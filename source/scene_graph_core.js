//
// This file declares all the nodes that can be used in the scene graph
//

// The scene graph is stored as a nested tree of objects.
// To draw a scene 2 calls are made, first to predraw, next to draw
// Predraw calculates model matrix, applies animations and can be used to position things like lights
// Draw used the model matrix that has been precalculated and draws all the models and textures to the screen.
// Both Predraw and Draw are recursive calls.
// NOTE: for performance increases draw could be flattened (as the recursive nature isn't required once model matrix has been calculated) and ordered to minimise model/texture switches 



// Core node, shouldn't be used in scene graph, should only be used to inherit from
class SceneNode{
    children = [];
    transformations = [];
    non_inherited_transformations = [];
    animations = [];
    has_error;
    friendly_name;
    cached_model_matrix;
    constructor(friendly_name){
        this.has_error = false;
        this.friendly_name = friendly_name;
    }

    add_child(new_child){
        if(!Array.isArray(new_child)){
            this.children.push(new_child);
        }else{
            this.children =this.children.concat(new_child);
        }
    }

    add_transform(transform, not_inherited){
        if(not_inherited){
            this.non_inherited_transformations.push(transform)
        }else{
            this.transformations.push(transform);
        }
        
    }

    add_animation(animation){
        this.animations.push(animation);
    }

    set_error(){
        this.has_error = true;
    }

    _apply_transformation(model_matrix){
        for(let i=0; i<this.transformations.length; i++){
            this.transformations[i].apply(model_matrix);
        }
    }

    _apply_me_only_transforms(model_matrix){
        for(let i=0; i<this.non_inherited_transformations.length; i++){
            this.non_inherited_transformations[i].apply(model_matrix);
        }
    }

    _apply_animations(model_matrix, deltaTime){
        for(let i=0; i<this.animations.length; i++){
            this.animations[i].apply(model_matrix, deltaTime);
        }
    }

    predraw(model_matrix, gl, uniforms, deltaTime){
        if(!this.has_error){
            this._apply_transformation(model_matrix)
            this._apply_animations(model_matrix, deltaTime)
            this._predraw_children(model_matrix, gl, uniforms, deltaTime);
            this._apply_me_only_transforms(model_matrix)
            this._predraw_self(model_matrix, gl, uniforms, deltaTime);
           

            // Cache the model matrix so we don't have to recalculate on draw call
            this.cached_model_matrix = model_matrix;
            
        } else{
            console.log("Error: unable to complete predraw on object '"+this.friendly_name+"' as it has been marked as having an error");
        }
    }

    _predraw_children(model_matrix, gl, uniforms, deltaTime){
        // Draw all of children
        for(let i=0; i<this.children.length; i++){
            // Give children fresh matrix that they can modify
            let fresh_matrix = new Matrix4(model_matrix);
            // Draw child
            this.children[i].predraw(fresh_matrix, gl, uniforms, deltaTime);
        }
    }

    // This function should have any operation that need to be done before vertices start getting drawn (e.g. placing lights)
    _predraw_self(model_matrix, gl, uniforms){
        // Do nothing, unless specified
    }

    draw(gl, uniforms){
        if(!this.has_error){
            this._draw_self(this.cached_model_matrix, gl, uniforms);
            this._draw_children(gl, uniforms);

            // Clear cached matrix (to make development error easier to catch)
            this.cached_model_matrix = null;
        }else{
            console.log("Error: unable to draw object '"+this.friendly_name+"' as it has been marked as having an error");
        }
    }

    _draw_children(gl, uniforms){
        // Draw all of children
        for(let i=0; i<this.children.length; i++){
            this.children[i].draw(gl, uniforms);
        }
    }

    _draw_self(model_matrix, gl, uniforms){
        console.log("Error: please implement this method")
    }
}

// Wrapper node, use if you want a node that has children and transformations but no model associated with it
class SceneWrapperNode extends SceneNode{
    constructor(friendly_name){
        super(friendly_name);
    }

    _draw_self(model_matrix, gl, uniforms){
        // Do Nothing
    }
}

// This should be used as a root node to the scene graph
class SceneGraph extends SceneNode{
  
    constructor(friendly_name){
        super(friendly_name)
    }


    draw(gl, uniforms, deltaTime){
        let model_matrix = new Matrix4();
        model_matrix.setTranslate(0, 0, 0);
        super._predraw_children(model_matrix, gl, uniforms, deltaTime);
        super._draw_children(gl, uniforms);
    }

}

// This is a node that has a model associated with it
class SceneModelNode extends SceneNode{
    model;
    texture;
    constructor(friendly_name, model, texture){
        super(friendly_name)
        this.model = model
        this.texture = texture;
    }


    _draw_self(model_matrix, gl, uniforms){
       
            if(!this.model){
                console.log("Error: SceneModeNode '"+this.friendly_name+"' was given a bad model, cannot draw");
                super.set_error();
                return;
            }

            if(!this.texture){
                console.log("Error: SceneModeNode '"+this.friendly_name+"' was given a bad texture, cannot draw");
                super.set_error();
                return;
            }

            this.texture.switch_to_me();

            // Pass the model matrix to the uniform variable
            gl.uniformMatrix4fv(uniforms.u_ModelMatrix, false, model_matrix.elements);

            // Calculate the normal transformation matrix and pass it to u_NormalMatrix
            let normalMatrix = new Matrix4()
            normalMatrix.setInverseOf(model_matrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uniforms.u_NormalMatrix, false, normalMatrix.elements);

            // Get the model to draw itself
            this.model.draw(gl);
    }

}

// This a special node where you want to apply an animation to its texture
class SceneModelTextureAnimationNode extends SceneModelNode{
    constructor(friendly_name, model, texture){
        super(friendly_name, model, texture)


    }

    _apply_animations(model_matrix, deltaTime){
        this.texture = this.texture_obj[this.animations[0].apply(deltaTime)];
    }

    bind_textures(texture_obj){
        this.texture_obj = texture_obj
    }
}

// This node contains a light. Lighting animations can be applied to it
class SceneLightingNode extends SceneNode{
    light;
    constructor(friendly_name, light){
        super(friendly_name)
        this.light = light;
    }

    // Place light before vertexes get drawn
    _predraw_self(model_matrix, gl, uniforms){
        if(!this.light){
            console.log("Error: cannot draw light "+this.friendly_name+" as no light model has been provided");
            this.set_error()
            return;
        }

        let cords = new Vector4([0.0, 0.0, 0.0, 1.0])
        cords = model_matrix.multiplyVector4(cords);
        let x = cords.elements[0]
        let y = cords.elements[1]
        let z = cords.elements[2]
        this.light.set_position(x,y,z);
    }

    _draw_self(model_matrix, gl, uniforms){
        // Do nothing, light has already been placed
    }


    _apply_animations(model_matrix, deltaTime){
        for(let i=0; i<this.animations.length; i++){
            this.animations[i].apply(this.light, deltaTime);
        }
    }

}

// This provides a shorthand to make wrapper nodes that have no model but have an animation.
// Useful to wrap a branch in an animation
class SceneAnimationNode extends SceneNode{
    constructor(friendly_name, initial_state, animation_function){
        super(friendly_name)

        super.add_animation(new Animation(friendly_name, initial_state, animation_function))
    }

    _predraw_self(){}
    _draw_self(){}
}

// This node will print its position to the debug output
class SceneDebugNode extends SceneNode{
    constructor(friendly_name, model, texture){
        super(friendly_name)
    }

    _draw_self(model_matrix, gl, uniforms){
        print_debug_model_matrix(model_matrix)
    }
    _predraw_self(){}
}
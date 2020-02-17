class Transform {
    apply(){
        Console.log("Error: calling super transform function");
    }
}

class Rotate extends Transform{
    constructor(angle, x, y, z){
        super()
        this.valid = true;
        this.update(angle, x, y, z)
    }

    update(angle, x, y, z){
        this.angle = angle;
        this.x = x;
        this.y = y;
        this.z = z;
       
        if (isNaN(angle) || isNaN(x) || isNaN(y) || isNaN(z)){
            console.log("Error: transform ROTATE was given a bad set of values");
            this.valid = false;
        }
    }

    apply(matrix){
        if(this.valid){
            matrix.rotate(this.angle, this.x, this.y, this.z);
        }else{
            console.log("Error: not applying transformation as transformation isn't valid");
        }
    }
}

class Translate extends Transform{
    constructor( x, y, z){
        super()
        this.valid = true;
        this.update(x, y, z)
    }

    update(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
       
        if (isNaN(x) || isNaN(y) || isNaN(z)){
            console.log("Error: transform TRANSLATE was given a bad set of values");
            this.valid = false;
        }
    }

    apply(matrix){
        if(this.valid){
            matrix.translate(this.x, this.y, this.z);
        }else{
            console.log("Error: not applying transformation as transformation isn't valid");
        }
    }
}

class Scale extends Transform{
    constructor( x, y, z){
        super()
        this.valid = true;
        this.update(x, y, z)
    }

    update(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
       
        if (isNaN(x) || isNaN(y) || isNaN(z)){
            console.log("Error: transform SCALE was given a bad set of values");
            this.valid = false;
        }
    }

    apply(matrix){
        if(this.valid){
            matrix.scale(this.x, this.y, this.z);
        }else{
            console.log("Error: not applying transformation as transformation isn't valid");
        }
    }
}

class SceneNode{
    children = [];
    transformations = [];
    has_error;
    friendly_name;
    constructor(friendly_name){
        this.has_error = false;
        this.friendly_name = friendly_name;
    }

    add_child(new_child){
        this.children.push(new_child);
    }

    add_transform(transform){
        this.transformations.push(transform);
    }

    set_error(){
        this.has_error = true;
    }

    draw(model_matrix, gl, uniforms){
        if(!this.has_error){
            this._apply_transformation(model_matrix)
            this._draw_self(model_matrix, gl, uniforms);
            this._draw_children(model_matrix, gl, uniforms);
        }else{
            console.log("Error: unable to draw object '"+this.friendly_name+"' as it has been marked as having an error");
        }

    }

    _apply_transformation(model_matrix){
        for(let i=0; i<this.transformations.length; i++){
            this.transformations[i].apply(model_matrix);
        }
    }

    _draw_children(model_matrix, gl, uniforms){
        // Draw all of children
        for(let i=0; i<this.children.length; i++){
            // Give children fresh matrix that they can modify
            let fresh_matrix = new Matrix4(model_matrix);
            // Draw child
            this.children[i].draw(fresh_matrix, gl, uniforms);
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


    draw(gl, uniforms){
        let model_matrix = new Matrix4();
        model_matrix.setTranslate(0, 0, 0);
        super._draw_children(model_matrix, gl, uniforms);
    }

}

// This is a node that has a model associated with it
class SceneModelNode extends SceneNode{
    model;
    constructor(friendly_name, model){
        super(friendly_name)
        this.model = model
    }


    _draw_self(model_matrix, gl, uniforms){
       
            if(!this.model){
                console.log("Error: SceneModeNode '"+this.friendly_name+"' was given a bad model, cannot draw");
                super.set_error();
                return;
            }

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


class SceneLightingNode extends SceneNode{
    light;
    constructor(friendly_name, light){
        super(friendly_name)
        this.light = light;
    }

    _draw_self(model_matrix, gl, uniforms){
        if(!this.light){
            console.log("Error: cannot draw light "+this.friendly_name+" as no light model has been provided");
            this.set_error()
            return;
        }

        let cords = new Vector4([0.0,0.0,0.0,1.0])
        cords = model_matrix.multiplyVector4(cords);
        console.log("New co-ords: "+cords.elements);
        let x = cords.elements[0]
        let y = cords.elements[1]
        let z = cords.elements[2]
        this.light.set_position(x,y,z);
    }



}
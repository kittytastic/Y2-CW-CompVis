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
    model;
    valid = true;
    constructor(model, drawn, friendly_name){
        this.valid = true;
        this.model = model;
        this.drawn = drawn;
        this.friendly_name = friendly_name;
    }

    add_child(new_child){
        this.children.push(new_child);
    }

    add_transform(transform){
        this.transformations.push(transform);
    }

    draw(model_matrix, gl, uniforms){
        if(this.valid){
            this._apply_transformation(model_matrix)
            this._draw_self(model_matrix, gl, uniforms);
            this._draw_children(model_matrix, gl, uniforms);
        }else{
            console.log("Error: unable to draw object as it is invalid");
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
        if(this.drawn){

            
            if(!this.model){
                console.log("Error: Scene node given a bad model, cannot draw");
                return;
            }
            // Pass the model matrix to the uniform variable
            gl.uniformMatrix4fv(uniforms.u_ModelMatrix, false, model_matrix.elements);

            // Calculate the normal transformation matrix and pass it to u_NormalMatrix
            let normalMatrix = new Matrix4()
            normalMatrix.setInverseOf(model_matrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uniforms.u_NormalMatrix, false, normalMatrix.elements);

            this.model.draw(gl);
        }
    }
}

class SceneGraph extends SceneNode{
  
    constructor(friendly_name){
        super()
        this.friendly_name = friendly_name
    }


    draw(gl, uniforms){
        let model_matrix = new Matrix4();
        model_matrix.setTranslate(0, 0, 0);

        super._draw_children(model_matrix, gl, uniforms);
        

    }


}
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
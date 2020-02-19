let AN_ROTATE_SPEED = 30;
function rotate_x(model_matrix, deltaTime, prevState){


    //console.log(deltaTime)
    if(!deltaTime){
        console.log("Error: bad time value given to animation")
    }
   
    deltaTime *= 0.001;
    let rot = prevState.rot + AN_ROTATE_SPEED * deltaTime
    model_matrix.rotate(rot, 0, 1, 0);
    return {...prevState, rot: rot}
}

function rotate_rev_x(model_matrix, deltaTime, prevState){


    //console.log(deltaTime)
    if(!deltaTime){
        console.log("Error")
    }
   
    deltaTime *= 0.001;
    let rot = prevState.rot - AN_ROTATE_SPEED * 1 * deltaTime
    model_matrix.rotate(rot, 0, 0, 1);
    return {...prevState, rot: rot}
}

function seconds(model_matrix, deltaTime, prevState){

   let s = new Date().getSeconds();

    let rot = s * 6;
    model_matrix.rotate(-rot, 0, 1, 0);

    return {...prevState}
}

function mins(model_matrix, deltaTime, prevState){

    let d = new Date()
    let m = d.getMinutes() + d.getSeconds()/60 +d.getMilliseconds()/(60*1000);
 
     let rot = m * 6;
     model_matrix.rotate(-rot, 0, 1, 0);
 
     return {...prevState}
 }

 function hours(model_matrix, deltaTime, prevState){

    let d = new Date()
    let h = d.getHours() + d.getMinutes()/60;
    h = h%12;
     let rot = h/12 * 360;
     model_matrix.rotate(-rot, 0, 1, 0);
 
     return {...prevState}
 }
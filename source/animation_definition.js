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

function animation_seconds(model_matrix, deltaTime, prevState){

   let s = new Date().getSeconds();

    let rot = s * 6;
    model_matrix.rotate(-rot, 0, 0, 1);

    return {...prevState}
}

function animation_minutes(model_matrix, deltaTime, prevState){
    //console.log("Clock somewhere?")
    //print_debug_model_matrix(model_matrix)
    let d = new Date()
    let m = d.getMinutes() + d.getSeconds()/60 +d.getMilliseconds()/(60*1000);
 
     let rot = m * 6;
     model_matrix.rotate(-rot, 0, 0, 1);
 
     return {...prevState}
 }

 function animation_hours(model_matrix, deltaTime, prevState){

    let d = new Date()
    let h = d.getHours() + d.getMinutes()/60;
    h = h%12;
     let rot = h/12 * 360;
     model_matrix.rotate(-rot, 0, 0, 1);
 
     return {...prevState}
 }



 function light_sway(model_matrix, deltaTime, prevState){
    deltaTime *=  0.001;
    

    let sway_v = 10;
    let threshold = 50;

    let new_angle = prevState.angle;
    let new_direction = prevState.direction

    if(prevState.direction){
        new_angle += sway_v * deltaTime
       
    }else{
        new_angle -= sway_v * deltaTime
    }

    if(new_angle>threshold&&prevState.direction){
        new_angle = threshold
        new_direction = false;
    }

    if(new_angle<(-threshold)&&!prevState.direction){
        new_angle = -threshold
        new_direction = true
    }

    model_matrix.rotate(new_angle, 1, 0, 0);
    //model_matrix.translate(new_angle, 0, 0)

    return {angle:new_angle, direction:new_direction}
 }
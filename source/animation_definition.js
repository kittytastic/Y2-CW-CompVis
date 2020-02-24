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
    
    let inital_displacment = 55

    let new_time = prevState.time + deltaTime 
    let new_angle = (inital_displacment/360)*2*Math.PI *Math.cos(9.81/prevState.length * new_time)
    let angle_degrees = new_angle/(2*Math.PI)*360

    model_matrix.rotate(angle_degrees, 1, 0, 0);

    return {...prevState, time:new_time}
 }


 function animation_light_off(light, deltaTime, prevState){

    let s = new Date().getSeconds();
 
     if(s%5 == 1){
         light.set_colour(0,0,0)
     }else{
        light.set_colour(0.05,0,0)
     }
 
     return {...prevState}
 }
 

var G_CHAIRS_OUT = true;

 function move_chairs(model_matrix, deltaTime, prevState){
    deltaTime *= 0.001
    
    let distance = 1.5
        let chair_speed = 1;
    let change = 0;


    if(G_CHAIRS_OUT){
        if(prevState.pos>0){
            change = - chair_speed*deltaTime
        }
    }else{
        if(prevState.pos<distance){
            change = chair_speed * deltaTime
        }
    }

    let new_pos = prevState.pos + change;

    if(new_pos>0){
        model_matrix.translate(new_pos*prevState.dir[0], new_pos*prevState.dir[1], new_pos*prevState.dir[2])
    }



    return {...prevState, pos:new_pos}
 }



 
 function do_texture_change(deltaTime, prevState){

    let light_tex_a = 'sofa'
    let light_tex_b = 'dark_wood'
    let t = light_tex_a


    let s = new Date().getSeconds();
 
     if(s%5 == 1){
        t = light_tex_a
     }else{
        t= light_tex_b
     }

        return {...prevState, texture:t}
 }
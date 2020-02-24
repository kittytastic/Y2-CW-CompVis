function make_scene(models, textures, lighting_controller){

    let scene_graph = new SceneGraph("root")

    g_chair_y_transform = new Rotate(g_yAngle, 0, 1, 0);
    g_chair_x_transform = new Rotate(g_xAngle, 1, 0, 0);

    


   
    //scene_graph.add_child(chair1)
    scene_graph.add_child(building(models, textures, lighting_controller))
   // scene_graph.add_child(clock(models, textures))

   //let c = new SceneModelNode("Cylinder", models['cylinder'], textures['wood'])
   //c.add_transform(new Translate(2,2,2))
   //c.add_transform(new Scale(5,5,5))
   //c.add_child(new SceneDebugNode())
   //scene_graph.add_child(c)

   scene_graph.add_child(make_tv(models, textures, lighting_controller))

    return scene_graph;
}

function make_chair(models, textures){
    let chair = new SceneWrapperNode("Chair");

    
    let back = new SceneModelNode( "Back", models['box'], textures['wood']);
    back.add_transform(new Translate(0, 1.25, -0.75))
    back.add_transform(new Scale(2.0, 2.0, 0.5))
    
    let seat = new SceneModelNode("Seat", models['box'], textures['wood']);
    seat.add_transform(new Scale(2.0, 0.5, 2.0))
    
    let leg1 = new SceneModelNode( "Leg 1", models['box'], textures['wood']);
    leg1.add_transform(new Translate(0.75, -1, -0.75))
    leg1.add_transform(new Scale(0.5, 1.5, 0.5))
 
    let leg2 = new SceneModelNode("Leg 2", models['box'], textures['wood']);
    leg2.add_transform(new Translate(0.75, -1, 0.75))
    leg2.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg3 = new SceneModelNode("Leg 3", models['box'], textures['wood']);
    leg3.add_transform(new Translate(-0.75, -1, -0.75))
    leg3.add_transform(new Scale(0.5, 1.5, 0.5))
    
    let leg4 = new SceneModelNode("Leg 4", models['box'], textures['wood']);
    leg4.add_transform(new Translate(-0.75, -1, 0.75))
    leg4.add_transform(new Scale(0.5, 1.5, 0.5))
    

    chair.add_child(back)
    chair.add_child(seat)
    chair.add_child(leg1)
    chair.add_child(leg2)
    chair.add_child(leg3)
    chair.add_child(leg4)
    

    return chair;
}

function building(models, textures, lighting_controller){
    let wall = []
    let thickness = 0.5
    let height = HEIGHT * METER_TO_UNITS

    let x_length = ROOM_X * METER_TO_UNITS;
    let z_length = ROOM_Z * METER_TO_UNITS;


    wall.push(new SceneModelNode("Wall 0", models['box'], textures['wall']));
    wall[0].add_transform(new Translate(-x_length/2, height/2, 0))
    wall[0].add_transform(new Scale(thickness, height, z_length))

    wall.push(new SceneModelNode("Wall 1", models['box'], textures['feature_wall']));
    wall[1].add_transform(new Translate(x_length/2, height/2, 0))
    wall[1].add_transform(new Scale(thickness, height, z_length))

    wall.push(new SceneModelNode("Wall 2", models['box'], textures['wall']));
    wall[2].add_transform(new Translate(0, height/2, -z_length/2))
    wall[2].add_transform(new Scale(x_length, height, thickness), true)

    let clock = make_clock(models, textures)
    wall[2].add_child(clock);
    clock.add_transform(new Translate(0,-1,1))

    wall.push(new SceneModelNode("Wall 3", models['box'], textures['wall']));
    wall[3].add_transform(new Translate(0, height/2, z_length/2))
    wall[3].add_transform(new Scale(x_length, height, thickness))



    
    let ceiling = new SceneModelNode("Ceiling", models['floor'], textures['wood']);
    ceiling.add_transform(new Translate(0, height, 0));
    ceiling.add_child(light(models, textures, lighting_controller))
    //floor.add_transform(new Scale(x_length, 0.5, z_length))

    return [...wall, make_floor(models, textures), ceiling]

}


function make_floor(models, textures){
    let floor = new SceneModelNode("Floor", models['floor'], textures['carpet']);

    let sofa = new SceneModelNode("Sofa", models['sofa'], textures['sofa']);
    sofa.add_transform(new Rotate(-90, 1,0,0))
    sofa.add_transform(new Translate(8,3,1))


    floor.add_child(sofa);
    floor.add_child(make_table_set(models, textures))
    floor.add_child(make_coffee_table(models, textures));

    return floor
}



function make_table_set(models, textures){
    let table_set = new SceneWrapperNode("Table set");
    table_set.add_transform(new Translate(-9,0,0))

    let chair = []
    chair.push(make_chair(models, textures));
    chair.push(make_chair(models, textures));
    chair.push(make_chair(models, textures));
    chair.push(make_chair(models, textures));

    for(let i=0; i<4; i++){
        
        chair[i].add_transform(new Rotate(90*i, 0, 1, 0))
        chair[i].add_transform(new Translate(0, 2, -3))

        chair[i].add_animation(new Animation("Pull out chair", {pos: 0, dir: [0, 0, -1]}, move_chairs))
    }

    let table = make_table(models, textures)
    table.add_transform(new Translate(0, 0.5, 0))

    table_set.add_child(chair)
    table_set.add_child(table)

    return table_set

}



function make_table(models, textures){

    let base = new SceneModelNode("Table Base", models['box'], textures['brushed_metal_dark'])
    base.add_transform(new Scale(1.5,0.2,1.5), true)
    let leg = new SceneModelNode("Table Leg", models['cylinder'], textures['brushed_metal_dark'])
    leg.add_transform(new Rotate(90,1,0,0), true)
    leg.add_transform(new Scale(0.2,0.2,1.5), true)
    leg.add_transform(new Translate(0,1,0))
    let top = new SceneModelNode("Table Top", models['box'], textures['dark_wood'])
    top.add_transform(new Translate(0,1.5,0))
    top.add_transform(new Scale(3,0.1,3), true)

    base.add_child(leg)
    leg.add_child(top)

   
    return base
}


function light(models, textures, lighting_controller){

    let light_obj = new SceneWrapperNode("Light Cord")
    light_obj.add_transform(new Translate(0, -0.5, 0)) 

    light_obj.add_animation(new Animation("Light animation", {length: 7, time: 0}, light_sway))

    let light_cord = new SceneModelNode("Light Cord", models['cylinder'], textures['brushed_metal_dark'])
    light_cord.add_transform(new Translate(0, -1, 0))

    light_cord.add_transform(new Rotate(90, 1, 0, 0))
    
    let cord_thickness = 0.05
    light_cord.add_transform(new Scale(cord_thickness, cord_thickness, 1))


    let light = lighting_controller.get_point_light();
    light.set_colour(1,1,1);

    let light_node = new SceneLightingNode("Light", light);
    light_node.add_transform(new Translate(0, -2, 0))
    //light_node.add_animation(new AnimationLight("Light on off", {}, animation_light_off))
    

    let light_bulb = new SceneModelNode("Light Bulb", models['cylinder'], textures['lamp'])
    light_bulb.add_transform(new Rotate(90, 1, 0 , 0));
    
    
    let sf = 0.6
    light_bulb.add_transform(new Scale(0.6,0.6,0.6));
    light_node.add_child(light_bulb)

    light_obj.add_child(light_node)
    light_obj.add_child(light_cord)


    return light_obj


}


function make_clock(models, textures){

    let hr_hand_length = 0.3
    let min_hand_length = 0.4
    let sec_hand_length = 0.5

    let hr_hand_width = 0.05
    let min_hand_width = 0.05
    let sec_hand_width = 0.03

    let spoke_size = 0.05

    let hand_thickness = 0.1
    let clock_thickness = 0.2
    let hand_spacing = hand_thickness
    
    

    let backplate = new SceneModelNode("Clock Back Plate", models['box'], textures['brushed_metal'])
    backplate.add_transform(new Translate(0, 3, 0))
    backplate.add_transform(new Scale(2, 2, clock_thickness))


    let hand_offset = clock_thickness+hand_thickness*2
    let hours = new SceneModelNode("Clock Hours", models['box'], textures['brushed_metal_dark'])
    hours.add_transform(new Translate(0, hr_hand_length/2-spoke_size, hand_spacing+hand_offset))
    hours.add_transform(new Scale(hr_hand_width, hr_hand_length, hand_thickness))
    
    let hr_ani = new SceneAnimationNode("Hours animation", {}, animation_hours)
    hr_ani.add_child(hours)
   
    let minutes = new SceneModelNode("Clock Minutes", models['box'], textures['brushed_metal_dark'])
    minutes.add_transform(new Translate(0, min_hand_length/2- spoke_size, hand_spacing*2+hand_offset))
    minutes.add_transform(new Scale(min_hand_width, min_hand_length, hand_thickness))
    
    let min_ani = new SceneAnimationNode("Hours animation", {}, animation_minutes)
    min_ani.add_child(minutes)

    let seconds = new SceneModelNode("Clock Seconds", models['box'], textures['brushed_metal_light'])
    seconds.add_transform(new Translate(0, sec_hand_length/2-spoke_size, hand_spacing*3+hand_offset)) 
    seconds.add_transform(new Scale(sec_hand_width, sec_hand_length, hand_thickness))

    let sec_ani = new SceneAnimationNode("Hours animation", {}, animation_seconds)
    sec_ani.add_child(seconds)

    backplate.add_child(hr_ani)
    backplate.add_child(min_ani)
    backplate.add_child(sec_ani)
    

    return backplate
}


function make_coffee_table(models, textures){
    
    let table = new SceneWrapperNode("Coffee Table:");
    table.add_transform(new Translate(4, 1, 0));
    let legs = []
    let leg_size = 0.4

    for(let i=0; i<4; i++){
        legs.push(new SceneModelNode("Coffee Leg: "+i, models['box'], textures['brushed_metal_dark']))
        legs[i].add_transform(new Scale(leg_size, 2, leg_size), true)
    }

    let x_change = 2;
    let z_change = 1;

    legs[0].add_transform(new Translate(x_change,0,z_change))
    legs[1].add_transform(new Translate(-x_change,0,z_change))
    legs[2].add_transform(new Translate(x_change,0,-z_change))
    legs[3].add_transform(new Translate(-x_change,0,-z_change))


    let table_top = new SceneModelNode("Coffee TableTop", models['box'], textures['dark_wood'])
    table_top.add_transform(new Scale(2*x_change+leg_size, 0.3, 2*z_change+leg_size), true);
    table_top.add_transform(new Translate(0, 1.15, 0))

    table.add_child(legs)
    table.add_child(table_top)




    return table

}



function make_tv(models, textures, lighting_controller){
   /* let light_wrapper = new SceneWrapperNode("TV Light wrapper")
    light_obj.add_transform(new Translate(0, -0.5, 0)) 
*/

    let point_light = lighting_controller.get_point_light();
    point_light.set_colour(0.1,0,0);

    let light_node = new SceneLightingNode("Light", point_light);
    light_node.add_transform(new Translate(0, 0, -1))
    light_node.add_animation(new AnimationLight("Light on off", {}, animation_light_off))
    

    let light_bulb = new SceneModelTextureAnimationNode("Light Bulb", models['box'], textures['light_hi'])
    light_bulb.bind_textures(textures)
    light_bulb.add_animation(new AnimationTexture("Light bulb change", {texture:'light_hi'}, do_texture_change))
    light_bulb.add_transform(new Translate(0, 3, 0))
    light_bulb.add_transform(new Scale(0.05, 0.1, 0.05));
    
    light_bulb.add_child(light_node);

    return light_bulb

}
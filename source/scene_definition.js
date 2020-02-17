function make_scene(models, textures, lighting_controller){
   
    models['box'].texture = textures['wood'];

    let scene_graph = new SceneGraph("root")

    g_chair_y_transform = new Rotate(g_yAngle, 0, 1, 0);
    g_chair_x_transform = new Rotate(g_xAngle, 1, 0, 0);

    let chair1 = make_light_chair(models, textures, lighting_controller);
    chair1.add_transform(g_chair_x_transform);
    chair1.add_transform(g_chair_y_transform);

    let chair2 = make_chair(models, textures);
    chair2.add_transform(new Translate(-5,0,0))
   

    scene_graph.add_child(chair1)
    scene_graph.add_child(chair2)

    return scene_graph;
}

function make_chair(models, textures){
    let chair = new SceneWrapperNode("Chair");
    
    let back = new SceneModelNode( "Back", models['box']);
    back.add_transform(new Translate(0, 1.25, -0.75))
    back.add_transform(new Scale(2.0, 2.0, 0.5))
    
    let seat = new SceneModelNode("Seat", models['box']);
    seat.add_transform(new Scale(2.0, 0.5, 2.0))
    
    let leg1 = new SceneModelNode( "Leg 1", models['box']);
    leg1.add_transform(new Translate(0.75, -1, -0.75))
    leg1.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg2 = new SceneModelNode("Leg 2", models['box']);
    leg2.add_transform(new Translate(0.75, -1, 0.75))
    leg2.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg3 = new SceneModelNode("Leg 3", models['box']);
    leg3.add_transform(new Translate(-0.75, -1, -0.75))
    leg3.add_transform(new Scale(0.5, 1.5, 0.5))
    
    let leg4 = new SceneModelNode("Leg 4", models['box']);
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

function make_light_chair(models, textures, lighting_controller){
    let chair = new SceneWrapperNode("Chair");


    let light = lighting_controller.get_point_light();
    light.set_colour(1,1,1);

    let light_node = new SceneLightingNode("Light", light);
    light_node.add_transform(new Translate(0, -2, 1))

    let light_box = new SceneModelNode( "Light box", models['box']);
    light_box.add_transform(new Scale(0.5, 0.5, 0.5));
    light_box.add_transform(new Translate(0,2,1))
    light_box.add_child(light_node)


    let back = new SceneModelNode( "Back", models['box']);
    back.add_transform(new Translate(0, 1.25, -0.75))
    back.add_transform(new Scale(2.0, 2.0, 0.5))
    
    let seat = new SceneModelNode("Seat", models['box']);
    seat.add_transform(new Scale(2.0, 0.5, 2.0))
    seat.add_child(light_box);


    let leg1 = new SceneModelNode( "Leg 1", models['box']);
    leg1.add_transform(new Translate(0.75, -1, -0.75))
    leg1.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg2 = new SceneModelNode("Leg 2", models['box']);
    leg2.add_transform(new Translate(0.75, -1, 0.75))
    leg2.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg3 = new SceneModelNode("Leg 3", models['box']);
    leg3.add_transform(new Translate(-0.75, -1, -0.75))
    leg3.add_transform(new Scale(0.5, 1.5, 0.5))
    
    let leg4 = new SceneModelNode("Leg 4", models['box']);
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
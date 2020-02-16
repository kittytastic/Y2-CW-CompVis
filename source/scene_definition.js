function make_scene(){
   
    let scene_graph = new SceneGraph("root")

    g_chair_y_transform = new Rotate(g_yAngle, 0, 1, 0);
    g_chair_x_transform = new Rotate(g_xAngle, 1, 0, 0);


    let chair = new SceneNode('', false, "Chair");
    chair.add_transform(g_chair_x_transform);
    chair.add_transform(g_chair_y_transform);

    let back = new SceneNode('box', true, "Back");
    back.add_transform(new Translate(0, 1.25, -0.75))
    back.add_transform(new Scale(2.0, 2.0, 0.5))
    
    let seat = new SceneNode('box', true, "Seat");
    seat.add_transform(new Scale(2.0, 0.5, 2.0))
    
    let leg1 = new SceneNode('box', true, "Leg 1");
    leg1.add_transform(new Translate(0.75, -1, -0.75))
    leg1.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg2 = new SceneNode('box', true, "Leg 2");
    leg2.add_transform(new Translate(0.75, -1, 0.75))
    leg2.add_transform(new Scale(0.5, 1.5, 0.5))

    let leg3 = new SceneNode('box', true, "Leg 3");
    leg3.add_transform(new Translate(-0.75, -1, -0.75))
    leg3.add_transform(new Scale(0.5, 1.5, 0.5))
    
    let leg4 = new SceneNode('box', true, "Leg 4");
    leg4.add_transform(new Translate(-0.75, -1, 0.75))
    leg4.add_transform(new Scale(0.5, 1.5, 0.5))

    chair.add_child(back)
    chair.add_child(seat)
    chair.add_child(leg1)
    chair.add_child(leg2)
    chair.add_child(leg3)
    chair.add_child(leg4)

    scene_graph.add_child(chair)

    return scene_graph;
}
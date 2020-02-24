//
// This file makes and loads all of the models into objects
//


function make_all_models(gl){
    let models = {}

   models['box'] = make_box_model(gl);
   models['floor'] = custom_box(gl, ROOM_X*METER_TO_UNITS, 0.5, ROOM_Z*METER_TO_UNITS, 3)
   models['cylinder'] = import_from_json(gl, MODEL_CYLINDER);
   models['sofa'] = import_from_json(gl, MODEL_SOFA);
   models['sculpture'] = import_from_json(gl, MODEL_SCULPTURE);

    return models
}


function make_box_model(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var vertices = new Float32Array([   // Coordinates
       0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5, // v0-v1-v2-v3 front
       0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5, // v0-v3-v4-v5 right
       0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
      -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5, // v1-v6-v7-v2 left
      -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5, // v7-v4-v3-v2 down
       0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5  // v4-v7-v6-v5 back
    ]);

   var texCoords = new Float32Array([
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0, // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0, // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0, // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0, // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0, // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0 // v4-v7-v6-v5 back
   ])
  
  
    var normals = new Float32Array([    // Normal
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);
  
  
    // Indices of the vertices
    var indices = new Uint8Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
   ]);
  
  
    
    //return new Basic3DModel(gl, vertices,normals,colors,indices);
    return new Basic3DModel(gl, vertices,normals,texCoords,indices);
  }


  function custom_box(gl, x, y, z, texture_rate) {
   // Create a cube
   //    v6----- v5
   //   /|      /|
   //  v1------v0|
   //  | |     | |
   //  | |v7---|-|v4
   //  |/      |/
   //  v2------v3
   var vertices = new Float32Array([   // Coordinates
      x, y, z,  -x, y, z,  -x,-y, z,   x,-y, z, // v0-v1-v2-v3 front
      x, y, z,   x,-y, z,   x,-y,-z,   x, y,-z, // v0-v3-v4-v5 right
      x, y, z,   x, y,-z,  -x, y,-z,  -x, y, z, // v0-v5-v6-v1 up
     -x, y, z,  -x, y,-z,  -x,-y,-z,  -x,-y, z, // v1-v6-v7-v2 left
     -x,-y,-z,   x,-y,-z,   x,-y, z,  -x,-y, z, // v7-v4-v3-v2 down
      x,-y,-z,  -x,-y,-z,  -x, y,-z,   x, y,-z  // v4-v7-v6-v5 back
   ]);

   x_rep = x/METER_TO_UNITS * texture_rate
   y_rep = y/METER_TO_UNITS * texture_rate
   z_rep = z/METER_TO_UNITS * texture_rate

  var texCoords = new Float32Array([
   x_rep, y_rep,   0.0, y_rep,   0.0, 0.0,   x_rep, 0.0, // v0-v1-v2-v3 front
     0.0, y_rep,   0.0, 0.0,   z_rep, 0.0,   z_rep, y_rep, // v0-v3-v4-v5 right
     x_rep, 0.0,   x_rep, z_rep,   0.0, z_rep,   0.0, 0.0, // v0-v5-v6-v1 up
     z_rep, y_rep,   0.0, y_rep,   0.0, 0.0,   z_rep, 0.0, // v1-v6-v7-v2 left
     0.0, 0.0,   x_rep, 0.0,   x_rep, z_rep,   0.0, z_rep, // v7-v4-v3-v2 down
     0.0, 0.0,   x_rep, 0.0,   x_rep, y_rep,   0.0, y_rep // v4-v7-v6-v5 back
  ])
 
 
   var normals = new Float32Array([    // Normal
     0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
   ]);
 
 
   // Indices of the vertices
   var indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9,10,   8,10,11,    // up
     12,13,14,  12,14,15,    // left
     16,17,18,  16,18,19,    // down
     20,21,22,  20,22,23     // back
  ]);
 
 
   
   //return new Basic3DModel(gl, vertices,normals,colors,indices);
   return new Basic3DModel(gl, vertices,normals,texCoords,indices);
 }


 
// Directional lighting demo: By Frederick Li
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +        // Normal
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightDirection;\n' + // Light direction (in the world coordinate, normalized)
  'varying vec4 v_Color;\n' +
  'uniform bool u_isLighting;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  if(u_isLighting)\n' + 
  '  {\n' +
  '     vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '     float nDotL = max(dot(normal, u_LightDirection), 0.0);\n' +
        // Calculate the color due to diffuse reflection
  '     vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
  '     v_Color = vec4(diffuse, a_Color.a);\n' +  '  }\n' +
  '  else\n' +
  '  {\n' +
  '     v_Color = a_Color;\n' +
  '  }\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

var modelMatrix = new Matrix4(); // The model matrix
var viewMatrix = new Matrix4();  // The view matrix
var projMatrix = new Matrix4();  // The projection matrix
var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

var ANGLE_STEP = 3.0;  // The increments of rotation angle (degrees)
var g_xAngle = 0.0;    // The rotation x angle (degrees)
var g_yAngle = 0.0;    // The rotation y angle (degrees)

let g_z_pos = 15;
let g_x_pos = 0;
let g_y_pos = 0;
let MOVE_STEP = 0.5;

let g_vertical_angle = 270;
let g_horizontal_angle = 270;
let VIEW_ANGLE_STEP = 10;
let VIEW_STICK = 10;



let g_scene_graph;
let g_chair_y_transform;
let g_chair_x_transform;

let gl;
let g_u_ModelMatrix;
let g_u_NormalMatrix;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set clear color and enable hidden surface removal
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Get the storage locations of uniform attributes
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  g_u_ModelMatrix = u_ModelMatrix;
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  g_u_NormalMatrix = u_NormalMatrix;
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');

  // Trigger using lighting or not
  var u_isLighting = gl.getUniformLocation(gl.program, 'u_isLighting'); 

  if (!u_ModelMatrix || !u_ViewMatrix || !u_NormalMatrix ||
      !u_ProjMatrix || !u_LightColor || !u_LightDirection ||
      !u_isLighting ) { 
    console.log('Failed to Get the storage locations of u_ModelMatrix, u_ViewMatrix, and/or u_ProjMatrix');
    return;
  }

  // Set the light color (white)
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  var lightDirection = new Vector3([0.5, 3.0, 4.0]);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(u_LightDirection, lightDirection.elements);

  // Calculate the view matrix and the projection matrix
  //viewMatrix.setLookAt(0, 0, 15, 0, 0, -100, 0, 1, 0);
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  // Pass the model, view, and projection matrix to the uniform variable respectively
  //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);




  g_scene_graph = new SceneGraph("GOD")
  make_scene();




  document.onkeydown = function(ev){
    keydown(ev, gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix);
  };

  draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix);
}

function make_scene(){
    //modelMatrix.rotate(g_yAngle, 0, 1, 0); // Rotate along y axis
    //modelMatrix.rotate(g_xAngle, 1, 0, 0); // Rotate along x axis

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

    g_scene_graph.add_child(chair)
    console.log(g_scene_graph)

}


function angleIncrement(variable, angle){
    let k = (variable + angle)%360
    return k>0?k:360+k;
}

function move_forwards(distance){
    //let g_
}
function move_sideways(distance){}
function move_up(distance){}


function keydown(ev, gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix) {
  switch (ev.key) {
    case 'ArrowUp': // Up arrow key -> the positive rotation of arm1 around the y-axis
      g_xAngle = (g_xAngle + ANGLE_STEP) % 360;
      break;
    case 'ArrowDown': // Down arrow key -> the negative rotation of arm1 around the y-axis
      g_xAngle = (g_xAngle - ANGLE_STEP) % 360;
      break;
    case 'ArrowRight': // Right arrow key -> the positive rotation of arm1 around the y-axis
      g_yAngle = (g_yAngle + ANGLE_STEP) % 360;
      break;
    case 'ArrowLeft': // Left arrow key -> the negative rotation of arm1 around the y-axis
      g_yAngle = (g_yAngle - ANGLE_STEP) % 360;
      break;
    case 'w':
        g_z_pos -= MOVE_STEP;
        break;
    case 's':
        g_z_pos += MOVE_STEP;
        break;
    case 'd':
        g_x_pos += MOVE_STEP;
        break;
    case 'a':
        g_x_pos -= MOVE_STEP; 
        break;
    case 'z':
        g_y_pos += MOVE_STEP; 
        break;
    case 'c':
        g_y_pos -= MOVE_STEP; 
        break;
    case 'u':
        g_vertical_angle = angleIncrement(g_vertical_angle, VIEW_ANGLE_STEP);
        break;
    case 'j':
        g_vertical_angle = angleIncrement(g_vertical_angle, -VIEW_ANGLE_STEP);
        break;
    case 'h':
        g_horizontal_angle = angleIncrement(g_horizontal_angle, VIEW_ANGLE_STEP);
        break;
    case 'k':
        g_horizontal_angle = angleIncrement(g_horizontal_angle, -VIEW_ANGLE_STEP);
        break;
    default: 
        console.log('Key was pressed: '+ev.keyCode)
    return; // Skip drawing at no effective action
  }

console.log("x: "+g_z_pos+" y:"+g_x_pos);
console.log("horizontal view: "+g_horizontal_angle+" vertical view:"+g_vertical_angle);
  // Draw the scene
  draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix);
}


function initVertexBuffers(gl) {
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


  var colors = new Float32Array([    // Colors
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
 ]);


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


  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer (gl, attribute, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}

function initAxesVertexBuffers(gl) {

  var verticesColors = new Float32Array([
    // Vertex coordinates and color (for axes)
    -20.0,  0.0,   0.0,  1.0,  1.0,  1.0,  // (x,y,z), (r,g,b) 
     20.0,  0.0,   0.0,  1.0,  1.0,  1.0,
     0.0,  20.0,   0.0,  1.0,  1.0,  1.0, 
     0.0, -20.0,   0.0,  1.0,  1.0,  1.0,
     0.0,   0.0, -20.0,  1.0,  1.0,  1.0, 
     0.0,   0.0,  20.0,  1.0,  1.0,  1.0 
  ]);
  var n = 6;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();  
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

function draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix) {

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform1i(u_isLighting, false); // Will not apply lighting
  //gl.uniform1i(u_isLighting, true); // Will not apply lighting

    // Calculate the view matrix and the projection matrix
    let look_x = VIEW_STICK*Math.cos(2*Math.PI * (g_horizontal_angle/360)) + g_x_pos;
    let look_y = g_y_pos + VIEW_STICK*Math.cos(2*Math.PI * (g_vertical_angle/360));
    //let look_z = -100;
    let look_z = VIEW_STICK*Math.sin(2*Math.PI * (g_horizontal_angle/360)) + g_z_pos +VIEW_STICK*Math.sin(2*Math.PI * (g_vertical_angle/360));

    viewMatrix.setLookAt(g_x_pos, g_y_pos, g_z_pos, look_x, look_y, look_z, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);


  // Set the vertex coordinates and color (for the x, y axes)

  var n = initAxesVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Calculate the view matrix and the projection matrix
  modelMatrix.setTranslate(0, 0, 0);  // No Translation
  // Pass the model matrix to the uniform variable
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Draw x and y axes
  gl.drawArrays(gl.LINES, 0, n);

  gl.uniform1i(u_isLighting, true); // Will apply lighting

  // Set the vertex coordinates and color (for the cube)
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Rotate, and then translate
  /*modelMatrix.setTranslate(0, 0, 0);  // Translation (No translation is supported here)
  modelMatrix.rotate(g_yAngle, 0, 1, 0); // Rotate along y axis
  modelMatrix.rotate(g_xAngle, 1, 0, 0); // Rotate along x axis

  // Model the chair seat
  pushMatrix(modelMatrix);
    modelMatrix.scale(2.0, 0.5, 2.0); // Scale
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  // Model the chair back
  pushMatrix(modelMatrix);
    modelMatrix.translate(0, 1.25, -0.75);  // Translation
    modelMatrix.scale(2.0, 2.0, 0.5); // Scale
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  // Model the a leg
  pushMatrix(modelMatrix);
    modelMatrix.translate(0.75, -1, -0.75);  // Translation
    modelMatrix.scale(0.5, 1.5, 0.5); // Scale
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  // Model the a leg
  pushMatrix(modelMatrix);
    modelMatrix.translate(-0.75, -1, -0.75);  // Translation
    modelMatrix.scale(0.5, 1.5, 0.5); // Scale
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  // Model the a leg
  pushMatrix(modelMatrix);
    modelMatrix.translate(-0.75, -1, 0.75);  // Translation
    modelMatrix.scale(0.5, 1.5, 0.5); // Scale
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  // Model the a leg
  pushMatrix(modelMatrix);
    modelMatrix.translate(0.75, -1, 0.75);  // Translation
    modelMatrix.scale(0.5, 1.5, 0.5); // Scale
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();*/

console.log("Graphing it")
  let buffer_map = {'box': n}

  g_chair_x_transform.update(g_xAngle, 1, 0, 0);
  g_chair_y_transform.update(g_yAngle, 0, 1, 0);
  g_scene_graph.draw(buffer_map)

}

function drawbox(gl, u_ModelMatrix, u_NormalMatrix, n) {
  pushMatrix(modelMatrix);

    // Pass the model matrix to the uniform variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  modelMatrix = popMatrix();
}

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
    buffer_key;
    valid = true;
    constructor(buffer_key, drawn, friendly_name){
        this.valid = true;
        this.buffer_key = buffer_key;
        this.drawn = drawn;
        this.friendly_name = friendly_name;
    }

    add_child(new_child){
        this.children.push(new_child);
    }

    add_transform(transform){
        this.transformations.push(transform);
    }

    draw(model_matrix, buffer_map){
        if(this.valid){
            this._apply_transformation(model_matrix)
            this._draw_self(model_matrix, buffer_map);
            this._draw_children(model_matrix, buffer_map);
        }else{
            console.log("Error: unable to draw object as it is invalid");
        }

    }

    _apply_transformation(model_matrix){
        for(let i=0; i<this.transformations.length; i++){
            this.transformations[i].apply(model_matrix);
        }
    }

    _draw_children(model_matrix, buffer_map){
        // Draw all of children
        for(let i=0; i<this.children.length; i++){
            // Give children fresh matrix that they can modify
            let fresh_matrix = new Matrix4(model_matrix);
            // Draw child
            this.children[i].draw(fresh_matrix, buffer_map);
        }
    }

    _draw_self(model_matrix, buffer_map){
        if(this.drawn){

            let buffer_index = buffer_map[this.buffer_key]
            if(isNaN(buffer_index) || buffer_index<0){
                console.log("Error: Scene node given a bad buffer index value");
                return;
            }
            // Pass the model matrix to the uniform variable
            gl.uniformMatrix4fv(g_u_ModelMatrix, false, model_matrix.elements);

            // Calculate the normal transformation matrix and pass it to u_NormalMatrix
            g_normalMatrix.setInverseOf(model_matrix);
            g_normalMatrix.transpose();
            gl.uniformMatrix4fv(g_u_NormalMatrix, false, g_normalMatrix.elements);

            // Draw the cube
            gl.drawElements(gl.TRIANGLES, buffer_index, gl.UNSIGNED_BYTE, 0);
        }
    }
}

class SceneGraph extends SceneNode{
  
    constructor(friendly_name){
        super()
        this.friendly_name = friendly_name
    }


    draw(buffer_map){
        let model_matrix = new Matrix4();
        model_matrix.setTranslate(0, 0, 0);

        super._draw_children(model_matrix, buffer_map);
        

    }


}
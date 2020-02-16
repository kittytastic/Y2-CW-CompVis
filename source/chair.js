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


let g_camera;

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

  g_camera = new Camera(0,0,15,0,0);

  let models = make_all_models();
 
  g_scene_graph = make_scene(models);

  
  document.onkeydown = function(ev){
    keydown(ev, gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix);
  };

  draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix);
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
        //g_z_pos -= MOVE_STEP;
        g_camera.move_forwards(MOVE_STEP);
        break;
    case 's':
        //g_z_pos += MOVE_STEP;
        g_camera.move_backwards(MOVE_STEP);
        break;
    case 'd':
        //g_x_pos += MOVE_STEP;
        g_camera.move_left(MOVE_STEP);
        break;
    case 'a':
        //g_x_pos -= MOVE_STEP; 
        g_camera.move_right(MOVE_STEP);
        break;
    case 'z':
        //g_y_pos += MOVE_STEP;
        g_camera.move_up(MOVE_STEP); 
        break;
    case 'c':
        //g_y_pos -= MOVE_STEP;
        g_camera.move_down(MOVE_STEP); 
        break;
    case 'u':
        //g_vertical_angle = angleIncrement(g_vertical_angle, VIEW_ANGLE_STEP);
        g_camera.look_up(VIEW_ANGLE_STEP);
        break;
    case 'j':
        //g_vertical_angle = angleIncrement(g_vertical_angle, -VIEW_ANGLE_STEP);
        g_camera.look_down(VIEW_ANGLE_STEP);
        break;
    case 'h':
        //g_horizontal_angle = angleIncrement(g_horizontal_angle, VIEW_ANGLE_STEP);
        g_camera.look_left(VIEW_ANGLE_STEP);
        break;
    case 'k':
       // g_horizontal_angle = angleIncrement(g_horizontal_angle, -VIEW_ANGLE_STEP);
       g_camera.look_right(VIEW_ANGLE_STEP);
        break;
    default: 
        console.log('Key was pressed: '+ev.keyCode)
    return; // Skip drawing at no effective action
  }

//console.log("x: "+g_z_pos+" y:"+g_x_pos);
//console.log("horizontal view: "+g_horizontal_angle+" vertical view:"+g_vertical_angle);
  // Draw the scene
  draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix);
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


function draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting, u_ViewMatrix) {

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform1i(u_isLighting, false); // Will not apply lighting
  //gl.uniform1i(u_isLighting, true); // Will not apply lighting

    // Calculate the view matrix and the projection matrix
    /*let look_x = VIEW_STICK*Math.cos(2*Math.PI * (g_horizontal_angle/360)) + g_x_pos;
    let look_y = g_y_pos + VIEW_STICK*Math.cos(2*Math.PI * (g_vertical_angle/360));
    //let look_z = -100;
    let look_z = VIEW_STICK*Math.sin(2*Math.PI * (g_horizontal_angle/360)) + g_z_pos +VIEW_STICK*Math.sin(2*Math.PI * (g_vertical_angle/360));

    viewMatrix.setLookAt(g_x_pos, g_y_pos, g_z_pos, look_x, look_y, look_z, 0, 1, 0);*/
    let viewMatrix = g_camera.make_view_matrix();
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

  
  // Transform the chair
  g_chair_x_transform.update(g_xAngle, 1, 0, 0);
  g_chair_y_transform.update(g_yAngle, 0, 1, 0);
  
  // Draw scene
  g_scene_graph.draw()

}


function to_radians(deg){
  let k = (deg%360)
  deg = k>0?k:360+k
  return Math.PI * (deg/180)
}


class Camera{
  // Create a cube
    //  y
    //  |  z
    //  | /
    //  |/      
    //  O------ x

    // 0,0 looking angles would have you on the origin looking at z
    // angles go anticlokwise


  x; y; z;
  horizontal_angle; vertical_angle;
  orientation;
  camera_matrix;

  o_x; o_y; o_z;
  constructor(x, y, z, horizontal_angle, vertical_angle){
    this.x = x; 
    this.y = y;
    this.z = z; 
    this.horizontal_angle = horizontal_angle; 
    this.vertical_angle = vertical_angle;

    /*this.orientation = which_way_up;
    this.o_x, this.o_y, this.o_z = 0;
    switch(which_way_up){
      case 'x':
        this.o_x = 1.0
        break;
      case 'y':
        this.o_y = 1.0;
      case 'z':
        this.o_z = 1.0;
      default:
        console.log("Error: camera was given an unknown orientation "+this.orientation+" Defaulting to x as up")
    }*/

    this.camera_matrix = new Matrix4()
    this.camera_matrix.setTranslate(x,y,z);
    this.camera_matrix.rotate(to_radians(this.horizontal_angle), this.o_x, this.o_y, this.o_z);

  }

  make_view_matrix(){
    console.log("x:"+this.x+"  y:"+this.y+"  z:"+this.z + "  hoz:"+this.horizontal_angle+"  vert:"+this.vertical_angle);
    let cm = new Matrix4()
    cm.setTranslate(this.x,this.y,this.z);
    cm.rotate(this.horizontal_angle, 0, 1, 0);
    cm.rotate(this.vertical_angle, 1, 0, 0);
    cm.invert();
    return cm;

    
  }


  move_forwards(step){
    this._move_on_plane(step, 180);
  }

  move_backwards(step){
    this._move_on_plane(step, 0)
  }

  move_left(step){
    this._move_on_plane(step, 90)
  }

  move_right(step){
    this._move_on_plane(step, -90)
  }

  _move_on_plane(step, offset){
    let t = to_radians(this.horizontal_angle+offset)
    this.x += step * Math.sin(t)
    this.z += step * Math.cos(t)
  }

  move_up(step){
    this.y += step;
  }

  move_down(step){
    this.y -= step;
  }

  look_left(angle){
    this.horizontal_angle += angle
  }

  look_right(angle){
    this.horizontal_angle -= angle
  }

  look_up(angle){
    this.vertical_angle += angle
  }

  look_down(angle){
    this.vertical_angle -= angle
  }



}
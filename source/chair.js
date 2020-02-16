var ANGLE_STEP = 3.0;  // The increments of rotation angle (degrees)
var g_xAngle = 0.0;    // The rotation x angle (degrees)
var g_yAngle = 0.0;    // The rotation y angle (degrees)

let g_scene_graph;
let g_chair_y_transform;
let g_chair_x_transform;

let gl;
let g_u_ModelMatrix;
let g_u_NormalMatrix;

let g_camera;
let MOVE_STEP = 0.5;
let VIEW_ANGLE_STEP = 10; 

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

  let uniforms = {}

  uniforms.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  uniforms.u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  uniforms.u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  uniforms.u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  uniforms.u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  uniforms.u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  uniforms.u_isLighting = gl.getUniformLocation(gl.program, 'u_isLighting');
  // Get the storage locations of uniform attributes
  /*var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  g_u_ModelMatrix = u_ModelMatrix;
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  g_u_NormalMatrix = u_NormalMatrix;
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');*/

  // Trigger using lighting or not
  //var u_isLighting = gl.getUniformLocation(gl.program, 'u_isLighting'); 

  for(key in uniforms){
    if(!uniforms[key]){
      console.log("Error: failed to get uniform "+key);
      return;
    }
  }

  g_u_ModelMatrix = uniforms.u_ModelMatrix;
  g_u_NormalMatrix = uniforms.u_NormalMatrix;

  /*if (!u_ModelMatrix || !u_ViewMatrix || !u_NormalMatrix ||
      !u_ProjMatrix || !u_LightColor || !u_LightDirection ||
      !u_isLighting ) { 
    console.log('Failed to Get the storage locations of u_ModelMatrix, u_ViewMatrix, and/or u_ProjMatrix');
    return;
  }*/

  // Set the light color (white)
  gl.uniform3f(uniforms.u_LightColor, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  var lightDirection = new Vector3([0.5, 3.0, 4.0]);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(uniforms.u_LightDirection, lightDirection.elements);

  
  // Set perspective
  let projMatrix = new Matrix4();  
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(uniforms.u_ProjMatrix, false, projMatrix.elements);

  // Initialise camera
  g_camera = new Camera(0,0,15,0,0);

  // Make 3D models
  let models = make_all_models();
 
  // Make scene graph
  g_scene_graph = make_scene(models);

  
  document.onkeydown = function(ev){
    keydown(ev, gl, uniforms);
  };

  draw(gl, uniforms);
}


function keydown(ev, gl, uniforms) {
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
        g_camera.move_forwards(MOVE_STEP);
        break;
    case 's':
        g_camera.move_backwards(MOVE_STEP);
        break;
    case 'd':
        g_camera.move_left(MOVE_STEP);
        break;
    case 'a':
        g_camera.move_right(MOVE_STEP);
        break;
    case 'z':
        g_camera.move_up(MOVE_STEP); 
        break;
    case 'c':
        g_camera.move_down(MOVE_STEP); 
        break;
    case 'u':
        g_camera.look_up(VIEW_ANGLE_STEP);
        break;
    case 'j':
        g_camera.look_down(VIEW_ANGLE_STEP);
        break;
    case 'h':
        g_camera.look_left(VIEW_ANGLE_STEP);
        break;
    case 'k':
       g_camera.look_right(VIEW_ANGLE_STEP);
        break;
    default: 
        console.log('Key was pressed: '+ev.keyCode)
    return; // Skip drawing at no effective action
  }


  // Draw the scene
  draw(gl, uniforms);
}


function draw(gl, uniforms) {

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set camera
  let viewMatrix = g_camera.make_view_matrix();
  gl.uniformMatrix4fv(uniforms.u_ViewMatrix, false, viewMatrix.elements);

  
  draw_axis(uniforms.u_isLighting, uniforms.u_ModelMatrix);
  

  gl.uniform1i(uniforms.u_isLighting, true); // Will apply lighting

  
  // Transform the chair
  g_chair_x_transform.update(g_xAngle, 1, 0, 0);
  g_chair_y_transform.update(g_yAngle, 0, 1, 0);
  
  // Draw scene
  g_scene_graph.draw()

}





function draw_axis(u_isLighting, u_ModelMatrix){
  gl.uniform1i(u_isLighting, false); // Will not apply lighting
  
  // Set the vertex coordinates and color (for the x, y axes)

  var n = initAxesVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Calculate the view matrix and the projection matrix
  var modelMatrix = new Matrix4(); 
  modelMatrix.setTranslate(0, 0, 0);  // No Translation
  // Pass the model matrix to the uniform variable
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Draw x and y axes
  gl.drawArrays(gl.LINES, 0, n);
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
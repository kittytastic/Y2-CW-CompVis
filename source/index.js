const DEBUG = false

let ROOM_X = 10
let ROOM_Z = 6
let HEIGHT = 3

let KB_CHAIR_ANGLE_PS = 360
let KB_MOVE_PS = 3;
let KB_TURN_ANGLE_PS = 60;

let METER_TO_UNITS = 3

var g_xAngle = 0.0;    // The rotation x angle (degrees)
var g_yAngle = 0.0;    // The rotation y angle (degrees)

let g_scene_graph;
let g_chair_y_transform;
let g_chair_x_transform;

let g_camera;
let g_keyboard_controller;

const UNIFORMS = ['u_ModelMatrix', 'u_ViewMatrix', 'u_NormalMatrix', 'u_ProjMatrix', 'u_PointLightColor', 'u_PointLightPosition', 'u_AmbientLight', 'u_Sampler']

function main() {
  

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas, DEBUG);
  if (!gl) {
    console.log('Error: Failed to get the rendering context for WebGL');
    return;
  }


  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Error: Failed to intialise shaders.');
    return;
  }

  // Set clear color and enable hidden surface removal
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  
  // Get the storage locations of uniform attributes
  let uniforms = {}
  for(key in UNIFORMS){
    let name = UNIFORMS[key]
    uniforms[name] = gl.getUniformLocation(gl.program, name);

    // Check uniform exists
    if(!uniforms[name]){
      console.log("Error: failed to get uniform "+name);
      return;
    }
  }

  // Set perspective
  let projMatrix = new Matrix4();  
  projMatrix.setPerspective(40, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(uniforms.u_ProjMatrix, false, projMatrix.elements);



  // Create Lighting controller  
  let lc = new LightingController(gl, uniforms);
  
  // Set ambient Light
  let ambient = 0.3 
  lc.set_ambient(ambient, ambient, ambient);
  
  
  // Initialise camera
  g_camera = new Camera(0,1.8 * METER_TO_UNITS,3,0,0);

  // Make 3D models
  let models = make_all_models(gl);
 
  // Make textures
  let textures = make_all_textures(gl, uniforms);

  // Make scene graph
  g_scene_graph = make_scene(models, textures, lc);

  // Set keyboard actions
  g_keyboard_controller = new KeyboardController();
  set_binding(g_keyboard_controller);
  
  start_render_loop(gl, uniforms);
}


// Start render loop
function start_render_loop(gl, uniforms){
  var last_frame_time = new Date();

  function render(now) {
    //if(!g_last_frame) g_last_frame = now
    const deltaTime = now - last_frame_time;
    last_frame_time = now;

    draw(gl, uniforms, deltaTime);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}




function draw(gl, uniforms, deltaTime) {
  g_keyboard_controller.apply_key_actions()

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set camera
  let viewMatrix = g_camera.make_view_matrix();
  gl.uniformMatrix4fv(uniforms.u_ViewMatrix, false, viewMatrix.elements);

  // Don't apply lighting
  //gl.uniform1i(uniforms.u_isLighting, false);
  
  // Draw axis
  draw_axis(gl, uniforms);
  
  // Apply lighting
  //gl.uniform1i(uniforms.u_isLighting, true);

  // Transform the chair
  g_chair_x_transform.update(g_xAngle, 1, 0, 0);
  g_chair_y_transform.update(g_yAngle, 0, 1, 0);
  
  // Draw scene
  g_scene_graph.draw(gl, uniforms, deltaTime)    

}





function draw_axis(gl, uniforms){
  
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
  gl.uniformMatrix4fv(uniforms.u_ModelMatrix, false, modelMatrix.elements);

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


function set_binding(kb_controller){
  
  // Chair controls
  kb_controller.add_action('ArrowUp', (dt)=>{g_xAngle = (g_xAngle + KB_CHAIR_ANGLE_PS*dt) % 360;})
  kb_controller.add_action('ArrowDown', (dt)=>{g_xAngle = (g_xAngle - KB_CHAIR_ANGLE_PS*dt) % 360;});
  kb_controller.add_action('ArrowRight', (dt)=>{ g_yAngle = (g_yAngle + KB_CHAIR_ANGLE_PS*dt) % 360;});
  kb_controller.add_action('ArrowLeft', (dt)=>{g_yAngle = (g_yAngle - KB_CHAIR_ANGLE_PS*dt) % 360;});
  
  // Camera position
  kb_controller.add_action('w', (dt)=>{g_camera.move_forwards(KB_MOVE_PS*dt);});
  kb_controller.add_action('s', (dt)=>{g_camera.move_backwards(KB_MOVE_PS*dt);});
  kb_controller.add_action('d', (dt)=>{g_camera.move_left(KB_MOVE_PS*dt);});
  kb_controller.add_action('a', (dt)=>{g_camera.move_right(KB_MOVE_PS*dt);});
  kb_controller.add_action(' ', (dt)=>{g_camera.move_up(KB_MOVE_PS*dt);});
  kb_controller.add_action('Shift', (dt)=>{g_camera.move_down(KB_MOVE_PS*dt);});
  
  // Camera angle
  kb_controller.add_action('u', (dt)=>{g_camera.look_up(KB_TURN_ANGLE_PS*dt);});
  kb_controller.add_action('j', (dt)=>{g_camera.look_down(KB_TURN_ANGLE_PS*dt);});
  kb_controller.add_action('h', (dt)=>{g_camera.look_left(KB_TURN_ANGLE_PS*dt);});
  kb_controller.add_action( 'k', (dt)=>{g_camera.look_right(KB_TURN_ANGLE_PS*dt);});
       
}
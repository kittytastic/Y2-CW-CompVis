// Debug mode
const DEBUG = false

// Room size in meters
let ROOM_X = 10
let ROOM_Z = 6
let HEIGHT = 3

// Set camera speed
let KB_CHAIR_ANGLE_PS = 360
let KB_MOVE_PS = 3;
let KB_TURN_ANGLE_PS = 60;

// Conversion from units to meters
let METER_TO_UNITS = 3

// Declare global objects
let g_scene_graph;
let g_camera;
let g_keyboard_controller;

// Name all the uniforms used in shaders
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
  var last_frame_time;

  function render(now) {
    if(!last_frame_time) last_frame_time = now
    const deltaTime = now - last_frame_time;
    last_frame_time = now;

    draw(gl, uniforms, deltaTime);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}




function draw(gl, uniforms, deltaTime) {

  // Check the keyboard for any keys currently held down
  g_keyboard_controller.apply_key_actions()

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set camera
  let viewMatrix = g_camera.make_view_matrix();
  gl.uniformMatrix4fv(uniforms.u_ViewMatrix, false, viewMatrix.elements);

  // Print camera position
  g_camera.print_debug();
  
  // Draw scene
  g_scene_graph.draw(gl, uniforms, deltaTime)    

}



function set_binding(kb_controller){
  
  // Camera position
  kb_controller.add_action('KeyW', (dt)=>{g_camera.move_forwards(KB_MOVE_PS*dt);});
  kb_controller.add_action('KeyS', (dt)=>{g_camera.move_backwards(KB_MOVE_PS*dt);});
  kb_controller.add_action('KeyD', (dt)=>{g_camera.move_left(KB_MOVE_PS*dt);});
  kb_controller.add_action('KeyA', (dt)=>{g_camera.move_right(KB_MOVE_PS*dt);});
  kb_controller.add_action('Space', (dt)=>{g_camera.move_up(KB_MOVE_PS*dt);});
  kb_controller.add_action('KeyC', (dt)=>{g_camera.move_down(KB_MOVE_PS*dt);});
  
  // Camera angle
  kb_controller.add_action('KeyU', (dt)=>{g_camera.look_up(KB_TURN_ANGLE_PS*dt);});
  kb_controller.add_action('KeyJ', (dt)=>{g_camera.look_down(KB_TURN_ANGLE_PS*dt);});
  kb_controller.add_action('KeyH', (dt)=>{g_camera.look_left(KB_TURN_ANGLE_PS*dt);});
  kb_controller.add_action( 'KeyK', (dt)=>{g_camera.look_right(KB_TURN_ANGLE_PS*dt);});


  // Pull out chairs
  kb_controller.add_press('KeyO', (dt)=>{G_CHAIRS_OUT = !G_CHAIRS_OUT});
       
}
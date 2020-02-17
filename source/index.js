const ANGLE_STEP = 3.0;  // The increments of rotation angle (degrees)
var g_xAngle = 0.0;    // The rotation x angle (degrees)
var g_yAngle = 0.0;    // The rotation y angle (degrees)

let g_scene_graph;
let g_chair_y_transform;
let g_chair_x_transform;

let g_camera;
const MOVE_STEP = 0.5;
const VIEW_ANGLE_STEP = 10; 

let g_tex;

const UNIFORMS = ['u_ModelMatrix', 'u_ViewMatrix', 'u_NormalMatrix', 'u_ProjMatrix', 'u_PointLightColor', 'u_PointLightPosition', 'u_AmbientLight', 'u_Sampler']

function main() {
  

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas);
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


  g_tex = new Texture(gl, uniforms, '../Textures/wood.png', 0);
  

  // Create Lighting controller  
  let lc = new LightingController(gl, uniforms);
  
  // Set ambient Light
  let ambient = 0.3 
  lc.set_ambient(ambient, ambient, ambient);

  // Make 2 point lights
  let p1 = lc.get_point_light()
  //let p2 = lc.get_point_light();

  p1.set_colour(0.0, 0.0, 0.0);
  p1.set_position(0, 4, 4);
  
  //p2.set_colour(0.0, 0.0, 0.0);
  //p2.set_position(0, 4, 4);

  
  // Set perspective
  let projMatrix = new Matrix4();  
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(uniforms.u_ProjMatrix, false, projMatrix.elements);

  // Initialise camera
  g_camera = new Camera(0,0,15,0,0);

  // Make 3D models
  let models = make_all_models(gl);
 
  // Make scene graph
  g_scene_graph = make_scene(models, lc);

  
  // Bind keydown listener
  document.onkeydown = function(ev){
    keydown(ev, gl, uniforms);
  };

  // Draw first frame
  draw(gl, uniforms);
}


function keydown(ev, gl, uniforms) {
  switch (ev.key) {
    case 'ArrowUp': 
      g_xAngle = (g_xAngle + ANGLE_STEP) % 360;
      break;
    case 'ArrowDown': 
      g_xAngle = (g_xAngle - ANGLE_STEP) % 360;
      break;
    case 'ArrowRight':
      g_yAngle = (g_yAngle + ANGLE_STEP) % 360;
      break;
    case 'ArrowLeft':
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

  g_tex.switch_to_me();

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
  g_scene_graph.draw(gl, uniforms)    

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


class TextureController{
  constructor(gl, uniforms){
    this.created_textures = 0;
    this.gl = gl;
    this.uniforms = uniforms;
  }

  make_texture(img_url){
    if(this.created_textures<  gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS){
      this.created_textures += 1;
      return new Texture(this.gl, this.uniforms, img_url, this.created_textures-1);
    }else{
      console.log("Error: Cannot make more textures, the maximum limit has been reached ("+gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS+")")
      return null;
    }
  }


}

class Texture{
  constructor(gl, uniforms, img_url, texture_id){
    this.gl = gl
    this.uniforms = uniforms
    this.texture_id = texture_id;
    /*this.img = new Image();
    this.img.onload = this._create_texture.bind(this);
    this.img_loaded = false*/
    this.texture = loadTexture(gl, img_url)
  }

  /*_create_initial_texture(){

  }

  _create_texture(){
    //this.gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, )

    this.gl.activeTexture(gl.TEXTURE0)
    this.gl.bindTexture(gl.TEXTURE_2D, this.img);

    this.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB)


    this.img_loaded = true;
  }*/

  switch_to_me(){

    // Tell WebGL we want to affect texture unit 0
    this.gl.activeTexture(this.gl.TEXTURE0);

    // Bind the texture to texture unit 0
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // Tell the shader we bound the texture to texture unit 0
    this.gl.uniform1i(this.uniforms.u_Sampler, 0);

  }


}



function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
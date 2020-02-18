function make_all_textures(gl, uniforms){
    let textures = {}
    let tc = new TextureController(gl, uniforms)


    /*textures['wood'] =  new Texture(gl, uniforms, '../Textures/wood.png', 0);
    textures['dark_wood'] =  new Texture(gl, uniforms, '../Textures/dark_wood.png', 0);*/

    textures['wood'] =  tc.make_texture('../Textures/wood.png');
    textures['dark_wood'] =  tc.make_texture('../Textures/dark_wood.png');




    return textures
}


class TextureController{
    constructor(gl, uniforms){
      this.created_textures = 0;
      this.gl = gl;
      this.uniforms = uniforms;
    }
  
    make_texture(img_url){
      if(this.created_textures<  this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS){
        this.created_textures += 1;
        return new Texture(this.gl, this.uniforms, img_url, this.created_textures-1);
      }else{
        console.log("Error: Cannot make more textures, the maximum limit has been reached ("+this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS+")")
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
      this.texture = loadTexture(gl, img_url, texture_id)
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
      //this.gl.activeTexture(this.gl.TEXTURE0);
  
      // Bind the texture to texture unit 0
      //this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  
      //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
      //this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);


      // Tell the shader we bound the texture to texture unit 0
      //this.gl.uniform1i(this.uniforms.u_Sampler, 0);
      this.gl.uniform1i(this.uniforms.u_Sampler, this.texture_id);
  
    }
  
  
  }
  
  
  
  function loadTexture(gl, url, texture_unit) {
    const texture = gl.createTexture();

    gl.activeTexture(gl['TEXTURE'+texture_unit])

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
      gl.activeTexture(gl['TEXTURE'+texture_unit])
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);
  
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          console.log("Mip mapping")
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
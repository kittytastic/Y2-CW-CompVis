
    class Model{
        constructor(){
  
        }
  
        switch_to_me(){
          console.log("Error: model hasn't initiated switch to me function")
        }
    }  
  
  class Attribute{
    constructor(attribute, data, num, type, offset, stride){
      this.attribute = attribute;
      this.data = data;
      this.num = num;
      this.type = type;
      if(offset){this.offset = offset;}else{this.offset=0}
      if(stride){this.stride = stride;}else{this.stride=0}

      this.has_error = false

      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log('Error: Failed to create the buffer object');
        this.has_error = true
        return
      }
      //console.log("Building buffer with data: ", this.data)
      // Write date into the buffer object
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }

    bind(){
     
      if(!this.has_error){
        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        
        // Assign the buffer object to the attribute variable
        var a_attribute = gl.getAttribLocation(gl.program, this.attribute);
        if (a_attribute < 0) {
          console.log('Error: Failed to get the storage location of ' + this.attribute);
          this.has_error = true;
          return false;
        }
      gl.vertexAttribPointer(a_attribute, this.num, this.type, false, this.stride, this.offset);
      // Enable the assignment of the buffer object to the attribute variable
      gl.enableVertexAttribArray(a_attribute);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }else{
      console.log("Error: unable to bind buffer, an error has occurred")
    }
    return true;
    }

  }


  class Basic3DModel extends Model{
    constructor(vertices, normals, colors, indices){
        super();
        this.attributes = []
        this.has_error = false
        this.attributes.push(new Attribute('a_Position', vertices, 3, gl.FLOAT));
        this.attributes.push(new Attribute('a_Color', colors, 3, gl.FLOAT));
        this.attributes.push(new Attribute('a_Normal', normals, 3, gl.FLOAT));
        this.n = indices.length;

        this.buffer = gl.createBuffer()
        if (!this.buffer) {
          console.log('Error: Failed to create the buffer object');
          this.has_error = true
          return
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }

    switch_to_me(){
      if(!this.has_error){
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);

      for(let i=0; i<this.attributes.length; i++){
        // TODO error check
        this.attributes[i].bind();
      }}else{
        console.log("Error: cannot switch to model as it has an error")
      }
    }

  }


  function make_square_obj(gl) {
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
  
  
    
    return new Basic3DModel(vertices,normals,colors,indices);
  }
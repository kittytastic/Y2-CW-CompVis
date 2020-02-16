
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

class LightingController{
    uniforms;
    gl;
    ambient = [0,0,0];
    point_position;
    point_color;
    allocated_point_lights=0;
  
      constructor(gl, uniforms){
          this.uniforms = uniforms
          this.gl = gl;
          
          let point_zeros = []
          for(let i=0; i<MAX_POINT_LIGHTS; i++){
            point_zeros.push(0.0);
          }
          this.point_position = point_zeros.splice()
          this.point_color = point_zeros.splice()
  
      }
  
      set_ambient(r,g,b){
        this.ambient = [r,g,b]
        this.gl.uniform3f(this.uniforms.u_AmbientLight, r, g, b);
      }
  
      _set_point_light_position(light_id, x, y, z){
        if(light_id>=MAX_POINT_LIGHTS){
          console.log("Error: cannot set position on point light "+light_id+" as it is out of range");
          return false;
        }
  
        let offset = 3*light_id;
        this.point_position[offset] = x;
        this.point_position[offset+1] = y;
        this.point_position[offset+2] = z;
        
        this.gl.uniform3fv(this.uniforms.u_PointLightPosition, new Float32Array(this.point_position));
      }
  
      _set_point_light_color(light_id, r, g, b){
        if(light_id>=MAX_POINT_LIGHTS){
          console.log("Error: cannot set position on point light "+light_id+" as it is out of range");
          return false;
        }
  
        let offset = 3*light_id;
        this.point_color[offset] = r;
        this.point_color[offset+1] = g;
        this.point_color[offset+2] = b;
        
        this.gl.uniform3fv(this.uniforms.u_PointLightColor, new Float32Array(this.point_color));
  
      }
  
      get_point_light(){
        if(this.allocated_point_lights<MAX_POINT_LIGHTS){
          this.allocated_point_lights += 1
          return new PointLight(this, this.allocated_point_lights-1);
        }else{
          console.log("Error: cannot make a new point light, there are no more left to be allocated!")
          return false;
        }
  
      }
  
  
  
  
  }
  
  class PointLight{
    constructor(lighting_controller, id){
        this.lc = lighting_controller;
        this.id = id;
    }
  
    set_colour(r,g,b){
      this.lc._set_point_light_color(this.id, r, g, b);
    }
  
    set_position(x, y, z){
      this.lc._set_point_light_position(this.id, x, y, z);
    }
  
  }
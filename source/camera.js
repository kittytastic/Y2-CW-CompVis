class Camera{
    // Axis
    //  y
    //  |  -z
    //  | /
    //  |/      
    //  O------ x

    // 0,0 looking angles would have you on the origin looking at -z
    // angles go anticlockwise

  x; y; z;
  horizontal_angle; vertical_angle;

  constructor(x, y, z, horizontal_angle, vertical_angle){
    this.x = x; 
    this.y = y;
    this.z = z; 
    this.horizontal_angle = horizontal_angle; 
    this.vertical_angle = vertical_angle;
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

  _move_on_plane(step, offset){
    let t = this._to_radians(this.horizontal_angle+offset)
    this.x += step * Math.sin(t)
    this.z += step * Math.cos(t)
  }

  _to_radians(deg){
    let k = (deg%360)
    deg = k>0?k:360+k
    return Math.PI * (deg/180)
  }
}
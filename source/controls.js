class KeyboardController{
    key_down_time = {}
    currently_down = {}
    key_press_queue = []
    action = {}
    press = {}

    constructor(){
        // Bind key listeners
        document.onkeydown = this._keydown.bind(this);
        document.onkeyup = this._keyup.bind(this);
        document.onkeypress = this._keypress.bind(this)
    }

    add_action(key, action_func){
        this.action[key] = action_func;
    }

    add_press(key, action_func){
      this.press[key] = action_func;
    }

    _keydown(ev){
        if(!this.currently_down[ev.code] && this.action[ev.code]){
          this.currently_down[ev.code] = true;
          this.key_down_time[ev.code] = new Date()
        }
      }
      
      _keyup(ev){
        let now = new Date();
        this.currently_down[ev.code] = false
        let dur = now - this.key_down_time[ev.code]
        this.key_press_queue.push({key: ev.code, time:dur});
      }

      _keypress(ev){
        if(this.press[ev.code]){
          this.press[ev.code]();
        }
      }
      
      
      apply_key_actions(){
          let now = new Date()
      
          for(key in this.currently_down){
            if(this.currently_down[key]){
              let dt = now - this.key_down_time[key];
              this._key_action(key, dt)
              this.key_down_time[key] = now;
            }
          }
      
          for(let i=0; i<this.key_press_queue.length; i++){
            //console.log("finished lp")
            let k = this.key_press_queue[i]
            this._key_action(k.key, k.time)
          }
      
          this.key_press_queue = [];
      }

      _key_action(key, deltaT){
          // Convert milliseconds to seconds 
          let delta_seconds = deltaT * 0.001

          if(this.action[key]){
              this.action[key](delta_seconds);
          }

      }
}
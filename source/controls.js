class KeyboardController{
    key_down_time = {}
    currently_down = {}
    key_press_queue = []
    timed_action = {}
    press = {}

    constructor(){
        // Bind key listeners
        document.onkeydown = this._keydown.bind(this);
        document.onkeyup = this._keyup.bind(this);
        document.onkeypress = this._keypress.bind(this)
    }

    // Timed actions will call back call backs with the amount of time that has elapsed since initial press or last frame
    add_timed_action(key, action_func){
        this.timed_action[key] = action_func;
    }

    // Press actions will be triggered on key press
    add_press(key, action_func){
      this.press[key] = action_func;
    }

    // Handel keydown event
    _keydown(ev){
        if(!this.currently_down[ev.code] && this.timed_action[ev.code]){
          // Record that the key is currently being pressed
          this.currently_down[ev.code] = true;
          this.key_down_time[ev.code] = new Date()
        }
      }
      
      // Handel keyup event
      _keyup(ev){
        let now = new Date();
        this.currently_down[ev.code] = false
        let dur = now - this.key_down_time[ev.code]

        // enqueue the time between keyup and last frame
        this.key_press_queue.push({key: ev.code, time:dur});
      }

      // Handel keypress event
      _keypress(ev){
        // Trigger keypress callback
        if(this.press[ev.code]){
          this.press[ev.code]();
        }
      }
      
      
      // Applies all actions for keys that can be held down for time
      apply_timed_actions(){
          let now = new Date()
      
          // Check all keys that are currently down and trigger their action if required
          for(key in this.currently_down){
            if(this.currently_down[key]){
              let dt = now - this.key_down_time[key];
              this._key_action(key, dt)
              this.key_down_time[key] = now;
            }
          }
      
          // Work through queue of all key that have been released since the last frame
          // And apply their actions for the amount of time required
          for(let i=0; i<this.key_press_queue.length; i++){
            let k = this.key_press_queue[i]
            this._key_action(k.key, k.time)
          }
      
          this.key_press_queue = [];
      }

      // Apply a keys action
      _key_action(key, deltaT){
          // Convert milliseconds to seconds 
          let delta_seconds = deltaT * 0.001

          if(this.timed_action[key]){
              this.timed_action[key](delta_seconds);
          }

      }
}
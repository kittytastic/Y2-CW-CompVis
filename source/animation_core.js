class Animation{
    animation_function;
  
    constructor(friendly_name, initial_state, animation_function){
       this.friendly_name = friendly_name;
       this.state = initial_state;
       this.animation_function = animation_function
    }
  
    set_function(animation_function){
      this.animation_function = animation_function;
    }

    set_state(state){
        this.state = state
    }
  
    apply(model_matrix, deltaTime){
      if(!this.animation_function){
        console.log("Error: Unable to apply animation "+this.friendly_name+" as no animation function has been provided");
      }else{
        this.state = this.animation_function(model_matrix, deltaTime, this.state);
        if(!this.state){
            console.log("Error: animation "+this.friendly_name+" has not updated its state");
        }
      }
    }
  }
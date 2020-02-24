//
// This file defines all the classes used for animations
//

// An animation is stateful. i.e it is given an initial state and every frame it applies any necessary transformations then needs to update its state

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


// This class can be used for animating light objects
class AnimationLight extends Animation{
  apply(light, deltaTime){
    if(!this.animation_function){
      console.log("Error: Unable to apply animation "+this.friendly_name+" as no animation function has been provided");
    }else{
      this.state = this.animation_function(light, deltaTime, this.state);
      if(!this.state){
          console.log("Error: animation "+this.friendly_name+" has not updated its state");
      }
    }
  }


}

// This object can be used to animate texture objects
class AnimationTexture extends Animation{
  apply(deltaTime){
    if(!this.animation_function){
      console.log("Error: Unable to apply animation "+this.friendly_name+" as no animation function has been provided");
    }else{
      this.state = this.animation_function(deltaTime, this.state);
      if(!this.state){
          console.log("Error: animation "+this.friendly_name+" has not updated its state");
      }
    }
    return this.state.texture
  }
}
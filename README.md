# Living room simulation - qwrx21

## How to install

```bash
npm install
```

## How to run 
```bash
npm run
```

This should automatically open a tab in your browser. If a tab isn't automatically opened the server runs on port 8081 and can be access through a browser on [http://localhost:8081].


## Features
- **Extensive Scene Graph** - Everything in the scene is a member of the scene graph: models, animations, translations, lights;  
- **Stateful animations** - Animations use the idea of statefulness to make them super flexible. Animations can be applied to: position, lights (colour and position), and a models' texture.
- **Multiple point lights** - The framework supports multiple point lights, adjustable in *shader.js*. The demo shows a point light in the lamp and point light on the T.V.. 
- **Flexible** - I very much built this as a framework and then made a living room using it, hence beyond the actual definition of the scene and its' components everything is easily reusable e.g. Scene Graph, Camera, Time-aware Keyboard controller e.t.c. 


## External resources used
Some of the textures used are from the Minecraft texture-pack PureDBcraft [https://bdcraft.net/downloads/purebdcraft-minecraft/]. Using them within the scope of this course work is allowed according to their fair usage agreement. They can be distinguished for the texture that I have created as they are stored in the folder */Textures/External*. Visually they can be distinguished by their cartoon appearance. Because they tesselate nicely they have been used on the floor and ceiling to show repeated textures.  

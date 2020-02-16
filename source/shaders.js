// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +        // Normal
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
 
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  'uniform bool u_isLighting;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  //'  if(u_isLighting)\n' + 
  '  if(true)\n' + 
  '  {\n' +
  '     v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '     v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '     v_Color = a_Color;\n' +
  '}\n'+
  '  else\n' +
  '  {\n' +
  '     v_Color = a_Color;\n' +
  '  }\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' + // Light direction (in the world coordinate, normalized)
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  'void main() {\n' +
  '     vec3 normal = normalize(v_Normal);\n' +
  '     vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
  '     float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  // Calculate the color due to diffuse reflection
'     vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
//'     v_Color = vec4(diffuse, a_Color.a);\n' +  '  }\n' +

  '  gl_FragColor = vec4(diffuse, v_Color.a);\n' +
  '}\n';
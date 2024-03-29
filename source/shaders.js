// global variable that sets the maximum number of point lights
var MAX_POINT_LIGHTS = 2



// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +        // Normal
  'attribute vec2 a_TexCoords;\n' +        
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
 
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  'varying highp vec2 v_TexCoords;\n' +
  
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '     v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '     v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '     v_Color = a_Color;\n' +
  '     v_TexCoords = a_TexCoords;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'uniform vec3 u_PointLightColor['+MAX_POINT_LIGHTS+'];\n' +   
'uniform vec3 u_PointLightPosition['+MAX_POINT_LIGHTS+'];\n' +
'uniform vec3 u_AmbientLight;\n' + 
'uniform sampler2D u_Sampler;\n' + 
'varying vec4 v_Color;\n' +
'varying vec3 v_Position;\n' +
'varying vec3 v_Normal;\n' +
'varying highp vec2 v_TexCoords;\n' +

'void main() {\n' +
'     vec3 normal = normalize(v_Normal);\n' +
'     vec3 diffuse = vec3(0.0,0.0,0.0);\n' +
'       vec4 TexColor = texture2D(u_Sampler, v_TexCoords);\n' +
      // For each point light
'     for(int i=0; i<'+MAX_POINT_LIGHTS+'; i++){\n' +
'       vec3 lightDirection = normalize(u_PointLightPosition[i] - v_Position);\n' +
'       float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
        // Calculate the color due to diffuse reflection
'       diffuse += u_PointLightColor[i] * TexColor.rgb * nDotL;\n' +
'     }\n' +
    // Calculate ambient lighting
'   vec3 ambient = u_AmbientLight * TexColor.rgb;\n' +
    // Colour is the sum of diffused and ambient
'   gl_FragColor = vec4(diffuse+ambient, 1);\n' +
' }\n';
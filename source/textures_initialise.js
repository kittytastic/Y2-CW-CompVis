//
// In this file all the textures are loaded into an object
//


function make_all_textures(gl, uniforms){
    let textures = {}
    let tc = new TextureController(gl, uniforms)

    textures['wood'] =  tc.make_texture('../Textures/wood.png');
    textures['dark_wood'] =  tc.make_texture('../Textures/dark_wood.png');
    textures['stone'] =  tc.make_texture('../Textures/stone.png');
    textures['carpet'] =  tc.make_texture('../Textures/carpet.png');
    textures['feature_wall'] =  tc.make_texture('../Textures/fw.png');
    textures['wall'] =  tc.make_texture('../Textures/wall.png');
    textures['brushed_metal'] =  tc.make_texture('../Textures/brushed_metal.png');
    textures['brushed_metal_dark'] =  tc.make_texture('../Textures/brushed_metal_dark.png');
    textures['brushed_metal_light'] =  tc.make_texture('../Textures/brushed_metal_light.png');
    textures['lamp'] =  tc.make_texture('../Textures/lamp.png');
    textures['sofa'] =  tc.make_texture('../Textures/sofa.png');
    textures['light_hi'] =  tc.make_texture('../Textures/light_hi.png');
    textures['light_low'] =  tc.make_texture('../Textures/light_low.png');
    textures['tv_screen'] =  tc.make_texture('../Textures/tv_screen.png');


    return textures
}
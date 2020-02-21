function print_debug_model_matrix(model_matrix){
    let cords = new Vector4([0.0, 0.0, 0.0, 1.0])
    cords = model_matrix.multiplyVector4(cords);
    let x = cords.elements[0]
    let y = cords.elements[1]
    let z = cords.elements[2]
    document.getElementById("d_x").innerHTML = round_to(x, 1)
    document.getElementById("d_y").innerHTML = round_to(y, 1)
    document.getElementById("d_z").innerHTML = round_to(z, 1)

}


function round_to(dec, dp){
    let fact = Math.pow(10, dp)
    return Math.round(dec*fact)/fact
  }
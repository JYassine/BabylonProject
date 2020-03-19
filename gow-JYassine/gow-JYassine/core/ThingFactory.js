import Utilities from "../utilities/Utilities.js";


// an utility variable
// contains functions to generate in-game things
// such as crates, doors, etc
var ThingFactory = {

    createTimeCrate : function(size, power, scene) {

        
        let columns = 2;
        let rows = 1;
        let faceUV = new Array(6);

        // faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
        for (var i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(1 / columns, 0, (1 + 1) / columns, 1);
        }
        faceUV[4] = new BABYLON.Vector4(0, 0, 1 / columns, 1);
        //timeCrate.checkCollisions = true;
        let options = {
            wrap: true,
            faceUV: faceUV,
            size: size
        }
        
        var timeCrate = new BABYLON.MeshBuilder.CreateBox("timeCrate", options, scene);
        var timeCrateTexture = new BABYLON.Texture("./textures/crates/crate" + parseInt(power) + ".png", scene);
    
        var timeCrateMaterial = new BABYLON.StandardMaterial('timeCrate', scene);
        timeCrateMaterial.diffuseTexture = timeCrateTexture;
        timeCrate.material = timeCrateMaterial;
        var returnCrate = {
            mesh: timeCrate,
            size: size,
            power: power,
            isRemoved: false,
            floatVal: Math.random() * Math.PI*2
        }
        return returnCrate;

    }

}

export default ThingFactory;
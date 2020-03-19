import Utilities from "../utilities/Utilities.js";



// an utility variable
// contains functions to generate in-game things
// such as crates, doors, etc
var ThingFactory = {

    createTimeCrate: function (size, power, scene) {


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
            floatVal: Math.random() * Math.PI * 2
        }
        return returnCrate;

    },

    // if linear is TRUE the gate moves with a fixed speed.
    // if FALSE the gate accelerates, then decelerate on direction switch
    // SPEED is how fast... the gate moves.
    // RANGE is how far... the gate goes.
    // The best is just to try some values until you get what you want
    createGate: function (size, speed, range, linear, xPos, scene) {
        let daLight = ThingFactory.createCustomLight("gateLight", 0, 0, 1, scene);
        var gate = BABYLON.MeshBuilder.CreateCylinder("gate",
            { diameterTop: size, diameterBottom: size, height: size*7, tessellation: 96 }, scene);
        // Add the particle effect to the gate
        aestheticGate(gate, scene);
        gate.material = daLight;
        gate.position.x = xPos;
        let returnGate = {
            mesh: gate,
            floatVal: Math.random() * Math.PI * 2,
            linear: linear,
            speed: speed,
            range: range,
            initialX: xPos
        }
        return returnGate;

    },



    // not really meant to be used directly... usually... or is it?
    createCustomLight: function(id, r, g, b, scene) {
        BABYLON.Effect.ShadersStore[id + "customVertexShader"] = 'precision highp float;  attribute vec3 position; attribute vec3 normal; attribute vec2 uv;  uniform mat4 worldViewProjection; uniform float time;  varying vec3 vPosition; varying vec3 vNormal; varying vec2 vUV;  void main(void) {     vec3 v = position;     gl_Position = worldViewProjection * vec4(v, 1.0);     vPosition = position;     vNormal = normal;     vUV = uv; }';
        BABYLON.Effect.ShadersStore[id + "customFragmentShader"] = `
                    #extension GL_OES_standard_derivatives : enable
                    precision highp float;   
                                
                    // Varying
                    varying vec3 vPosition;
                    varying vec3 vNormal;
                    varying vec2 vUV;
    
                    // Refs
                    uniform vec3 color;
                    uniform vec3 cameraPosition;
                                
                    
                    void main(void) {          
                        float x = vUV.x;
                        float y = vUV.y;
                        vec2 uv = -1. + 2. * vUV;
                        float a = 1. - smoothstep(-.9, 0.9, abs(uv.x)); //*(1.-vUV.y))*1.);
                        float b = 1. - pow(0.1, vUV.y);
                        vec3 col = vec3(`+ r + `,` + g + `,` + b + `);
                        gl_FragColor = vec4(col, 0.2);
                    }`;
    
    
        var gateLight = new BABYLON.ShaderMaterial("shader", scene, {
            vertex: id + "custom",
            fragment: id + "custom",
        },
            {
                needAlphaBlending: true,
                attributes: ["position", "normal", "uv"],
                uniforms: ["time", "worldViewProjection"]
            });
    
        return gateLight;
    }

}












/************** RESSOURCES USED FOR THINGFACTORY **********/





// Create a particle effect fountain. Solely made for the gates you have to enter
// Later, we should maybe avoid remaking the whole particle system for each gate, since it's the same
function aestheticGate(theGate, scene) {

    var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);
    particleSystem.particleTexture = new BABYLON.Texture("./textures/flare.png", scene);
    particleSystem.emitter = theGate;
    particleSystem.minEmitBox = new BABYLON.Vector3(50, -3, 50);
    particleSystem.maxEmitBox = new BABYLON.Vector3(-50, 200, -50);
    particleSystem.color1 = new BABYLON.Color4(0.0, 0.0, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.3, 0.2, 0.8, 1.0);
    //particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 5.0;
    particleSystem.maxSize = 12.0;
    particleSystem.minLifeTime = 1.0;
    particleSystem.maxLifeTime = 2.0;
    particleSystem.emitRate = 50;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(4, 2, -4);
    particleSystem.direction2 = new BABYLON.Vector3(-4, 12, 4);
    //particleSystem.minAngularSpeed = 0;
    //particleSystem.maxAngularSpeed = Math.PI;
    //particleSystem.minEmitPower = 1;
    //particleSystem.maxEmitPower = 5;
    particleSystem.updateSpeed = 0.01;
    particleSystem.isLocal = true;
    particleSystem.start();

}







export default ThingFactory;
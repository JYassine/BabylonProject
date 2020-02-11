var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas,true)


var createScene = function() {


    var scene = new BABYLON.Scene(engine);
    var boat;
    scene.enablePhysics();
    
    

    // Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
   
    camera.attachControl(canvas, true);
    
    // Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("//www.babylonjs.com/assets/skybox/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Water material
    var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
    waterMaterial.bumpTexture = new BABYLON.Texture("//www.babylonjs.com/assets/waterbump.png", scene);
    waterMaterial.windForce = -10;
    waterMaterial.waveHeight = 0.8;
    waterMaterial.bumpHeight = 0.1;
    waterMaterial.waveLength = 0.3;
    waterMaterial.waveSpeed = 100;
    waterMaterial.colorBlendFactor = 0;
    waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
    waterMaterial.colorBlendFactor = 0;
    

    // Ground
    var groundTexture = new BABYLON.Texture("//www.babylonjs.com/assets/sand.jpg", scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 1024, 1024, 32, scene, false);
    ground.position.y = -1;
    ground.material = groundMaterial;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

    // Water mesh
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1024, 1024, 32, scene, false);
    waterMesh.material = waterMaterial;
    waterMesh.physicsImpostor = new BABYLON.PhysicsImpostor(waterMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    

    waterMaterial.addToRenderList(ground);
    waterMaterial.addToRenderList(skybox);
    waterMaterial.addToRenderList(boat);

    //Movement 
    var map = {}; //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    function boatMovement(boat){

            if ((map["z"] || map["Z"])) {
                dir = boat[0].getDirection(new BABYLON.Vector3(0, 0, 1))
                boat[0].position.x+=dir.x
                boat[0].position.z+=dir.z
            };
        
            if ((map["q"] || map["Q"])) {
                
                boat[0].rotate(BABYLON.Axis.Y, -Math.PI / 100, BABYLON.Space.WORLD); 
            };
        
            if ((map["d"] || map["D"])) {
                boat[0].rotate(BABYLON.Axis.Y, Math.PI / 100, BABYLON.Space.WORLD); 
            };
        

        

    }

    BABYLON.SceneLoader.ImportMesh("","./", "boat.glb", scene, function (newMeshes) {
            
        // Attach camera to canvas inputs
        console.log(newMeshes)
        scene.activeCamera.attachControl(canvas);
        camera.target=newMeshes[0];

            
		scene.registerBeforeRender(boatMovement.bind(this, newMeshes));

        
        
    });


    scene.registerBeforeRender(function (){

      

    });


    return scene;
}



var scene = createScene();
engine.runRenderLoop(function() {
    scene.render();
});
window.addEventListener('resize', function() {
    engine.resize();
});



var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas,true)


var createScene = function() {


    var scene = new BABYLON.Scene(engine)
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    var camera = new BABYLON.ArcRotateCamera("Camera", 5,1,5, new BABYLON.Vector3(5, 10, -30), scene);
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 10, 10), scene);

    camera.attachControl(canvas, true);
    camera.applyGravity = true;

    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 50, height: 50}, scene);
    var myBox =  BABYLON.MeshBuilder.CreateBox("myBox", {height: 2, width: 2, depth: 2}, scene);
    
    var box =  BABYLON.MeshBuilder.CreateBox("myBox", {height: 2, width: 2, depth: 2}, scene);


    var wall = BABYLON.Mesh.CreatePlane("wall", 5, scene);
    wall.position.y=1
    wall.material = new BABYLON.StandardMaterial("wallMat", scene);
    wall.material.emissiveColor = new BABYLON.Color3(0.5, 1, 0.5);

    myBox.position.x=4
    myBox.position.y=4
    box.position.y=1
    box.position.z=-10

    box.isPickable = false; 

    

    var map = {}; //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));



    
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;
    myBox.checkCollisions=true;
    myGround.checkCollisions=true;


    // Impact impostor
    var impact = BABYLON.Mesh.CreatePlane("impact", 1, scene);
    impact.material = new BABYLON.StandardMaterial("impactMat", scene);
    impact.material.diffuseTexture = new BABYLON.Texture("textures/impact.png", scene);
    impact.material.diffuseTexture.hasAlpha = true;
    impact.position = new BABYLON.Vector3(0, 0, -0.1);
    
    

    scene.enablePhysics();

    //Impulse Settings
    var impulseDirection = new BABYLON.Vector3(0, 1, 0);
    var impulseMagnitude = 1.3;
    var contactLocalRefPoint = BABYLON.Vector3.Zero();

    var Pulse = function() {
        box.physicsImpostor.applyImpulse(impulseDirection.scale(impulseMagnitude), box.getAbsolutePosition().add(contactLocalRefPoint));
    }

    
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.2 }, scene);
    myBox.physicsImpostor = new BABYLON.PhysicsImpostor(myBox, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 3,restitution: 0.2 }, scene);
    myGround.physicsImpostor = new BABYLON.PhysicsImpostor(myGround, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0,friction:0.5}, scene);
    scene.registerBeforeRender(function () {


        if(box.intersectsMesh(myBox, true)) {
            myBox.material = new BABYLON.StandardMaterial("b1mat", scene);
            myBox.material.diffuseColor = new BABYLON.Color3(2, 0, 0); // over-powered colors..
        }else {
            
            myBox.material = new BABYLON.StandardMaterial("b1mat", scene);
            myBox.material.diffuseColor = new BABYLON.Color3(0, 2, 0); // over-powered colors..
        }
        
        if ((map["z"] || map["Z"])) {
            box.position.z += 0.1;
        };
    
        if ((map["s"] || map["S"])) {
            box.position.z -= 0.1;
        };
    
        if ((map["q"] || map["Q"])) {
            box.position.x -= 0.1;
        };
    
        if ((map["d"] || map["D"])) {
            box.position.x += 0.1;
        };

        if ((map["f"] || map["F"])) {
            Pulse()
        };
    });

    scene.onPointerDown = function (evt, pickResult) {
        // if the click hits the ground object, we change the impact position
        if (pickResult.hit) {
            impact.position.x = pickResult.pickedPoint.x;
            impact.position.y = pickResult.pickedPoint.y;
        }
    };
    return scene;
}



var scene = createScene();
engine.runRenderLoop(function() {
    scene.render();
});
window.addEventListener('resize', function() {
    engine.resize();
});



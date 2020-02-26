var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true)
// OUR BOAT
var bigBoat;
// THE DYNAMIC TERRAIN
var dynamicTerrain;
//MUSIC
var musicBoat;
var musicSucceedCheckPoint;
var musicWind;

// checkpoint
var numberCheckPoint = 5
var numberCheckPointPassed = 0

// gui text
var textPassed = new BABYLON.GUI.TextBlock();

// LOADING SCREEN
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        // Do not add a loading screen if there is already one
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "Scene is loading...";


    var customLoadingScreenCss = document.createElement('style');
    customLoadingScreenCss.type = 'text/css';
    customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: #000000;
        color: white;
        font-size:50px;
        text-align:center;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    document.getElementById("customLoadingScreenDiv").style.display = "none";
}

const displayGUI = (textPassed, scene) => {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.adaptWidthToChildren = true;
    rect1.height = "40px";
    rect1.width = "200px"
    rect1.cornerRadius = 20;
    rect1.color = "Orange";
    rect1.thickness = 4;
    rect1.background = "green";
    advancedTexture.addControl(rect1);
    rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    textPassed.text = "PASSED : " + numberCheckPointPassed + "/" + numberCheckPoint;
    textPassed.color = "white";
    textPassed.fontSize = 24;
    rect1.addControl(textPassed);


    var meContMoveBtnWidth = "40px";
    var meContMoveBtnHeight = "40px";

    var style = advancedTexture.createStyle();
    style.fontSize = 20;
    style.fontFamily = "Arial, Helvetica, sans-serif";
    style.fontWeight = "bold";

    var menuContainerMove = new BABYLON.GUI.Rectangle()
    menuContainerMove.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    menuContainerMove.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    menuContainerMove.width = "100px";
    menuContainerMove.height = "100px";
    advancedTexture.addControl(menuContainerMove);

    var menuContainerMoveGrid = new BABYLON.GUI.Grid();
    menuContainerMove.addControl(menuContainerMoveGrid);


    menuContainerMoveGrid.addColumnDefinition(0, false);
    menuContainerMoveGrid.addColumnDefinition(0.3);
    menuContainerMoveGrid.addColumnDefinition(0.3);
    menuContainerMoveGrid.addColumnDefinition(0.3);
    menuContainerMoveGrid.addColumnDefinition(0, false);
    menuContainerMoveGrid.addRowDefinition(0.3);
    menuContainerMoveGrid.addRowDefinition(0.3);
    menuContainerMoveGrid.addRowDefinition(0.3);


    var buttonZ = BABYLON.GUI.Button.CreateSimpleButton("Z", "Z");
    buttonZ.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttonZ.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    buttonZ.width = meContMoveBtnWidth;
    buttonZ.height = meContMoveBtnHeight;
    buttonZ.background = "red";
    buttonZ.style = style;

    menuContainerMoveGrid.addControl(buttonZ, 0, 2);


    var buttonQ = BABYLON.GUI.Button.CreateSimpleButton("Q", "Q");
    buttonQ.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttonQ.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    buttonQ.width = meContMoveBtnWidth;
    buttonQ.height = meContMoveBtnHeight;
    buttonQ.background = "red";
    buttonQ.style = style;

    menuContainerMoveGrid.addControl(buttonQ, 2, 1);

    var buttonD = BABYLON.GUI.Button.CreateSimpleButton("D", "D");
    buttonD.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttonD.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    buttonD.width = meContMoveBtnWidth;
    buttonD.height = meContMoveBtnHeight;
    buttonD.background = "red";
    buttonD.style = style;
    menuContainerMoveGrid.addControl(buttonD, 2, 3);

    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 90:
                buttonZ.background = "green";
                break;
            case 81:
                buttonQ.background = "green";
                break;
            case 68:
                buttonD.background = "green";
                break;


        }
    });

    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 90:
                buttonZ.background = "red";
                break;
            case 81:
                buttonQ.background = "red";
                break;
            case 68:
                buttonD.background = "red";
                break;
        }

    });

}


var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    
    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    scene.collisionsEnabled = true;
    
    // Parameters : name, position, scene
    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    displayGUI(textPassed, scene)
    engine.displayLoadingUI()

    // Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), scene);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
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
    waterMaterial.waveHeight = 0.2;
    waterMaterial.bumpHeight = 0.1;
    waterMaterial.waveLength = 0.1;
    waterMaterial.waveSpeed = 40.0;
    waterMaterial.colorBlendFactor = 0;
    waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
    waterMaterial.colorBlendFactor = 0;

    // Ground
    var groundTexture = new BABYLON.Texture("//www.babylonjs.com/assets/sand.jpg", scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;

    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = groundTexture;

    var ground = BABYLON.Mesh.CreateGround("ground", 8192, 8192, 2, scene, false);
    ground.position.y = -4;
    ground.material = groundMaterial;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);

    // Water mesh
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 8192, 8192, 2, scene, false);
    waterMesh.material = waterMaterial;
    waterMaterial.addToRenderList(ground);
    waterMaterial.addToRenderList(skybox);


    // Add the action manager of babylon to handle keypad
    var map = {}; //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    /***** CUSTOM LIGHT  ******/
    BABYLON.Effect.ShadersStore["customVertexShader"] = 'precision highp float;  attribute vec3 position; attribute vec3 normal; attribute vec2 uv;  uniform mat4 worldViewProjection; uniform float time;  varying vec3 vPosition; varying vec3 vNormal; varying vec2 vUV;  void main(void) {     vec3 v = position;     gl_Position = worldViewProjection * vec4(v, 1.0);     vPosition = position;     vNormal = normal;     vUV = uv; }';
    BABYLON.Effect.ShadersStore["customFragmentShader"] = `
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
                    vec3 col = vec3(0., 0., 1.);
                    gl_FragColor = vec4(col, 0.2);
                }`;


    var checkPointLight = new BABYLON.ShaderMaterial("shader", scene, {
        vertex: "custom",
        fragment: "custom",
    },
        {
            needAlphaBlending: true,
            attributes: ["position", "normal", "uv"],
            uniforms: ["time", "worldViewProjection"]
        });
    /***** CUSTOM LIGHT  ******/

    /******** Create checkpoints *******/
    var checkpoints = []
    baseFirstCheckPoint = -2000
    for (i = 0; i < numberCheckPoint; i++) {
        var checkPoint = BABYLON.MeshBuilder.CreateCylinder("pl", { diameterTop: 60, diameterBottom: 60, height: 600, tessellation: 96 }, scene);

        checkPoint.position.z = baseFirstCheckPoint
        if (i >= 2) {
            checkPoint.position.x = getRandomInt(200)
        }
        checkPoint.material = checkPointLight;
        checkPoint.checkCollisions = true
        checkpoints.push(checkPoint)
        baseFirstCheckPoint += 1000

    }

    /********** HANDLE SOUND **********/

    BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;

    musicBoat = new BABYLON.Sound("boatSong", "audio/boat_song.wav", scene, null, {
        loop: true,
        autoplay: false,
        volume: 0.3
    });


    musicSucceedCheckPoint = new BABYLON.Sound("checkPoint", "audio/success_checkpoint.wav", scene, null, {
        loop: true,
        autoplay: false,
        volume: 0.6
    });

    musicWind = new BABYLON.Sound("wind", "audio/wind.wav", scene, null, {
        loop: true,
        autoplay: true,
        volume: 1
    });

    

    /****** Import from blender other mesh ******/

    var box = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
    box.checkCollisions = true
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
    box.isVisible = false

    BABYLON.SceneLoader.ImportMesh("", "./", "boat.glb", scene, function (newMeshes) {
       
        scene.executeWhenReady(function () {

            scene.activeCamera.attachControl(canvas);
            newMeshes[0].position.y = 1
            newMeshes[0].position.z = 3000 - 100
            newMeshes[0].scaling.x = 0.4
            newMeshes[0].scaling.y = 0.4
            newMeshes[0].scaling.z = 0.4
            newMeshes[0].actionManager = new BABYLON.ActionManager(scene);
            newMeshes[0].checkCollisions = true
    
    
            /**** HANDLE COLLISION WITH CHECKPOINT *****/
            checkpoints.forEach(checkP => {
                newMeshes[0].actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        {
                            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                            parameter: checkP
                        },
                        function () {
                            checkP.dispose()
                            musicSucceedCheckPoint.play()
                            setTimeout(()=>{musicSucceedCheckPoint.stop()},900)
                            numberCheckPointPassed += 1
                            textPassed.text = "PASSED : " + numberCheckPointPassed + "/" + numberCheckPoint;

                        }
                    )
                );
            })
            /*var box2 = new BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 15, diameterX: 15 }, scene);
            box2.checkCollisions = true
            box2.position.y = 20
            box2.position.z = 2800
            box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 }, scene);
            */
            box.position.y = newMeshes[0].position.y
            box.position.z = newMeshes[0].position.z
            box.position.x = newMeshes[0].position.x
    
            waterMaterial.addToRenderList(newMeshes[0]);
            bigBoat = newMeshes
           
          
            scene.activeCamera.attachControl(canvas); 
            engine.hideLoadingUI()       
            engine.runRenderLoop(function () {           
                scene.render();        
            });   
       });

    });

    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 90:
                if (musicBoat.isPlaying === false) {
                    
                    BABYLON.Engine.audioEngine.unlock();
                    musicBoat.play()
                }
                break;
        }
    });

    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 90:
                if (musicBoat.isPlaying) {
                    musicBoat.pause()
                }
                break;
        }

    });

    alpha=0

    scene.registerBeforeRender(function () {

        if (bigBoat != undefined) {
            bigBoat.checkCollisions = true
            box.position.y = bigBoat[0].position.y + 10
            box.position.z = bigBoat[0].position.z
            box.position.x = bigBoat[0].position.x
            camera.position.copyFrom(bigBoat[0].position.subtract(bigBoat[0].forward.scale(40)).add(new BABYLON.Vector3(0, 1.2, 0)))
            camera.setTarget(new BABYLON.Vector3(bigBoat[0].position.x, bigBoat[0].position.y, bigBoat[0].position.z))
            camera.position.y = 15
        }

    });

    scene.registerAfterRender(function () {
        if ((map["z"] || map["Z"])) {

            dir = bigBoat[0].getDirection(new BABYLON.Vector3(0, 0, 8))
            bigBoat[0].position.x += dir.x
            bigBoat[0].position.z += dir.z
            bigBoat.forEach(mesh => {
                if (mesh.name === "Plane.000" || mesh.name === "Plane.029" || mesh.name === "Plane.047"
                    || mesh.name === "Plane.017" || mesh.name === "Plane.019" || mesh.name === "Plane.008" || mesh.name === "Plane.035") {
                    mesh.rotate(BABYLON.Axis.Z, Math.PI / 15, BABYLON.Space.LOCAL)
                }
            })
        }
        if ((map["q"] || map["Q"])) {
            if (bigBoat[0]._rotationQuaternion.w <= 0.80) {
                bigBoat[0].rotate(BABYLON.Axis.Y, -Math.PI / 100, BABYLON.Space.WORLD);
            }
        }
        if ((map["d"] || map["D"])) {
            if (bigBoat[0]._rotationQuaternion.w >= -0.80) {
                bigBoat[0].rotate(BABYLON.Axis.Y, Math.PI / 100, BABYLON.Space.WORLD);
            }
        }
    });


    
    return scene;
}



var scene = createScene();
window.addEventListener('resize', function () {
    engine.resize();
});

/*** FUNCTION USED  ***/

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

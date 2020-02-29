import BabylonGUI from "./gui/BabylonGUI.js";
import GuiGame from "./gui/GuiGame.js";
import Utilities from "./utilities/Utilities.js"


var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true)
// OUR BOAT
var bigBoat;

var baseFirstCheckPoint;
//MUSIC
var musicBoat;
var musicSucceedCheckPoint;
var musicWind;
var musicBackground;

// keypad
var map = {}; //object for multiple key presses

//Sound
var buttonClickSound;
var soundCrash;
var soundClockUrgent;
var winSong;
var loseSong;

//collision
var collisionWithLimit = false

// checkpoint
var numberCheckPoint = 5
var numberCheckPointPassed = 0
// function interval
var timerInterval;

// gui 

var babylonGUI = new BabylonGUI(BABYLON.GUI)

// gui text
var textPassed = new BABYLON.GUI.TextBlock();
var textStart = new BABYLON.GUI.TextBlock();
var textTimer = new BABYLON.GUI.TextBlock();
var timer = 0;
var maxTime = 40

// limit game

var limitZ = 3500
var limitX=800


const gameOver = (scene) => {
    loseSong.play()
    musicBackground.stop()
    soundClockUrgent.stop()
    map["z"] = false;
    map["q"] = false;
    map["d"] = false;
    clearInterval(timerInterval)

    var panel = new BABYLON.GUI.StackPanel();
     babylonGUI.add(panel);


    var rectGameOver = new BABYLON.GUI.Rectangle();
    rectGameOver.adaptWidthToChildren = true;
    rectGameOver.height = "40px";
    rectGameOver.width = "200px"
    rectGameOver.cornerRadius = 20;
    rectGameOver.color = "Orange";
    rectGameOver.thickness = 4;
    rectGameOver.background = "red";
    rectGameOver.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.addControl(rectGameOver);


    var textLoser = new BABYLON.GUI.TextBlock()
    textLoser.text = "You lose !"
    textLoser.color = "white";
    textLoser.fontSize = 24;
    rectGameOver.addControl(textLoser);

    var buttonRestart = BABYLON.GUI.Button.CreateSimpleButton("gameOver", "RESTART !");
    buttonRestart.width = 0.2;
    buttonRestart.height = "40px";
    buttonRestart.color = "white";
    buttonRestart.background = "green";
    panel.addControl(buttonRestart);

    for (let i = 0; i < scene.actionManager.actions.length; i++) {
        scene.actionManager.actions.pop()
    }

    buttonRestart.onPointerClickObservable.add(() => {
        scene.dispose()
        scene=undefined
        timer = 0
        textTimer.color = "yellow"
        numberCheckPointPassed = 0
        limitZ = 3500
        scene = createScene()
    });



}

const win = () => {
    
    
    if (numberCheckPointPassed === numberCheckPoint) {
        musicBackground.stop()
        map["z"] = false;
        map["q"] = false;
        map["d"] = false;
        soundClockUrgent.stop()
        clearInterval(timerInterval)
        winSong.play()

        var panel = new BABYLON.GUI.StackPanel();
        babylonGUI.add(panel);


        var rectWin = new BABYLON.GUI.Rectangle();
        rectWin.adaptWidthToChildren = true;
        rectWin.height = "40px";
        rectWin.width = "200px"
        rectWin.cornerRadius = 20;
        rectWin.color = "Orange";
        rectWin.thickness = 4;
        rectWin.background = "green";
        rectWin.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        panel.addControl(rectWin);


        var textWin = new BABYLON.GUI.TextBlock()
        textWin.text = "You win !"
        textWin.color = "white";
        textWin.fontSize = 24;
        rectWin.addControl(textWin);

        var buttonRestart = BABYLON.GUI.Button.CreateSimpleButton("winner", "RESTART !");
        buttonRestart.width = 0.2;
        buttonRestart.height = "40px";
        buttonRestart.color = "white";
        buttonRestart.background = "green";
        panel.addControl(buttonRestart);

        for (let i = 0; i < scene.actionManager.actions.length; i++) {
            scene.actionManager.actions.pop()
        }

        buttonRestart.onPointerClickObservable.add(() => {
            scene.dispose()
            scene=undefined
            timer = 0
            textTimer.color = "yellow"
            numberCheckPointPassed = 0
            limitZ = 3500
            babylonGUI.destroy()
            scene = createScene()
           
        });

    }

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
    

    GuiGame.displayGUI(textPassed, babylonGUI,textStart,maxTime,numberCheckPointPassed,numberCheckPoint,textTimer,timer)
    engine.displayLoadingUI()
    

     // Add the action manager of babylon to handle keypad
     scene.actionManager = new BABYLON.ActionManager(scene);
        
    if (scene.onPointerObservable.hasObservers()) {
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    
                    BABYLON.Engine.audioEngine.unlock();
                    
                    buttonClickSound.play()
                    var actionKeyup = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
                        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
                
                    });
                
                    var actionKeydown = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
                        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
                    }));
                    
                    scene.actionManager.registerAction(actionKeyup)
                
                    scene.actionManager.registerAction(actionKeydown)
               
                    textStart.dispose()
                    scene.onPointerObservable.remove(scene.onPointerObservable.observers[2])
                    timerInterval = window.setInterval(() => {
                        timer++;
                        textTimer.text = "Timer : " + timer;
                        if (timer > maxTime - 10) {
                            soundClockUrgent.play(0, 0, 0.3)
                            textTimer.color = "red"
                        }
                        if (timer > maxTime - 1) {
                            gameOver(scene)
                        }
                    }, 1000);

                    break;
            }
        });
    }


    // Light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 1), scene);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/background/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Water material
    var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
    waterMaterial.bumpTexture = new BABYLON.Texture("./textures/waterbump.png", scene);
    waterMaterial.windForce = -10;
    waterMaterial.waveHeight = 0.2;
    waterMaterial.bumpHeight = 0.1;
    waterMaterial.waveLength = 0.1;
    waterMaterial.waveSpeed = 40.0;
    waterMaterial.colorBlendFactor = 0;
    waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
    waterMaterial.colorBlendFactor = 0;

    // Ground
    var groundTexture = new BABYLON.Texture("./textures/sand.jpg", scene);
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
    baseFirstCheckPoint = -300
    for (let i = 0; i < numberCheckPoint; i++) {
        var checkPoint = BABYLON.MeshBuilder.CreateCylinder("pl", { diameterTop: 60, diameterBottom: 60, height: 600, tessellation: 96 }, scene);

        checkPoint.position.z = baseFirstCheckPoint
        if (i >= 1) {
            checkPoint.position.x = Utilities.getRandomInt(600)
        }
        checkPoint.material = checkPointLight;
        checkPoint.checkCollisions = true
        checkpoints.push(checkPoint)
        baseFirstCheckPoint += 500

    }

    /********** HANDLE SOUND **********/


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
        volume: 0.6
    });

    musicBackground = new BABYLON.Sound("musicBg", "audio/music_bg.mp3", scene, null, {
        loop: true,
        autoplay: true,
        volume: 2
    });

    buttonClickSound = new BABYLON.Sound("click", "audio/button_click.wav", scene, null, {
        loop: false,
        autoplay: false,
        volume: 2
    });

    soundCrash = new BABYLON.Sound("crash", "audio/crash.mp3", scene, null, {
        loop: false,
        autoplay: false,
        volume: 4
    });

    soundClockUrgent = new BABYLON.Sound("clock", "audio/tick_tock.wav", scene, null, {
        loop: false,
        autoplay: false,
        volume: 3
    });

    winSong = new BABYLON.Sound("winner", "audio/win.mp3", scene, null, {
        loop: false,
        autoplay: false,
        volume: 3
    });

    loseSong = new BABYLON.Sound("winner", "audio/fail_sound.mp3", scene, null, {
        loop: false,
        autoplay: false,
        volume: 3
    });



    var limitp=0

    /****CREATE LIMIT OF THE GAME *********/
    var decor = []
    for (let i = 0; i < 200; i++) {
        var limitPlane = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        limitPlane.position.y = 10
        limitPlane.position.z = limitZ
        limitPlane.position.x =limitX

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseTexture = new BABYLON.Texture("./textures/rock.jpg", scene);
        limitPlane.material = myMaterial;

        var limitPlane2 = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        limitPlane2.position.y = 10
        limitPlane2.position.z = limitZ
        limitPlane2.position.x = -limitX
        limitPlane2.material = myMaterial

        var limitPlane3 = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        limitPlane3.position.y = 10
        limitPlane3.position.z = -1000
        limitPlane3.position.x = 1000+limitp
        limitPlane3.material = myMaterial

        decor.push(limitPlane)
        decor.push(limitPlane2)
        decor.push(limitPlane3)
        
        limitZ -= 40
        limitp-=40
        

    }


    /****** Import from blender other mesh ******/

    var boxCollider = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
    boxCollider.checkCollisions = true
    boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
    boxCollider.isVisible = false

    BABYLON.SceneLoader.ImportMesh("", "./model/", "boat.glb", scene, function (newMeshes) {

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
                            setTimeout(() => { musicSucceedCheckPoint.stop() }, 900)
                            numberCheckPointPassed += 1
                            textPassed.text = "PASSED : " + numberCheckPointPassed + "/" + numberCheckPoint;
                            win()

                        }
                    )
                );
            })
            boxCollider.position.y = newMeshes[0].position.y
            boxCollider.position.z = newMeshes[0].position.z
            boxCollider.position.x = newMeshes[0].position.x

            waterMaterial.addToRenderList(newMeshes[0]);
            bigBoat = newMeshes
            

            // HANDLE COLLISION WITH LIMIT 
            decor.forEach(meshDecor => {
                newMeshes[0].actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: meshDecor
                }, function () {
                    if (newMeshes[0].position.x < 0) {
                        newMeshes[0].position.subtractInPlace(new BABYLON.Vector3(-10, 0, 0));
                    } else {
                        newMeshes[0].position.subtractInPlace(new BABYLON.Vector3(10, 0, 0));
                    }
                    textTimer.color = "red"
                    collisionWithLimit = true
                    soundCrash.play()
                    timer += 1
                }));

                newMeshes[0].actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: meshDecor
                }, function () {
                    collisionWithLimit = false
                    setTimeout(() => { textTimer.color = "yellow" }, 500);
                }));
            });

            
            scene.activeCamera.attachControl(canvas);
            engine.hideLoadingUI()
            engine.runRenderLoop(function () {
                scene.render();
            });
        });

    });
    
    BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
                        

    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 90:
                if (!musicBoat.isPlaying) {
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

    scene.registerBeforeRender(function () {

        if (bigBoat != undefined) {
            bigBoat.checkCollisions = true
            boxCollider.position.y = bigBoat[0].position.y + 10
            boxCollider.position.z = bigBoat[0].position.z
            boxCollider.position.x = bigBoat[0].position.x
            camera.position.copyFrom(bigBoat[0].position.subtract(bigBoat[0].forward.scale(40)).add(new BABYLON.Vector3(0, 1.2, 0)))
            camera.setTarget(new BABYLON.Vector3(bigBoat[0].position.x, bigBoat[0].position.y, bigBoat[0].position.z))
            camera.position.y = 15
        }

    });

    scene.registerAfterRender(function () {

        if ((map["z"] || map["Z"]) && collisionWithLimit == false) {
           
            let dir = bigBoat[0].getDirection(new BABYLON.Vector3(0, 0, 8))
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



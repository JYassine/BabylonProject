import BabylonGUI from "./gui/BabylonGUI.js";
import GuiGame from "./gui/GuiGame.js";
import Utilities from "./utilities/Utilities.js"
import AudioManagerBabylon from "./AudioManager/AudioManagerBabylon.js"
import AudioGame from "./AudioManager/AudioGame.js"
import Light from "./core/Light.js"
import GameLogic from "./core/GameLogic.js"
import EntityBabylon from "./core/EntityBabylon.js"
import Vehicle3D from "./core/Vehicle3D.js";


var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true)

// scene
var scene;

// target of the missiles
var pointMissiles = []
// missile
var missiles = [];
// function to launch missil in an interval of each 7 seconds
var missileInterval;
// number of missiles to launch
var numberMissiles = 2;


//turret
var turrets = []
var behaviorsTurret = []
// OUR BOAT
var bigBoat;
var boatEntity;
var baseFirstCheckPoint;
//var block;
//MUSIC
var audioManager;
// keypad
var map = {}; //object for multiple key presses

//collision
var collisionWithLimit = false
// checkpoint
var numberCheckPoint = 5
var numberCheckPointPassed = 0
var maxPositionCheckPoint = 600;
var timerDirection;
var timeChangeDirection = 0;
// function interval
var timerInterval;
// gui 
var babylonGUI = new BabylonGUI(BABYLON.GUI)

// gui text
var textPassed = new BABYLON.GUI.TextBlock();
var textStart = new BABYLON.GUI.TextBlock();
var textTimer = new BABYLON.GUI.TextBlock();
var panelEndGame = new BABYLON.GUI.StackPanel();
var timer = 0;
var maxTime = 40

// gameLogic
var gameLogic;

// limit game

var limitZ = 3500
var limitX = 800


var createScene = function () {

    scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    scene.collisionsEnabled = true;

    audioManager = new AudioManagerBabylon(scene);
    gameLogic = new GameLogic(scene, audioManager, babylonGUI)


    // Parameters : name, position, scene
    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);



    GuiGame.displayGUI(textPassed, babylonGUI, textStart, maxTime,
        numberCheckPointPassed, numberCheckPoint, textTimer, timer)//, boatEntity.getMomentum())
    engine.displayLoadingUI()




    // Add the action manager of babylon to handle keypad
    scene.actionManager = new BABYLON.ActionManager(scene);

    if (scene.onPointerObservable.hasObservers()) {
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:

                    BABYLON.Engine.audioEngine.unlock();
                    audioManager.find("clickSong").play()
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
                        textTimer.text = "Timer :" + timer;
                        if (timer > maxTime - 10) {

                            audioManager.find("clockSong").play(0, 0, 0.3)
                            textTimer.color = "red"
                        }
                        if (timer > maxTime - 1) {
                            gameOver(scene, false)
                        }
                    }, 1000);


                    // LAUNCH MISSIL WITH TIME INTERVAL OF 7 seconds
                    missileInterval = setInterval(() => {

                        pointMissiles = []
                        missiles = []
                        var positionZMissile = boatEntity.getMesh().position.z - 200;

                        var positionXMissile = boatEntity.getMesh().position.x + 30;
                        for (let i = 0; i < numberMissiles; i++) {
                            // setup to point the missiles need to target
                            var light2 = customLight.createCustomLight("idMissile", 1, 0, 0, scene)
                            var pointMissile = BABYLON.MeshBuilder.CreateCylinder("pl", { diameterTop: 60, diameterBottom: 60, height: 20, tessellation: 96 }, scene);
                            pointMissile.position.z = positionZMissile
                            pointMissile.position.x = positionXMissile
                            pointMissile.material = light2;
                            pointMissile.checkCollisions = true
                            pointMissile.actionManager = new BABYLON.ActionManager(scene);
                            pointMissiles.push(pointMissile)


                            // setup the missile
                            var materialShip = new BABYLON.StandardMaterial("shiptx1", scene);
                            materialShip.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red

                            var meshMissile = BABYLON.Mesh.CreateCylinder("spaceship", 2, 0, 1, 6, 1, scene, false);
                            meshMissile.scaling = new BABYLON.Vector3(20, 20, 20)
                            var randomTurret = turrets[Utilities.getRandomInt(2)]

                            meshMissile.position.x = randomTurret.position.x
                            meshMissile.position.y = randomTurret.position.y
                            meshMissile.position.z = randomTurret.position.z

                            meshMissile.material = materialShip;
                            meshMissile.checkCollisions = true
                            meshMissile.actionManager = new BABYLON.ActionManager(scene);
                            var missile = new Vehicle3D(meshMissile)
                            missiles.push(missile)
                            audioManager.find("missileSong").play()

                            positionZMissile = positionZMissile - 200
                            positionXMissile = positionXMissile + 60


                        }

                        for (let i = 0; i < missiles.length; i++) {
                            missiles[i].getMesh().actionManager.registerAction(
                                new BABYLON.ExecuteCodeAction(
                                    {
                                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                        parameter: pointMissiles[i]
                                    },
                                    function () {
                                        missiles[i].getMesh().dispose()
                                        pointMissiles[i].dispose()
                                        audioManager.find("missileSong").stop()
                                        audioManager.find("explosionMissileSong").play()
                                    }

                                )
                            );
                        }
                    }, 4000)

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

    /*// TEST
    block = new BABYLON.Mesh.CreateBox("pd", 40, scene);
    block.isVisible = true;
    block.position = new BABYLON.Vector3(-150,20,2500);*/

    // Water mesh
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 8192, 8192, 2, scene, false);
    waterMesh.material = waterMaterial;
    waterMaterial.addToRenderList(ground);
    waterMaterial.addToRenderList(skybox);





    /***** CUSTOM LIGHT  ******/

    let customLight = new Light()
    var checkPointLight = customLight.createCustomLight("idcheckPoint", 0, 0, 1, scene)




    /***** CUSTOM LIGHT  ******/

    /******** Create checkpoints *******/
    var checkpoints = []
    baseFirstCheckPoint = -300

    for (let i = 0; i < numberCheckPoint; i++) {
        var checkPoint = BABYLON.MeshBuilder.CreateCylinder("pl", { diameterTop: 60, diameterBottom: 60, height: 400, tessellation: 96 }, scene);

        // Add the particle effect to the checkpoint
        customLight.aestheticCheckpoint(checkPoint, scene);



        checkPoint.position.z = baseFirstCheckPoint
        if (i >= 1) {
            checkPoint.position.x = Utilities.getRandomInt(maxPositionCheckPoint)
        }
        checkPoint.material = checkPointLight;
        checkPoint.checkCollisions = true
        checkpoints.push(checkPoint)
        baseFirstCheckPoint += 500

    }

    
    /********** HANDLE SOUND **********/


    AudioGame.addAllSongs(audioManager)

    var limitp = 0

    /****CREATE LIMIT OF THE GAME *********/
    var decor = []
    for (let i = 0; i < 200; i++) {
        var limitPlane = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        limitPlane.position.y = 10
        limitPlane.position.z = limitZ
        limitPlane.position.x = limitX
        limitPlane.checkCollisions = true;

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseTexture = new BABYLON.Texture("./textures/rock.jpg", scene);
        limitPlane.material = myMaterial;

        var limitPlane2 = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        limitPlane2.position.y = 10
        limitPlane2.position.z = limitZ
        limitPlane2.position.x = -limitX
        limitPlane2.material = myMaterial
        limitPlane2.checkCollisions = true;

        var limitPlane3 = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        limitPlane3.position.y = 10
        limitPlane3.position.z = -1000
        limitPlane3.position.x = 1000 + limitp
        limitPlane3.material = myMaterial
        limitPlane3.checkCollisions = true;



        decor.push(limitPlane)
        decor.push(limitPlane2)
        decor.push(limitPlane3)

        limitZ -= 40
        limitp -= 40


    }

    /**** CREATE TURRET ******/

    let turretY = 50
    let turretZ = 1500
    let turretX = 800

    for (let i = 0; i < 2; i++) {
        var turret = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
        turret.position.y = turretY
        turret.position.z = turretZ
        turret.position.x = turretX
        turret.material = new BABYLON.StandardMaterial("mat", scene);
        turret.material.diffuseColor = BABYLON.Color3.Random();
        turrets.push(turret)
        turretX = -turretX
        var behaviorTurret = new Vehicle3D(turret)
        behaviorsTurret.push(behaviorTurret)

    }


    timerDirection = setInterval(()=>{
        timeChangeDirection+=1
    },3000)




    /****** Import from blender other mesh ******/

    var boxCollider = new BABYLON.MeshBuilder.CreateBox("box", { height: 40, width: 40, depth: 40 }, scene);
    boxCollider.checkCollisions = true
    boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
    boxCollider.isVisible = false

    BABYLON.SceneLoader.ImportMesh("", "./model/", "boat.glb", scene, function (newMeshes) {

        scene.executeWhenReady(function () {

            scene.activeCamera.attachControl(canvas);
            boatEntity = new EntityBabylon(newMeshes[0], scene)

            /**** HANDLE COLLISION WITH CHECKPOINT *****/
            checkpoints.forEach(checkP => {
                boatEntity.getMesh().actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        {
                            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                            parameter: checkP
                        },
                        function () {
                            checkP.dispose()
                            audioManager.find("checkPointSong").play()
                            setTimeout(() => { audioManager.find("checkPointSong").stop() }, 900)
                            numberCheckPointPassed += 1
                            textPassed.text = "PASSED : " + numberCheckPointPassed + "/" + numberCheckPoint;
                            if (numberCheckPointPassed === numberCheckPoint) {
                                gameOver(scene, true)
                            }

                        }

                    )
                );
            })
            boxCollider.position.y = boatEntity.getMesh().position.y
            boxCollider.position.z = boatEntity.getMesh().position.z
            boxCollider.position.x = boatEntity.getMesh().position.x

            waterMaterial.addToRenderList(boatEntity.getMesh());
            bigBoat = newMeshes


            // HANDLE COLLISION WITH LIMIT 
            decor.forEach(meshDecor => {
                /*
                
                boatEntity.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: meshDecor
                }, function () {
                    if (boatEntity.mesh.position.x < 0) {
                        boatEntity.getMesh().position.subtractInPlace(new BABYLON.Vector3(-10, 0, 0));
                        boatEntity.g
                    } else {
                        boatEntity.getMesh().position.subtractInPlace(new BABYLON.Vector3(10, 0, 0));
                    }
                    textTimer.color = "red"
                    collisionWithLimit = true
                    audioManager.find("crashSong").play()
                    timer += 1
                }));

                boatEntity.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: meshDecor
                }, function () {
                    collisionWithLimit = false
                    setTimeout(() => { textTimer.color = "yellow" }, 500);
                }));
            */});


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
                var boatSong = audioManager.find("boatSong")
                if (!boatSong.isPlaying) {
                    boatSong.play()
                }
                break;
        }

    });
    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 90:

                var boatSong = audioManager.find("boatSong")
                if (boatSong.isPlaying) {
                    boatSong.pause()
                }
                break;
        }

    });
    scene.registerAfterRender(function () {

        for (let i = 0; i < behaviorsTurret.length; i++) {
            behaviorsTurret[i].seekTurret(boatEntity.getMesh())
            behaviorsTurret[i].update()
        }

        if (missiles.length != 0) {
            for (let i = 0; i < numberMissiles; i++) {
                missiles[i].seek(pointMissiles[i])
                missiles[i].update()
                Utilities.facePoint(missiles[i].getMesh(), pointMissiles[i].position)
            }
        }

        

        checkpoints.forEach(checkP=>{
            if(timeChangeDirection%2==0){
                checkP.position.x+=1
            }else{
                checkP.position.x-=1
            }
        })

        boatEntity.handleMovement(map, bigBoat, collisionWithLimit)
        bigBoat.checkCollisions = true
        var boatPos = boatEntity.getMesh().position;
        boxCollider.position.y = boatPos.y + 10
        boxCollider.position.z = boatPos.z
        boxCollider.position.x = boatPos.x
        camera.position.copyFrom(boatPos.subtract(boatEntity.getMesh().forward.scale(40)).add(new BABYLON.Vector3(0, 1.7, 0)))
        camera.setTarget(new BABYLON.Vector3(boatPos.x, boatPos.y, boatPos.z))
        camera.position.y = 18

        //block.rotation.y += 0.2;



    });

    return scene;
}



var scene = createScene();
window.addEventListener('resize', function () {
    engine.resize();
});

const gameOver = (scene, winner) => {
    map["z"] = false;
    map["q"] = false;
    map["d"] = false;
    clearInterval(timerInterval)
    clearInterval(missileInterval)
    clearInterval(timerDirection)
    timeChangeDirection = 0
    missiles = []
    pointMissiles = []


    gameLogic.gameOver(winner, panelEndGame, numberCheckPointPassed, timer, textTimer, limitZ)

    let buttonRestart = panelEndGame.getChildByName("gameOver")
    buttonRestart.onPointerClickObservable.add(() => {
        scene.dispose()
        scene = undefined
        timer = 0
        textTimer.color = "yellow"
        numberCheckPointPassed = 0
        limitZ = 3500
        babylonGUI.destroy()
        scene = createScene()
    });

    gameLogic.restart()


}


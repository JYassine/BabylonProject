
var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas,true)
// OUR BOAT
var bigBoat ;
// THE DYNAMIC TERRAIN
var dynamicTerrain;


    // Handle the movement of the boat with keypad
    function boatMovement(boat,map){

         bigBoat=boat;

        if ((map["z"] || map["Z"])) {
             dir = boat[0].getDirection(new BABYLON.Vector3(0, 0,1))
             boat[0].position.x+=dir.x
             boat[0].position.z+=dir.z
             boat.forEach(mesh=>{
             if(mesh.name==="Plane.000" || mesh.name==="Plane.029" || mesh.name==="Plane.047"
                || mesh.name==="Plane.017" || mesh.name==="Plane.019" || mesh.name==="Plane.008" || mesh.name==="Plane.035" ){
                    mesh.rotate(BABYLON.Axis.Z, Math.PI / 15, BABYLON.Space.LOCAL)
                }
            })
        };
            
        if ((map["q"] || map["Q"])) {
            boat[0].rotate(BABYLON.Axis.Y, -Math.PI / 100, BABYLON.Space.WORLD); 
        };
            
        if ((map["d"] || map["D"])) {
            boat[0].rotate(BABYLON.Axis.Y, Math.PI / 100, BABYLON.Space.WORLD); 
        };
    }


    // ADD THE LIBRARY TO CONSTRUCT DYNAMIC TERRAIN
    const addLibraryDynamicTerrain = () => {
        var url = "https://cdn.rawgit.com/BabylonJS/Extensions/master/DynamicTerrain/dist/babylon.dynamicTerrain.min.js";
        dynamicTerrain = document.createElement("script");
        dynamicTerrain.src = url;
        document.head.appendChild(dynamicTerrain)
    }


    var createScene = function() {

        addLibraryDynamicTerrain();

        var scene = new BABYLON.Scene(engine);
        var boat;
        scene.enablePhysics();
        
        
        // Camera
        // Parameters : name, position, scene
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

        // Targets the camera to a particular position. In this case the scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // Attach the camera to the canvas
        camera.attachControl(canvas, true);
        
        // Light
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

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


        
        /* START DYNAMIC TERRAIN  */
        var mapSubX = 1000;             // point number on X axis
        var mapSubZ = 800;              // point number on Z axis
        var seed = 0.3;                 // seed
        var elevationScale = 1.0;    
        var mapData = new Float32Array(mapSubX * mapSubZ * 3); // 3 float values per point : x, y and z


        // CONSTRUCT OUR MAP
        for (var l = 0; l < mapSubZ; l++) {
            for (var w = 0; w < mapSubX; w++) {
                var x = (w - mapSubX * 0.5) * 2.0;
                var z = (l - mapSubZ * 0.5) * 2.0;
                var y = 0
                y *= (0.5 + y) * y * elevationScale;   
                    
                mapData[3 *(l * mapSubX + w)] = x;
                mapData[3* (l * mapSubX + w) + 1] = y;
                mapData[ 3* (l * mapSubX + w) + 2] = z;

                
            }
        }



        // wait for dynamic terrain extension to be loaded
        dynamicTerrain.onload = function() {

            // Dynamic Terrain
            // ===============
            var terrainSub = 500;               // 500 terrain subdivisions
            var params = {
                mapData: mapData,               // data map declaration : what data to use ?
                mapSubX: mapSubX,               // how are these data stored by rows and columns
                mapSubZ: mapSubZ,
                
                terrainSub: terrainSub          // how many terrain subdivisions wanted
            }
            var terrain = new BABYLON.DynamicTerrain("dt", params, scene);
            var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene);
            
            waterMaterial.bumpTexture = new BABYLON.Texture("//www.babylonjs.com/assets/waterbump.png", scene);
            waterMaterial.windForce = 6;
            waterMaterial.waveHeight = 0;
            waterMaterial.bumpHeight = 0.1;
            waterMaterial.waveLength = 0.1;
            waterMaterial.waveSpeed = 10;
            waterMaterial.colorBlendFactor = 0;
            waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
            waterMaterial.colorBlendFactor = 0;
            
            terrain.mesh.material=waterMaterial
            
            waterMaterial.addToRenderList(skybox);
            waterMaterial.addToRenderList(boat);

            terrain.update(true);

        }  

        /* END DYNAMIC TERRAIN */
        

        // Add the action manager of babylon to handle keypad
        var map = {}; //object for multiple key presses
        scene.actionManager = new BABYLON.ActionManager(scene);

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

        }));

        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));



        // Import from blender other mesh
        BABYLON.SceneLoader.ImportMesh("","./", "boat.glb", scene, function (newMeshes) {
                
            // Attach camera to canvas inputs
            scene.activeCamera.attachControl(canvas);
            newMeshes.scaling = new BABYLON.Vector3(2,2,2)
            scene.registerBeforeRender(boatMovement.bind(this, newMeshes,map));

            
            
        });
        
        scene.registerBeforeRender(function (){

            if(bigBoat!=undefined){
                camera.position.z = bigBoat[0].position.z-100
                camera.position.x = bigBoat[0].position.x
                camera.position.y = bigBoat[0].position.y+50
            }
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



export default class EntityBabylon {

    preMomentum = 0; // speed on previous frame
    momentum = 0;  // speed on current frame
    acceleration = 0.14;
    decel = 0.98;
    maxSpeed = 18;
    minSpeed = 0;
    // how slower is backtrack next to the forward speed
    backTrackratio = 1/3;
    maxBacktrackSpeed = -(this.maxSpeed * this.backTrackratio);

    // guaranteed angle spin per frame no matter what your current speed is
    minimumDrift = Math.PI/600;

    // how violent is a crash with an obstacle
    // upon hitting an obstacle, your momentum is multiplied by the value below to determine
    // the recoil
    // note the recoil can't exceed the maxBacktrackSpeed value, and even a collision with very small
    // speed will have a minimum collision recoil
    crashingRecoil = -(1/2);

    // camera twerk
    // the duration of the camera going mad when you hit something. you can modify this
    crashDuration = 8;
    // procs a crash when true. don't touch this value, the game sets it up
    doCrash = false;
    // don't touch neither, crash remaining time
    currentCrashDuration = 0;
    // no toucherino. camera madness based on how violent the impact
    crashIntensity;



    constructor(mesh, scene) {
        this.mesh = mesh
        this.scene = scene
        this.mesh.position.y = 1
        this.mesh.position.z = 3000 - 100
        this.mesh.scaling.x = 0.4
        this.mesh.scaling.y = 0.4
        this.mesh.scaling.z = 0.4
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.mesh.checkCollisions = true
    }

    getCrashState() {
        return this.doCrash
    }

    getMesh() {
        return this.mesh;
    }

    // Return the boat's current speed
    getMomentum() {
        return this.momentum;
    }

    crashRecoil() {
        this.doCrash = true;
    }

    getCrashIntensity() {
        return this.crashIntensity
    }

    handleMovement(map, otherMesh) {
        var speedRatio = this.momentum/this.maxSpeed;

        //console.log("[" + this.preMomentum + ", " + this.momentum + "]")
        this.preMomentum = this.momentum;

        if (this.doCrash) {
            this.doCrash = false;
            this.currentCrashDuration = this.crashDuration;
            this.crashIntensity = 2 + (this.momentum/3);
            // there's a minimum crashing recoil speed, else some bad hitbox things can happen
            // also a crashing can't exceed the maximum backtracking speed
            this.momentum = Math.min(Math.max(this.momentum*this.crashingRecoil, this.maxBacktrackSpeed) ,-1.5);
        }
        this.currentCrashDuration = Math.max(0, this.currentCrashDuration-1);

        // pressing Z (forward) is forced if momentum is negative. Momentum is negative when
        // the boat is recovering from hitting an obstacle, or when 
        var isBacktracking = (map["s"] || map["S"]);
        if ((map["z"] || map["Z"])) {
            // acceleration is linear
            this.momentum = Math.min(this.momentum + this.acceleration, this.maxSpeed);
        }
        else if (isBacktracking && (this.momentum <= 0)) {
            this.momentum = Math.max(-(this.maxSpeed*this.backTrackratio), 
            this.momentum - (this.acceleration * this.backTrackratio))
        }
        else {
            // deceleration is logarithmic
            // there's a certain cap upon which the speed drops to 0. This prevents the deceleration
            // from pseudo never-ending

            // the 18 IS AN ARBITRARY BALANCE VALUE. MIGHT WANT TO MAKE IT MORE CUSTOMIZABLE
            // "Braking" which is attempting to backtrack when your speed is > 0, will just
            // decelerate on a twice as fast rate
            this.momentum = 
             ((this.momentum < (this.maxSpeed/18) 
                && (this.momentum > -(this.maxSpeed/18*this.backTrackratio))) ? 0 : 
                this.momentum = this.momentum * this.decel * ((isBacktracking) ? this.decel : 1));
        }
        //console.log(this.momentum)

        this.mesh.moveWithCollisions(new BABYLON.Vector3(
            parseFloat(parseFloat(Math.sin(this.mesh.rotation.y)) * (this.momentum)),
            0,
            parseFloat(parseFloat(Math.cos(this.mesh.rotation.y)) * -(this.momentum))));
        
        //this.mesh.rotate(BABYLON.Axis.X, Math.PI / 5000, BABYLON.Space.WORLD);
        this.mesh.rotate(BABYLON.Axis.X, (this.preMomentum - this.momentum) * (Math.PI / 550), 
                BABYLON.Space.LOCAL);
                
        //console.log((this.preMomentum - this.momentum) * (Math.PI / 550))

        //this.mesh.rotation.z = this.momentum;
        otherMesh.forEach(mesh => {
            if (mesh.name === "Plane.000" || mesh.name === "Plane.029" || mesh.name === "Plane.047"
                || mesh.name === "Plane.017" || mesh.name === "Plane.019" || mesh.name === "Plane.008" || mesh.name === "Plane.035") {
                mesh.rotate(BABYLON.Axis.Z, Math.PI / 15, BABYLON.Space.LOCAL)
            }
        })

        // }
        var drift = ((map["q"] || map["Q"]) ? -1 :  (map["d"] || map["D"]) ? 1 : 0);
        if (drift != 0) {
            var driftAngle = this.minimumDrift * drift; //speedRatio*(drift*(Math.PI / 100))
            this.mesh.rotate(BABYLON.Axis.Y, driftAngle + (speedRatio*(drift*(Math.PI / 350))), BABYLON.Space.WORLD);
            this.mesh.rotation.y -= driftAngle + (speedRatio*(drift*(Math.PI / 350)));
        }

    }



}
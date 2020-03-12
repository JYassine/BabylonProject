export default class EntityBabylon {

    momentum = 0;
    acceleration = 0.14;
    decel = 0.98;
    maxSpeed = 18;
    minSpeed = 0;



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


    getMesh() {
        return this.mesh;
    }

    // Return the boat's current speed
    getMomentum() {
        return this.momentum;
    }

    // there's a minimum crashing recoil speed, else some bad hitbox things can happen
    crashRecoil() {
        this.momentum = Math.min(this.momentum/(-3.5),-2);
    }

    handleMovement(map, otherMesh) {

        //if (collisionWithLimit == false) {
        // pressing Z (forward) is forced if momentum is negative. Momentum is negative when
        // the boat is recovering from hitting an obstacle
        if ((map["z"] || map["Z"]) || (this.momentum < 0)) {
            // acceleration is linear
            this.momentum = Math.min(this.momentum + this.acceleration, this.maxSpeed);
        }
        else {
            // deceleration is logarithmic
            this.momentum = Math.max(this.momentum * this.decel, this.minSpeed);
        }

        this.mesh.moveWithCollisions(new BABYLON.Vector3(
            parseFloat(parseFloat(Math.sin(this.mesh.rotation.y)) * (this.momentum)),
            0,
            parseFloat(parseFloat(Math.cos(this.mesh.rotation.y)) * -(this.momentum))));
        
        //this.mesh.rotate(BABYLON.Axis.X, Math.PI / 5000, BABYLON.Space.WORLD);
       // this.mesh.rotation = new BABYLON.Vector3(this.mesh.rotation.x, 
         //   this.mesh.rotation.y, this.mesh.rotation.z);
        //this.mesh.rotation.z = this.momentum;
        otherMesh.forEach(mesh => {
            if (mesh.name === "Plane.000" || mesh.name === "Plane.029" || mesh.name === "Plane.047"
                || mesh.name === "Plane.017" || mesh.name === "Plane.019" || mesh.name === "Plane.008" || mesh.name === "Plane.035") {
                mesh.rotate(BABYLON.Axis.Z, Math.PI / 15, BABYLON.Space.LOCAL)
            }
        })

        // }
        if ((map["q"] || map["Q"])) {
            //if (this.mesh._rotationQuaternion.w <= 0.80) {
            this.mesh.rotate(BABYLON.Axis.Y, -Math.PI / 100, BABYLON.Space.WORLD);
            this.mesh.rotation.y -= -Math.PI / 100;
            //}
        }
        else if ((map["d"] || map["D"])) {
            //if (this.mesh._rotationQuaternion.w >= -0.80) {
            this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 100, BABYLON.Space.WORLD);
            this.mesh.rotation.y += -Math.PI / 100;
            //}
        }

    }



}
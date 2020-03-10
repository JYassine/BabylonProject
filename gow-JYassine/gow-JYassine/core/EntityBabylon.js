export default class EntityBabylon {

    momentum = 0;
    acceleration = 0.3;



    constructor(mesh,scene) {
        this.mesh=mesh
        this.scene=scene
        this.mesh.position.y = 1
        this.mesh.position.z = 3000 - 100
        this.mesh.scaling.x = 0.4
        this.mesh.scaling.y = 0.4
        this.mesh.scaling.z = 0.4
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.mesh.checkCollisions = true
    }
    

    getMesh(){
        return this.mesh;
    }

    // Return the boat's current speed
    getMomentum(){
        return this.momentum;
    }

    handleMovement(map,otherMesh,collisionWithLimit) {

        if (collisionWithLimit == false) {
            if ((map["z"] || map["Z"])) {
                this.momentum = Math.min(this.momentum + this.acceleration, 30);
            }
            else {
                this.momentum = Math.max(this.momentum - (this.acceleration * 3), 0);
            }
            
            let dir = this.mesh.getDirection(new BABYLON.Vector3(0, 0, this.momentum))
            this.mesh.position.x += dir.x
            this.mesh.position.z += dir.z
            otherMesh.forEach(mesh => {
                if (mesh.name === "Plane.000" || mesh.name === "Plane.029" || mesh.name === "Plane.047"
                    || mesh.name === "Plane.017" || mesh.name === "Plane.019" || mesh.name === "Plane.008" || mesh.name === "Plane.035") {
                    mesh.rotate(BABYLON.Axis.Z, Math.PI / 15, BABYLON.Space.LOCAL)
                }})
           
        }
        if ((map["q"] || map["Q"])) {
            if (this.mesh._rotationQuaternion.w <= 0.80) {
                this.mesh.rotate(BABYLON.Axis.Y, -Math.PI / 100, BABYLON.Space.WORLD);
            }
        }
        if ((map["d"] || map["D"])) {
            if (this.mesh._rotationQuaternion.w >= -0.80) {
                this.mesh.rotate(BABYLON.Axis.Y, Math.PI / 100, BABYLON.Space.WORLD);
            }
        }

    }



}
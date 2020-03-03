export default class EntityBabylon {

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

    handleMovement(map,otherMesh,collisionWithLimit) {

        if ((map["z"] || map["Z"]) && collisionWithLimit == false) {
           
            let dir = this.mesh.getDirection(new BABYLON.Vector3(0, 0, 8))
            this.mesh.position.x += dir.x
            this.mesh.position.z += dir.z
            otherMesh.forEach(mesh => {
                if (mesh.name === "Plane.000" || mesh.name === "Plane.029" || mesh.name === "Plane.047"
                    || mesh.name === "Plane.017" || mesh.name === "Plane.019" || mesh.name === "Plane.008" || mesh.name === "Plane.035") {
                    mesh.rotate(BABYLON.Axis.Z, Math.PI / 15, BABYLON.Space.LOCAL)
                }
            })
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
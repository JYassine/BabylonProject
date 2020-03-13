
var Utilities = {
    getRandomInt : (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    },

    // simplified face funtion
	facePoint : (rotatingObject, pointToRotateTo) => {
		// a directional vector from one object to the other one
		var direction = pointToRotateTo.subtract(rotatingObject.position);
		
		if (!rotatingObject.rotationQuaternion) {
			rotatingObject.rotationQuaternion = BABYLON.Quaternion.Identity();
		}
		
		direction.normalize();
		
		var mat = BABYLON.Matrix.Identity();
		
		var upVec = BABYLON.Vector3.Up();
		
		var xaxis = BABYLON.Vector3.Cross(direction, upVec);
		var yaxis = BABYLON.Vector3.Cross(xaxis, direction);
		
		mat.m[0] = xaxis.x;
		mat.m[1] = xaxis.y;
		mat.m[2] = xaxis.z;
		
		mat.m[4] = direction.x;
		mat.m[5] = direction.y;
		mat.m[6] = direction.z;
		
		mat.m[8] = yaxis.x;
		mat.m[9] = yaxis.y;
		mat.m[10] = yaxis.z;
		
		BABYLON.Quaternion.FromRotationMatrixToRef(mat, rotatingObject.rotationQuaternion);
		
	},

	// give a mesh which has a correctly stretched texture and another mesh which is bigger/smaller.
	// returns the correctly stretched texture mesh with a correctly stretched texture
	textureRescale : (goodLookingMesh, stretchedMesh) => {
		toStretchTexture = goodLookingMesh.diffuseTexture.clone();
		height1 = goodLookingMesh.height;
		height2 = stretchedMesh.height;
		depth1 = goodLookingMesh.depth;
		depth2 = stretchedMesh.depth;

		toStretchTexture.vScale = height1 / height2;
		toStretchTexture.uScale = depth1 / depth2;
		stretchedMesh.diffuseTexture = toStretchTexture;
		return stretchedMesh;
	}
    
}

export default Utilities;
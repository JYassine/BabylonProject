export default class Light {


    constructor(){



    }


    createCustomLight(scene){
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

        return checkPointLight;
    }
}
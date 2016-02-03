/* requireJS module definition */
define(["jquery", "three", "shaders"],
    (function($, THREE, Shaders) {

        "use strict";

        var Explosion = function() {


            this.root = new THREE.Object3D();

            var scope = this;

            // load explosion texture
            var loader  = new THREE.TextureLoader();
            // Loading textures is asynchronous. That means you the load function
            // takes the file url as input and three callback functions
            // onLoadSuccess, onLoadProgress and onLoadError
            // we need to handle these cases. Only in onLoadSuccess we can setup
            // the scene, the texture and the shaders correctly.
            // correctly this would be implemented with promises (see assignment add-on question)

            var start = Date.now()

            // define a shader with these uniform values
            this.material = new THREE.ShaderMaterial( {
                 uniforms: {
                     explosionTex: {type: 't', value: null},
                     time: {type: 'f', value: 0.0},
                     weight: {type: 'f', value: 0.0},
                     freqScale: {type: 'f', value: 0.0},
                     colorScale: {type: 'f', value: 0.0}
                 },
                 vertexShader: Shaders.getVertexShader("explosion"),
                 fragmentShader: Shaders.getFragmentShader("explosion")
             });

            // Parametereinstellung & Animation
            setInterval(function () {
                var speed = $("#explosionSpeed").val();
                scope.material.uniforms['time'].value = 0.00001 * speed * (Date.now() - start);
                var color = $("#explosionColor").val();
                scope.material.uniforms['colorScale'].value = color;
                var frequency = $("#explosionFrequency").val();
                scope.material.uniforms['freqScale'].value = frequency;
                var weight = $("#explosionWeight").val();
                scope.material.uniforms['weight'].value = weight;
            },5);

            loader.load("./textures/explosion.png", function(tex){
                scope.material.uniforms.explosionTex.value = tex;
            });

            scope.mesh = new THREE.Mesh(new THREE.SphereGeometry( 500, 220, 220), scope.material);
            scope.mesh.name = "explosion";
            scope.root.add(scope.mesh);

            this.getMesh = function() {
                return this.root;
            };


        }; // constructor


        return Explosion;

    })); // define module


/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Planet = function() {

            this.root = new THREE.Object3D();

            // load and create required textures
            var loader = new THREE.TextureLoader();

            var scope = this;

            // implement ShaderMaterial using the code from
            // the lecture

            // hint:
            // texture can be assigned only when it is loaded completely, e.g. like this
            //material.uniforms.daytimeTexture.value   = textureName;

            //var material = new THREE.MeshPhongMaterial( {color: new THREE.Color(1, 0, 0)})

            this.material = new THREE.ShaderMaterial( {
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib["lights"],
                    {
                        materialPhongDiffuse: {type: 'c', value: new THREE.Color(1, 1, 1)},
                        materialPhongSpecular: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                        materialPhongAmbient: {type: 'c', value: new THREE.Color(0.8, 0.2, 0.2)},
                        materialPhongShining: {type: 'f', value: 16.0},
                        textureDay : {type: 't', value: null},
                        textureNight: {type: 't', value: null},
                        textureClouds: {type: 't', value: null},
                        textureDayIsOn: {type: 'i', value: $("#showDay").is(":checked")},
                        textureNightIsOn: {type: 'i', value: $("#showNight").is(":checked")},
                        textureCloudsIsOn: {type: 'i', value: $("#showClouds").is(":checked")}
                    }
                ]),
                vertexShader: Shaders.getVertexShader("planet"),
                fragmentShader: Shaders.getFragmentShader("planet"),
                lights: true
            });

            // Erstellung des Skeletts
            var skeleton = new THREE.SphereGeometry(400, 100, 100);

            // Laden der Texturen
            loader.load("./textures/earth_month04.jpg", function(tex) {
                scope.material.uniforms.textureDay.value = tex;
            });
            loader.load("./textures/earth_at_night_2048.jpg", function(tex) {
                scope.material.uniforms.textureNight.value = tex;
            });
            loader.load("./textures/earth_clouds_2048.jpg", function(tex) {
                scope.material.uniforms.textureClouds.value = tex;
            });

            // Texturen An-/Ausschalten
            scope.textureSwitch = function(tex) {
                var to;
                switch (tex) {
                    case "day" :
                        to = $("#showDay").is(":checked");
                        scope.material.uniforms.textureDayIsOn.value = to;
                        break;
                    case "night" :
                        to  = $("#showNight").is(":checked");
                        scope.material.uniforms.textureNightIsOn.value = to;
                        break;
                    case "clouds" :
                        to = $("#showClouds").is(":checked");
                        scope.material.uniforms.textureCloudsIsOn.value = to;
                        break;
                    default :
                        to = null;
                        console.log("Illegal argument for texture: " + tex);
                }
                console.log("changing " + tex + ": " + to);
            };

            // Skin und Skelett zusammenführen
            scope.mesh = new THREE.Mesh(skeleton, this.material);
            scope.mesh.name = "planet";
            scope.root.add(scope.mesh);

            this.getMesh = function() {
                return this.root;
            };
        }; // constructor
        return Planet;
    })); // define module



/**
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 *
 */

/* requireJS module definition */
define(["three", "util", "shaders", "BufferGeometry", "random", "band"],
        (function (THREE, util, shaders, BufferGeometry, Random, Band) {

            "use strict";

            /*
             * Scene constructor
             */
            var Scene = function (renderer, width, height) {

                // the scope of the object instance
                var scope = this;

                scope.renderer = renderer;
                scope.t = 0;
                scope.runningXSun = 0;
                scope.runningZSun = 0;
                scope.rotator = 0.01;

                scope.camera = new THREE.PerspectiveCamera(66, width / height, 0.1, 2000);
                scope.camera.position.z = 1000;
                scope.scene = new THREE.Scene();

                // Add a listener for 'keydown' events. By this listener, all key events will be
                // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
                document.addEventListener("keydown", onDocumentKeyDown, false);

                /**
                 * Method called on pressed key (keydown)
                 * @param {type} event
                 * @returns {undefined}
                 */
                function onDocumentKeyDown(event) {
                    // Get the key code of the pressed key
                    var keyCode = event.which;

                    if (keyCode === 38) {
                        console.log("cursor up");
                        scope.currentMesh.rotation.x += 0.05;
                        // Cursor down
                    } else if (keyCode === 40) {
                        console.log("cursor down");
                        scope.currentMesh.rotation.x += -0.05;
                        // Cursor left
                    } else if (keyCode === 37) {
                        console.log("cursor left");
                        scope.currentMesh.rotation.y += 0.05;
                        // Cursor right
                    } else if (keyCode === 39) {
                        console.log("cursor right");
                        scope.currentMesh.rotation.y += -0.05;
                        // Cursor up
                    } else if (keyCode === 49) {
                        console.log("turning neck left");
                        var element = scope.scene.getObjectByName("neck", true);
                        if (element) {
                            element.rotateY(-0.05);
                        }
                    } else if (keyCode === 50) {
                        console.log("turning neck right");
                        var element = scope.scene.getObjectByName("neck", true);
                        if (element) {
                            element.rotateY(0.05);
                        }
                    } else if (keyCode === 51) {
                        console.log("turning left arm left");
                        var element = scope.scene.getObjectByName("jointLeftArm", true);
                        if (element) {
                            element.rotateY(0.05);
                        }
                    } else if (keyCode === 52) {
                        console.log("turning left arm right");
                        var element = scope.scene.getObjectByName("jointLeftArm", true);
                        if (element) {
                            element.rotateY(-0.05);
                        }
                    } else if (keyCode === 53) {
                        console.log("turning right arm left");
                        var element = scope.scene.getObjectByName("jointRightArm", true);
                        if (element) {
                            element.rotateY(0.05);
                        }
                    } else if (keyCode === 54) {
                        console.log("turning right arm right");
                        var element = scope.scene.getObjectByName("jointRightArm", true);
                        if (element) {
                            element.rotateY(-0.05);
                        }
                    } else if (keyCode === 55) {
                        console.log("turning right leg left");
                        var element = scope.scene.getObjectByName("jointLeftLeg", true);
                        if (element) {
                            element.rotateX(0.05);
                        }
                    } else if (keyCode === 56) {
                        console.log("turning right leg right");
                        var element = scope.scene.getObjectByName("jointLeftLeg", true);
                        if (element) {
                            element.rotateX(-0.05);
                        }
                    } else if (keyCode === 57) {
                        console.log("turning right leg left");
                        var element = scope.scene.getObjectByName("jointRightLeg", true);
                        if (element) {
                            element.rotateX(0.05);
                        }
                    } else if (keyCode === 48) {
                        console.log("turning right leg right");
                        var element = scope.scene.getObjectByName("jointRightLeg", true);
                        if (element) {
                            element.rotateX(-0.05);
                        }
                    }
                }

                /**
                 * 
                 * @param {type} mesh
                 * @returns {undefined}
                 */
                this.addMesh = function (mesh) {
                    scope.currentMesh = mesh;
                    scope.scene.add(scope.currentMesh);
                };

                /**
                 * Clears the Scene
                 * @returns {undefined}
                 */
                this.clearScene = function () {
                    scope.scene = new THREE.Scene();
                    scope.t = 0;
                    scope.runningXSun = 0;
                    scope.runningZSun = 0;
                };

                /**
                 * 
                 * @param {type} bufferGeometry
                 * @returns {undefined}
                 */
                this.addBufferGeometry = function (bufferGeometry) {
                    scope.currentMesh = bufferGeometry.getMesh();
                    scope.scene.add(scope.currentMesh);
                };

                /**
                 * Adds a light to the scene
                 * @param light the give light
                 */
                this.addLight = function (light) {
                    scope.scene.add(light);
                };

                /**
                 * drawing the scene
                 * @returns {undefined}
                 */
                this.draw = function () {
                    requestAnimFrame(scope.draw);
                    scope.animate();
                };

                /**
                 * animate the scene
                 * @returns {undefined}
                 */
                this.animate = function () {
                    scope.renderer.render(scope.scene, scope.camera);
                    if ($("#animate").prop("checked")) {
                        var robotHead = scope.scene.getObjectByName("neck", true);
                        var planet = scope.scene.getObjectByName("planet", true);
                        if (robotHead) {
                            var robotLeftArm = scope.scene.getObjectByName("jointLeftArm", true);
                            var robotRightArm = scope.scene.getObjectByName("jointRightArm", true);
                            var robotLeftLeg = scope.scene.getObjectByName("jointLeftLeg", true);
                            var robotRightLeg = scope.scene.getObjectByName("jointRightLeg", true);
                            
                            var robotLeftHand = scope.scene.getObjectByName("handLeft", true);
                            var robotRightHand = scope.scene.getObjectByName("handRight", true);
                            
                            robotHead.rotateY(0.01)
                            robotHead.scale.y += scope.rotator * 0.3;
                            
                            robotLeftArm.rotateY(0.01);
                            robotLeftHand.translateY(scope.rotator * 75);
                            robotRightHand.translateY(scope.rotator * -75);
                            robotRightArm.rotateY(0.01);
                            
                            scope.t++;
                            if (scope.t === 180) {
                                scope.t = -180;
                                scope.rotator *= (-1);
                            } 
                            
                            robotLeftLeg.rotateX(scope.rotator);
                            robotRightLeg.rotateX(-scope.rotator);
                        } else if (planet) {
                            var sun = scope.scene.getObjectByName("dLight");
                            sun.position.x = Math.sin(scope.runningXSun);
                            scope.runningXSun -= 0.008;
                            sun.position.z = Math.cos(scope.runningZSun);
                            scope.runningZSun -= 0.008;
                            scope.currentMesh.rotation.y += 0.0025;
                        } else {
                            scope.currentMesh.rotation.y += 0.0025;
                            scope.currentMesh.rotation.x += 0.0020;
                            scope.currentMesh.rotation.z += 0.0030;
                        }
                    }
                };
            };
            // this module only exports the constructor for Scene objects
            return Scene;
        })); // define



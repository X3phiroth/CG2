define(["three"],
        (function (THREE) {

            "use strict";

            var Robot = function () {
                this.root = new THREE.Object3D();

//                proportions (Object {width (w), height (h), depth (d)})
                var headSize = {w: 150, h: 150, d: 150};
                var torsoSize = {w: 300, h: 450, d: 100};
                var neckSize = {w: 50, h: 50, d: 50};
                var armSize = {w: 50, h: 50, d: 200};
                var legSize = {w: 50, h: 50, d: 220};
                var footSize = {w: 100, h: 50, d: 150};

//                head
                this.head = new THREE.Object3D();
                this.head.name = "head";
                this.head.translateY(headSize.h / 2 + neckSize.h / 2);
                this.headSkin = new THREE.Mesh(
                        new THREE.CubeGeometry(headSize.w, headSize.h, headSize.d),
                        new THREE.MeshNormalMaterial());
                this.head.add(this.headSkin);

//                neck
                this.neck = new THREE.Object3D();
                this.neck.name = "neck";
                this.neck.translateY(torsoSize.h / 2 + neckSize.h / 2);
                this.neckSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(neckSize.w, neckSize.h, neckSize.d),
                        new THREE.MeshNormalMaterial());
                this.neck.add(this.neckSkin);

//                torso
                this.torso = new THREE.Object3D();
                this.torso.name = "torso";
                this.torsoSkin = new THREE.Mesh(
                        new THREE.CubeGeometry(torsoSize.w, torsoSize.h, torsoSize.d),
                        new THREE.MeshNormalMaterial());
                this.torso.add(this.torsoSkin);

//                upper left arm
                this.upperArmLeft = new THREE.Object3D();
                this.upperArmLeft.name = "upperArmLeft";
                this.upperArmLeft.rotateZ(Math.PI / 2);
                this.upperArmLeft.translateX(torsoSize.h / 2 - armSize.h);
                this.upperArmLeft.translateY(torsoSize.w / 2 + armSize.d / 2);
                this.upperArmLeftSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(armSize.w, armSize.h, armSize.d),
                        new THREE.MeshNormalMaterial());
                this.upperArmLeft.add(this.upperArmLeftSkin);
                
//                left arm joint
                this.jointLeftArm = new THREE.Object3D();
                this.jointLeftArm.name = "jointLeftArm";
                this.jointLeftArm.translateY(armSize.w + armSize.w);
                this.jointLeftArmSkin = new THREE.Mesh(
                        new THREE.SphereGeometry(armSize.w),
                        new THREE.MeshNormalMaterial());
                this.jointLeftArm.add(this.jointLeftArmSkin);
                
//                lower left arm
                this.lowerArmLeft = new THREE.Object3D();
                this.lowerArmLeft.name = "lowerArmLeft";
                this.lowerArmLeft.rotateZ(Math.PI / 2);
                this.lowerArmLeft.translateY(armSize.d / 2);
                this.lowerArmLeftSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(armSize.w, armSize.h, armSize.d),
                        new THREE.MeshNormalMaterial());
                this.lowerArmLeft.add(this.lowerArmLeftSkin);
                
//                left hand
                this.handLeft = new THREE.Object3D();
                this.handLeft.name = "handLeft";
                this.handLeft.translateY(armSize.w + armSize.w);
                this.handLeftSkin = new THREE.Mesh(
                        new THREE.SphereGeometry(armSize.w),
                        new THREE.MeshNormalMaterial({wireframe: true}));
                this.handLeft.add(this.handLeftSkin);
                
//                upper right arm
                this.upperArmRight = new THREE.Object3D();
                this.upperArmRight.name = "upperArmRight";
                this.upperArmRight.rotateZ(-Math.PI / 2);
                this.upperArmRight.translateX(-(torsoSize.h / 2 - armSize.h));
                this.upperArmRight.translateY(torsoSize.w / 2 + armSize.d / 2);
                
                this.upperArmRightSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(armSize.w, armSize.h, armSize.d),
                        new THREE.MeshNormalMaterial());
                this.upperArmRightSkin.scale.set(2, 1, 1);
                this.upperArmRight.add(this.upperArmRightSkin);
                
//                right arm joint
                this.jointRightArm = new THREE.Object3D();
                this.jointRightArm.name = "jointRightArm";
                this.jointRightArm.translateY(armSize.w + armSize.w);
                this.jointRightArmSkin = new THREE.Mesh(
                        new THREE.SphereGeometry(armSize.w),
                        new THREE.MeshNormalMaterial());
                this.jointRightArm.add(this.jointRightArmSkin);
                
//                lower right arm
                this.lowerArmRight = new THREE.Object3D();
                this.lowerArmRight.name = "lowerArmRight";
                this.lowerArmRight.rotateZ(Math.PI / 2);
                this.lowerArmRight.translateY(-armSize.d / 2);
                this.lowerArmRightSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(armSize.w, armSize.h, armSize.d),
                        new THREE.MeshNormalMaterial());
                this.lowerArmRight.add(this.lowerArmRightSkin);
                
//                right hand
                this.handRight = new THREE.Object3D();
                this.handRight.name = "handRight";
                this.handRight.translateY(-(armSize.w + armSize.w));
                this.handRightSkin = new THREE.Mesh(
                        new THREE.SphereGeometry(armSize.w),
                        new THREE.MeshNormalMaterial({wireframe: true}));
                this.handRight.add(this.handRightSkin);
                
//                left leg joint
                this.jointLegLeft = new THREE.Object3D();
                this.jointLegLeft.name = "jointLeftLeg";
                this.jointLegLeft.translateY(-torsoSize.h / 2);
                this.jointLegLeft.translateX(-torsoSize.w / 4);
                this.jointLeftLegSkin = new THREE.Mesh(
                        new THREE.SphereGeometry(legSize.w),
                        new THREE.MeshNormalMaterial());
                this.jointLegLeft.add(this.jointLeftLegSkin);
                
//                left leg
                this.legLeft = new THREE.Object3D();
                this.legLeft.name = "legLeft";
                this.legLeft.translateY(-legSize.d / 2);
                this.legLeftSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(legSize.w, legSize.h, legSize.d),
                        new THREE.MeshNormalMaterial());
                this.legLeft.add(this.legLeftSkin);
                
//                left foot
                this.footLeft = new THREE.Object3D();
                this.footLeft.name = "footRight";
                this.footLeft.translateY(-(legSize.d / 2 + footSize.h / 2));
                this.footLeft.translateZ(legSize.w / 2);
                this.footLeftSkin = new THREE.Mesh(
                        new THREE.CubeGeometry(footSize.w, footSize.h, footSize.d),
                        new THREE.MeshNormalMaterial());
                this.footLeft.add(this.footLeftSkin);
                
//                right leg joint
                this.jointLegRight = new THREE.Object3D();
                this.jointLegRight.name = "jointRightLeg";
                this.jointLegRight.translateY(-torsoSize.h / 2);
                this.jointLegRight.translateX(torsoSize.w / 4);
                this.jointRightLegSkin = new THREE.Mesh(
                        new THREE.SphereGeometry(legSize.w),
                        new THREE.MeshNormalMaterial());
                this.jointLegRight.add(this.jointRightLegSkin);
                
//                right leg
                this.legRight = new THREE.Object3D();
                this.legRight.name = "legRight";
                this.legRight.translateY(-legSize.d / 2);
                this.legRightSkin = new THREE.Mesh(
                        new THREE.CylinderGeometry(legSize.w, legSize.h, legSize.d),
                        new THREE.MeshNormalMaterial());
                this.legRight.add(this.legRightSkin);
                
//                right foot
                this.footRight = new THREE.Object3D();
                this.footRight.name = "footRight";
                this.footRight.translateY(-(legSize.d / 2 + footSize.h / 2));
                this.footRight.translateZ(legSize.w / 2);
                this.footRightSkin = new THREE.Mesh(
                        new THREE.CubeGeometry(footSize.w, footSize.h, footSize.d),
                        new THREE.MeshNormalMaterial());
                this.footRight.add(this.footRightSkin);
                
//                allocation
                this.neck.add(this.head);
                
                this.torso.add(this.neck);
                this.torso.add(this.upperArmLeft);
                this.torso.add(this.upperArmRight);
                this.torso.add(this.jointLegLeft);
                this.torso.add(this.jointLegRight);
                
                this.upperArmLeft.add(this.jointLeftArm);
                this.jointLeftArm.add(this.lowerArmLeft);
                this.lowerArmLeft.add(this.handLeft);
                
                this.upperArmRight.add(this.jointRightArm);
                this.jointRightArm.add(this.lowerArmRight);
                this.lowerArmRight.add(this.handRight);
                
                this.jointLegLeft.add(this.legLeft);
                this.legLeft.add(this.footLeft);
                
                this.jointLegRight.add(this.legRight);
                this.legRight.add(this.footRight);

                this.root.add(this.torso);

                this.getMesh = function () {
                    return this.root;
                };
            };
            return Robot;
        }));

/**
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band", "parametric", "three", "vec2", "robot"],
        (function ($, BufferGeometry, Random, Band, ParametricSurface, THREE, vec2, Robot) {
            "use strict";
            /**
             * define callback functions to react to changes in the HTML page
             * and provide them with a closure defining context and scene
             */
            var HtmlController = function (scene) {

                var that = this;

//-- Misc --------------------------------------------------------------------//
                $("#wireframe").click(function () {
                    scene.currentMesh.material.wireframe = $("#wireframe").prop("checked");
                })

//-- Menu Buttons ------------------------------------------------------------//
                $("#random").show();
                $("#band").hide();
                $("#ellipsoid").hide();
                $("#parametric").hide();
                $("#calcPoints").hide();
                $("#paraPresets").hide();
                $("#calcPresets").hide();

                $("#btnRandom").click((function () {
                    $("#random").show();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                    $("#calcPoints").hide();
                    $("#paraPresets").hide();
                    $("#calcPresets").hide();
                }));
                $("#btnBand").click((function () {
                    $("#random").hide();
                    $("#band").show();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                    $("#calcPoints").hide();
                    $("#paraPresets").hide();
                    $("#calcPresets").hide();
                }));
                $("#btnParametric").click((function () {
                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").show();
                    $("#btnNewParametric").show();
                    $("#btnNewPillow").hide();
                    $("#btnNewCosine").hide();
                    $("#calcPoints").hide();
                    $("#paraPresets").show();
                    $("#calcPresets").hide();
                }));
                $("#btnPoints").click(function () {
                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                    $("#btnNewParametric").hide();
                    $("#btnNewPillow").hide();
                    $("#btnNewCosine").hide();
                    $("#calcPoints").show();
                    $("#paraPresets").hide();
                    $("#calcPresets").show();
                });
                $("#btnRobot").click(function () {
                    var robot = new Robot();
                    scene.addMesh(robot.getMesh());
                });
                $('#btnClear').click(function () {
                    scene.clearScene()
                    $("#animate").prop("checked", false);
                });

//-- Parametric Preset Buttons ------------------------------------------------//
                $("#btnEllipsoid").click((function () {
                    that.setValuesParametric("600 * Math.cos(u) * Math.cos(v)",
                            "400 * Math.cos(u) * Math.sin(v)",
                            "200 * Math.sin(u)",
                            -(Math.PI), (Math.PI), -(Math.PI / 2), (Math.PI / 2), 25, 25);
                }));
                $("#btnPillow").click((function () {
                    that.setValuesParametric("400 * Math.cos(u)",
                            "400 * Math.cos(v)",
                            "150 * Math.sin(u) * Math.sin(v)",
                            -(Math.PI), (Math.PI), 0, (Math.PI), 30, 30);
                }));
                $("#btnCosin").click((function () {
                    that.setValuesParametric("500 * Math.cos(u)",
                            "300 * Math.cos(v)",
                            "300 * Math.cos(u + v)",
                            -(Math.PI), (Math.PI), -(Math.PI), (Math.PI), 30, 30);
                }));
                $("#btnTorus").click((function () {
                    that.setValuesParametric("(300 + 150 * Math.cos(v))*Math.cos(u)",
                            "(300 + 150 * Math.cos(v))*Math.sin(u)",
                            "100 * Math.sin(v)",
                            -(Math.PI), (Math.PI), -(Math.PI), (Math.PI), 25, 25);
                }));
                $("#btnSphere").click((function () {
                    that.setValuesParametric("500 * Math.cos(u) * Math.cos(v)",
                            "500 * Math.cos(u) * Math.sin(v)",
                            "500 * Math.sin(u)",
                            -(Math.PI), (Math.PI), -(Math.PI / 2), (Math.PI / 2), 25, 25);
                }));
                $("#btnClearParametric").click((function () {
                    that.setValuesParametric("", "", "", "", "", "", "", "", "");
                }));

//-- Points Calc Preset Buttons ----------------------------------------------//
                $("#btnCalcPreset1").click((function () {
                    that.setValuesCalcPoints(10, 5, 3, 5, 10);
                }));
                $("#btnCalcPreset2").click((function () {
                    that.setValuesCalcPoints(3, 3, 3, 2, 2);
                }));
                $("#btnCalcPreset3").click((function () {
                    that.setValuesCalcPoints(3, 3, 3, 3, 0);
                }));
                $("#btnCalcClear").click((function () {
                    that.setValuesCalcPoints("", "", "", "", "");
                }));

//-- Generate Buttons --------------------------------------------------------//
                $("#btnNewRandom").click((function () {
                    var numPoints = parseInt($("#numItems").attr("value"));
                    var random = new Random(numPoints);
                    var bufferGeometryRandom = new BufferGeometry("point");
                    bufferGeometryRandom.addAttribute("position", random.getPositions());
                    bufferGeometryRandom.addAttribute("color", random.getColors());
                    scene.addBufferGeometry(bufferGeometryRandom);
                }));
                $("#btnNewBand").click((function () {
                    var config = {
                        segments: parseInt($("#numSegments").attr("value")),
                        radius: parseInt($("#radius").attr("value")),
                        height: parseInt($("#height").attr("value"))
                    };
                    var band = new Band(config);
                    var bufferGeometryBand = new BufferGeometry();
                    bufferGeometryBand.addAttribute("position", band.getPositions());
                    bufferGeometryBand.addAttribute("color", band.getColors());
                    bufferGeometryBand.addAttribute("index", band.getIndices());
                    scene.addBufferGeometry(bufferGeometryBand);
                }));
                $("#btnNewParametric").click((function () {
                    var fx = $("#functionX").val() || "u * 200";
                    var fy = $("#functionY").val() || "v * 200";
                    var fz = $("#functionZ").val() || "0";

                    var positionFunc = function (u, v) {
                        try {
                            var pos3D = [eval(fx), eval(fy), eval(fz)];
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                alert("Syntax Error : Bitte Formeleingabe überprüfen\n\
                                und erneut ausführen ... " + e.message);
                                return;
                            } else {
                                throw(e);
                            }
                        }
                        return pos3D;
                    };

                    var config = {
                        uMin: parseFloat($("#parUMin").val()),
                        uMax: parseFloat($("#parUMax").val()),
                        uSegments: parseInt($("#parUSegments").val()),
                        vMin: parseFloat($("#parVMin").val()),
                        vMax: parseFloat($("#parVMax").val()),
                        vSegments: parseInt($("#parVSegments").val())
                    };
                    console.log(config);
                    var parametric = new ParametricSurface(positionFunc, config);
                    var bufferGeometryParametric = new BufferGeometry();
                    bufferGeometryParametric.addAttribute("position", parametric.getPositions());
                    bufferGeometryParametric.addAttribute("color", parametric.getColors());
                    bufferGeometryParametric.addAttribute("index", parametric.getIndices());
                    scene.addBufferGeometry(bufferGeometryParametric);
                }));
                $("#btnCalcPoints").click(function () {
//                    http://walter.bislins.ch/blog/index.asp?page=Schnittpunkte+zweier+Kreise+berechnen+%28JavaScript%29

                    var p1 = [parseFloat($("#xp1").val()), parseFloat($("#yp1").val())];
                    var p2 = [parseFloat($("#xp2").val()), parseFloat($("#yp2").val())];
                    var r1 = parseFloat($("#cRadius").val());
                    var r2;

                    var distance = vec2.length(vec2.sub(p1, p2));
                    console.log(distance);

                    if (distance < r1) {
                        $("#p3").html("");
                        $("#p4").html("");
                        $("#hint").html('<span style="color: red;">Point is <u>IN</u> the Circle</span>');
                        return;
                    }
                    if (distance === r1) {
                        $("#p3").html("[" + p2[0].toFixed(2) + "," + p2[1].toFixed(2) + "]");
                        $("#p4").html("[" + p2[0].toFixed(2) + "," + p2[1].toFixed(2) + "]");
                        $("#hint").html('<span style="color: red;">Point is <u>ON</u> the Circle</span>');
                        return;
                    } else {
                        r2 = Math.sqrt(Math.pow(distance, 2) - Math.pow(r1, 2));

                        var x = (Math.pow(r1, 2) + Math.pow(distance, 2) - Math.pow(r2, 2)) / (2 * distance);
                        console.log(x);
                        var y1 = Math.sqrt(Math.pow(r1, 2) - Math.pow(x, 2));
                        var y2 = -Math.sqrt(Math.pow(r1, 2) - Math.pow(x, 2));

                        var ex = [(p2[0] - p1[0]) / distance, (p2[1] - p1[1]) / distance];
                        var ey = [-ex[0], ex[1]];

                        var p3 = [p1[0] + x * ex[0] + y1 * ey[0], p1[1] + x * ex[1] + y1 * ey[1]];
                        var p4 = [p1[0] + x * ex[0] - y1 * ey[0], p1[1] + x * ex[1] - y1 * ey[1]];

                        $("#p3").html("[" + p3[0].toFixed(2) + "," + p3[1].toFixed(2) + "]");
                        $("#p4").html("[" + p4[0].toFixed(2) + "," + p4[1].toFixed(2) + "]");
                        $("#hint").html("");
                    }
                });

                /**
                 * sets values for parametric
                 * @param {type} vMin
                 * @param {type} vMax
                 * @param {type} uMin
                 * @param {type} uMax
                 * @param {type} vSegments
                 * @param {type} uSegments
                 * @returns {undefined}
                 */
                this.setValuesParametric = function (functionX, functionY, functionZ, vMin, vMax, uMin, uMax, vSegments, uSegments) {
                    $("#functionX").val(functionX);
                    $("#functionY").val(functionY);
                    $("#functionZ").val(functionZ);
                    $("#parVMin").val(vMin);
                    $("#parVMax").val(vMax);
                    $("#parUMin").val(uMin);
                    $("#parUMax").val(uMax);
                    $("#parVSegments").val(vSegments);
                    $("#parUSegments").val(uSegments);
                };

                /**
                 * sets values for point calc
                 * @param {type} xP1
                 * @param {type} yP1
                 * @param {type} r
                 * @param {type} xP2
                 * @param {type} yP2
                 * @returns {undefined}
                 */
                this.setValuesCalcPoints = function (xP1, yP1, r, xP2, yP2) {
                    $("#xp1").val(xP1);
                    $("#yp1").val(yP1);
                    $("#cRadius").val(r);
                    $("#xp2").val(xP2);
                    $("#yp2").val(yP2);
                };
            };
            // return the constructor function
            return HtmlController;
        })); // require





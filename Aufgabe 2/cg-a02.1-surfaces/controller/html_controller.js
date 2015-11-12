/*
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
define(["jquery", "BufferGeometry", "random", "band", "parametric"],
        (function ($, BufferGeometry, Random, Band, ParametricSurface) {
            "use strict";
            /*
             * define callback functions to react to changes in the HTML page
             * and provide them with a closure defining context and scene
             */
            var HtmlController = function (scene) {


                $("#random").show();
                $("#band").hide();
                $("#ellipsoid").hide();
                $("#parametric").hide();

                $("#btnRandom").click((function () {
                    $("#random").show();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                }));
                $("#btnBand").click((function () {
                    $("#random").hide();
                    $("#band").show();
                    $("#ellipsoid").hide();
                    $("#parametric").hide();
                }));
                $("#btnEllipsoid").click((function () {
                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").show();
                    $("#parametric").hide();
                }));
                $("#btnParametric").click((function () {
                    $("#random").hide();
                    $("#band").hide();
                    $("#ellipsoid").hide();
                    $("#parametric").show();
                }));
                $("#btnNewRandom").click((function () {

                    var numPoints = parseInt($("#numItems").attr("value"));
                    var random = new Random(numPoints);
                    var bufferGeometryRandom = new BufferGeometry();
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
                    scene.addBufferGeometry(bufferGeometryBand);
                }));
                $("#btnNewParametric").click((function () {

                    var config = {
                        vsegments: parseInt($("#parVSegments").attr("value")),
                        usegments: parseInt($("#parUSegments").attr("value")),
                        umin: parseInt($("#parUMin").attr("value")),
                        umax: parseInt($("#parUMax").attr("value")),
                        vmin: parseInt($("#parVMin").attr("value")),
                        vmax: parseInt($("#parVMax").attr("value"))

                    };
                    var positionFunc = function(u, v) {
                        return [400 * Math.sin(u) * Math.cos(v),
                            200 * Math.sin(u) * Math.sin(v),
                            100 * Math.cos(u)];
                    };
                    var parametric = new ParametricSurface(positionFunc, config);
                    var bufferGeometryParametric = new BufferGeometry();
                    bufferGeometryParametric.addAttribute("position", parametric.getPositions());
                    bufferGeometryParametric.addAttribute("color", parametric.getColors());
                    scene.addBufferGeometry(bufferGeometryParametric);
                }));
            };
            // return the constructor function
            return HtmlController;
        })); // require





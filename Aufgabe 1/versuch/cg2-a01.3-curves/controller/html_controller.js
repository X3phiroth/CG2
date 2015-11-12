/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "Line", "Circle", "Point", "KdTree", "util", "kdutil", "ParametricCurve", "BezierCurve"], (function ($, Line, Circle, Point, KdTree, Util, KdUtil, ParametricCurve, BezierCurve) {
    "use strict";

    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function (context, scene, sceneController) {

        var kdTree;
        var pointList = [];

        // generate random X coordinate within the canvas
        var randomX = function () {
            return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
        };

        // generate random Y coordinate within the canvas
        var randomY = function () {
            return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
        };

        // generate random Y coordinate within the canvas
        var randomRadius = function () {
            return Math.floor(Math.random() * 20) + 30;
        };

        // generate random color in hex notation
        var randomColor = function () {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function (byte) {
                var s = byte.toString(16); // convert to hex string
                if (s.length === 1)
                    s = "0" + s; // pad with leading 0
                return s;
            };

            var r = Math.floor(Math.random() * 25.9) * 10;
            var g = Math.floor(Math.random() * 25.9) * 10;
            var b = Math.floor(Math.random() * 25.9) * 10;

            // convert to hex notation
            return "#" + toHex2(r) + toHex2(g) + toHex2(b);
        };

        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click((function () {

            // create the actual line and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };

            var line = new Line([randomX(), randomY()],
                    [randomX(), randomY()],
                    style);
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw

        }));

        $("#btnNewCircle").click((function () {
            // create the actual line and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };

            var circle = new Circle([randomX(), randomY()],
                    randomRadius(), style);
            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
        }));

        $("#btnNewPoint").click((function () {
            // create the actual point and add it to the scene
            var color = randomColor();

            var point = new Point([randomX(), randomY()], color);
            scene.addObjects([point]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(point); // this will also redraw
        }));

        $("#btnNewParametricCurve").click((function () {
            // create the actual point and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };
            var paraCurve = new ParametricCurve("200*Math.sin(t)", "200*Math.cos(t)", 0, Math.PI, 20, style);
            scene.addObjects([paraCurve]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(paraCurve); // this will also redraw
        }));

        $("#btnNewBezierCurve").click((function () {
            // create the actual point and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };

            var bezierCurve = new BezierCurve([100, 200], [250, 50], [400, 200], [250, 350], 20, 0, 1, style);
            scene.addObjects([bezierCurve]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(bezierCurve); // this will also redraw
        }));

        $("#colorChange").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof Line || object instanceof Circle) {
                object.lineStyle.color = $("#colorChange").val();
            }
            if (object instanceof Point) {
                object.color = $("#colorChange").val();
            }
        });

        $("#lineWidthChange").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof Line || object instanceof Circle) {
                object.lineStyle.width = $("#lineWidthChange").val();
            }
        });

        $("#radiusChange").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof Circle) {
                object.radius = $("#radiusChange").val();
            }
        });

        $("#lineWidthChangeCurve").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve) {
                object.lineStyle.width = $("#lineWidthChangeCurve").val();
            }
            if (object instanceof BezierCurve) {
                object.lineStyle.width = $("#lineWidthChangeCurve").val();
                object.innerCurve.lineStyle.width = $("#lineWidthChangeCurve").val();
            }
        });

        $("#colorChangeCurve").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve) {
                object.lineStyle.color = $("#colorChangeCurve").val();
            }
            if (object instanceof BezierCurve) {
                object.lineStyle.color = $("#colorChangeCurve").val();
                object.innerCurve.lineStyle.color = $("#colorChangeCurve").val();
            }
        });

        $("#xFunction").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve) {
                object.xFunction = $("#xFunction").val();
            }
        });

        $("#yFunction").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve) {
                object.yFunction = $("#yFunction").val();
            }
        });

        $("#minT").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve || object instanceof BezierCurve) {
                object.min_t = $("#minT").val();
            }
        });

        $("#maxT").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve || object instanceof BezierCurve) {
                object.max_t = $("#maxT").val();
            }
        });

        $("#segments").change(function () {
            var object = sceneController.getSelectedObject();
            if (object instanceof ParametricCurve || object instanceof BezierCurve) {
                object.segments = $("#segments").val();
            }
        });

        $("#tickMarks").change(function () {
            var object = sceneController.getSelectedObject();
            var bool = $("#tickMarks").is(":checked");
            if (object instanceof ParametricCurve) {
                object.checkedValue = bool;
            }
            if (object instanceof BezierCurve) {
                object.checkedValue(bool);
            }
        });

        $("#btnNewPointList").click((function () {

            // create the actual line and add it to the scene
            var color = randomColor();

            var numPoints = parseInt($("#numPoints").attr("value"));
            ;
            for (var i = 0; i < numPoints; ++i) {
                var point = new Point([randomX(), randomY()],
                        color);
                scene.addObjects([point]);
                pointList.push(point);
            }

            // deselect all objects
            sceneController.deselect();

        }));

        $("#visKdTree").click((function () {

            var showTree = $("#visKdTree").attr("checked");
            if (showTree && kdTree) {
                KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
            }

        }));

        $("#btnBuildKdTree").click((function () {

            kdTree = new KdTree(pointList);

        }));

        /**
         * creates a random query point and
         * runs linear search and kd-nearest-neighbor search
         */
        $("#btnQueryKdTree").click((function () {

            var style = {
                width: 2,
                color: "#ff0000"
            };
            var queryPoint = new Point([randomX(), randomY()], 2,
                    style);
            scene.addObjects([queryPoint]);
            sceneController.select(queryPoint);

            console.log("query point: ", queryPoint.center);

            ////////////////////////////////////////////////
            // TODO: measure and compare timings of linear
            //       and kd-nearest-neighbor search
            ////////////////////////////////////////////////
            var linearTiming = new Date().getMilliseconds();
            var minIdx = KdUtil.linearSearch(pointList, queryPoint);
            linearTiming = new Date().getMilliseconds() - linearTiming;

            console.log("nearest neighbor linear: ", pointList[minIdx].center);

            var kdTiming = new Date().getMilliseconds();
            var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, 10000000, kdTree.root, 0);
            kdTiming = new Date().getMilliseconds() - kdTiming;

            console.log("nearest neighbor kd: ", kdNearestNeighbor.point.center);

            //Difference usually visible with 10k Points
            console.log("Linear Search took     ", linearTiming, " ms.");
            console.log("KdNearestNeighbor took ", kdTiming, " ms.");

            sceneController.select(pointList[minIdx]);
            sceneController.select(kdNearestNeighbor.point);

        }));

        //init inputs
        var update = function (obj) {
            $("#geometrie").hide();
            $("#curve").hide();
            if (obj instanceof Line || obj instanceof Circle || obj instanceof Point) {
                $("#geometrie").show();
                $("#colorChange").show();
                $("#lineWidthChange").hide();
                $("#radiusChange").hide();

                if (obj instanceof Line) {
                    $("#colorChange").val(obj.lineStyle.color);

                    $("#lineWidthChange").show();
                    $("#lineWidthChange").val(obj.lineStyle.width);
                }
                if (obj instanceof Circle) {
                    $("#colorChange").val(obj.lineStyle.color);

                    $("#lineWidthChange").show();
                    $("#lineWidthChange").val(obj.lineStyle.width);

                    $("#radiusChange").show();
                    $("#radiusChange").val(obj.radius);
                }
                if (obj instanceof Point) {
                    $("#colorChange").val(obj.color);
                }
            }
            if (obj instanceof ParametricCurve || obj instanceof BezierCurve) {
                $("#curve").show();
                $("#colorChangeCurve").val(obj.lineStyle.color);
                $("#lineWidthChangeCurve").val(obj.lineStyle.width);

                if (obj instanceof ParametricCurve) {
                    $("#xFunction").prop("readonly", false);
                    $("#yFunction").prop("readonly", false);
                } else {
                    $("#xFunction").prop("readonly", true);
                    $("#yFunction").prop("readonly", true);
                }

                $("#xFunction").show();
                $("#xFunction").val(obj.xFunction);

                $("#yFunction").show();
                $("#yFunction").val(obj.yFunction);

                $("#minT").show();
                $("#minT").val(obj.min_t);

                $("#maxT").show();
                $("#maxT").val(obj.max_t);

                $("#segments").show();
                $("#segments").val(obj.segments);
            }
//            $("#radiusChange").hide();
//            $("#xFunction").hide();
//            $("#yFunction").hide();
//            $("#minT").hide();
//            $("#maxT").hide();
//            $("#segments").hide();
        };

        $("#colorChange, #lineWidthChange, #radiusChange, #colorChangeCurve, " +
                "#lineWidthChangeCurve, #xFunction, #yFunction, " +
                "#minT, #maxT, #segments").on("change", function () {
            sceneController.select(sceneController.getSelectedObject());
        });

        sceneController.onObjChange(update);
        sceneController.onSelection(update);
    };

    // return the constructor function
    return HtmlController;


})); // require





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
define(["jquery", "Line", "Circle", "Point", "KdTree", "util", "kdutil"], (function ($, Line, Circle, Point, KdTree, Util, KdUtil) {
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
        
        $("#colorChange").change(function() {
            var object = sceneController.getSelectedObject();
            if (object instanceof Line || object instanceof Circle) {
                object.lineStyle.color = $("#colorChange").val();
            }
            if (object instanceof Point) {
                object.color = $("#colorChange").val();
            }
        });
        
        $("#lineWidthChange").change(function() {
            var object = sceneController.getSelectedObject();
            if (object instanceof Line || object instanceof Circle) {
                object.lineStyle.width = $("#lineWidthChange").val();
            }
        });
        
        $("#radiusChange").change(function() {
            var object = sceneController.getSelectedObject();
            if (object instanceof Circle) {
                object.radius = $("#radiusChange").val();
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
    };

    // return the constructor function
    return HtmlController;


})); // require





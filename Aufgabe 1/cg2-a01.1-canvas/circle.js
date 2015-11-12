/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: straight_line
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
        (function (util, vec2, Scene, PointDragger) {

            "use strict";

            /**
             *  A simple circel that can be dragged
             *  around by its crust.
             *  Parameters:
             *  - point an array objects representing [x,y] coordinates of the center
             *  - radius 
             *  - circleStyle: object defining width and color attributes for circle drawing,
             *  
             *       begin of the form { width: 2, color: "#00FF00" }
             *       @argument {arry} point description
             *       @argument {int} radius description
             *       @argument {css} circleStyle description
             */

            var Circle = function (point, radius, circleStyle) {

                console.log("creating a Circel ");


                // draw style for drawing the line
                this.circleStyle = circleStyle || {width: "2", color: "#0000AA"};
                this.p0 = point || [10, 10]; //hier muss ich die Werte einfügen z.B. 100, 75,
                this.radius = radius || 10;


//            this.p1 = point1 || [50,10];
//
//                this.startAngle = startAngle || 1.5 * Math.PI;
//
//                this.endAngle = radius || 1.5 * Math.PI;
                // draw this line into the provided 2D rendering context
                this.draw = function (context) {

                    // draw actual actuel circle
                    context.beginPath();
                    context.arc(this.p0[0], this.p0[1], this.radius, 0 * Math.PI, 2.4 * Math.PI);

                    context.lineWidth = this.circleStyle.width;
                    context.strokeStyle = this.circleStyle.color;
//                    

                    // actually start drawing
                    context.stroke();

                };
                this.changeColor = function (color) {
                    this.circleStyle.color = color;
                };
                // test whether the mouse position is on this line segment
                this.isHit = function (context, pos) {

                    //(x_kreis - x_P)*(x_kreis - x_P) + (y_kreis - y_P)*(y_kreis - y_P) < radius*radius )
                    var toleranz = 2;
                    if (
                            (((this.p0[0] - pos[0]) + toleranz) * ((this.p0[0] - pos[0]) + toleranz) + ((this.p0[1] - pos[1]) + toleranz) >= (radius * radius)) &&
                            (((this.p0[0] - pos[0]) - toleranz) * ((this.p0[0] - pos[0]) - toleranz) + ((this.p0[1] - pos[1]) - toleranz) <= (radius * radius)))
                        ;
                    return true;
                };

//                 // return list of draggers to manipulate this line
//            this.createDraggers = function() {
//
//                var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true };
//                var draggers = [];
//
//                // create closure and callbacks for dragger
//                var _line = this;
//                var getP0 = function() { return _line.p0; };
////                var getP1 = function() { return _line.p1; };
//                var setP0 = function(dragEvent) { _line.p0 = dragEvent.position; };
////                var setP1 = function(dragEvent) { _line.p1 = dragEvent.position; };
//                draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
//                draggers.push()
////                draggers.push( new PointDragger(getP1, setP1, draggerStyle) );
//
//                return draggers;
//
//            };

                // return list of draggers to manipulate this line
                this.createDraggers = function () {

                    var draggerStyle = {radius: 4, color: this.circleStyle.color, width: 0, fill: true};
                    var draggers = [];

                    // create closure and callbacks for dragger
                    var _circle = this;
                    var getP0 = function () {
                        return _circle.p0;
                    };
//                    var getP1 = function () {
//                        return _circle.p1;
//                    };
                    var setP0 = function (dragEvent) {
                        _circle.p0 = dragEvent.position;
                    };
//                    var setP1 = function (dragEvent) {
//                        _circle.p1 = dragEvent.position;
//                    };
                    draggers.push(new PointDragger(getP0, setP0, draggerStyle));
//                    draggers.push(new PointDragger(getP1, setP1, draggerStyle));
                    var getOuterPoint = function () {
                        var outerPos = [];
                        outerPos[0] = _circle.p0[0] + _circle.radius;
                        outerPos[1] = _circle.p0[1];
                        return outerPos;
                    };

                    //callback that adjusts the radius by the difference between value passed by the dragger and center point
                    var setNewRadius = function (dragEvent) {
                        _circle.radius = vec2.length(vec2.sub(dragEvent.position, _circle.p0));
                        console.log(JSON.stringify(this));
                        console.log(JSON.stringify(_circle));
                    };
                    draggers.push(new PointDragger(getOuterPoint, setNewRadius, draggerStyle));






                    return draggers;

                };


            };

            // this module only exports the constructor for StraightLine objects
            return Circle;

        })); // define




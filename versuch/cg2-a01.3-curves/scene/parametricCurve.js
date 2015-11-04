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
define(["util", "vec2", "Scene", "Point", "Line"],
        (function (util, vec2, Scene, Point, Line) {

            "use strict";

            /**
             *  A simple straight line that can be dragged
             *  around by its endpoints.
             *  Parameters:
             *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
             *  - lineStyle: object defining width and color attributes for line drawing,
             *       begin of the form { width: 2, color: "#00FF00" }
             */

            var ParametricCurve = function (xFunction, yFunction, min_t, max_t, segments, lineStyle) {

                console.log("creating parametric curve");

                // draw style for drawing the line
                this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
                
                this.points = [];
                this.xFunction = xFunction;
                this.yFunction = yFunction;
                this.min_t = min_t || 0;
                this.max_t = max_t || 1;
                this.segments = segments;
                
                try {
                    if (min_t < max_t) {
                        for (var i = 0; i <= this.segments; i++) {
                            var t = min_t + (this.max_t - this.min_t) / this.segments * i;
                            var p = [eval(this.xFunction), eval(this.yFunction)];
                            this.points.push(p);
                        }
                    } else {
                        throw "t-max must be bigger than t-min";
                    }
                } catch (err) {
                    alert("There is an error..");
                }

                // draw this line into the provided 2D rendering context
                this.draw = function (context) {

                    // draw actual line
                    context.beginPath();

                    // set points to be drawn
                    context.moveTo(this.points[0][0], this.points[0][1]);
                    for (var i = 1; i < this.points.length; i++) {
                        context.lineTo(this.points[i][0], this.points[i][1]);
                    }

                    // set drawing style
                    context.lineWidth = this.lineStyle.width;
                    context.strokeStyle = this.lineStyle.color;

                    // actually start drawing
                    context.stroke();
                    
                    console.log("Curve is drawn.");

                };

                // test whether the mouse position is on this line segment
                this.isHit = function (context, pos) {
                    
                    for (var i = 1; i < this.points.length; i++) {
                        var segment = new Line(this.points[i-1], this.points[i]);
                        if (segment.isHit(context, pos)) {
                            console.log("YES");
                            return true;
                            
                        }
                    }
                    console.log("NO");
                    return false;

//                    // project point on line, get parameter of that projection point
//                    var t = vec2.projectPointOnLine(pos, this.p0, this.p1);
//
//                    // outside the line segment?
//                    if (t < 0.0 || t > 1.0) {
//                        return false;
//                    }
//
//                    // coordinates of the projected point
//                    var p = vec2.add(this.p0, vec2.mult(vec2.sub(this.p1, this.p0), t));
//
//                    // distance of the point from the line
//                    var d = vec2.length(vec2.sub(p, pos));
//
//                    // allow 2 pixels extra "sensitivity"
//                    return d <= (this.lineStyle.width / 2) + 2;

                };

                // return list of draggers to manipulate this line
                this.createDraggers = function () {
                    return [];
                };


            };

            // this module only exports the constructor for StraightLine objects
            return ParametricCurve;

        })); // define



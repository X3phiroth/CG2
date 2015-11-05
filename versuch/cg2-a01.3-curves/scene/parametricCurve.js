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
define(["util", "vec2", "Scene", "Line"],
        (function (util, vec2, Scene, Line) {

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

                // draw style for drawing the line
                this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

                this.points = [];
                this.xFunction = xFunction;
                this.yFunction = yFunction;
                this.min_t = min_t || 0;
                this.max_t = max_t || 1;
                this.segments = segments;
                this.checkedValue = false;

                // draw this line into the provided 2D rendering context
                this.draw = function (context) {

                    this.fillPoints();

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

                    if (this.checkedValue) {
                        context.beginPath();
                        for (var i = 1; i < segments; i++) {
                            //Mitte des Segments
                            var part = vec2.sub(points[(i + 1)], points[(i - 1)]);
                            var norm = [-part[1], part[0]];
                            var normalized = vec2.mult(norm, (1 / vec2.length(norm)));
                            var tick0 = vec2.add(points[i], vec2.mult(normalized, 10));
                            var tick1 = vec2.sub(points[i], vec2.mult(normalized, 10));
                            context.moveTo(tick0[0], tick0[1]);
                            context.lineTo(tick1[0], tick1[1]);
                        }
                        ;
                        // draw style
                        context.lineWidth = 1;
                        context.strokeStyle = "#123456";
                        // start drawing
                        context.stroke();
                    }

                };

                this.drawCurve = function (context, points, segment, marks) {
                    this.points = points;
                    
                    //start drawing the curve
                    context.beginPath();
                    
                    context.moveTo(points[0][0], points[0][1]);
                    for (var i = 1; i < points.length; i++) {
                            context.lineTo(points[i][0], points[i][1]);
                    };
                    
                    // set drawing style
                    context.lineWidth = this.lineStyle.width;
                    context.strokeStyle = this.lineStyle.color;

                    // start drawing
                    context.stroke();

                    if (this.checkedValue) {
                        context.beginPath();
                        for (var i = 1; i < segment; i++) {
                            //Mitte des Segments
                            var temp = vec2.sub(points[(i + 1)], points[(i - 1)]);
                            var norm = [temp[1] * (-1), temp[0]];
                            var normalized = vec2.mult(norm, (1 / vec2.length(norm)));
                            var tick0 = vec2.add(points[i], vec2.mult(normalized, 10));
                            var tick1 = vec2.sub(points[i], vec2.mult(normalized, 10));
                            context.moveTo(tick0[0], tick0[1]);
                            context.lineTo(tick1[0], tick1[1]);
                        }
                        ;
                        context.lineWidth = 1;
                        context.strokeStyle = "#123456";
                        // start drawing
                        context.stroke();
                    }
                };

                // test whether the mouse position is on this line segment
                this.isHit = function (context, pos) {

                    for (var i = 1; i < this.points.length; i++) {
                        var segment = new Line(this.points[i - 1], this.points[i]);
                        if (segment.isHit(context, pos)) {
                            return true;
                        }
                    }
                    return false;
                };

                // return list of draggers to manipulate this line
                this.createDraggers = function () {
                    return [];
                };

                this.fillPoints = function () {
                    try {
                        if (min_t < max_t) {
                            this.points = [];
                            for (var i = 0; i <= this.segments; i++) {
                                var t = min_t + (this.max_t - this.min_t) / this.segments * i;
                                var p = [eval(this.xFunction), eval(this.yFunction)];
                                this.points.push(p);
                            }
                        } else {
                            throw "t-max must be bigger than t-min";
                        }
                    } catch (err) {
                        alert(err.message);
                        return;
                    }
                };

            };

            // this module only exports the constructor for StraightLine objects
            return ParametricCurve;

        })); // define



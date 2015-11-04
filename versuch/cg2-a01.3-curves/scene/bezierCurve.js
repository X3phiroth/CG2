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
define(["util", "vec2", "Scene", "Point", "Line", "PointDragger"],
        (function (util, vec2, Scene, Point, Line, PointDragger) {

            "use strict";

            /**
             *  A simple straight line that can be dragged
             *  around by its endpoints.
             *  Parameters:
             *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
             *  - lineStyle: object defining width and color attributes for line drawing,
             *       begin of the form { width: 2, color: "#00FF00" }
             */

            var BezierCurve = function (p0, p1, p2, p3, renders, t, lineStyle) {

                console.log("creating parametric curve");

                // draw style for drawing the line
                this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
                
                this.p0 = p0 || [100, 200];
                this.p1 = p1 || [250, 50];
                this.p2 = p2 || [300, 200];
                this.p3 = p3 || [250, 350];
                this.renders = renders;
                this.t = t;
                this.points = [];
                
                

                // draw this line into the provided 2D rendering context
                this.draw = function (context) {

                    this.calcPoints(this.p0, this.p1, this.p2, this.p3, renders)

                    context.beginPath();

                    // set points to be drawn
                    context.moveTo(this.p0[0], this.p0[1]);
                    for (var i = 0; i < this.points.length; i++) {
                        context.lineTo(this.points[i][0], this.points[i][1]);
                    }
                    context.lineTo(this.p3[0], this.p3[1]);

                    // set drawing style
                    context.lineWidth = this.lineStyle.width;
                    context.strokeStyle = this.lineStyle.color;

                    // actually start drawing
                    context.stroke();
                    
                    console.log("Curve is drawn.");

                };

                // test whether the mouse position is on this line segment
                this.isHit = function (context, pos) {

                    // project point on line, get parameter of that projection point
                    var t = vec2.projectPointOnLine(pos, this.p0, this.p1);

                    // outside the line segment?
                    if (t < 0.0 || t > 1.0) {
                        return false;
                    }

                    // coordinates of the projected point
                    var p = vec2.add(this.p0, vec2.mult(vec2.sub(this.p1, this.p0), t));

                    // distance of the point from the line
                    var d = vec2.length(vec2.sub(p, pos));

                    // allow 2 pixels extra "sensitivity"
                    return d <= (this.lineStyle.width / 2) + 2;

                };

                // return list of draggers to manipulate this line
                this.createDraggers = function () {

                    var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}
                    var draggers = [];

                    // create closure and callbacks for dragger
                    var _curve = this;
                    var getP0 = function () {
                        return _curve.p0;
                    };
                    var getP1 = function () {
                        return _curve.p1;
                    };
                    var getP2 = function () {
                        return _curve.p2;
                    };
                    var getP3 = function () {
                        return _curve.p3;
                    };
                    var setP0 = function (dragEvent) {
                        _curve.p0 = dragEvent.position;
                    };
                    var setP1 = function (dragEvent) {
                        _curve.p1 = dragEvent.position;
                    };
                    var setP2 = function (dragEvent) {
                        _curve.p2 = dragEvent.position;
                    };
                    var setP3 = function (dragEvent) {
                        _curve.p3 = dragEvent.position;
                    };
                    draggers.push(new PointDragger(getP0, setP0, draggerStyle));
                    draggers.push(new PointDragger(getP1, setP1, draggerStyle));
                    draggers.push(new PointDragger(getP2, setP2, draggerStyle));
                    draggers.push(new PointDragger(getP3, setP3, draggerStyle));

                    return draggers;

                };
                
                this.calcPoints = function(p0, p1, p2, p3, depth) {
                    var a0 = [(1-this.t)*p0[0]+this.t*p1[0], (1-this.t)*p0[1]+this.t*p1[1]];
                    var a1 = [(1-this.t)*p1[0]+this.t*p2[0], (1-this.t)*p1[1]+this.t*p2[1]];
                    var a2 = [(1-this.t)*p2[0]+this.t*p3[0], (1-this.t)*p2[1]+this.t*p3[1]];
                    
                    var b0 = [(1-this.t)*a0[0]+this.t*a1[0], (1-this.t)*a0[1]+this.t*a1[1]];
                    var b1 = [(1-this.t)*a1[0]+this.t*a2[0], (1-this.t)*a1[1]+this.t*a2[1]];
                    
                    var c0 = [(1-this.t)*b0[0]+this.t*b1[0], (1-this.t)*b0[1]+this.t*b1[1]];
                    
                    this.points.push(c0);
                    
                    if (depth > 0) {
                        this.calcPoints(p0, a0, b0, c0, depth - 1);
                        this.calcPoints(c0, b1, a2, p3, depth - 1);
                    }
                }


            };

            // this module only exports the constructor for StraightLine objects
            return BezierCurve;

        })); // define



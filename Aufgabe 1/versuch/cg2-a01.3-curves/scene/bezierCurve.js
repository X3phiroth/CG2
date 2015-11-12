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
define(["util", "vec2", "Scene", "Line", "PointDragger", "ParametricCurve", "PolygonDragger"],
        (function (util, vec2, Scene, Line, PointDragger, ParametricCurve, PolygonDragger) {

            "use strict";

            /**
             *  A simple straight line that can be dragged
             *  around by its endpoints.
             *  Parameters:
             *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
             *  - lineStyle: object defining width and color attributes for line drawing,
             *       begin of the form { width: 2, color: "#00FF00" }
             */

            var BezierCurve = function (p0, p1, p2, p3, segments, min_t, max_t, lineStyle) {

                // draw style for drawing the line
                this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
                
                this.p0 = p0 || [100, 200];
                this.p1 = p1 || [250, 50];
                this.p2 = p2 || [300, 200];
                this.p3 = p3 || [250, 350];
                this.segments = segments || 20;

                this.b0 = function (t) {
                    return Math.pow(1 - t, 3);
                }

                this.b1 = function (t) {
                    return 3 * Math.pow(1 - t, 2) * t;
                }

                this.b2 = function (t) {
                    return 3 * (1 - t) * Math.pow(t, 2);
                }

                this.b3 = function (t) {
                    return Math.pow(t, 3);
                }
                //function of bezier curve with the polygon points and polynoms
                this.evaluate = function (coord, t) {
                    return (this.b0(t) * this.p0[coord]) + 
                            (this.b1(t) * this.p1[coord]) + 
                            (this.b2(t) * this.p2[coord]) + 
                            (this.b3(t) * this.p3[coord]);
                };

                this.min_t = min_t;
                this.max_t = max_t;

                this.innerCurve = new ParametricCurve(xFunction, yFunction,
                        min_t, max_t, segments, lineStyle);

                this.checkedValue = function (value) {
                    this.innerCurve.checkedValue = value;
                }

                // draw this line into the provided 2D rendering context
                this.draw = function (context) {
                    this.points = [];
                    this.points.push(this.p0);
                    for (var i = 1; i <= this.segments; i++) {
                        var t = this.min_t + (this.max_t - this.min_t) / this.segments * i;
                        var px = this.evaluate(0, t);
                        var py = this.evaluate(1, t);
                        this.points.push([px, py]);
                    }
                    this.innerCurve.drawCurve(context, this.points, this.segment, this.marks);
                };

                // test whether the mouse position is on this line segment
                this.isHit = function (context, pos) {
                    return this.innerCurve.isHit(context, pos);
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

                    draggers.push(new PolygonDragger(getP0, getP1, getP2, getP3, draggerStyle));

                    return draggers;

                };
            };

            // this module only exports the constructor for StraightLine objects
            return BezierCurve;

        })); // define



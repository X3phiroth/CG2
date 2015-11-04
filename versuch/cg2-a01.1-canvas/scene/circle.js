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
define(["util", "vec2", "Scene", "PointDragger"], (function (util, vec2, Scene, PointDragger) {

    "use strict";

    /**
     *  A simple cirlcethat can be dragged around by its center.
     * @param {two digits Array} center the center of the circle [x, y]
     * @param {number} radius the radius of the circle
     * @param {object} lineStyle Object defining width and color for the line. Begin of the form { width: 2, color: "#00FF00" }
     */
    var Circle = function (center, radius, lineStyle) {

        console.log("creating a circle at [" +
                center[0] + "," + center[1] + "] with radius " +
                radius + ".");

        // draw style for drawing the line
        this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

        // initial values in case either point is undefined
        this.center = center || [10, 10];
        this.radius = radius || 50;

        // draw this line into the provided 2D rendering context
        this.draw = function (context) {

            // draw actual line
            context.beginPath();

            // set point to be drawn
            context.arc(this.center[0], this.center[1], this.radius, 0, Math.PI * 2)

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this line segment
        this.isHit = function (context, pos) {

            //length of vector from center to mouse position
            var distance = vec2.length(vec2.sub(this.center, pos));

            // adding some tollerance
            var min = this.radius - 2;
            var max = this.radius + 2;

            return distance >= min && distance <= max;
        };

        // return list of draggers to manipulate this line
        this.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}
            var draggers = [];

            // create closure and callbacks for dragger
            var _circle = this;
            var getP0 = function () {
                return _circle.center;
            };
            var getP1 = function () {
                return [_circle.center[0] + _circle.radius, _circle.center[1]];
            };
            var setP0 = function (dragEvent) {
                _circle.center = dragEvent.position;
            };
            var setP1 = function (dragEvent) {
                _circle.p1 = dragEvent.position;
            };
            draggers.push(new PointDragger(getP0, setP0, draggerStyle));
            draggers.push(new PointDragger(getP1, setP1, draggerStyle));

            return draggers;
        };
    };
    // this module only exports the constructor for StraightLine objects
    return Circle;
})); // define



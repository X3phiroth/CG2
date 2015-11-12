/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: circle
 *
 * A circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"], (function (util, vec2, Scene, PointDragger) {

    "use strict";

    /**
     *  A simple straight line that can be dragged
     *  around by its endpoints.
     *  Parameters:
     *  - center and radius: array objects representing [x,y] coordinates of start and end point
     *  - lineStyle: object defining width and color attributes for line drawing,
     *       begin of the form { width: 2, color: "#00FF00" }
     */

    var Circle = function (center, radius, lineStyle) {

        console.log("creating circle at [" +
                center[0] + "," + center[1] + "] with radius [" +
                radius + "].");

        // draw style for drawing the line
        this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

        // initial values in case either point is undefined
        this.center = center || [10, 10];
        this.radius = radius || 40;

        // draw this line into the provided 2D rendering context
        this.draw = function (context) {

            // draw actual cirlce
            context.beginPath();

            // set points to be drawn
            context.arc(center[0], center[1], this.radius, 0, 2 * Math.PI);

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // change the color of the circle
        this.changeColor = function (color) {
            this.lineStyle.color = color;
        }
        // test whether the mouse position is on this line segment
        this.isHit = function (context, pos) {

            // project point on line, get parameter of that projection point
            var temp = vec2.sub(pos, this.center);
            var distance = vec2.length(temp);

            // allow 2 pixels extra "sensitivity"
            return distance <= (this.radius + this.lineStyle.width / 2) - 2;

        };

        // return list of draggers to manipulate this line
        this.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _circle = this;
            var getCenter = function () {
                return _circle.center;
            };
//            var getRadius = function () {
//                return [_circle.center + _circle.radius, _circle.center];
//            };
            var setCenter = function (dragEvent) {
                _circle.center = dragEvent.position;
            };
//            var setRadius = function (dragEvent) {
//                _circle.radius = vec2.length(vec2.sub(dragEvent.position, _circle.center));
//            };

            draggers.push(new PointDragger(getCenter, setCenter, draggerStyle));
//            draggers.push(new PointDragger(getRadius, setRadius, draggerStyle));

            return draggers;

        };
    };

    // this module only exports the constructor for StraightLine objects
    return Circle;

})); // define
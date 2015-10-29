/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util,vec2,Scene,PointDragger) {

        "use strict";

        /**
         *  A simple straight line that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - center and radius: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Point = function(center, radius, lineStyle) {

            console.log("creating Point at [" +
            center[0] + "," + center[1] + "] with radius [" +
            radius + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

            // initial values in case either point is undefined
            this.center = center || [10,10];
            this.radius = radius || 2;

            // draw this line into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual cirlce
                context.beginPath();

                // set points to be drawn
                context.arc(center[0], center[1],radius,0,2*Math.PI);

                // set drawing style
                context.lineWidth = 1;
                context.strokeStyle = this.lineStyle.color;
				context.fillStyle = this.lineStyle.color;
				context.fill();

                // actually start drawing
                context.stroke();

            };

            // test whether the mouse position is on this line segment
            this.isHit = function(context,pos) {

                // project point on line, get parameter of that projection point
                var t = vec2.projectPointOnLine(pos, this.p0, this.p1);

                // outside the line segment?
                if(t<0.0 || t>1.0) {
                    return false;
                }

                // coordinates of the projected point
                var p = vec2.add(this.p0, vec2.mult( vec2.sub(this.p1,this.p0), t ));

                // distance of the point from the line
                var d = vec2.length(vec2.sub(p,pos));

                // allow 2 pixels extra "sensitivity"
                return d<=(this.lineStyle.width/2)+2;

            };

            // return list of draggers to manipulate this line
            this.createDraggers = function() {

                var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
                var draggers = [];

                // create closure and callbacks for dragger
                var _point = this;
                var getP0 = function() { return _Point.center; };
 //               var getP1 = function() { return _point.p1; };
                var setP0 = function(dragEvent) { _point.center = dragEvent.position; };
 //               var setP1 = function(dragEvent) { _point.p1 = dragEvent.position; };
                draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
 //               draggers.push( new PointDragger(getP1, setP1, draggerStyle) );

                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Point;

    })); // define
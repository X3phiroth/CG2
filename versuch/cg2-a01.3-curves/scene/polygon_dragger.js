/* requireJS module definition */
define(["util", "Scene", "Line"],
        (function (Util, Scene, Line) {


            // A ControlPolygonDragger is a visible border to move a curve
            // Parameters:
            // - getPos0
            //   callback function that will return the position of p0
            // - getPos1
            //   callback function that will return the position of p1
            // - getPos2
            //   callback function that will return the position of p2
            // - getPos3
            //   callback function that will return the position of p3

            var ControlPolygonDragger = function (getPos0, getPos1, getPos2, getPos3, style) {

                // remember the callbacks
                this.getPos0 = getPos0;
                this.getPos1 = getPos1;
                this.getPos2 = getPos2;
                this.getPos3 = getPos3;

                // draw style
                this.drawStyle = style;

                // attribute queried by SceneController to recognize draggers
                this.isDragger = true;

            };

            // draw the ControlPolygonDragger as straightlines
            ControlPolygonDragger.prototype.draw = function (context) {

                // draw actual line
                context.beginPath();

                // defining the lines
                context.moveTo(this.getPos0()[0], this.getPos0()[1]);
                context.lineTo(this.getPos1()[0], this.getPos1()[1]);

                context.moveTo(this.getPos1()[0], this.getPos1()[1]);
                context.lineTo(this.getPos2()[0], this.getPos2()[1]);

                context.moveTo(this.getPos2()[0], this.getPos2()[1]);
                context.lineTo(this.getPos3()[0], this.getPos3()[1]);

                // drawing style
                context.lineWidth = 1;
                context.strokeStyle = this.drawStyle.color;

                // drawing part
                context.stroke();

            };

            // this dragger can not be hit. 
            ControlPolygonDragger.prototype.isHit = function (context, mousePos) {
                return false;
            };


            return ControlPolygonDragger;
        })); 
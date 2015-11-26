/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three"], (function (THREE) {

    "use strict";

    var ParametricSurface = function (posFunc, config) {

        var umin = config.umin || -Math.PI;
        var umax = config.umax || Math.PI;
        var vmin = config.vmin || -Math.PI;
        var vmax = config.vmax || Math.PI;
        var usegments = config.usegments || 20;
        var vsegments = config.vsegments || 10;

        this.posFunc = posFunc;

        this.positions = new Float32Array((usegments + 1) * (vsegments + 1) * 3);
        this.colors = new Float32Array((usegments + 1) * (vsegments + 1) * 3);
        this.indices = new Uint32Array((usegments + 1) * (vsegments + 1) * 5);

        var c = 0;
        for (var i = 0; i <= usegments; i++) {
            for (var j = 0; j <= vsegments; j++) {
                this.indices[c] = i * vsegments + j;
                this.indices[c + 1] = (i + 1) * vsegments + j;
                this.indices[c + 2] = (i + 1) * vsegments + j + 1;

                this.indices[c + 3] = i * vsegments + j;
                this.indices[c + 4] = (i + 1) * vsegments + j + 1;
                this.indices[c + 5] = i * vsegments + j + 1;

                c += 6;
            }
        }


        var umin_temp = 0;
        var vmin_temp = 0;

//                var c = 0;
        for (var i = 0; i <= usegments; i++) {
            umin_temp += (umax - umin) / usegments; // errechnet position u
            vmin_temp = vmin;
            for (var j = 0; j <= vsegments; j++) {
                vmin_temp += (vmax - vmin) / vsegments; // errechnet position v
                // errechnet Koordinaten, abhängig von Funktion
                this.positions[(i * vsegments + j) * 3] = this.posFunc(umin_temp, vmin_temp)[0]; // (i * vsegments + j) * 3
                //                       c++;
                this.positions[(i * vsegments + j) * 3 + 1] = this.posFunc(umin_temp, vmin_temp)[1]; // (i * vsegments + j) * 3 + 1
                //                       c++;
                this.positions[(i * vsegments + j) * 3 + 2] = this.posFunc(umin_temp, vmin_temp)[2]; // (i * vsegments + j) * 3 + 2
                //                       c++;
            }
        }

        this.color = new THREE.Color();
        this.color.setRGB(0, 0, 1);
        for (var k = 0; k < this.positions.length; k += 3) {
            this.colors[k] = this.color.r;
            this.colors[k + 1] = this.color.g;
            this.colors[k + 2] = this.color.b;
        }

        this.getPositions = function () {
            return this.positions;
        };

        this.getColors = function () {
            return this.colors;
        };

        this.getIndices = function () {
            return this.indices;
        };

    };

    return ParametricSurface;
}));


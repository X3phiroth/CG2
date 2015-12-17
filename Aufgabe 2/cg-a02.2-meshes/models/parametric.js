/**
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

        var uMin = config.uMin || -Math.PI;
        var uMax = config.uMax || Math.PI;
        var vMin = config.vMin || -Math.PI;
        var vMax = config.vMax || Math.PI;
        var uSegments = config.uSegments || 20;
        var vSegments = config.vSegments || 10;

        this.positions = new Float32Array((uSegments + 1) * (vSegments + 1) * 3);
        this.colors = new Float32Array(this.positions.length);
        this.indices = new Uint32Array(uSegments * vSegments * 6);
        
        this.color = new THREE.Color();
        this.color.setRGB(0, 0, 1);

        var c = 0;
        for (var u = 0, i = 0, c = 0; u < uSegments; u++) {
            for (var v = 0; v < vSegments; v++) {
                this.indices[i++] = c;
                this.indices[i++] = c + vSegments + 2;
                this.indices[i++] = c + 1;

                this.indices[i++] = c;
                this.indices[i++] = c + vSegments + 1;
                this.indices[i++] = c + vSegments + 2;
                c++;
            }
            c++;
        }

        var uStep = (uMax - uMin) / uSegments;
        var vStep = (vMax - vMin) / vSegments;
        var i = 0;

        //durch die veränderte formel für die U-zuweisung wird ein Rundungsfehler vermieden
        //nach jeder Schleife wird segmentStep neu berechnet
        //und damit der Maxwert von u und v auch berechnet wird ist die verkürzte if-Anweisung im Schleifenkopf da
        for (var u = uMin; u <= uMax; u += uStep) {
            for (var v = vMin; v <= vMax; v += vStep) {

                var pos = posFunc(u, v);

                this.positions[i++] = pos[0];
                this.colors[i] = this.color.r;
                this.positions[i++] = pos[1];
                this.colors[i] = this.color.g;
                this.positions[i++] = pos[2];
                this.colors[i] = this.color.b;
            }
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
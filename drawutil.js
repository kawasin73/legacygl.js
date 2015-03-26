"use strict";

function get_drawutil(gl, legacygl) {
    var drawutil = {};
    drawutil.xyzaxis = function() {
        legacygl.begin(gl.LINES);
        legacygl.color(1, 0, 0);    legacygl.vertex(0, 0, 0);    legacygl.vertex(1, 0, 0);
        legacygl.color(0, 1, 0);    legacygl.vertex(0, 0, 0);    legacygl.vertex(0, 1, 0);
        legacygl.color(0, 0, 1);    legacygl.vertex(0, 0, 0);    legacygl.vertex(0, 0, 1);
        legacygl.end();
    };
    drawutil.xygrid = function(size) {
        legacygl.begin(gl.LINES);
        for (var i = -size; i <= size; ++i) {
            legacygl.vertex(i, -size, 0);
            legacygl.vertex(i,  size, 0);
            legacygl.vertex(-size, i, 0);
            legacygl.vertex( size, i, 0);
        }
        legacygl.end();
    };
    drawutil.yzgrid = function(size) {
        legacygl.begin(gl.LINES);
        for (var i = -size; i <= size; ++i) {
            legacygl.vertex(0, i, -size);
            legacygl.vertex(0, i,  size);
            legacygl.vertex(0, -size, i);
            legacygl.vertex(0,  size, i);
        }
        legacygl.end();
    };
    drawutil.zxgrid = function(size) {
        legacygl.begin(gl.LINES);
        for (var i = -size; i <= size; ++i) {
            legacygl.vertex(i, 0, -size);
            legacygl.vertex(i, 0,  size);
            legacygl.vertex(-size, 0, i);
            legacygl.vertex( size, 0, i);
        }
        legacygl.end();
    };
    drawutil.quadmesh = function(mode, vertices, faces) {
        legacygl.begin(mode == "line" ? gl.LINES : legacygl.QUADS);
        for (var f = 0; f < faces.length / 4; ++f) {
            for (var i = 0; i < 4; ++i) {
                var v0 = faces[4 * f + i];
                var x0 = vertices[3 * v0];
                var y0 = vertices[3 * v0 + 1];
                var z0 = vertices[3 * v0 + 2];
                legacygl.vertex(x0, y0, z0);
                if (mode == "line") {
                    var v1 = faces[4 * f + (i + 1) % 4];
                    var x1 = vertices[3 * v1];
                    var y1 = vertices[3 * v1 + 1];
                    var z1 = vertices[3 * v1 + 2];
                    legacygl.vertex(x1, y1, z1);
                }
            }
        }
        legacygl.end();
    };
    drawutil.trimesh = function(mode, vertices, faces) {
        legacygl.begin(mode == "line" ? gl.LINES : gl.TRIANGLES);
        for (var f = 0; f < faces.length / 3; ++f) {
            for (var i = 0; i < 3; ++i) {
                var v0 = faces[3 * f + i];
                var x0 = vertices[3 * v0];
                var y0 = vertices[3 * v0 + 1];
                var z0 = vertices[3 * v0 + 2];
                legacygl.vertex(x0, y0, z0);
                if (mode == "line") {
                    var v1 = faces[3 * f + (i + 1) % 3];
                    var x1 = vertices[3 * v1];
                    var y1 = vertices[3 * v1 + 1];
                    var z1 = vertices[3 * v1 + 2];
                    legacygl.vertex(x1, y1, z1);
                }
            }
        }
        legacygl.end();
    };
    drawutil.cube = function(mode, size) {
        var r = size / 2;
        this.quadmesh(mode, 
            [ // vertices
            -r, -r, -r,
             r, -r, -r,
            -r,  r, -r,
             r,  r, -r,
            -r, -r,  r,
             r, -r,  r,
            -r,  r,  r,
             r,  r,  r
            ], [ // faces
            1, 3, 7, 5, // positive-x
            3, 2, 6, 7, // positive-y
            2, 0, 4, 6, // negative-x
            0, 1, 5, 4, // negative-y
            4, 5, 7, 6, // positive-z
            0, 2, 3, 1  // negative-z
            ]
        );
    };
    return drawutil;
};

"use strict";

mat4.adjoint_ip = function(a) { mat4.adjoint(a, a); };
mat4.invert_ip = function(a) { mat4.invert(a, a); };
mat4.multiply_ip = function(a, b) { mat4.multiply(a, a, b); };
mat4.rotate_ip = function(a, rad, axis) { mat4.rotate(a, a, rad, axis); };
mat4.rotateX_ip = function(a, rad) { mat4.rotateX(a, a, rad); };
mat4.rotateY_ip = function(a, rad) { mat4.rotateY(a, a, rad); };
mat4.rotateZ_ip = function(a, rad) { mat4.rotateZ(a, a, rad); };
mat4.scale_ip = function(a, v) { mat4.scale(a, a, v); };
mat4.translate_ip = function(a, v) { mat4.translate(a, a, v); };
mat4.transpose_ip = function(a) { mat4.transpose(a, a); };
mat4.ortho2d = function(a, left, right, bottom, top) { mat4.ortho(a, left, right, bottom, top, -1, 1); };

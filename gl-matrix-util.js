"use strict";

// mat2 in-place versions
mat2.adjoint_ip = function(a) { return mat2.adjoint(a, a); };
mat2.invert_ip = function(a) { return mat2.invert(a, a); };
mat2.mul_ip = function(a, b) { return mat2.mul(a, a, b); };
mat2.multiply_ip = function(a, b) { return mat2.multiply(a, a, b); };
mat2.rotate_ip = function(a, rad) { return mat2.rotate(a, a, rad); };
mat2.scale_ip = function(a, v) { return mat2.scale(a, a, v); };
mat2.translate_ip = function(a, v) { return mat2.translate(a, a, v); };
mat2.transpose_ip = function(a) { return mat2.transpose(a, a); };

// mat3 in-place versions
mat3.adjoint_ip = function(a) { return mat3.adjoint(a, a); };
mat3.invert_ip = function(a) { return mat3.invert(a, a); };
mat3.mul_ip = function(a, b) { return mat3.mul(a, a, b); };
mat3.multiply_ip = function(a, b) { return mat3.multiply(a, a, b); };
mat3.rotate_ip = function(a, rad) { return mat3.rotate(a, a, rad); };
mat3.scale_ip = function(a, v) { return mat3.scale(a, a, v); };
mat3.translate_ip = function(a, v) { return mat3.translate(a, a, v); };
mat3.transpose_ip = function(a) { return mat3.transpose(a, a); };

// mat4 in-place versions
mat4.adjoint_ip = function(a) { return mat4.adjoint(a, a); };
mat4.invert_ip = function(a) { return mat4.invert(a, a); };
mat4.mul_ip = function(a, b) { return mat4.mul(a, a, b); };
mat4.multiply_ip = function(a, b) { return mat4.multiply(a, a, b); };
mat4.rotate_ip = function(a, rad, axis) { return mat4.rotate(a, a, rad, axis); };
mat4.rotateX_ip = function(a, rad) { return mat4.rotateX(a, a, rad); };
mat4.rotateY_ip = function(a, rad) { return mat4.rotateY(a, a, rad); };
mat4.rotateZ_ip = function(a, rad) { return mat4.rotateZ(a, a, rad); };
mat4.scale_ip = function(a, v) { return mat4.scale(a, a, v); };
mat4.translate_ip = function(a, v) { return mat4.translate(a, a, v); };
mat4.transpose_ip = function(a) { return mat4.transpose(a, a); };

// glu
mat4.ortho2d = function(a, left, right, bottom, top) { return mat4.ortho(a, left, right, bottom, top, -1, 1); };

// vec2 in-place versions
vec2.add_ip = function(a, b) { return vec2.add(a, a, b); };
vec2.div_ip = function(a, b) { return vec2.div(a, a, b); };
vec2.divide_ip = function(a, b) { return vec2.divide(a, a, b); };
vec2.lerp_ip = function(a, b, t) { return vec2.lerp(a, a, b, t); };
vec2.max_ip = function(a, b) { return vec2.max(a, a, b); };
vec2.min_ip = function(a, b) { return vec2.min(a, a, b); };
vec2.mul_ip = function(a, b) { return vec2.mul(a, a, b); };
vec2.multiply_ip = function(a, b) { return vec2.multiply(a, a, b); };
vec2.negate_ip = function(a) { return vec2.negate(a, a); };
vec2.normalize_ip = function(a) { return vec2.normalize(a, a); };
vec2.scale_ip = function(a, b) { return vec2.scale(a, a, b); };
vec2.scaleAndAdd_ip = function(a, b, scale) { return vec2.scaleAndAdd(a, a, b, scale); };
vec2.sub_ip = function(a, b) { return vec2.sub(a, a, b); };
vec2.subtract_ip = function(a, b) { return vec2.subtract(a, a, b); };
vec2.transformMat2_ip = function(a, m) { return vec2.transformMat2(a, a, m); };
vec2.transformMat2d_ip = function(a, m) { return vec2.transformMat2d(a, a, m); };
vec2.transformMat3_ip = function(a, m) { return vec2.transformMat3(a, a, m); };
vec2.transformMat4_ip = function(a, m) { return vec2.transformMat4(a, a, m); };

// vec3 in-place versions
vec3.add_ip = function(a, b) { return vec3.add(a, a, b); };
vec3.cross_ip = function(a, b) { return vec3.cross(a, a, b); };
vec3.div_ip = function(a, b) { return vec3.div(a, a, b); };
vec3.divide_ip = function(a, b) { return vec3.divide(a, a, b); };
vec3.lerp_ip = function(a, b, t) { return vec3.lerp(a, a, b, t); };
vec3.max_ip = function(a, b) { return vec3.max(a, a, b); };
vec3.min_ip = function(a, b) { return vec3.min(a, a, b); };
vec3.mul_ip = function(a, b) { return vec3.mul(a, a, b); };
vec3.multiply_ip = function(a, b) { return vec3.multiply(a, a, b); };
vec3.negate_ip = function(a) { return vec3.negate(a, a); };
vec3.normalize_ip = function(a) { return vec3.normalize(a, a); };
vec3.scale_ip = function(a, b) { return vec3.scale(a, a, b); };
vec3.scaleAndAdd_ip = function(a, b, scale) { return vec3.scaleAndAdd(a, a, b, scale); };
vec3.sub_ip = function(a, b) { return vec3.sub(a, a, b); };
vec3.subtract_ip = function(a, b) { return vec3.subtract(a, a, b); };
vec3.transformMat3_ip = function(a, m) { return vec3.transformMat3(a, a, m); };
vec3.transformMat4_ip = function(a, m) { return vec3.transformMat4(a, a, m); };
vec3.transformQuat_ip = function(a, q) { return vec3.transformQuat(a, a, q); };

// vec4 in-place versions
vec4.add_ip = function(a, b) { return vec4.add(a, a, b); };
vec4.div_ip = function(a, b) { return vec4.div(a, a, b); };
vec4.divide_ip = function(a, b) { return vec4.divide(a, a, b); };
vec4.lerp_ip = function(a, b, t) { return vec4.lerp(a, a, b, t); };
vec4.max_ip = function(a, b) { return vec4.max(a, a, b); };
vec4.min_ip = function(a, b) { return vec4.min(a, a, b); };
vec4.mul_ip = function(a, b) { return vec4.mul(a, a, b); };
vec4.multiply_ip = function(a, b) { return vec4.multiply(a, a, b); };
vec4.negate_ip = function(a) { return vec4.negate(a, a); };
vec4.normalize_ip = function(a) { return vec4.normalize(a, a); };
vec4.scale_ip = function(a, b) { return vec4.scale(a, a, b); };
vec4.scaleAndAdd_ip = function(a, b, scale) { return vec4.scaleAndAdd(a, a, b, scale); };
vec4.sub_ip = function(a, b) { return vec4.sub(a, a, b); };
vec4.subtract_ip = function(a, b) { return vec4.subtract(a, a, b); };
vec4.transformMat4_ip = function(a, m) { return vec4.transformMat4(a, a, m); };
vec4.transformQuat_ip = function(a, q) { return vec4.transformQuat(a, a, q); };

// quat in-place versions
quat.add_ip = function(a, b) { return quat.add(a, a, b); };
quat.calculateW_ip = function(a) { return quat.calculateW(a, a); };
quat.conjugate_ip = function(a) { return quat.conjugate(a, a); };
quat.invert_ip = function(a) { return quat.invert(a, a); };
quat.lerp_ip = function(a, b, t) { return quat.lerp(a, a, b, t); };
quat.mul_ip = function(a, b) { return quat.mul(a, a, b); };
quat.multiply_ip = function(a, b) { return quat.multiply(a, a, b); };
quat.normalize_ip = function(a) { return quat.normalize(a, a); };
quat.rotateX_ip = function(a, rad) { return quat.rotateX(a, a, rad); };
quat.rotateY_ip = function(a, rad) { return quat.rotateY(a, a, rad); };
quat.rotateZ_ip = function(a, rad) { return quat.rotateZ(a, a, rad); };
quat.scale_ip = function(a, b) { return quat.scale(a, a, b); };
quat.slerp_ip = function(a, b, t) { return quat.slerp(a, a, b, t); };

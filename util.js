"use strict";

function project(obj_xyz, modelview, projection, viewport) {
    // object coordinate to normalized decive coordinate
    var m = mat4.mul([], projection, modelview);
    var ndc = vec4.transformMat4([], [obj_xyz[0], obj_xyz[1], obj_xyz[2], 1], m);
    vec4.scale_ip(ndc, 1 / ndc[3]);
    // normalized device coordinate to viewport coordinate
    var win_x = (ndc[0] + 1) * viewport[2] / 2 + viewport[0];
    var win_y = (ndc[1] + 1) * viewport[3] / 2 + viewport[1];
    var win_z = (ndc[2] + 1) / 2;
    return [win_x, win_y, win_z];
};

function unproject(win_xyz, modelview, projection, viewport) {
    // viewport coordinate to normalized device coordinate
    var ndc_x = (win_xyz[0] - viewport[0]) * 2 / viewport[2] - 1;
    var ndc_y = (win_xyz[1] - viewport[1]) * 2 / viewport[3] - 1;
    var ndc_z =  win_xyz[2] * 2 - 1;
    var ndc = [ndc_x, ndc_y, ndc_z, 1];
    // normalized decive coordinate to object coordinate
    var m = mat4.mul([], projection, modelview);
    mat4.invert_ip(m);
    var obj_xyzw = vec4.transformMat4([], ndc, m);
    vec4.scale_ip(obj_xyzw, 1 / obj_xyzw[3]);
    return [obj_xyzw[0], obj_xyzw[1], obj_xyzw[2]];
};

HTMLCanvasElement.prototype.get_mousepos = function(event) {
    // http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = this;
    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)
    var x = event.pageX - totalOffsetX;
    var y = event.pageY - totalOffsetY;
    return [x, this.height - y];
};
HTMLCanvasElement.prototype.aspect_ratio = function() {
    return this.width / this.height;
};

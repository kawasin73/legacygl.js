"use strict";

function get_camera(viewport_width, viewport_height) {
    var camera = {};
    camera.eye = [0, 0, 1];
    camera.center = [0, 0, 0];
    camera.up = [0, 1, 0];
    camera.center_to_eye = function() {
        return vec3.sub([], this.eye, this.center);
    };
    camera.eye_to_center = function() {
        return vec3.sub([], this.center, this.eye);
    };
    camera.right = function() {
        return vec3.normalize([], vec3.cross([], this.eye_to_center(), this.up));
    };
    camera.lookAt = function(modelview_matrix) {
        mat4.lookAt(modelview_matrix, this.eye, this.center, this.up);
    };
    camera.mode = "none";
    camera.is_moving = function() {
        return this.mode != "none";
    };
    camera.start_moving = function(x, y, mode) {
        this.prev_x = x;
        this.prev_y = y;
        this.mode = mode;
    };
    camera.move = function(x, y) {
        var viewport_size = (viewport_width + viewport_height) / 2;
        if (this.mode == "rotate") {
            var theta_x = 2 * Math.PI * (x - this.prev_x) / viewport_size;
            var theta_y = 2 * Math.PI * (y - this.prev_y) / viewport_size;
            var rot_hrz = quat.setAxisAngle([], this.up, -theta_x);
            var rot_vrt = quat.setAxisAngle([], this.right(), -theta_y);
            var rot = quat.mul([], rot_vrt, rot_hrz);
            this.eye = vec3.add([], this.center, vec3.transformQuat([], this.center_to_eye(), rot));
            this.up = vec3.transformQuat([], this.up, rot);
        } else if (this.mode == "pan") {
            var r = vec3.len(this.center_to_eye());
            var d0 = vec3.scale([], this.right(), -r * (x - this.prev_x) / viewport_size);
            var d1 = vec3.scale([], this.up, r * (y - this.prev_y) / viewport_size);
            var d = vec3.add([], d0, d1);
            this.eye = vec3.add([], this.eye, d);
            this.center = vec3.add([], this.center, d);
        } else if (this.mode == "zoom") {
            var d = vec3.scale([], this.eye_to_center(), (x - this.prev_x + y - this.prev_y) / viewport_size);
            this.eye = vec3.add([], this.eye, d);
        }
        this.prev_x = x;
        this.prev_y = y;
    };
    camera.finish_moving = function() {
        this.mode = "none";
    };
    return camera;
}

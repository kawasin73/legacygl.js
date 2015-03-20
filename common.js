"use strict";

function get_drawutil(gl, legacygl) {
    var drawutil = {};
    drawutil.fill_and_line = function(drawfunc, fill_color, line_color) {
        gl.enable(gl.POLYGON_OFFSET_FILL);
        legacygl.color(fill_color[0], fill_color[1], fill_color[2]);
        drawfunc("fill");
        gl.disable(gl.POLYGON_OFFSET_FILL);
        legacygl.color(line_color[0], line_color[1], line_color[2]);
        drawfunc("line");
    };
    drawutil.trimesh = function(mode, vertices, faces) {
        legacygl.begin(gl[mode == "line" ? "LINES" : "TRIANGLES"]);
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
        this.trimesh(mode, 
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
            1, 3, 7, 7, 5, 1, // positive-x
            3, 2, 6, 6, 7, 3, // positive-y
            2, 0, 4, 4, 6, 2, // negative-x
            0, 1, 5, 5, 4, 0, // negative-y
            4, 5, 7, 7, 6, 4, // positive-z
            0, 2, 3, 3, 1, 0  // negative-z
            ]
        );
    };
    return drawutil;
};

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
};

function get_shader(gl, vertex_shader_src, fragment_shader_src) {
    var shader = {};
    // vertex shader
    shader.vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader.vertex_shader, vertex_shader_src);
    gl.compileShader(shader.vertex_shader);
    if (!gl.getShaderParameter(shader.vertex_shader, gl.COMPILE_STATUS))
        alert(gl.getShaderInfoLog(shader.vertex_shader));
    // fragment shader
    shader.fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader.fragment_shader, fragment_shader_src);
    gl.compileShader(shader.fragment_shader);
    if (!gl.getShaderParameter(shader.fragment_shader, gl.COMPILE_STATUS))
        alert(gl.getShaderInfoLog(shader.fragment_shader));
    // shader program
    shader.program = gl.createProgram();
    gl.attachShader(shader.program, shader.vertex_shader);
    gl.attachShader(shader.program, shader.fragment_shader);
    gl.linkProgram(shader.program);
    gl.useProgram(shader.program);
    if (!gl.getProgramParameter(shader.program, gl.LINK_STATUS))
        alert("Could not initialise shaders");
    // utility for uniforms
    shader.uniforms = {};
    shader.add_uniform = function(name, type) {
        this.uniforms[name] = {};
        this.uniforms[name].location = gl.getUniformLocation(this.program, "u_" + name);
        this.uniforms[name].type = type;
        this.uniforms[name].value =
            type == "1f" || type == "1i" ? 0 :
            type == "2f" || type == "2i" ? vec2.create() :
            type == "3f" || type == "3i" ? vec3.create() :
            type == "4f" || type == "4i" ? vec4.create() :
            type == "Matrix2f" ? mat2.create() :
            type == "Matrix3f" ? mat3.create() :
            type == "Matrix4f" ? mat4.create() :
            undefined;
        this.uniforms[name].stack = [];
        this.uniforms[name].push = function(){
            var copy =
                type == "1f" || type == "1i" ? this.value :
                type == "2f" || type == "2i" ? vec2.copy([], this.value) :
                type == "3f" || type == "3i" ? vec3.copy([], this.value) :
                type == "4f" || type == "4i" ? vec4.copy([], this.value) :
                type == "Matrix2f" ? mat2.copy([], this.value) :
                type == "Matrix3f" ? mat3.copy([], this.value) :
                type == "Matrix4f" ? mat4.copy([], this.value) :
                undefined;
            this.stack.push(copy);
        };
        this.uniforms[name].pop = function(){
            var copy = this.stack[this.stack.length - 1];
            this.value =
                type == "1f" || type == "1i" ? copy :
                type == "2f" || type == "2i" ? vec2.copy([], copy) :
                type == "3f" || type == "3i" ? vec3.copy([], copy) :
                type == "4f" || type == "4i" ? vec4.copy([], copy) :
                type == "Matrix2f" ? mat2.copy([], copy) :
                type == "Matrix3f" ? mat3.copy([], copy) :
                type == "Matrix4f" ? mat4.copy([], copy) :
                undefined;
            this.stack.pop();
        };
    };
    shader.set_uniforms = function() {
        for (var name in this.uniforms) {
            var type = this.uniforms[name].type;
            var func_name = "uniform" + type;
            if (type != "1f" && type != "1i")
                func_name += "v";
            if (type == "Matrix2f" || type == "Matrix3f" || type == "Matrix4f") {
                gl[func_name](this.uniforms[name].location, false, this.uniforms[name].value);
            }
            else
                gl[func_name](this.uniforms[name].location, this.uniforms[name].value);
        }
    };
    return shader;
};

function get_legacygl(gl, shader_program) {
    var legacygl = {};
    
    // vertex attributes
    legacygl.vertex_attributes = {};
    legacygl.add_vertex_attribute = function(name, size) {
        this.vertex_attributes[name] = {};
        this.vertex_attributes[name].size = size;
        // current value
        this.vertex_attributes[name].current = [];
        for (var i = 0; i < size; ++i)
            this.vertex_attributes[name].current[i] = 0;
        // shader location
        this.vertex_attributes[name].location = gl.getAttribLocation(shader_program, "a_" + name);
        gl.enableVertexAttribArray(this.vertex_attributes[name].location);
        // current value setter
        this[name] = function() {
            for (var i = 0; i < size; ++i)
                this.vertex_attributes[name].current[i] = arguments[i];
        };
    };
    // special treatment for position attribute
    legacygl.add_vertex_attribute("position", 3);
    delete legacygl.position;
    delete legacygl.vertex_attributes.position.current;
    legacygl.vertex = function(x, y, z) {
        for (var name in this.vertex_attributes) {
            var push_value = name == "position" ? [x, y, z] : this.vertex_attributes[name].current;
            for (var i = 0; i < this.vertex_attributes[name].size; ++i)
                this.vertex_attributes[name].array.push(push_value[i]);
        }
    };
    // begin and end
    legacygl.begin = function(mode) {
        this.mode = mode;
        // clear array
        for (var name in this.vertex_attributes)
            this.vertex_attributes[name].array = [];
    };
    legacygl.end = function() {
        for (var name in this.vertex_attributes) {
            this.vertex_attributes[name].buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_attributes[name].buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex_attributes[name].array), gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.vertex_attributes[name].location, this.vertex_attributes[name].size, gl.FLOAT, false, 0, 0);
        }
        gl.drawArrays(this.mode, 0, this.vertex_attributes.position.array.length / 3);
        for (var name in this.vertex_attributes)
            gl.deleteBuffer(this.vertex_attributes[name].buffer);
    };
    return legacygl;
}

"use strict";

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
    return shader;
};

function get_legacygl(gl, shader_program) {
    var legacygl = {};
    // legacygl.current_color = [1, 1, 1, 1];
    // legacygl.current_normal = [0, 0, 1];
    // legacygl.current_texcoord = [0, 0];
    legacygl.is_valid = false;
    // legacygl.a_position = gl.getAttribLocation(shader_program, "a_position");
    // legacygl.a_color = gl.getAttribLocation(shader_program, "a_color");
    // legacygl.a_normal = gl.getAttribLocation(shader_program, "a_normal");
    // legacygl.a_texcoord = gl.getAttribLocation(shader_program, "a_texcoord");
    // gl.enableVertexAttribArray(legacygl.a_position);
    // gl.enableVertexAttribArray(legacygl.a_color);
    // gl.enableVertexAttribArray(legacygl.a_normal);
    // gl.enableVertexAttribArray(legacygl.a_texcoord);
    
    legacygl.vertex_attributes = {};
    legacygl.add_vertex_attribute = function(attrib_name, attrib_size) {
        var vertex_attribute = {};
        vertex_attribute.size = attrib_size;
        // array and buffer
        vertex_attribute.array = [];
        vertex_attribute.buffer = gl.createBuffer();
        // current value
        vertex_attribute.current = [];
        for (var i = 0; i < attrib_size; ++i)
            vertex_attribute.current[i] = 0;
        // shader location
        vertex_attribute.location = gl.getAttribLocation(shader_program, "a_" + attrib_name);
        gl.enableVertexAttribArray(vertex_attribute.location);
        // register
        this.vertex_attributes[attrib_name] = vertex_attribute;
        this[attrib_name] = function() {
            for (var i = 0; i < attrib_size; ++i)
                this.vertex_attributes[attrib_name].current[i] = arguments[i];
        };
        
    };
    // special treatment for position attribute
    legacygl.add_vertex_attribute("position", 3);
    delete legacygl.position;
    delete legacygl.vertex_attributes.position.current;
    legacygl.vertex3 = function(x, y, z) {
        for (var attrib_name in this.vertex_attributes) {
            var vertex_attribute = this.vertex_attributes[attrib_name];
            var push_value = attrib_name == "position" ? [x, y, z] : this.vertex_attributes[attrib_name].current;
            for (var i = 0; i < vertex_attribute.size; ++i)
                vertex_attribute.array.push(push_value[i]);
        }
    };
    legacygl.vertex2 = function(x, y) {
        this.vertex3(x, y, 0);
    };
    // begin and end
    legacygl.begin = function(mode) {
        this.mode = mode;
        // clear array
        for (var attrib_name in this.vertex_attributes)
            this.vertex_attributes[attrib_name].array = [];
    };
    legacygl.end = function() {
        for (var attrib_name in this.vertex_attributes) {
            var vertex_attribute = this.vertex_attributes[attrib_name];
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_attribute.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attribute.array), gl.STATIC_DRAW);
        }

        // // position
        // this.buffer_position = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_position);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_position), gl.STATIC_DRAW);
        // // color
        // this.buffer_color = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_color);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_color), gl.STATIC_DRAW);
        // // normal
        // this.buffer_normal = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_normal);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_normal), gl.STATIC_DRAW);
        // // texcoord
        // this.buffer_texcoord = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_texcoord);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.array_texcoord), gl.STATIC_DRAW);
    };
    legacygl.draw = function(draw_func) {
        if (!this.is_valid) {
            draw_func();
            this.is_valid = true;
        }
        for (var attrib_name in this.vertex_attributes) {
            var vertex_attribute = this.vertex_attributes[attrib_name];
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_attribute.buffer);
            gl.vertexAttribPointer(vertex_attribute.location, vertex_attribute.size, gl.FLOAT, false, 0, 0);
        }
        // // position
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_position);
        // gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);
        // // color
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_color);
        // gl.vertexAttribPointer(this.a_color, 4, gl.FLOAT, false, 0, 0);
        // // normal
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_normal);
        // gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);
        // // texcoord
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer_texcoord);
        // gl.vertexAttribPointer(this.a_texcoord, 2, gl.FLOAT, false, 0, 0);
        // draw
        gl.drawArrays(this.mode, 0, this.vertex_attributes.position.array.length / 3);
    };
    legacygl.invalidate = function() {
        this.is_valid = false;
    };
    return legacygl;
}

"use strict";

function get_legacygl(gl, vertex_shader_src, fragment_shader_src) {
    var legacygl = {};
    
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
        alert("Could not initialize shaders!");
    legacygl.shader = shader;
    
    // utility for uniforms
    legacygl.uniforms = {};
    legacygl.add_uniform = function(name, type) {
        this.uniforms[name] = {};
        this.uniforms[name].location = gl.getUniformLocation(this.shader.program, "u_" + name);
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
    legacygl.set_uniforms = function() {
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
    
    // utility for vertex attributes
    legacygl.vertex_attributes = [];
    legacygl.add_vertex_attribute = function(name, size) {
        var vertex_attribute = { name: name, size: size };
        // initialize current value with 0
        vertex_attribute.current = [];
        for (var i = 0; i < size; ++i)
            vertex_attribute.current.push(0);
        // register current value setter func
        this[name] = function() {
            for (var i = 0; i < size; ++i)
                vertex_attribute.current[i] = arguments[i];
        };
        // shader location
        vertex_attribute.location = gl.getAttribLocation(this.shader.program, "a_" + name);
        gl.enableVertexAttribArray(vertex_attribute.location);
        // add to the list
        this.vertex_attributes.push(vertex_attribute);
    };
    // special treatment for vertex position attribute
    legacygl.add_vertex_attribute("vertex", 3);
    delete legacygl.vertex_attributes[0].current;
    legacygl.vertex = function(x, y, z) {
        this.vertex_attributes.forEach(function(vertex_attribute) {
            var value = vertex_attribute.name == "vertex" ? [x, y, z] : vertex_attribute.current;
            for (var i = 0; i < vertex_attribute.size; ++i)
                vertex_attribute.array.push(value[i]);
        });
        // emulate GL_QUADS
        var num_vertices = this.vertex_attributes[0].array.length / 3;
        if (this.mode == this.QUADS && num_vertices % 6 == 4) {         // 6 vertices per quad (= 2 triangles)
            var v0 = num_vertices - 4;
            // add 2 vertices identical to [v0] and [v0+2] to construct the other half of the quad
            for (var k = 0; k < 3; ++k) {
                if (k == 1)
                    continue;
                this.vertex_attributes.forEach(function(vertex_attribute) {
                    for (var i = 0; i < vertex_attribute.size; ++i)
                        vertex_attribute.array.push(vertex_attribute.array[vertex_attribute.size * (v0 + k) + i]);
                });
            }
        }
    };
    // begin and end
    legacygl.begin = function(mode) {
        this.mode = mode;
        this.vertex_attributes.forEach(function(vertex_attribute) {
            vertex_attribute.array = [];
        });
    };
    legacygl.end = function() {
        this.vertex_attributes.forEach(function(vertex_attribute) {
            vertex_attribute.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_attribute.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attribute.array), gl.STATIC_DRAW);
            gl.vertexAttribPointer(vertex_attribute.location, vertex_attribute.size, gl.FLOAT, false, 0, 0);
        });
        // emulate GL_QUADS
        gl.drawArrays(this.mode == this.QUADS ? gl.TRIANGLES : this.mode, 0, this.vertex_attributes[0].array.length / 3);
        this.vertex_attributes.forEach(function(vertex_attribute) {
            gl.deleteBuffer(vertex_attribute.buffer);
        });
    };
    // emulate GL_QUADS
    legacygl.QUADS = "GL_QUADS";
    return legacygl;
}

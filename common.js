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
            this.stack.push(this.value);
        };
        this.uniforms[name].pop = function(){
            this.value = this.stack[this.stack.length - 1];
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

function get_displist(gl, shader_program) {
    var displist = {};
    
    // vertex attributes
    displist.vertex_attributes = {};
    displist.add_vertex_attribute = function(name, size) {
        this.vertex_attributes[name] = {};
        this.vertex_attributes[name].size = size;
        // array and buffer
        this.vertex_attributes[name].buffer = gl.createBuffer();
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
    displist.add_vertex_attribute("position", 3);
    delete displist.position;
    delete displist.vertex_attributes.position.current;
    displist.vertex3 = function(x, y, z) {
        for (var name in this.vertex_attributes) {
            var push_value = name == "position" ? [x, y, z] : this.vertex_attributes[name].current;
            for (var i = 0; i < this.vertex_attributes[name].size; ++i)
                this.vertex_attributes[name].array.push(push_value[i]);
        }
    };
    displist.vertex2 = function(x, y) {
        this.vertex3(x, y, 0);
    };
    // begin and end
    displist.begin = function(mode) {
        this.mode = mode;
        // clear array
        for (var name in this.vertex_attributes)
            this.vertex_attributes[name].array = [];
    };
    displist.end = function() {
        for (var name in this.vertex_attributes) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_attributes[name].buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex_attributes[name].array), gl.STATIC_DRAW);
        }
    };
    // draw call with displaylist-like mechanism
    displist.set_drawfunc = function(drawfunc) {
        this.drawfunc = drawfunc;
        this.is_valid = false;
    };
    displist.draw = function() {
        if (!this.is_valid) {
            this.drawfunc();
            this.is_valid = true;
        }
        for (var name in this.vertex_attributes) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_attributes[name].buffer);
            gl.vertexAttribPointer(this.vertex_attributes[name].location, this.vertex_attributes[name].size, gl.FLOAT, false, 0, 0);
        }
        gl.drawArrays(this.mode, 0, this.vertex_attributes.position.array.length / 3);
    };
    displist.invalidate = function() {
        this.is_valid = false;
    };
    return displist;
}

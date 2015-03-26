# legacygl.js #

**legacygl.js** is a small library based on WebGL with the aim of enabling a good-old-days legacy 
OpenGL style coding using deprecated APIs (e.g., glBegin, glColor3d, glTexCoord2d, glPushMatrix).

### Hello World 3D ###

```
#!html
<html>

<head>
<title>legacygl.js demo: hello world 3D</title>
<script src="../gl-matrix.js"></script>
<script src="../gl-matrix-util.js"></script>
<script src="../legacygl.js"></script>
<script src="../camera.js"></script>
<script src="../util.js"></script>
<script type="text/javascript">
var gl;
var canvas;
var shader;
var legacygl;
var drawutil;
var camera;

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // projection and camera positioning
    mat4.perspective(shader.uniforms.projection.value, 30 * Math.PI / 180, canvas.width / canvas.height, 0.1, 1000);
    var modelview = shader.uniforms.modelview;
    camera.lookAt(modelview.value);
    shader.set_uniforms();
    // draw zx-grid
    legacygl.color(0.5, 0.5, 0.5);
    drawutil.zxgrid(50);
    // draw quad
    mat4.rotateY_ip(modelview.value, 1.1);
    shader.set_uniforms();
    legacygl.color(0, 0.7, 1);
    legacygl.begin(legacygl.QUADS);
    legacygl.vertex(1, 0, 0);
    legacygl.vertex(0.5, 1, 0);
    legacygl.vertex(0, 1, 0.5);
    legacygl.vertex(0, 0, 1);
    legacygl.end();
};
function init() {
    canvas = document.getElementById("canvas");
    gl = canvas.getContext("experimental-webgl");
    if (!gl)
        alert("Could not initialize WebGL!");
    var vertex_shader_src = "\
        attribute vec3 a_vertex;\
        attribute vec3 a_color;\
        varying vec3 v_color;\
        uniform mat4 u_modelview;\
        uniform mat4 u_projection;\
        void main(void) {\
            gl_Position = u_projection * u_modelview * vec4(a_vertex, 1.0);\
            v_color = a_color;\
        }\
        ";
    var fragment_shader_src = "\
        precision mediump float;\
        varying vec3 v_color;\
        void main(void) {\
            gl_FragColor = vec4(v_color, 1.0);\
        }\
        ";
    shader = get_shader(gl, vertex_shader_src, fragment_shader_src);
    shader.add_uniform("modelview", "Matrix4f");
    shader.add_uniform("projection", "Matrix4f");
    legacygl = get_legacygl(gl, shader.program);
    legacygl.add_vertex_attribute("color", 3);
    drawutil = get_drawutil(gl, legacygl);
    camera = get_camera(canvas.width);
    camera.eye = [40, 20, 30];
    canvas.onmousedown = function(evt) {
        camera.start_moving(this.get_mousepos(evt), evt.shiftKey ? "zoom" : evt.ctrlKey ? "pan" : "rotate");
    };
    canvas.onmousemove = function(evt) {
        if (camera.is_moving()) {
            camera.move(this.get_mousepos(evt));
            draw();
        }
    };
    document.onmouseup = function(evt) {
        if (camera.is_moving())
            camera.finish_moving();
    };
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1, 1, 1, 1);
};
</script>
</head>
<body onload="init(); draw();">
    <h2>legacygl.js demo: hello world 3D</h2>
    <canvas id="canvas" width="640" height="480" style="border:1px solid #000000;"></canvas>
    <h3>camera control:</h3>
    <ul>
        <li>drag: rotate
        <li>shift+drag: zoom
        <li>ctrl+drag: pan
    </ul>
</body>
</html>
```
http://htmlpreview.github.io/?https://bitbucket.org/kenshi84/legacygl.js/raw/85702b11f61e7ea2b40655655cb92664ad0e01b4/examples/hello3d.html

### Demos ###
- Hello World in 2D: 
- Z-Buffer: http://htmlpreview.github.io/?https://bitbucket.org/kenshi84/legacygl.js/raw/85702b11f61e7ea2b40655655cb92664ad0e01b4/examples/z-buffer.html
- Object picking / moving in 3D:

### Documentation ###
* Tutorial: Shader Variables

### Contact:###
[Kenshi Takayama](http://research.nii.ac.jp/~takayama/)
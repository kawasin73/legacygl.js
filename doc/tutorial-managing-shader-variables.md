# Managing Shader Variables #

The `legacygl` object is tightly coupled with its shader program, and takes care of the process of sending the shader variables (uniform/attribute) data to the GPU.

## Example Vertex Shader Code ##
```
#!glsl
// the only mandatory vertex attribute
attribute vec3 a_vertex;
// all other uniform/attribute vars are at your will
uniform int u_myint;
uniform float u_myfloat;
uniform vec2i u_myvec2i;
uniform mat4 u_mymat4;
attribute float a_myfloat;
attribute vec3 a_myvec3;
void main(void) {
    gl_Position = vec4(a_vertex, 1.0);
}
```

## Uniform Variables ##

Each uniform variable used in the shader needs to be registered to `legacygl` by calling
```
#!javascript
legacygl.add_uniform(name, type);
```

`name` is the same as the one used in the GLSL code without the prefix `u_`, and `type` must be one of the following: `"1f"`, `"2f"`, `"3f"`, `"4f"`, `"1i"`, `"2i"`, `"3i"`, `"4i"`, `"Matrix2f"`, `"Matrix3f"`, and `"Matrix4f"`. For the above example code, the registration process would be:
```
#!javascript
legacygl.add_uniform("myint", "1i");
legacygl.add_uniform("myfloat", "1f");
legacygl.add_uniform("myvec2i", "2i");
legacygl.add_uniform("mymat4", "Matrix4f");
```

This automatically creates an entry for each variable, e.g., `legacygl.myint`, and you can access the actual data on the CPU via `legacygl.myint.value` which is just a number for scalars or a [glMatrix](http://glmatrix.net) object for vectors and matrices.
The transfer of these uniform variables data to GPU occurs when
```
#!javascript
legacygl.set_uniforms();
```
is called, but this is implicitly called inside `legacygl.begin()` and `legacygl.callList()`, so you don't need to call it yourself. `legacygl` also provides a simple push/pop mechanism (much like `glPushMatrix/glPopMatrix`) for each variable:
```
#!javascript
legacygl.myint.push();
legacygl.myint.value = 3;
drawfunc();
legacygl.myint.pop();
drawfunc();
```

## Vertex Attribute Variables ##

Each vertex attribute variable is registered to `legacygl` by calling
```
#!javascript
legacygl.add_vertex_attribute(name, size);
```
where `name` is the same as the one in the shader code without the prefix `a_`, and `size` is the number of numbers per vertex (e.g., 9 for `mat3`). For the above example code, the registration process would be:
```
#!javascript
legacygl.add_vertex_attribute("myfloat", 1);
legacygl.add_vertex_attribute("myvec3", 3);
```
This automatically creates a function for each variable that changes its "current value". For example, you can do something like:
```
#!javascript
legacygl.myfloat(0.2);
legacygl.begin(gl.TRIANGLES);
legacygl.myvec3(1, -2, 3);
legacygl.vertex(0, 0, 0);

legacygl.myvec3(2, 3, 0);
legacygl.vertex(1, 0, 0);

legacygl.myfloat(-0.5);
legacygl.vertex(0, 0, 1);
legacygl.end();
```
Note that the `vertex` attribute is mandatory and is treated differently; there's no "current value" for it, and every time `legacygl.vertex(x, y, z)` is called, the vertex position along with its all other attribute data are appended to the arrays stored inside `legacygl` (which are then passed to the GPU when `legacygl.end()` is called).
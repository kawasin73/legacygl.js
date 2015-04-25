"use strict";

var meshio = {};
meshio.read_obj = function(file_content) {
    var mesh = make_halfedge_mesh();
    var points = [];
    file_content.split("\n").forEach(function(line) {
        var tokens = line.trim().split(" ");
        if (tokens.length < 4 || tokens[0].startsWith("#")) return;
        var head = tokens[0];
        if (head == "v") {
            var x = parseFloat(tokens[1]);
            var y = parseFloat(tokens[2]);
            var z = parseFloat(tokens[3]);
            points.push(x, y, z);
        } else if (head == "f") {
            var fv_indices = [];
            for (var i = 1; i < tokens.length; ++i)
                fv_indices.push(parseInt(tokens[i]) - 1);
            mesh.add_face(fv_indices);
        }
    });
    for (var i = 0; i < points.length / 3; ++i) {
        var x = points[3 * i];
        var y = points[3 * i + 1];
        var z = points[3 * i + 2];
        mesh.vertices[i].point = [x, y, z];
    }
    mesh.init_ids();
    mesh.init_boundaries();
    return mesh;
};
meshio.read_off = function(file_content) {
    var mesh = make_halfedge_mesh();
    var magic;
    var num_vertices;
    var num_faces;
    var points = [];
    var lines = file_content.split("\n");
    var cnt_vertices = 0;
    var cnt_faces = 0;
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var tokens = line.trim().split(" ");
        if (tokens.length == 0 || tokens[0].startsWith("#")) continue;
        if (!magic) {
            if (tokens[0] != "OFF") {
                console.log("Bad magic: " + tokens[0]);
                return;
            }
            magic = true;
        } else if (!num_vertices) {
            num_vertices = parseInt(tokens[0]);
            num_faces = parseInt(tokens[1]);
        } else if (cnt_vertices < num_vertices) {
            var x = parseFloat(tokens[0]);
            var y = parseFloat(tokens[1]);
            var z = parseFloat(tokens[2]);
            points.push(x, y, z);
            ++cnt_vertices;
        } else if (cnt_faces < num_faces) {
            var fv_indices = [];
            for (var j = 1; j < tokens.length; ++j)
                fv_indices.push(parseInt(tokens[j]));
            if (parseInt(tokens[0]) != fv_indices.length)
                console.log("Inconsistent face-vertex count: " + tokens);
            mesh.add_face(fv_indices);
            ++cnt_faces;
        }
    };
    if (cnt_faces != num_faces)
        console.log("Inconsistent face count: " + num_faces + " as declared vs " + cnt_faces + " found");
    for (var i = 0; i < points.length / 3; ++i) {
        var x = points[3 * i];
        var y = points[3 * i + 1];
        var z = points[3 * i + 2];
        mesh.vertices[i].point = [x, y, z];
    }
    mesh.init_ids();
    mesh.init_boundaries()();
    return mesh;
};
meshio.read = function(filename, content) {
    var file_extension = filename.toLowerCase().slice(-4);
    if (file_extension == ".obj")
        return meshio.read_obj(content);
    if (file_extension == ".off")
        return meshio.read_off(content);
    console.log("Unsupported format: " + file_extension);
};
meshio.write_obj = function(mesh) {
    var lines = [];
    return lines.join("");
};
meshio.write_off = function(mesh) {
    var lines = [];
    return lines.join("");
};
meshio.write = function(mesh, filename) {
    // TODO
};

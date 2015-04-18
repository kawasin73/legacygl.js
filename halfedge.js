"use strict";

function get_halfedge_mesh() {
    var mesh = {
        vertices : [],
        faces    : [],
        halfedges: {},
        edges    : {},
    };
    mesh.add_face = function(fv_indices) {
        var face = {};
        for (var k = 0; k < fv_indices.length; ++k) {
            var i = fv_indices[k];
            var j = fv_indices[(k + 1) % fv_indices.length];
            // two vertices
            var vi = mesh.vertices[i];
            var vj = mesh.vertices[j];
            if (!vi) vi = mesh.vertices[i] = {};
            if (!vj) vj = mesh.vertices[j] = {};
            // edge and two halfedges
            var hij_key = i + ":" + j;
            var hji_key = j + ":" + i;
            var eij_key = Math.min(i, j) + ":" + Math.max(i, j);
            var eij = mesh.edges[eij_key];
            var hij, hji;
            if (!eij) {
                hij = mesh.halfedges[hij_key] = { face: null };
                hji = mesh.halfedges[hji_key] = { face: null };
                eij = mesh.edges[eij_key] = [hij, hji];
            } else {
                hij = mesh.halfedges[hij_key];
                hji = mesh.halfedges[hji_key];
            }
            // connectivity around vertices
            vi.halfedge = hij;
            vj.halfedge = hji;
            // connectivity around halfedges
            hij.from = vi;  hij.to = vj;
            hji.from = vj;  hji.to = vi;
            hij.opposite = hji;
            hji.opposite = hij;
            hij.edge = hji.edge = eij;
            if (hij.face)
                console.log("nonmanifold detected at edge (" + [i, j] + ")");
            hij.face = face;
            // connectivity around face
            face.halfedge = hij;
        }
        // set prev/next for halfedges
        for (var k = 0; k < fv_indices.length; ++k) {
            var i0 = fv_indices[k];
            var i1 = fv_indices[(k + 1) % fv_indices.length];
            var i2 = fv_indices[(k + 2) % fv_indices.length];
            var h0 = mesh.halfedges[i0 + ":" + i1];
            var h1 = mesh.halfedges[i1 + ":" + i2];
            h0.next = h1;
            h1.prev = h0;
        }
        this.faces.push(face);
    };
    mesh.halfedges_array = function() {
        var result = [];
        Object.keys(this.halfedges).forEach(function(key) {
            result.push(this.halfedges[key]);
        });
        return result;
    };
    mesh.edges_array = function() {
        var result = [];
        Object.keys(this.edges).forEach(function(key) {
            result.push(this.edges[key]);
        });
        return result;
    };
    return mesh;
};

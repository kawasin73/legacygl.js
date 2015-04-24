"use strict";

function make_halfedge_mesh() {
    var mesh = {
        vertices : [],
        faces    : [],
        halfedges: {},
        edges    : {},
    };
    mesh.add_face = function(fv_indices) {
        // element constructors >>>>
        function make_vertex() {
            var vertex = {
                halfedge: null,
            };
            vertex.outgoing_halfedges = function() {
                var result = [];
                var h = this.halfedge;
                while (true) {
                    result.push(h);
                    h = h.opposite.next;
                    if (h == this.halfedge) break;
                }
                return result;
            };
            vertex.incoming_halfedges = function() {
                return this.outgoing_halfedges().map(function(h) { return h.opposite; });
            };
            vertex.vertices = function() {
                return this.outgoing_halfedges().map(function(h) { return h.vertex; });
            };
            vertex.faces = function() {
                return this.outgoing_halfedges().map(function(h) { return h.face; });
            };
            vertex.edges = function() {
                return this.outgoing_halfedges().map(function(h) { return h.edge; });
            };
            return vertex;
        };
        function make_face() {
            var face = {
                halfedge: null
            };
            face.halfedges = function() {
                var result = [];
                var h = this.halfedge;
                while (true) {
                    result.push(h);
                    h = h.next;
                    if (h == this.halfedge) break;
                }
                return result;
            };
            face.vertices = function() {
                return this.halfedges().map(function(h) { return h.vertex; });
            };
            face.faces = function() {
                return this.halfedges().map(function(h) { return h.opposite.face; });
            };
            face.edges = function() {
                return this.halfedges().map(function(h) { return h.edge; });
            };
            return face;
        };
        function make_halfedge() {
            var halfedge = {
                vertex: null,
                face: null,
                edge: null,
                next: null,
                prev: null,
                opposite: null
            };
            halfedge.from_vertex = function() {
                return this.opposite.vertex;
            };
            return halfedge;
        };
        function make_edge() {
            var edge = {
                halfedge: null
            };
            edge.halfedges = function() {
                return [this.halfedge, this.halfedge.opposite];
            };
            edge.vertices = function() {
                return this.halfedges().map(function(h) { return h.vrtex; });
            };
            edge.faces = function() {
                return this.halfedges().map(function(h) { return h.face; });
            };
            return edge;
        };
        // <<<< element constructors
        var face = make_face();
        for (var k = 0; k < fv_indices.length; ++k) {
            var i = fv_indices[k];
            var j = fv_indices[(k + 1) % fv_indices.length];
            // two vertices
            var vi = mesh.vertices[i];
            var vj = mesh.vertices[j];
            if (!vi) vi = mesh.vertices[i] = make_vertex();
            if (!vj) vj = mesh.vertices[j] = make_vertex();
            // edge and two halfedges
            var hij_key = i + ":" + j;
            var hji_key = j + ":" + i;
            var eij_key = Math.min(i, j) + ":" + Math.max(i, j);
            var eij = mesh.edges[eij_key];
            var hij, hji;
            if (!eij) {
                hij = mesh.halfedges[hij_key] = make_halfedge();
                hji = mesh.halfedges[hji_key] = make_halfedge();
                eij = mesh.edges[eij_key] = make_edge();
            } else {
                hij = mesh.halfedges[hij_key];
                hji = mesh.halfedges[hji_key];
            }
            // connectivity around vertices
            vi.halfedge = hij;
            vj.halfedge = hji;
            // connectivity around halfedges
            hij.vertex = vj;
            hji.vertex = vi;
            hij.opposite = hji;
            hji.opposite = hij;
            hij.edge = hji.edge = eij;
            eij.halfedge = hij;
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
    mesh.halfedges_forEach = function(func) {
        Object.keys(this.halfedges).forEach(function(key, index) {
            func(mesh.halfedges[key], index);
        });
    };
    mesh.edges_forEach = function(func) {
        Object.keys(this.edges).forEach(function(key, index) {
            func(mesh.edges[key], index);
        });
    };
    mesh.set_ids = function() {
        this.vertices.forEach(function(v, i) { v.id = i; });
        this.faces.forEach(function(f, i) { f.id = i; });
        this.edges_forEach(function(e, i) { e.id = i; });
        this.halfedges_forEach(function(h, i) { h.id = i; });
    };
    return mesh;
};

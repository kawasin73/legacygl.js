"use strict";

function make_boundingbox() {
    var bbox = {};
    bbox.set_empty = function() {
        this.min = [ Number.MAX_VALUE,  Number.MAX_VALUE,  Number.MAX_VALUE];
        this.max = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];
    };
    bbox.set_empty();
    bbox.extend = function(p) {
        this.min = numeric.min(this.min, p);
        this.max = numeric.max(this.max, p);
    };
    bbox.diagonal = function() {
        return numeric.sub(this.max, this.min);
    };
    bbox.diagonal_norm = function() {
        return numeric.norm2(this.diagonal());
    };
    bbox.center = function() {
        return numeric.mul(numeric.add(this.max, this.min), 0.5);
    };
    bbox.is_empty = function() {
        return !numeric.all(numeric.geq(this.max, this.min));
    };
    return bbox;
}

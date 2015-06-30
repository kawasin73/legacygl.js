"use strict";

HTMLCanvasElement.prototype.get_mousepos = function(event, flip_y) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    for(var currentElement = this; currentElement; currentElement = currentElement.offsetParent) {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    for(var currentElement = this; currentElement && currentElement != document.body; currentElement = currentElement.parentElement) {
        totalOffsetX -= currentElement.scrollLeft;
        totalOffsetY -= currentElement.scrollTop;
    }
    var x = event.pageX - totalOffsetX;
    var y = event.pageY - totalOffsetY;
    if (flip_y === undefined || flip_y)         // flip y by default
        y = this.height - y;
    return [x, y];
};
HTMLCanvasElement.prototype.aspect_ratio = function() {
    return this.width / this.height;
};
function verify_filename_extension(filename, supported_extensions) {
    var given_extension = filename.toLowerCase().slice(-4);
    if (supported_extensions.some(function (x) { return x == given_extension; }))
        return given_extension;
    alert("Supported formats are: " + supported_extensions);
    return undefined;
};

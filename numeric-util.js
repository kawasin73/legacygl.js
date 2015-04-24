"use strict";

numeric.zero = function(rows, cols) {
    var A = Array(rows);
    for (var i = 0; i < rows; ++i) {
        A[i] = Array(cols);
        for (var j = 0; j < cols; ++j)
            A[i][j] = 0;
    }
    return A;
}

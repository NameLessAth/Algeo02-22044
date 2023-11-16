"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function panjangVector(V) {
    var sum = 0;
    V.forEach(function (elmt) {
        sum += (elmt * elmt);
    });
    return Math.sqrt(sum);
}
function CosineSimiliarity(V1, V2) {
    var dotProd = 0;
    if ((panjangVector(V1) === 0) || (panjangVector(V2) === 0)) {
        if (panjangVector(V1) === panjangVector(V2))
            return 1;
        else
            return 0;
    }
    V1.forEach(function (elmt, index) {
        dotProd += elmt * V2[index];
    });
    return (dotProd / (panjangVector(V1) * panjangVector(V2)));
}
exports.default = CosineSimiliarity;

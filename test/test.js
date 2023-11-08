"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CBIR = exports.extractEntropy = exports.extractHomogeneity = exports.extractContrast = exports.debugGLCM = exports.createGLCM = void 0;
var Jimp = require('jimp');
// import CosineSimiliarity from './CosineSimiliarity';
var createGLCM = function (image, distanceX, distanceY) {
    var numRows = image.getHeight();
    var numCols = image.getWidth();
    var glcm = Array.from({ length: 256 }, function (number) { return Array(256).fill(0); });
    for (var i = 0; i < numRows; ++i) {
        for (var j = 0; j < numCols; ++j) {
            if (i + distanceY < numRows && j + distanceX < numCols) {
                var val1 = image.getPixelColor(j, i);
                var val2 = image.getPixelColor(j + distanceX, i + distanceY);
                var r1 = Math.floor((val1 / 65536) % 256);
                var g1 = Math.floor((val1 / 256) % 256);
                var b1 = val1 % 256;
                var r2 = Math.floor((val2 / 65536) % 256);
                var g2 = Math.floor((val2 / 256) % 256);
                var b2 = val2 % 256;
                var gray1 = Math.round(0.299 * r1 + 0.587 * g1 + 0.114 * b1);
                var gray2 = Math.round(0.299 * r2 + 0.587 * g2 + 0.114 * b2);
                glcm[gray1][gray2] += 1;
            }
        }
    }
    return glcm;
};
exports.createGLCM = createGLCM;
var debugGLCM = function (imageSrc, distanceX, distanceY) {
    var image = Jimp.read(imageSrc);
    var glcm = (0, exports.createGLCM)(image, distanceX, distanceY);
    for (var i = 0; i < glcm.length; i++) {
        for (var j = 0; j < glcm[i].length; j++) {
            console.log("GLCM[".concat(i, "][").concat(j, "]: ").concat(glcm[i][j]));
        }
    }
};
exports.debugGLCM = debugGLCM;
var extractContrast = function (imagePath) {
    var image = Jimp.read(imagePath);
    var textureContrast = [];
    var glcm = (0, exports.createGLCM)(image, 1, 1);
    var contrast = 0;
    for (var i = 0; i < glcm.length; i++) {
        for (var j = 0; j < glcm[i].length; j++) {
            var currContrast = Math.pow(i - j, 2) * glcm[i][j];
            contrast += currContrast;
        }
    }
    textureContrast.push(contrast);
    return textureContrast;
};
exports.extractContrast = extractContrast;
var extractHomogeneity = function (imagePath) {
    var image = Jimp.read(imagePath);
    var textureHomogeneity = [];
    var glcm = (0, exports.createGLCM)(image, 1, 1);
    var homogen = 0;
    for (var i = 0; i < glcm.length; i++) {
        for (var j = 0; j < glcm[i].length; j++) {
            var currHomogen = glcm[i][j] / (1 + Math.pow(i - j, 2));
            homogen += currHomogen;
        }
    }
    textureHomogeneity.push(homogen);
    return textureHomogeneity;
};
exports.extractHomogeneity = extractHomogeneity;
var extractEntropy = function (imagePath) {
    var image = Jimp.read(imagePath);
    var textureEntropy = [];
    var glcm = (0, exports.createGLCM)(image, 1, 1);
    var entropy = 0;
    for (var i = 0; i < glcm.length; i++) {
        for (var j = 0; j < glcm[i].length; j++) {
            var currEntropy = glcm[i][j] * Math.log(glcm[i][j]);
            entropy += currEntropy;
        }
    }
    textureEntropy.push(entropy);
    return textureEntropy;
};
exports.extractEntropy = extractEntropy;
var CBIR = function (imagePath, database) {
    var imageContrast = (0, exports.extractContrast)(imagePath);
    var imageHomogeneity = (0, exports.extractHomogeneity)(imagePath);
    var imageEntropy = (0, exports.extractEntropy)(imagePath);
};
exports.CBIR = CBIR;
(0, exports.debugGLCM)("0.jpg", 0.2, 0.2);

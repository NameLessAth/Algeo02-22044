"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToGrayScale = void 0;
var _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
function extractImageToMatrix(imagePath) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, ctx, image, imageData, data, width, height, matrix, i, row, j, position, _a, r, g, b, a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    canvas = createCanvas(256, 256);
                    ctx = canvas.getContext('2d');
                    return [4 /*yield*/, loadImage(imagePath)];
                case 1:
                    image = _b.sent();
                    ctx.drawImage(image, 0, 0, 256, 256);
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    data = imageData.data, width = imageData.width, height = imageData.height;
                    matrix = [];
                    for (i = 0; i < height; i++) {
                        row = [];
                        for (j = 0; j < width; j++) {
                            position = (i * width + j) * 4;
                            _a = data.slice(position, position + 4), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                            row.push([r, g, b]);
                        }
                        matrix.push(row);
                    }
                    return [2 /*return*/, matrix];
            }
        });
    });
}
function MatrixGray(matrixRGB) {
    return __awaiter(this, void 0, void 0, function () {
        var matrixGray, i, row, j, _a, r, g, b, gray;
        return __generator(this, function (_b) {
            matrixGray = [];
            for (i = 0; i < matrixRGB.length; i++) {
                row = [];
                for (j = 0; j < matrixRGB[i].length; j++) {
                    _a = matrixRGB[i][j], r = _a[0], g = _a[1], b = _a[2];
                    gray = rgbToGrayScale(r, g, b);
                    row.push(gray);
                }
                matrixGray.push(row);
            }
            return [2 /*return*/, matrixGray];
        });
    });
}
function quantizeMatrix(matrix) {
    var min = Math.min.apply(Math, matrix.flat());
    var max = Math.max.apply(Math, matrix.flat());
    var normalized = matrix.map(function (row) { return row.map(function (value) {
        return Math.round((value - min) * (255 / (max - min)));
    }); });
    var reshaped = new Array(256).fill().map(function () { return new Array(256).fill(0); });
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            reshaped[i][j] = normalized[i * 256 + j];
        }
    }
    var reshapedClean = reshaped.map(function (row) { return row.filter(function (value) { return value !== undefined; }); }).filter(function (row) { return row.length > 0; });
    return reshapedClean;
}
function extractContrast(matrix) {
    var min = Math.min.apply(Math, matrix.flat());
    var max = Math.max.apply(Math, matrix.flat());
    var normalized = matrix.map(function (row) { return row.map(function (value) {
        return Math.round((value - min) * (255 / (max - min)));
    }); });
    var reshaped = new Array(256).fill().map(function () { return new Array(256).fill(0); });
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            reshaped[i][j] = normalized[i * 256 + j];
        }
    }
    var contrast = new Array(256).fill().map(function () { return new Array(256).fill(0); });
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            if (i === 0 || j === 0 || i === 255 || j === 255) {
                contrast[i][j] = 0;
            }
            else {
                var left = reshaped[i - 1][j];
                var right = reshaped[i + 1][j];
                var top_1 = reshaped[i][j - 1];
                var bottom = reshaped[i][j + 1];
                var dx = (right - left) / 2;
                var dy = (bottom - top_1) / 2;
                var gradient = Math.sqrt(dx * dx + dy * dy);
                contrast[i][j] = gradient;
            }
        }
    }
    var contrastClean = contrast.map(function (row) { return row.filter(function (value) { return value !== undefined; }); }).filter(function (row) { return row.length > 0; });
    return contrastClean;
}
function rgbToGrayScale(r, g, b) {
    var grayValue = 0.299 * r + 0.587 * g + 0.114 * b;
    return grayValue;
}
exports.rgbToGrayScale = rgbToGrayScale;
function processImage() {
    return __awaiter(this, void 0, void 0, function () {
        var testFile, matrixRaw, grayMatrix, quantifizeMatrix, contrast, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    testFile = '0.jpg';
                    return [4 /*yield*/, extractImageToMatrix(testFile)];
                case 1:
                    matrixRaw = _a.sent();
                    return [4 /*yield*/, MatrixGray(matrixRaw)];
                case 2:
                    grayMatrix = _a.sent();
                    return [4 /*yield*/, quantizeMatrix(grayMatrix)];
                case 3:
                    quantifizeMatrix = _a.sent();
                    return [4 /*yield*/, extractContrast(quantifizeMatrix)];
                case 4:
                    contrast = _a.sent();
                    console.log(matrixRaw);
                    console.log("================================================");
                    console.log(grayMatrix);
                    console.log("================================================");
                    console.log(quantifizeMatrix);
                    console.log("================================================");
                    console.log(contrast);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error occurred:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
var start = performance.now();
processImage();
var end = performance.now();
console.log("Execution time: ".concat(end - start, " milliseconds"));

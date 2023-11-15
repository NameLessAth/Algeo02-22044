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
var _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
var fs = require('fs').promises;
var path = require('path');
var CosineSimiliarity_1 = require("../src/src/functions/CosineSimiliarity");
function ImageToMatrix(imagePath) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, ctx, image, imageData, data, width, height, matrix, i, row, j, position, VectorRaw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = createCanvas(256, 256);
                    ctx = canvas.getContext('2d');
                    return [4 /*yield*/, loadImage(imagePath)];
                case 1:
                    image = _a.sent();
                    ctx.drawImage(image, 0, 0, 256, 256);
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    data = imageData.data, width = imageData.width, height = imageData.height;
                    matrix = new Array(height);
                    for (i = 0; i < height; i++) {
                        row = new Array(width);
                        for (j = 0; j < width; j++) {
                            position = (i * width + j) * 4;
                            VectorRaw = [
                                data[position],
                                data[position + 1],
                                data[position + 2],
                            ];
                            // row[j] = VectorRaw;
                            row.push([VectorRaw]);
                        }
                        matrix[i] = row;
                    }
                    return [2 /*return*/, matrix];
            }
        });
    });
}
function GrayscaleMatrix(matrixRGB) {
    return __awaiter(this, void 0, void 0, function () {
        var GrayscaleMatrix, i, row, j, _a, r, g, b, gray;
        return __generator(this, function (_b) {
            GrayscaleMatrix = [];
            for (i = 0; i < matrixRGB.length; i++) {
                row = [];
                for (j = 0; j < matrixRGB[i].length; j++) {
                    _a = matrixRGB[i][j], r = _a[0], g = _a[1], b = _a[2];
                    gray = rgbToGrayScale(r, g, b);
                    row.push(gray);
                }
                GrayscaleMatrix.push(row);
            }
            return [2 /*return*/, GrayscaleMatrix];
        });
    });
}
function quantizeMatrix(matrix) {
    var flatMatrix = matrix.flat();
    var min = Math.min.apply(Math, flatMatrix);
    var max = Math.max.apply(Math, flatMatrix);
    var GrayscaleInt = flatMatrix.map(function (value) {
        return Math.round((value - min) * (255 / (max - min)));
    });
    var reshaped = new Array(256).fill(0).map(function () { return new Array(256).fill(0); });
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            reshaped[i][j] = GrayscaleInt[i * 256 + j];
        }
    }
    var reshapedClean = reshaped.filter(function (row) { return row.some(function (value) { return value !== 0; }); });
    return reshapedClean;
}
function createCoOccurrenceMatrix(matrix, distanceI, distanceJ, angle) {
    var coOccurrenceMatrix = new Array(matrix.length + 1).fill(0).map(function () { return new Array(matrix.length + 1).fill(0); });
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var currentValue = matrix[i][j];
            var neighborI = i + distanceI;
            var neighborJ = j + distanceJ;
            if (neighborI >= 0 && neighborI < matrix.length && neighborJ >= 0 && neighborJ < matrix[i].length) {
                var neighborValue = matrix[neighborI][neighborJ];
                if (currentValue >= 0 && currentValue < coOccurrenceMatrix.length &&
                    neighborValue >= 0 && neighborValue < coOccurrenceMatrix[currentValue].length) {
                    coOccurrenceMatrix[currentValue][neighborValue]++;
                }
            }
        }
    }
    return coOccurrenceMatrix;
}
function transposeMatrix(srcMatrix) {
    return srcMatrix[0].map(function (col, i) { return srcMatrix.map(function (row) { return row[i]; }); });
}
function addMatrix(matrix1, matrix2) {
    var resultMatrix = [];
    for (var i = 0; i < matrix1.length; ++i) {
        resultMatrix[i] = [];
        for (var j = 0; j < matrix1[i].length; ++j) {
            resultMatrix[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
    return resultMatrix;
}
function symmetricMatrix(matrix1, matrix2) {
    var symmetricMatrix = addMatrix(matrix1, matrix2);
    return symmetricMatrix;
}
function rgbToGrayScale(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}
function normalizeMatrix(file) {
    return __awaiter(this, void 0, void 0, function () {
        var matrixRaw, grayMatrix, quantifizeMatrix, GLCM, GLCMTranspose, resultGLCM, numRows, numCols, totalSum, normalized;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ImageToMatrix(file)];
                case 1:
                    matrixRaw = _a.sent();
                    return [4 /*yield*/, GrayscaleMatrix(matrixRaw)];
                case 2:
                    grayMatrix = _a.sent();
                    quantifizeMatrix = quantizeMatrix(grayMatrix);
                    GLCM = createCoOccurrenceMatrix(quantifizeMatrix, 0, 1, 0);
                    GLCMTranspose = transposeMatrix(GLCM);
                    resultGLCM = addMatrix(GLCM, GLCMTranspose);
                    numRows = resultGLCM.length;
                    numCols = resultGLCM[0].length;
                    totalSum = resultGLCM.reduce(function (sum, row) { return sum + row.reduce(function (rowSum, value) { return rowSum + value; }, 0); }, 0);
                    normalized = resultGLCM.map(function (row) { return row.map(function (value) { return value / totalSum; }); });
                    return [2 /*return*/, normalized];
            }
        });
    });
}
function extractContrast(matrix) {
    var contrast = 0;
    for (var i = 0; i < matrix.length; ++i) {
        for (var j = 0; j < matrix[i].length; ++j) {
            contrast += matrix[i][j] * Math.pow((i - j), 2);
        }
    }
    return contrast;
}
function extractHomogeneity(matrix) {
    var result = 0;
    for (var i = 0; i < matrix.length; ++i) {
        for (var j = 0; j < matrix[i].length; ++j) {
            result += matrix[i][j] / (1 + Math.pow(matrix[i][j], 2));
        }
    }
    return result;
}
function extractEntropy(matrix) {
    var result = 0;
    for (var i = 0; i < matrix.length; ++i) {
        for (var j = 0; j < matrix[i].length; ++j) {
            if (matrix[i][j] !== 0) {
                result += matrix[i][j] * Math.log(matrix[i][j]);
            }
        }
    }
    return -result;
}
function vectorTexture(matrix) {
    var contrast = extractContrast(matrix);
    var homogeneity = extractHomogeneity(matrix);
    var entropy = extractEntropy(matrix);
    return [contrast, homogeneity, entropy];
}
function processImage() {
    return __awaiter(this, void 0, void 0, function () {
        var matrixTest, testFile, testFile2, normalizedGLCM, normalizedGLCM2, contrast, homogeneity, entropy, contrast2, homogeneity2, entropy2, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    matrixTest = [
                        [0, 0, 1],
                        [1, 2, 3],
                        [2, 3, 2]
                    ];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    testFile = '0.jpg';
                    testFile2 = '1.jpg';
                    return [4 /*yield*/, normalizeMatrix(testFile)];
                case 2:
                    normalizedGLCM = _a.sent();
                    return [4 /*yield*/, normalizeMatrix(testFile2)];
                case 3:
                    normalizedGLCM2 = _a.sent();
                    console.log("Image 1");
                    return [4 /*yield*/, extractContrast(normalizedGLCM)];
                case 4:
                    contrast = _a.sent();
                    return [4 /*yield*/, extractHomogeneity(normalizedGLCM)];
                case 5:
                    homogeneity = _a.sent();
                    return [4 /*yield*/, extractEntropy(normalizedGLCM)];
                case 6:
                    entropy = _a.sent();
                    console.log(contrast);
                    console.log(homogeneity);
                    console.log(entropy);
                    console.log("Image 2");
                    return [4 /*yield*/, extractContrast(normalizedGLCM2)];
                case 7:
                    contrast2 = _a.sent();
                    return [4 /*yield*/, extractHomogeneity(normalizedGLCM2)];
                case 8:
                    homogeneity2 = _a.sent();
                    return [4 /*yield*/, extractEntropy(normalizedGLCM2)];
                case 9:
                    entropy2 = _a.sent();
                    console.log(contrast2);
                    console.log(homogeneity2);
                    console.log(entropy2);
                    console.log("similarity");
                    console.log((0, CosineSimiliarity_1.default)(vectorTexture(normalizedGLCM), vectorTexture(normalizedGLCM2)));
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error('Error occurred:', error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function processAllImage(fileCheck, folder) {
    return __awaiter(this, void 0, void 0, function () {
        var checkFile, files, _i, files_1, file, filePath, isFile, testFile, CosineSimilarity, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, normalizeMatrix(fileCheck)];
                case 1:
                    checkFile = _a.sent();
                    return [4 /*yield*/, fs.readdir(folder)];
                case 2:
                    files = (_a.sent()).sort(function (a, b) {
                        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                    });
                    _i = 0, files_1 = files;
                    _a.label = 3;
                case 3:
                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                    file = files_1[_i];
                    filePath = path.join(folder, file);
                    return [4 /*yield*/, fs.stat(filePath)];
                case 4:
                    isFile = (_a.sent()).isFile();
                    if (!isFile) return [3 /*break*/, 6];
                    return [4 /*yield*/, normalizeMatrix(filePath)];
                case 5:
                    testFile = _a.sent();
                    CosineSimilarity = (0, CosineSimiliarity_1.default)(vectorTexture(checkFile), vectorTexture(testFile));
                    fileName = path.basename(filePath);
                    console.log("Cosine similarity between ".concat(fileCheck, " & ").concat(fileName, ": ").concat(CosineSimilarity));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/];
            }
        });
    });
}
var start = process.hrtime();
processAllImage('0.jpg', '../src/public/dataset').then(function () {
    var end = process.hrtime(start);
    console.info('Execution time: %ds %dms', end[0], end[1] / 1000000);
});

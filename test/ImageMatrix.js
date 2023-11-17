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
        var canvas, ctx, image, imageData, data, width, height, matrix, i, row, j, position, r, g, b;
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
                            r = data[position];
                            g = data[position + 1];
                            b = data[position + 2];
                            row.push(rgbToGrayScale(r, g, b));
                        }
                        matrix[i] = row;
                    }
                    return [2 /*return*/, matrix];
            }
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
    return reshaped;
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
function symmetricMatrix(matrix1, matrix2) {
    var transposedMatrix2 = transposeMatrix(matrix2);
    var resultMatrix = [];
    for (var i = 0; i < matrix1.length; ++i) {
        resultMatrix[i] = [];
        for (var j = 0; j < matrix1[i].length; ++j) {
            resultMatrix[i][j] = matrix1[i][j] + transposedMatrix2[i][j];
        }
    }
    return resultMatrix;
}
function rgbToGrayScale(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}
function normalizeMatrix(matrixRaw) {
    return __awaiter(this, void 0, void 0, function () {
        var grayMatrix, quantifizeMatrix, GLCM, resultGLCM, numRows, numCols, totalSum, normalized;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ImageToMatrix(matrixRaw)];
                case 1:
                    grayMatrix = _a.sent();
                    quantifizeMatrix = quantizeMatrix(grayMatrix);
                    GLCM = createCoOccurrenceMatrix(quantifizeMatrix, 0, 1, 0);
                    resultGLCM = symmetricMatrix(GLCM, transposeMatrix(GLCM));
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
    var matrixLength = matrix.length;
    for (var i = 0; i < matrixLength; ++i) {
        var row = matrix[i];
        var rowLength = row.length;
        for (var j = 0; j < rowLength; ++j) {
            contrast += row[j] * (Math.pow((i - j), 2));
        }
    }
    return contrast;
}
function extractHomogeneity(matrix) {
    var result = 0;
    var matrixLength = matrix.length;
    for (var i = 0; i < matrixLength; ++i) {
        var row = matrix[i];
        var rowLength = row.length;
        for (var j = 0; j < rowLength; ++j) {
            result += row[j] / (1 + Math.pow(matrix[i][j], 2));
        }
    }
    return result;
}
function extractEntropy(matrix) {
    var result = 0;
    var matrixLength = matrix.length;
    for (var i = 0; i < matrixLength; ++i) {
        var row = matrix[i];
        var rowLength = row.length;
        for (var j = 0; j < rowLength; ++j) {
            if (row[j] !== 0) {
                result += row[j] * Math.log(matrix[i][j]);
            }
        }
    }
    return -result;
}
function vectorTexture(matrix) {
    var contrast = extractContrast(matrix);
    var homogeneity = extractHomogeneity(matrix);
    var entropy = extractEntropy(matrix);
    var magnitude = Math.sqrt(Math.pow(contrast, 2) + Math.pow(homogeneity, 2) + Math.pow(entropy, 2));
    return [contrast / magnitude, homogeneity / magnitude, entropy / magnitude];
}
function process(database, file) {
    return __awaiter(this, void 0, void 0, function () {
        var vectorRaw, vector, databaseSimillar, i, simillar, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, normalizeMatrix(file)];
                case 1:
                    vectorRaw = _b.sent();
                    return [4 /*yield*/, vectorTexture(vectorRaw)];
                case 2:
                    vector = _b.sent();
                    databaseSimillar = [];
                    for (i = 0; i < database.length; i++) {
                        simillar = (0, CosineSimiliarity_1.default)(vector, database[i]);
                        ;
                        databaseSimillar.push([i, simillar]);
                        console.log("".concat(i, ".jpg memiliki ").concat(simillar * 100, "% kecocokan"));
                    }
                    return [2 /*return*/, true];
                case 3:
                    _a = _b.sent();
                    console.log("error");
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function startRun(fileSrc, folder) {
    return __awaiter(this, void 0, void 0, function () {
        var database, files, _i, files_1, file, filePath, isFile, fileName, vector, _a, _b, start, berhasil;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    database = [];
                    return [4 /*yield*/, fs.readdir(folder)];
                case 1:
                    files = (_c.sent());
                    _i = 0, files_1 = files;
                    _c.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                    file = files_1[_i];
                    filePath = path.join(folder, file);
                    return [4 /*yield*/, fs.stat(filePath)];
                case 3:
                    isFile = (_c.sent()).isFile();
                    if (!isFile) return [3 /*break*/, 6];
                    fileName = path.basename(filePath);
                    return [4 /*yield*/, normalizeMatrix(filePath)];
                case 4:
                    vector = _c.sent();
                    _b = (_a = database).push;
                    return [4 /*yield*/, vectorTexture(vector)];
                case 5:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    start = performance.now();
                    return [4 /*yield*/, process(database, fileSrc)];
                case 8:
                    berhasil = _c.sent();
                    console.log("program executed for ".concat((performance.now() - start) / 1000, " seconds"));
                    return [2 /*return*/];
            }
        });
    });
}
startRun('0.jpg', '../src/public/dataset');

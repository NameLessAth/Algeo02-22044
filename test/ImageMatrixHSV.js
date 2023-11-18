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
var CosineSimiliarity_1 = require("../src/src/functions/CosineSimiliarity");
var fs = require('fs').promises;
var path = require('path');
var _a = require('canvas'), createCanvas = _a.createCanvas, loadImage = _a.loadImage;
function CMax(R, G, B) {
    if ((R >= G) && (R >= B))
        return R;
    else if ((G >= R) && (G >= B))
        return G;
    else if ((B >= G) && (B >= R))
        return B;
}
function CMin(R, G, B) {
    if ((R <= G) && (R <= B))
        return R;
    else if ((G <= R) && (G <= B))
        return G;
    else if ((B <= R) && (B <= G))
        return B;
}
function RGBtoHSV(V1) {
    var raksen = V1[0] / 255;
    var gaksen = V1[1] / 255;
    var baksen = V1[2] / 255;
    var max = CMax(raksen, gaksen, baksen);
    var min = CMin(raksen, gaksen, baksen);
    var hue;
    var saturation;
    var value = max;
    if (max == min)
        hue = 0;
    else if (max == raksen)
        hue = (((gaksen - baksen) / (max - min)) % 6) * 60;
    else if (max == gaksen)
        hue = (((baksen - raksen) / (max - min)) + 2) * 60;
    else
        hue = (((raksen - gaksen) / (max - min)) + 4) / 60;
    if (max == 0)
        saturation = 0;
    else
        saturation = (max - min) / max;
    return [hue, saturation, value];
}
function extractImageToMatrix(imagePath) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, ctx, image, imageData, data, width, height, matrix, i, row, j, position, _a, r, g, b, a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    canvas = createCanvas(4, 4);
                    ctx = canvas.getContext('2d');
                    return [4 /*yield*/, loadImage(imagePath)];
                case 1:
                    image = _b.sent();
                    ctx.drawImage(image, 0, 0, 4, 4);
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
function compare2ImageHSV(MatImg1, MatImg2) {
    var cosSimTot = 0;
    MatImg1.forEach(function (elmt1, indexRow) {
        elmt1.forEach(function (elmt2, indexCol) {
            cosSimTot += (0, CosineSimiliarity_1.default)(elmt2, MatImg2[indexRow][indexCol]);
        });
    });
    return cosSimTot / (16);
}
function insertSort(StartArr, inputElmt) {
    var stopIterate = false;
    var i = 0;
    var j;
    while ((i < StartArr.length) && (!stopIterate)) {
        if (inputElmt[1] > StartArr[i][1])
            stopIterate = true;
        else
            i++;
    }
    if (stopIterate) {
        j = i;
        while (j < StartArr.length)
            StartArr[j + 1] = StartArr[j];
    }
    StartArr[i] = inputElmt;
    return StartArr;
}
function bubbleSort(StartArr) {
    var n = StartArr.length;
    var temp = [0, 0];
    var swapped = false;
    for (var i = 0; i < n - 1; i++) {
        swapped = false;
        for (var j = 0; j < n - (i + 1); j++) {
            if (StartArr[1][j] < StartArr[1][j + 1]) {
                temp = StartArr[j];
                StartArr[j] = StartArr[j + 1];
                StartArr[j + 1] = temp;
            }
        }
        if (!swapped)
            break;
    }
    return StartArr;
}
function process(query, database) {
    return __awaiter(this, void 0, void 0, function () {
        var matrixRaw2, databasecocok, i, cocok, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    matrixRaw2 = extractImageToMatrix(query);
                    databasecocok = [];
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < database.length)) return [3 /*break*/, 4];
                    _a = compare2ImageHSV;
                    return [4 /*yield*/, matrixRaw2];
                case 2:
                    cocok = _a.apply(void 0, [_c.sent(), database[i]]);
                    databasecocok.push([i, cocok]);
                    console.log("".concat(i, ".jpg memiliki ").concat(cocok * 100, "% kecocokan"));
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, true];
                case 5:
                    _b = _c.sent();
                    console.log("error");
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function debugPhoto() {
    return __awaiter(this, void 0, void 0, function () {
        var matrixRaw, matrixRaw2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, extractImageToMatrix('../src/public/dataset/4503.jpg')];
                case 1:
                    matrixRaw = _b.sent();
                    return [4 /*yield*/, extractImageToMatrix('0.jpg')];
                case 2:
                    matrixRaw2 = _b.sent();
                    console.log("kecocokannya adalah = ", compare2ImageHSV(matrixRaw, matrixRaw2));
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    console.log("error ler");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function startRun(query, folder) {
    return __awaiter(this, void 0, void 0, function () {
        var database, debugBool, files, _i, files_1, file, filePath, isFile, matrixHSV, start, berhasil;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = [];
                    debugBool = false;
                    if (!!debugBool) return [3 /*break*/, 8];
                    return [4 /*yield*/, fs.readdir(folder)];
                case 1:
                    files = (_a.sent());
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    file = files_1[_i];
                    filePath = path.join(folder, file);
                    return [4 /*yield*/, fs.stat(filePath)];
                case 3:
                    isFile = (_a.sent()).isFile();
                    if (!isFile) return [3 /*break*/, 5];
                    return [4 /*yield*/, extractImageToMatrix(filePath)];
                case 4:
                    matrixHSV = _a.sent();
                    database.push(matrixHSV);
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    start = performance.now();
                    return [4 /*yield*/, process(query, database)];
                case 7:
                    berhasil = _a.sent();
                    console.log("program executed for ".concat((performance.now() - start) / 1000, " seconds"));
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, debugPhoto()];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
startRun('0.jpg', '../src/public/dataset');

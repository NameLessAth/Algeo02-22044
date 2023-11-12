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
    else if (max = raksen)
        hue = (((gaksen - baksen) / (max - min)) % 6) / 6;
    else if (max = gaksen)
        hue = (((baksen - raksen) / (max - min)) + 2) / 6;
    else
        hue = (((raksen - gaksen) / (max - min)) + 4) / 6;
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
                            row.push(RGBtoHSV([r, g, b]));
                        }
                        matrix.push(row);
                    }
                    return [2 /*return*/, matrix];
            }
        });
    });
}
function process() {
    return __awaiter(this, void 0, void 0, function () {
        var matrixRaw;
        return __generator(this, function (_a) {
            try {
                matrixRaw = extractImageToMatrix('0-resize.jpg');
            }
            catch (_b) {
                console.log("error anjing");
            }
            return [2 /*return*/];
        });
    });
}
var start = performance.now();
process();
console.log("program executed for ".concat(performance.now() - start, " miliseconds"));

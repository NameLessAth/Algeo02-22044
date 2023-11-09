const { createCanvas, loadImage } = require('canvas');

async function extractImageToMatrix(imagePath) {
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, 256, 256);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const matrix = new Array(height);

    for (let i = 0; i < height; i++) {
        const row = new Array(width);
        for (let j = 0; j < width; j++) {
            const position = (i * width + j) * 4;
            const r = data[position];
            const g = data[position + 1];
            const b = data[position + 2];
            row[j] = [r, g, b];
        }
        matrix[i] = row;
    }
    return matrix;
}

async function MatrixGray(matrixRGB) {
    const matrixGray = [];
    for (let i = 0; i < matrixRGB.length; i++) {
        const row = [];
        for (let j = 0; j < matrixRGB[i].length; j++) {
            const [r, g, b] = matrixRGB[i][j];
            const gray = rgbToGrayScale(r, g, b);
            row.push(gray);
        }
        matrixGray.push(row);
    }
    return matrixGray;
}

function quantizeMatrix(matrix) {
    const flatMatrix = matrix.flat();
    const min = Math.min(...flatMatrix);
    const max = Math.max(...flatMatrix);

    const normalized = flatMatrix.map(value => {
        return Math.round((value - min) * (255 / (max - min)));
    });

    const reshaped = new Array(256).fill(0).map(() => new Array(256).fill(0));
    for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
            reshaped[i][j] = normalized[i * 256 + j];
        }
    }
    const reshapedClean = reshaped.filter(row => row.some(value => value !== 0));
    return reshapedClean;
}

function rgbToGrayScale(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Test the execution time
const start = process.hrtime();
// Add your function calls here
const end = process.hrtime(start);
console.info('Execution time: %ds %dms', end[0], end[1] / 1000000);

const { createCanvas, loadImage } = require('canvas');
import * as math from 'mathjs';
import CosineSimiliarity from '../src/src/functions/CosineSimiliarity';

type Matrix = number[][];
type Vector = [number, number, number];

async function ImageToMatrix(imagePath: String): Promise<Matrix> {
    const canvas: Any = createCanvas(256, 256);
    const ctx: Any = canvas.getContext('2d');

    const image: Any = await loadImage(imagePath);
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

async function GrayscaleMatrix(matrixRGB: Matrix): Promise<Matrix> {
    const GrayscaleMatrix = [];
    for (let i = 0; i < matrixRGB.length; i++) {
        const row: number[] = [];
        for (let j = 0; j < matrixRGB[i].length; j++) {
            const [r, g, b] = matrixRGB[i][j];
            const gray = rgbToGrayScale(r, g, b);
            row.push(gray);
        }
        GrayscaleMatrix.push(row);
    }
    return GrayscaleMatrix;
}

function quantizeMatrix(matrix: Matrix) {
    const flatMatrix: Matrix = matrix.flat();
    const min = Math.min(...flatMatrix);
    const max = Math.max(...flatMatrix);
    const GrayscaleInt: Matrix = flatMatrix.map(value => {
        return Math.round((value - min) * (255 / (max - min)));
    });

    const reshaped = new Array(256).fill(0).map(() => new Array(256).fill(0));
    for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
            reshaped[i][j] = GrayscaleInt[i * 256 + j];
        }
    }
    const reshapedClean: Matrix = reshaped.filter(row => row.some(value => value !== 0));
    return reshapedClean;
}

function createCoOccurrenceMatrix(matrix: Matrix, distanceI: number, distanceJ: number, angle: number) {
    const coOccurrenceMatrix: Matrix = new Array(matrix.length + 1).fill(0).map(() => new Array(matrix.length + 1).fill(0));

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const currentValue = matrix[i][j];

            const neighborI: number = i + distanceI
            const neighborJ: number = j + distanceJ;

            if (neighborJ < matrix[i].length) {
                const neighborValue = matrix[neighborI][neighborJ];
                coOccurrenceMatrix[currentValue][neighborValue]++;
            }
        }
    }
    return coOccurrenceMatrix;
}

function transposeMatrix(srcMatrix: Matrix){
    return srcMatrix[0].map((col, i) => srcMatrix.map(row => row[i]));   
}


function addMatrix(matrix1: Matrix, matrix2: Matrix): Matrix{
    const resultMatrix: Matrix = [];
    
    for(let i = 0; i < matrix1.length; ++i){
        resultMatrix[i] = []; 
        for(let j = 0; j < matrix1[i].length; ++j){
            resultMatrix[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
    return resultMatrix; 
}

function symmetricMatrix(matrix1: Matrix, matrix2: Matrix): Matrix{
    const symmetricMatrix: Matrix = addMatrix(matrix1, matrix2);
    return symmetricMatrix;
}

function rgbToGrayScale(r: number, g: number, b: number) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function determinant(Matrix: Matrix): number{
    const resultDet: number = math.det(Matrix)
    return resultDet;
}

async function normalizeMatrix(file: String): Promise<Matrix> {

    let matrixRaw = await ImageToMatrix(file);
    let grayMatrix = await GrayscaleMatrix(matrixRaw);
    let quantifizeMatrix =  quantizeMatrix(grayMatrix);
    let GLCM =  createCoOccurrenceMatrix(quantifizeMatrix, 0, 1, 0); 
    let GLCMTranspose =  transposeMatrix(GLCM);
    let resultGLCM =  addMatrix(GLCM, GLCMTranspose);

    const numRows: number = resultGLCM.length;
    const numCols: number = resultGLCM[0].length;

    const totalSum = resultGLCM.reduce((sum, row) => sum + row.reduce((rowSum, value) => rowSum + value, 0), 0);
    const normalized = resultGLCM.map(row => row.map(value => value / totalSum));

    return normalized;
}

function extractContrast(matrix: Matrix): number{
    let contrast: number = 0; 
    for(let i = 0; i < matrix.length; ++i){
        for(let j = 0; j < matrix[i].length; ++j){
            contrast += matrix[i][j] * Math.pow((i - j), 2);
        }
    }

    return contrast;
}

function extractHomogeneity(matrix: Matrix): number{
    let result: number = 0;
    for(let i = 0; i < matrix.length; ++i){
        for(let j = 0; j < matrix[i].length; ++j){
            result += matrix[i][j] / (1 + Math.pow(matrix[i][j], 2));
        }
    }
    return result
}

function extractEntropy(matrix: Matrix): number{
    let result: number = 0; 
    for(let i = 0; i < matrix.length; ++i){
        for(let j = 0; j < matrix[i].length; ++j){
            if(matrix[i][j] !== 0){
                result += matrix[i][j] * Math.log(matrix[i][j]);
            }
        }
    }
    return -result; 
}

function vectorTexture(matrix: Matrix): Vector{
    const contrast: number = extractContrast(matrix); 
    const homogeneity: number = extractHomogeneity(matrix); 
    const entropy: number = extractEntropy(matrix); 

    return [contrast, homogeneity, entropy];
}

function printMatrix(matrix: Matrix){
    matrix.forEach(row => {
        console.log(row.join(', '));
    });
    console.log('\n');
}

async function processImage() {
    const matrixTest: Matrix = [
        [0, 0, 1], 
        [1, 2, 3], 
        [2, 3, 2]   
    ]
    try {
        const testFile = '0.jpg';
        const testFile2 = '0-resize.jpg';
        // const matrixRaw = await ImageToMatrix(testFile);
        // const grayMatrix = await GrayscaleMatrix(matrixRaw);
        // const quantifizeMatrix = await quantizeMatrix(grayMatrix);
        // const GLCM = await createCoOccurrenceMatrix(quantifizeMatrix, 0, 1, 0); 
        // const GLCMTranspose = await transposeMatrix(GLCM);
        // const resultGLCM = await addMatrix(GLCM, GLCMTranspose);
        const normalizedGLCM = await normalizeMatrix(testFile);
        const normalizedGLCM2 = await normalizeMatrix(testFile2);

        console.log("Image 1"); 
        const contrast = await extractContrast(normalizedGLCM);
        const homogeneity = await extractHomogeneity(normalizedGLCM);
        const entropy = await extractEntropy(normalizedGLCM); 
        console.log(contrast);
        console.log(homogeneity);
        console.log(entropy);

        console.log("Image 2"); 
        const contrast2 = await extractContrast(normalizedGLCM2); 
        const homogeneity2 = await extractHomogeneity(normalizedGLCM2); 
        const entropy2 = await extractEntropy(normalizedGLCM2);
        console.log(contrast2); 
        console.log(homogeneity2);
        console.log(entropy2);

        console.log("similarity"); 
        console.log(CosineSimiliarity(vectorTexture(normalizedGLCM), vectorTexture(normalizedGLCM2)));
  } catch (error) {
      console.error('Error occurred:', error);
    }
}

    const start = process.hrtime();
    processImage();
    const end = process.hrtime(start);
    console.info('Execution time: %ds %dms', end[0], end[1] / 1000000);

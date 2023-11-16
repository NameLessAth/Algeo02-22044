const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const path = require('path');
import CosineSimiliarity from '../src/src/functions/CosineSimiliarity';
import * as math from 'mathjs';

type Vector = [number, number, number];
type Matrix = number[][];
type MatrixVector = Vector[][];

async function ImageToMatrix(imagePath: String): Promise<MatrixVector> {
    const canvas: any = createCanvas(256, 256);
    const ctx: any = canvas.getContext('2d');

    const image: any = await loadImage(imagePath);
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

async function GrayscaleMatrix(matrixRGB: MatrixVector): Promise<Matrix> {
    const GrayscaleMatrix:number[][] = [];
    for (let i = 0; i < matrixRGB.length; i++) {
        const row: number[] = [];
        for (let j = 0; j < matrixRGB[i].length; j++) {
            const [r, g, b]= matrixRGB[i][j];
            const gray = rgbToGrayScale(r, g, b);
            row.push(gray);
        }
        GrayscaleMatrix.push(row);
    }
    return GrayscaleMatrix;
}

function quantizeMatrix(matrix: Matrix) {
    const flatMatrix: number[] = matrix.flat();
    const min = Math.min(...flatMatrix);
    const max = Math.max(...flatMatrix);
    const GrayscaleInt: number[] = flatMatrix.map(value => {
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

            const neighborI: number = i + distanceI;
            const neighborJ: number = j + distanceJ;

            if (neighborI >= 0 && neighborI < matrix.length && neighborJ >= 0 && neighborJ < matrix[i].length) {
                const neighborValue = matrix[neighborI][neighborJ];
                
                if (currentValue >= 0 && currentValue < coOccurrenceMatrix.length &&
                    neighborValue >= 0 && neighborValue < coOccurrenceMatrix[currentValue].length) {
                    coOccurrenceMatrix[currentValue][neighborValue]++;
                }
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

function rgbToGrayScale(r: number, g: number, b: number):number {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function determinant(Matrix: Matrix): number{
    const resultDet: number = math.det(Matrix)
    return resultDet;
}

async function normalizeMatrix(matrixRaw: MatrixVector): Promise<Matrix> {
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



async function processAllImage(fileCheck: string , folder:string) {
    const matrixRaw = await ImageToMatrix(fileCheck);
    const checkFile = await normalizeMatrix(matrixRaw); 

    const files = (await fs.readdir(folder)).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
    for(const file of files){
        const filePath = path.join(folder, file);
        const isFile = (await fs.stat(filePath)).isFile(); 

        if(isFile){
            const matrixRawFile = await ImageToMatrix(filePath); 
            const testFile = await normalizeMatrix(matrixRawFile);
            let CosineSimilarity = CosineSimiliarity(vectorTexture(checkFile), vectorTexture(testFile));

            const fileName = path.basename(filePath);

            console.log(`Cosine similarity between ${fileCheck} & ${fileName}: ${CosineSimilarity}`);
        }
    }
}

async function compareGrayscale(matrix1: Matrix, matrix2: Matrix): Promise<number>{
    // const nMatrix1 = await normalizeMatrix(matrix1); 
    // const nMatrix2 = await normalizeMatrix(matrix2);

    const vector1 = vectorTexture(matrix1); 
    const vector2 = vectorTexture(matrix2);

    const Simillarity = CosineSimiliarity(vector1, vector2); 

    return Simillarity;
}

// function bubbleSort(StartArr:[number, number][]):[number, number][]{
//   let n:number = StartArr.length;
//   let temp:[number, number] = [0,0];
//   let swapped:boolean = false;
//   for (let i = 0; i < n-1; i++){
//     swapped = false;
//     for (let j = 0; j < n - (i+1); j++){
//       if (StartArr[1][j] < StartArr[1][j+1]){
//         temp = StartArr[j];
//         StartArr[j] = StartArr[j+1];
//         StartArr[j+1] = temp;
//       }
//     } 
//     if (!swapped) break;
//   }

//   return StartArr;
// }

async function process(database:Matrix[], file: string) {
    try{
        const matrixRaw2 = await ImageToMatrix(file);
        const vectorRaw = await normalizeMatrix(matrixRaw2);
        var databaseSimillar:[number, number][] = [];
        for (let i = 0; i < database.length; i++){
          let simillar = await compareGrayscale(vectorRaw, database[i]);
          databaseSimillar.push([i, simillar]);
          console.log(`${i}.jpg memiliki ${simillar*100}% kecocokan`);
        } 
        // databaseSimillar =  bubbleSort(databaseSimillar);
        return true;
    } catch{
        console.log("error");
        return false;
    }
}

async function startRun(fileSrc: string, folder:string) {
    const database:Matrix[] = [];
    const files = (await fs.readdir(folder)).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
    for(const file of files){
        const filePath = path.join(folder, file);
        const isFile = (await fs.stat(filePath)).isFile(); 

        if(isFile){
            const fileName = path.basename(filePath);
            const data = await ImageToMatrix(`../src/public/dataset/${fileName}`);
            database.push(await normalizeMatrix(data));
        }
    }

    const start = performance.now();
    const berhasil:boolean = await process(database, fileSrc);
    console.log(`program executed for ${(performance.now()-start)/1000} seconds`);
}

startRun('0.jpg', '../src/public/dataset')

// processAllImage('0.jpg', '../src/public/dataset');


// async function processImage() {
//     const matrixTest: Matrix = [
//         [0, 0, 1], 
//         [1, 2, 3], 
//         [2, 3, 2]   
//     ]
//     try {
//         const testFile = '0.jpg';
//         const testFile2 = '1.jpg';
//         // const matrixRaw = await ImageToMatrix(testFile);
//         // const grayMatrix = await GrayscaleMatrix(matrixRaw);
//         // const quantifizeMatrix = await quantizeMatrix(grayMatrix);
//         // const GLCM = await createCoOccurrenceMatrix(quantifizeMatrix, 0, 1, 0); 
//         // const GLCMTranspose = await transposeMatrix(GLCM);
//         // const resultGLCM = await addMatrix(GLCM, GLCMTranspose);
//         const normalizedGLCM = await normalizeMatrix(testFile);
//         const normalizedGLCM2 = await normalizeMatrix(testFile2);

//         console.log("Image 1"); 
//         const contrast = await extractContrast(normalizedGLCM);
//         const homogeneity = await extractHomogeneity(normalizedGLCM);
//         const entropy = await extractEntropy(normalizedGLCM); 
//         console.log(contrast);
//         console.log(homogeneity);
//         console.log(entropy);

//         console.log("Image 2"); 
//         const contrast2 = await extractContrast(normalizedGLCM2); 
//         const homogeneity2 = await extractHomogeneity(normalizedGLCM2); 
//         const entropy2 = await extractEntropy(normalizedGLCM2);
//         console.log(contrast2); 
//         console.log(homogeneity2);
//         console.log(entropy2);

//         console.log("similarity"); 
//         console.log(CosineSimiliarity(vectorTexture(normalizedGLCM), vectorTexture(normalizedGLCM2)));
//   } catch (error) {
//       console.error('Error occurred:', error);
//     }
// }
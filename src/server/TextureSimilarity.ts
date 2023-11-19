const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const path = require('path');
import CosineSimiliarity from './CosineSimilarity'
import * as math from 'mathjs';
import { saveMatrixToFile } from './Saving';

type Vector = [number, number, number];
type Matrix = number[][];
type MatrixVector = Vector[][];
type Array = number[];

async function ImageToMatrix(imagePath: String): Promise<Matrix> {
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
            row.push(rgbToGrayScale(r, g, b));
        }
        matrix[i] = row;
    }
    return matrix;
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
    return reshaped;
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

function transposeMatrix(srcMatrix: Matrix): Matrix {
    return srcMatrix[0].map((col, i) => srcMatrix.map(row => row[i]));
}

function symmetricMatrix(matrix1: Matrix, matrix2: Matrix): Matrix {

    const transposedMatrix2 = transposeMatrix(matrix2);
    const resultMatrix: Matrix = [];

    for (let i = 0; i < matrix1.length; ++i) {
        resultMatrix[i] = [];
        for (let j = 0; j < matrix1[i].length; ++j) {
            resultMatrix[i][j] = matrix1[i][j] + transposedMatrix2[i][j];
        }
    }

    return resultMatrix;
}


function rgbToGrayScale(r: number, g: number, b: number):number {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}


async function normalizeMatrix(matrixRaw: string): Promise<Matrix> {
    let grayMatrix = await ImageToMatrix(matrixRaw);
    let quantifizeMatrix =  quantizeMatrix(grayMatrix);
    let GLCM =  createCoOccurrenceMatrix(quantifizeMatrix, 0, 1, 0); 
    let resultGLCM =  symmetricMatrix(GLCM, transposeMatrix(GLCM));

    const numRows: number = resultGLCM.length;
    const numCols: number = resultGLCM[0].length;

    const totalSum = resultGLCM.reduce((sum, row) => sum + row.reduce((rowSum, value) => rowSum + value, 0), 0);
    const normalized = resultGLCM.map(row => row.map(value => value / totalSum));

    return normalized;
}

function extractContrast(matrix: Matrix): number {
    let contrast = 0;
    const matrixLength = matrix.length;

    for (let i = 0; i < matrixLength; ++i) {
        const row = matrix[i];
        const rowLength = row.length;

        for (let j = 0; j < rowLength; ++j) {
            contrast += row[j] * ((i - j) ** 2);
        }
    }
    return contrast;
}


function extractHomogeneity(matrix: Matrix): number{
    let result: number = 0;
    let matrixLength: number = matrix.length;
    for(let i = 0; i < matrixLength; ++i){
        const row = matrix[i];
        const rowLength: number = row.length;
        for(let j = 0; j < rowLength; ++j){
            result += row[j] / (1 + Math.pow(matrix[i][j], 2));
        }
    }
    return result
}

function extractEntropy(matrix: Matrix): number{
    let result: number = 0; 
    let matrixLength = matrix.length;
    for(let i = 0; i < matrixLength; ++i){
        const row = matrix[i];
        const rowLength = row.length;
        for(let j = 0; j < rowLength; ++j){
            if(row[j] !== 0){
                result += row[j] * Math.log(matrix[i][j]);
            }
        }
    }
    return -result; 
}

function calculateMean(database: Vector[]): Vector {
    const mean: Vector = [0, 0, 0];
    const databaseLength: number = database.length;
    mean[0] = database.reduce((acc: number, val: any) => acc + val[0], 0) / databaseLength;
    mean[1] = database.reduce((acc: number, val: any) => acc + val[1], 0) / databaseLength;
    mean[2] = database.reduce((acc: number, val: any) => acc + val[2], 0) / databaseLength;
    return mean;
}

function calculateStandardDeviation(database: Vector[]): Vector {
    const databaseLength: number = database.length;
    const mean0: number = database.reduce((acc: number, val: any) => acc + val[0], 0) / databaseLength;
    const mean1: number = database.reduce((acc: number, val: any) => acc + val[1], 0) / databaseLength;
    const mean2: number = database.reduce((acc: number, val: any) => acc + val[2], 0) / databaseLength;
  
    const variance0 = database.reduce((acc: number, val: any) => acc + (val[0] - mean0) ** 2, 0) / databaseLength;
    const variance1 = database.reduce((acc: number, val: any) => acc + (val[1] - mean1) ** 2, 0) / databaseLength;
    const variance2 = database.reduce((acc: number, val: any) => acc + (val[2] - mean2) ** 2, 0) / databaseLength;
  
    const stdDevContrast: number = Math.sqrt(variance0);
    const stdDevHomogeneity: number = Math.sqrt(variance1);
    const stdDevEntropy: number = Math.sqrt(variance2);
    return [stdDevContrast, stdDevHomogeneity, stdDevEntropy];
}

function vectorTexture(matrix: Matrix): Vector {
    const contrast: number = extractContrast(matrix);
    const homogeneity: number = extractHomogeneity(matrix);
    const entropy: number = extractEntropy(matrix);
    
    return ([contrast, homogeneity, entropy]);
}

function textureNormalize(source: Vector, mean: Vector, std: Vector): Vector{
    return [(source[0] - mean[0])/std[0], (source[1] - mean[1])/ std[1], (source[2] - mean[2])/std[2]];
}

function bubbleSort(StartArr:[number, number][]):[number, number][]{
    let n:number = StartArr.length;
    let temp:[number, number] = [0,0];
    let swapped:boolean = false;
    for (let i = 0; i < n-1; i++){
      swapped = false;
      for (let j = 0; j < n - (i+1); j++){
        if (StartArr[1][j] < StartArr[1][j+1]){
          temp = StartArr[j];
          StartArr[j] = StartArr[j+1];
          StartArr[j+1] = temp;
        }
      } 
      if (!swapped) break;
    }
  
    return StartArr;
}

async function process(database:Vector[], file: string) {
    try{
        const vectorRaw = await normalizeMatrix(file);
        const vector = await vectorTexture(vectorRaw);
        const mean: Vector = calculateMean(database); 
        const std: Vector = calculateStandardDeviation(database);
        var databaseSimillar:[number, number][] = [];
        for (let i = 0; i < database.length; i++){
            const vectorSrc = textureNormalize(vector, mean, std);
            const checker = textureNormalize(database[i], mean, std);
            let simillar = CosineSimiliarity(vectorSrc, checker);;
            databaseSimillar.push([i, simillar]);
            console.log(`${i}.jpg memiliki ${simillar*100}% kecocokan`);
        } 
        const sortedMatches = databaseSimillar.sort((a, b) => b[1] - a[1]);
        await saveMatrixToFile(sortedMatches);
        return true;
    } catch{
        console.log("error");
        return false;
    }
}

async function startRun(fileSrc: string, folder:string) {
    const database:Vector[] = [];
    const files = (await fs.readdir(folder));
    for(const file of files){
        const filePath = path.join(folder, file);
        const isFile = (await fs.stat(filePath)).isFile(); 
        
        if(isFile){
            const fileName = path.basename(filePath);
            const vector = await normalizeMatrix(filePath); 
            database.push(vectorTexture(vector));
        }
    }
    const start = performance.now();
    const berhasil:boolean = await process(database, fileSrc);
    console.log(`program executed for ${(performance.now()-start)/1000} seconds`);
}

startRun('./image-uploads/0.jpg', './dataset-uploads')

// untuk menghindari simillarity 99%
// [contrastMean, homogeneityMean, entropyMean] // seluruth dataseh  MEAN
// [contrastSTD, homogenitySTD, entropySTD] //seluruh dataset STD
// [contrast, homogeneity, entropy] // -> rumus - MEAN /STD -> resultn
//result1 gambar1 dan result2 gambar2
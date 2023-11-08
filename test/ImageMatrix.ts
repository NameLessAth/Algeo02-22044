import { extractContrast } from '../src/src/functions/TextureRetrieval';
const { createCanvas, loadImage } = require('canvas');

async function extractImageToMatrix(imagePath: String): Promise<number[][]> {
  const canvas = createCanvas(256, 256); 
  const ctx = canvas.getContext('2d');

  const image = await loadImage(imagePath);
  ctx.drawImage(image, 0, 0, 256, 256);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  const matrix = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      const position = (i * width + j) * 4;
      const [r, g, b, a] = data.slice(position, position + 4);
      row.push([r, g, b]); 
    }
    matrix.push(row); 
  }
  return matrix;
}

async function MatrixGray(matrixRGB): Promise<number[][]> {
    const matrixGray = [];
    for(let i = 0; i < matrixRGB.length; i++){
        const row = []; 
        for(let j = 0; j <matrixRGB[i].length; j++){
            const [r, g, b] = matrixRGB[i][j];
            const gray = rgbToGrayScale(r, g, b); 
            row.push(gray);
        }
        matrixGray.push(row);
    }
    return matrixGray;
}

function quantizeMatrix(matrix: number[][]){
    const min = Math.min(...matrix.flat());
    const max = Math.max(...matrix.flat());

    const normalized = matrix.map(row => row.map(value => {
        return Math.round((value - min) * (255 / (max - min)));
    }));

    const reshaped = new Array(256).fill().map(() => new Array(256).fill(0));
    for (let i = 0; i < 256; i++) {
        for (let j = 0; j < 256; j++) {
            reshaped[i][j] = normalized[i * 256 + j];
        }
    }
    const reshapedClean = reshaped.map(row => row.filter(value => value !== undefined)).filter(row => row.length > 0);
    return reshapedClean;
}


export function rgbToGrayScale(r:number, g: number, b: number): number{
    const grayValue = 0.299 * r + 0.587 * g + 0.114 * b; 
    return grayValue; 
}

async function processImage() {
    try {
        const testFile = '0.jpg';
        const matrixRaw = await extractImageToMatrix(testFile);
        const grayMatrix = await MatrixGray(matrixRaw);
        const quantifizeMatrix = await quantizeMatrix(grayMatrix);
        console.log(matrixRaw); 
        console.log("================================================");
        console.log(grayMatrix);
        console.log("================================================");
        console.log(quantifizeMatrix);

    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
const start = performance.now();
processImage();
const end = performance.now();
console.log(`Execution time: ${end - start} milliseconds`);

import CosineSimiliarity from '../src/src/functions/CosineSimiliarity';
import { extractContrast } from '../src/src/functions/TextureRetrieval';
const { createCanvas, loadImage } = require('canvas');
type Vector3 = [number, number, number];
type Matrix = number[][]

function CMax(R:any, G:any, B:any):any {
    if ((R>=G)&&(R>=B)) return R;
    else if ((G>=R)&&(G>=B)) return G;
    else if ((B>=G)&&(B>=R)) return B;
}
function CMin(R:any, G:any, B:any):any {
    if ((R<=G)&&(R<=B)) return R;
    else if ((G<=R)&&(G<=B)) return G;
    else if ((B<=R)&&(B<=G)) return B;
}
   
function RGBtoHSV(V1:Vector3):Vector3 {
    let raksen:number = V1[0]/255; let gaksen:number = V1[1]/255; let baksen:number = V1[2]/255; 
    
    let max = CMax(raksen, gaksen, baksen);
    let min = CMin(raksen, gaksen, baksen);

    let hue:number; 
    let saturation:number; 
    let value:number = max;
    
    if (max == min) hue = 0;
    else if (max == raksen) hue = (((gaksen-baksen)/(max-min))%6)*60;
    else if (max == gaksen) hue = (((baksen-raksen)/(max-min))+2)*60;
    else hue = (((raksen-gaksen)/(max-min))+4)/60;
    

    if (max == 0) saturation = 0;
    else saturation = (max-min)/max;
    return [hue, saturation, value];
}

async function extractImageToMatrix(imagePath: String): Promise<number[][][]> {
  const canvas = createCanvas(4, 4); 
  const ctx = canvas.getContext('2d');

  const image = await loadImage(imagePath);
  ctx.drawImage(image, 0, 0, 4, 4);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  const matrix:any[] = [];

  for (let i = 0; i < height; i++) {
    const row: any[] = [];
    for (let j = 0; j < width; j++) {
      const position = (i * width + j) * 4;
      const [r, g, b, a] = data.slice(position, position + 4);

      row.push(RGBtoHSV([r,g,b])); 
    }
    matrix.push(row); 
  }
  return matrix;
}

function compare2ImageHSV(MatImg1:number[][][], MatImg2:number[][][]){
  let cosSimTot:number = 0;
  MatImg1.forEach((elmt1, indexRow) =>{
    elmt1.forEach((elmt2, indexCol) =>{
      cosSimTot += CosineSimiliarity(elmt2, MatImg2[indexRow][indexCol]);
    })
  })
  return cosSimTot/(16);
}



async function process() {
    try{
        const matrixRaw = extractImageToMatrix('0-resize.jpg');
        const matrixRaw2 = extractImageToMatrix('0.jpg');
        const matrixRaw3 = extractImageToMatrix('1.jpg');
        const matrixRaw4 = extractImageToMatrix('126.jpg');
        const matrixRaw5 = extractImageToMatrix('sun.jpg');
        const matrixRaw6 = extractImageToMatrix('white.jpg');
        console.log(compare2ImageHSV((await matrixRaw5), (await matrixRaw6)))
    } catch{
        console.log("error");
    }
}

const start = performance.now();
process();
console.log(`program executed for ${performance.now()-start} miliseconds`);
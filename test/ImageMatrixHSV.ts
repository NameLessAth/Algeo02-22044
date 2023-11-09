import { extractContrast } from '../src/src/functions/TextureRetrieval';
const { createCanvas, loadImage } = require('canvas');
type Vector = [number, number, number];

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
   
function RGBtoHSV(V1:Vector):Vector {
    let raksen:number = V1[0]/255; let gaksen:number = V1[1]/255; let baksen:number = V1[2]/255; 
    let max = CMax(raksen, gaksen, baksen);
    let min = CMin(raksen, gaksen, baksen);

    let hue:number; let saturation:number; let value:number = max;
    
    if (max == min) hue = 0;
    else if (max = raksen) hue = (((gaksen-baksen)/(max-min))%6)/6;
    else if (max = gaksen) hue = (((baksen-raksen)/(max-min))+2)/6;
    else hue = (((raksen-gaksen)/(max-min))+4)/6;

    if (max == 0) saturation = 0;
    else saturation = (max-min)/max;
    return [hue, saturation, value];
}

async function extractImageToMatrix(imagePath: String): Promise<number[][]> {
  const canvas = createCanvas(256, 256); 
  const ctx = canvas.getContext('2d');

  const image = await loadImage(imagePath);
  ctx.drawImage(image, 0, 0, 256, 256);

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

async function process() {
    try{
        const matrixRaw = extractImageToMatrix('0-resize.jpg');
    } catch{
        console.log("error anjing");
    }
}

const start = performance.now();
process();
console.log(`program executed for ${performance.now()-start} miliseconds`);
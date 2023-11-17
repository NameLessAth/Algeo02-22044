import CosineSimiliarity from '../src/src/functions/CosineSimiliarity'
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const path = require('path');
type Vector3 = [number, number, number];
type MatrixHSV = Vector3[][]

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

async function extractImageToMatrix(imagePath: String): Promise<MatrixHSV> {
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

function compare2ImageHSV(MatImg1:MatrixHSV, MatImg2:MatrixHSV){
  let cosSimTot:number = 0;
  MatImg1.forEach((elmt1, indexRow) =>{
    elmt1.forEach((elmt2, indexCol) =>{
      cosSimTot += CosineSimiliarity(elmt2, MatImg2[indexRow][indexCol]);
    })
  })
  return cosSimTot/(16);
}

function insertSort(StartArr:[number, number][], inputElmt:[number, number]):[number, number][]{
  let panjang:number = StartArr.length;
  if (panjang == 0){
    StartArr.push(inputElmt); return StartArr
  } let i:number = 0; let stopIterate:boolean = false; 
  while ((i < panjang)&&(!stopIterate)) {
    if (inputElmt[1] > StartArr[i][1]) stopIterate = true;
    else i++;
  } if (stopIterate == true){
    let j:number = panjang-1;
    while(j >= i){
      StartArr[j+1] = StartArr[j]; j--;
    } 
  } StartArr[i] = inputElmt;
  return StartArr;
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

async function process(database:MatrixHSV[]) {
    try{
        const matrixRaw2 = extractImageToMatrix('0.jpg');
        var databasecocok:[number, number][] = [];
        for (let i = 0; i < database.length; i++){
          let cocok = compare2ImageHSV(await matrixRaw2, database[i]);
          databasecocok = insertSort(databasecocok, [i, cocok]);
          // console.log(`${i}.jpg memiliki ${cocok*100}% kecocokan`);
        }
        console.log(databasecocok);
        return true;
    } catch{
        console.log("error");
        return false;
    }
}

// async function debugPhoto() {
//   try{
//     const matrixRaw = await extractImageToMatrix('../src/public/dataset/4503.jpg');
//     const matrixRaw2 = await extractImageToMatrix('0.jpg');
//     console.log("kecocokannya adalah = ",compare2ImageHSV(matrixRaw, matrixRaw2));
//   }catch{
//     console.log(`error ler`);
//   }
// }
async function startRun() {
  const database:MatrixHSV[] = [];
  const folder:string = '../src/public/dataset';
  const files = (await fs.readdir(folder));

  for(const file of files){
      const filePath = path.join(folder, file);
      const isFile = (await fs.stat(filePath)).isFile(); 

      if(isFile){
          const fileName = path.basename(filePath);
          const data = await extractImageToMatrix(`../src/public/dataset/${fileName}`);
          database.push(data);
      }
  }
  const start = performance.now();
  const berhasil:boolean = await process(database);
  console.log(`program executed for ${(performance.now()-start)/1000} seconds`);
}

startRun();
// function insertSortTest(a:number[]):number
/* 5
1 2 3 4
*/


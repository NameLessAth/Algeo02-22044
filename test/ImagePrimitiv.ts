const sharp = require("sharp"); 

async function getMetaData(imagePath:String): Promise<void> {
    const metadata = await sharp(imagePath).metadata(); 
    console.log(metadata); 
}

async function resizeImage(image:String, result:String): Promise<void>{
    try{
        await sharp(image).resize({
            width: 250,
            height: 250
        }).toFile(result+'-resize'+'.jpg');
    }catch(error){
        console.log(error);
    }
        
}

export function rgbToGrayScale(r:number, g: number, b: number): number{
    const grayValue = 0.299 * r + 0.587 * g + 0.114 * b; 
    return grayValue; 
}



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
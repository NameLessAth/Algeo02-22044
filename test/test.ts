const Jimp = require('jimp');
// import CosineSimiliarity from './CosineSimiliarity';

export const createGLCM = (image:any, distanceX:number, distanceY:number) =>{
    const numRows = image.getHeight();
    const numCols = image.getWidth();
    const glcm = Array.from({ length: 256 }, (number) => Array(256).fill(0));

    for (let i = 0; i < numRows; ++i) {
        for (let j = 0; j < numCols; ++j) {
            if (i + distanceY < numRows && j + distanceX < numCols) {
                const val1 = image.getPixelColor(j, i);
                const val2 = image.getPixelColor(j + distanceX, i + distanceY);

                const r1 = Math.floor((val1 / 65536) % 256);
                const g1 = Math.floor((val1 / 256) % 256);
                const b1 = val1 % 256;
                
                const r2 = Math.floor((val2 / 65536) % 256);
                const g2 = Math.floor((val2 / 256) % 256);
                const b2 = val2 % 256;
                
                const gray1 = Math.round(0.299 * r1 + 0.587 * g1 + 0.114 * b1);
                const gray2 = Math.round(0.299 * r2 + 0.587 * g2 + 0.114 * b2);

                glcm[gray1][gray2] += 1;
            }
        }
    }

    return glcm;
}

export const debugGLCM = (imageSrc:String, distanceX:number, distanceY:number) =>{
    const image = Jimp.read(imageSrc); 
    const glcm = createGLCM(image, distanceX, distanceY); 
    
    for (let i = 0; i < glcm.length; i++) {
        for (let j = 0; j < glcm[i].length; j++) {
            console.log(`GLCM[${i}][${j}]: ${glcm[i][j]}`);
        }
    }
}

export const extractContrast = (imagePath:String) => {
    const image = Jimp.read(imagePath);
    const textureContrast: number[] = [];

    const glcm = createGLCM(image, 1, 1);
    let contrast = 0; 
    for(let i = 0; i < glcm.length; i++){
        for(let j = 0; j <glcm[i].length; j++){
            const currContrast = Math.pow(i - j, 2) * glcm[i][j];
            contrast += currContrast;
        }
        
    }
    textureContrast.push(contrast);

    return textureContrast;
}



export const extractHomogeneity = (imagePath:String) => {
    const image = Jimp.read(imagePath); 
    const textureHomogeneity: number[] = []; 

    const glcm = createGLCM(image, 1, 1); 
    let homogen = 0; 
    for(let i = 0; i < glcm.length; i++){
        for(let j = 0; j <glcm[i].length; j++){
            const currHomogen = glcm[i][j]/(1 + Math.pow(i - j, 2));
            homogen += currHomogen;
        }
        
    }
    textureHomogeneity.push(homogen);

    return textureHomogeneity;
}

export const extractEntropy = (imagePath:String) => {
    const image = Jimp.read(imagePath); 
    const textureEntropy: number[] = []; 
    const glcm = createGLCM(image, 1, 1); 
    let entropy = 0; 
    for(let i = 0; i < glcm.length; i++){
        for(let j = 0; j < glcm[i].length; j++){
            const currEntropy = glcm[i][j] * Math.log(glcm[i][j]) ;
            entropy += currEntropy;
        }
    }
    textureEntropy.push(entropy);
    return textureEntropy;
    
}


export const CBIR = (imagePath, database) => {
    const imageContrast =  extractContrast(imagePath);
    const imageHomogeneity =  extractHomogeneity(imagePath);
    const imageEntropy =  extractEntropy(imagePath);

}




debugGLCM("0.jpg", 0.2, 0.2)

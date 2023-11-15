type Vector = [number, number, number];

function panjangVector(V: Vector): number {
    let sum = 0;
    V.forEach(elmt => {
        sum += (elmt * elmt)
    });
    return Math.sqrt(sum);
}

function CosineSimiliarity(V1: Vector, V2: Vector): number {
    let dotProd = 0;
    if ((panjangVector(V1)===0)||(panjangVector(V2)===0)){
        if (panjangVector(V1) === panjangVector(V2)) return 1;
        else return 0;
    }

    V1.forEach((elmt, index) => {
        dotProd += elmt * V2[index];
    })

    return (dotProd / (panjangVector(V1) * panjangVector(V2)));
}
// 3 4 5  0 0 0
// 0 + 0 + 0 / 0;
export default CosineSimiliarity;
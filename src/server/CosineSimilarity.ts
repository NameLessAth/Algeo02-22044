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

    V1.forEach((elmt, index) => {
        dotProd += elmt * V2[index];
    })

    return (dotProd / (panjangVector(V1) * panjangVector(V2)));
}

export default CosineSimiliarity;
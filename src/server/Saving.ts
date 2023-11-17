const fs = require('fs').promises;

export async function saveMatrixToFile(matrixData: any[][]) {
    try {
      const content = `const similarityData = ${JSON.stringify(matrixData)}; \n module.exports = similarityData`;
      await fs.writeFile('./result.js', content);
      console.log('Similarity data has been saved to result.ts');
    } catch (err) {
      console.error('Error saving similarity data:', err);
    }
  }
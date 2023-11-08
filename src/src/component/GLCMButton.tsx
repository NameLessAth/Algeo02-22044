import React from 'react';
import {createGLCMdebugGLCM } from '../functions/TextureRetrieval';

const GLCMButton = () => {
  const handleClick = () => {
    const imageSrc = '../../public/dataset/0.jpg'; // Provide the path to your image
    const distanceX = 1; // Specify your desired values for distanceX and distanceY
    const distanceY = 1;
    debugGLCM(imageSrc, distanceX, distanceY);
  };

  

  return (
    <div>
      <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Run GLCM Debug
      </button>
    </div>
  );
};

export default GLCMButton;

import React from 'react';
import ImageUpload from './component/ImageUpload';
import Title from './component/Title';
import ImageGallery from './component/ImageGallery';
import GLCMButton from './component/GLCMButton';
function App() {
  return (
    <>
      <Title />
      <GLCMButton />
      <ImageUpload />
      <ImageGallery />

    </>
  );  
}

export default App;
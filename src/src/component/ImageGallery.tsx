import React from 'react';

interface ImageItem {
  default: number;
}

const images = require.context('../images', true);
const imageList: ImageItem[] = images.keys().map((image) => images(image));

function ImageGallery() {
  return (
    <div className="grid grid-cols-3 gap-10 w-full h-auto justify-around items-center">
      {imageList.map((image, index) => (
        <img key={index} src={require(`../images/${index}.jpg`)} alt={`image-${index}`} className='w-[60vw] h-[50vh]' />
      ))}
    </div>
  );
}

export default ImageGallery;

import React, { useState, useEffect, ChangeEvent } from 'react';

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);
      const imageURL = URL.createObjectURL(file);
      setPreviewURL(imageURL);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the preview image URL when the component unmounts
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div className="p-5 flex items-center justify-around w-full h-[80vh]">
      {previewURL && (
        <div className="">
          <img src={previewURL} alt="Preview" className="max-w-[60vw] max-h-[50vh]" />
        </div>
      )}
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Image Upload and Preview</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
      </div>
    </div>
  );
};

export default ImageUpload;

import React, { useState } from 'react';

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isColorMode, setIsColorMode] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);

      if (event.target.files[0]) {
        const url = URL.createObjectURL(event.target.files[0]);
        setImageUrl(url);
      }
    }
  };

  const toggleMode = () => {
    setIsColorMode((prevMode) => !prevMode);
  };

  const uploadImage = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="flex flex-col md:flex-row bg-ndarkgray max-w-[100vw] min-h-[80vh] items-center justify-around">
      <div className="p-3">
        {imageUrl && <img src={imageUrl} alt="Selected Image" className="max-w-[45vw]" />}
      </div>
      <div className="px-3 py-5 flex flex-col justify-between items-center min-h-[400px]">
        <div className="flex flex-col justify-between items-start h-[120px]">
          <span className="text-nlightgray text-xl">
            Image Input
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-input"
          />
          <label
            htmlFor="image-input"
            className="px-4 py-2 rounded-full bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white"
          >
            Upload Image
          </label>
          <span className="text-nlightgray text-md">
          {selectedFile ? selectedFile.name : 'No file selected'}
          </span>
        </div>
        <div className="p-3 flex flex-col justify-between items-center h-[120px]">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isColorMode}
              onChange={toggleMode}
              className="sr-only peer"
            />
            <span className="text-md text-nlightgray mr-3 text-ml">Color</span>
            <div className={`w-11 h-6 bg-nwhite peer-focus:outline-none peer-focus:ring-4 ${isColorMode ? 'peer-checked:bg-ndarkred' : ''} peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[52px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ndarkred rounded-full`}></div>
            <span className="text-md text-nlightgray ml-3 text-ml">Texture</span>
          </label>
          <button
            onClick={uploadImage}
            className="px-4 py-2 rounded-full bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;

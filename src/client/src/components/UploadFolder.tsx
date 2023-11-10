import React, { useState, useEffect } from 'react';

function UploadFolder() {
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  useEffect(() => {
    // Handle pagination when the selected folder changes
    setCurrentPage(1);
  }, [selectedFolder]);

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
  
    if (files) {
      const formData = new FormData();
  
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
  
      fetch('/api/upload-folder', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
  
          // Update the state to display the uploaded images
          setImages(Array.from(files));
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
   
  

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {currentImages.map((image, index) => (
          <div key={index} className="w-full max-w-full">
            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} className="w-[350px] h-[250px]" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {images.length > imagesPerPage && (
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(images.length / imagesPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white ${
                  currentPage === i + 1 ? 'bg-nlightred text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center justify-center">
        <label htmlFor="folderInput" className="px-4 py-2 bg-ndarkred rounded-full text-nwhite hover:bg-nlightred hover:text-white cursor-pointer">
          Upload Datasets
        </label>
         {/* @ts-expect-error */}
        <input id="folderInput" type="file" directory="" webkitdirectory="" onChange={handleFolderChange} className="hidden"/>
        </div>
    </div>
  );
}

export default UploadFolder;

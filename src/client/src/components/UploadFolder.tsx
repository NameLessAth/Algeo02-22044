import React, { useState, useEffect } from 'react';

function UploadFolder() {
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [uploadTimes, setUploadTimes] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;
  const maxPaginationPages = 5;

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [selectedFolder]);

  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const startUploadTime = Date.now();
  
    if (files) {
      const batchSize = 2; 
      const totalFiles = files.length;
  
      for (let i = 0; i < totalFiles; i += batchSize) {
        const uploadBatch = Array.from({ length: Math.min(batchSize, totalFiles - i) }, (_, index) => files[i + index]);
        const uploadPromises = [];
  
        for (const file of uploadBatch) {
          const formData = new FormData();
          formData.append('images', file);
  
          const uploadPromise = fetch('/api/upload-folder', {
            method: 'POST',
            body: formData,
          })
            .then(async (response) => {
              if (!response.ok) {
                throw new Error('Failed to upload');
              }
  
              const data = await response.json();
  
              console.log(data.message);
  
              setImages((prevImages) => [...prevImages, file]);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
  
          uploadPromises.push(uploadPromise);
        }
  
        try {
          await Promise.all(uploadPromises);
        } catch (error) {
          console.error('Error uploading batch:', error);
        }
      }
    }

    const endUploadTime = Date.now();
    const duration = endUploadTime - startUploadTime;
    setUploadTimes((prevTimes) => [...prevTimes, duration]);
    console.log("Time spent: " + duration/1000 + "s");

  };
  
  // const handleNextPage = () => {
  //   setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(images.length / imagesPerPage)));
  // };

  // const handlePrevPage = () => {
  //   setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  // };

  // const indexOfLastImage = currentPage * imagesPerPage;
  // const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  // const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  // const currentUploadTimes = uploadTimes.slice(indexOfFirstImage, indexOfLastImage);

  // const totalPages = Math.ceil(images.length / imagesPerPage);

  // const startPage = Math.max(1, currentPage - Math.floor(maxPaginationPages / 2));
  // const endPage = Math.min(startPage + maxPaginationPages - 1, totalPages);

  // const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pb-10">
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {currentImages.map((image, index) => (
          <div key={index} className="w-full max-w-full">
            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} className="w-[350px] h-[250px]" />
            <p>Upload Time: {currentUploadTimes[index]} ms</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {images.length > imagesPerPage && (
          <div className="flex space-x-2">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white">
              {'<'}
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white ${
                  currentPage === page ? 'bg-nlightred text-white' : ''
                }`}
              >
                {page}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white">
              {'>'}
            </button>
          </div>
        )}
      </div> */}

      <div className="mt-4 flex flex-col items-center justify-center">
        <label htmlFor="folderInput" className="px-4 py-2 bg-ndarkred rounded-full text-nwhite hover:bg-nlightred hover:text-white cursor-pointer">
          Upload Datasets
        </label>
        {/* @ts-expect-error */}
        <input id="folderInput" type="file" directory="" webkitdirectory="" onChange={handleFolderChange} className="hidden" />
      </div>
    </div>
  );
}

export default UploadFolder;

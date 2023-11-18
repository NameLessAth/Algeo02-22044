import React, { useState } from 'react';
import WhiteBar from './WhiteBar';

function UploadPage() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isTextureMode, setIsTextureMode] = useState(false);
    const [, setImages] = useState<File[]>([]);
    const [uploadTime, setUploadTime] = useState<number>(0);
    const [similarityTime, setSimilarityTime] = useState<number>(0);
    const [similarityResult, setSimilarityResult] = useState<any[][]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setSelectedFile(file);

            const formData = new FormData();
            formData.append('image', file);

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

            if (file) {
                const url = URL.createObjectURL(file);
                setImageUrl(url);
            }
        }
    };

    const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const startTime = Date.now();
      
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
    
        const endTime = Date.now();
        const duration = endTime - startTime;
        setUploadTime(duration);
        console.log("Upload time spent: " + duration/1000 + "s");
    
    };

    const similarityData = () => {
        fetch('/api/similarityData')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setSimilarityResult(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

    const toggleMode = () => {
        setIsTextureMode((prevMode) => !prevMode);
        console.log("toggled")
    };

    const runColorSimilarity = () => {
        const startTime = Date.now();
        console.log("Starting...");
        fetch('/api/run-color-similarity', {
            method: 'POST',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Color similarity computation failed');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.message);
            similarityData();
            const endTime = Date.now();
            const duration = endTime - startTime;
            setSimilarityTime(duration);
            console.log("CBIR time spent: " + duration / 1000 + "s");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const runTextureSimilarity = () => {
        const startTime = Date.now();
        console.log("Starting...");
        fetch('/api/run-texture-similarity', {
            method: 'POST',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Texture similarity computation failed');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.message);
            similarityData();
            const endTime = Date.now();
            const duration = endTime - startTime;
            setSimilarityTime(duration);
            console.log("CBIR time spent: " + duration / 1000 + "s");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    // const handleDeleteImages = async () => {
    //     try {
    //         const response = await fetch('/delete-images', {
    //         method: 'DELETE'
    //     });

    //     if (response.ok) {
    //         alert('Images deleted successfully');
    //     } else {
    //         const errorMessage = await response.text();
    //         alert(`Failed to delete images: ${errorMessage}`);
    //     }
    //     } catch (error) {
    //         console.error('Error deleting images:', error);
    //         alert('An error occurred while deleting images');
    //     }
    // };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; 
    const totalPages = Math.ceil(similarityResult.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = similarityResult.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pageNumbers.push(i);
    }

    return (
        <>            
            <div className="flex flex-col md:flex-row bg-ndarkgray max-w-[100vw] min-h-[80vh] items-center justify-around">
                <div className="p-3">
                    {imageUrl && <img src={imageUrl} alt="Selected" className="max-w-[45vw]" />}
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
                        checked={isTextureMode}
                        onChange={toggleMode}
                        className="sr-only peer"
                        />
                        <span className="text-md text-nlightgray mr-3 text-ml">Color</span>
                        <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 ${isTextureMode ? '' : 'peer-checked:bg-ndarkred' } peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[52px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-ndarkred rounded-full`}></div>
                        <span className="text-md text-nlightgray ml-3 text-ml">Texture</span>
                    </label>
                    <button 
                        onClick={ isTextureMode ?  runTextureSimilarity : runColorSimilarity }
                        className="px-4 py-2 rounded-full bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white"
                    >
                        Search
                    </button>
                    </div>
                </div>
            </div>
            <WhiteBar />
            <div className="flex flex-col items-center justify-center h-full w-full pb-10">
            { similarityTime === 0 ? <p></p> : <p className='text-nlightgray'>CBIR time spent: {similarityTime / 1000}s</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">    
                    {currentItems.map(([filePath, percentage], index) => (
                    <div key={index} className="p-3">
                        <img src={`/api/get-image/${filePath}.jpg`} alt={`no ${index}`} className="w-[350px] h-[250px]" />
                        <p className="text-center text-nlightgray">{`${percentage * 100}%`}</p>
                    </div>
                    ))}
                </div>

                <div className="flex justify-center mt-5">
                <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 rounded-full bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white"
                >
                    {'<'}
                </button>

                {pageNumbers.map((pageNumber) => (
                    <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 mx-1 rounded-full bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white ${
                        currentPage === pageNumber ? 'bg-nlightred' : ''
                    }`}
                    >
                    {pageNumber}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 rounded-full bg-ndarkred text-nwhite hover:bg-nlightred hover:text-white"
                >
                    {'>'}
                </button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full w-full pb-10">
                <div className="mt-4 flex flex-col items-center justify-center">
                    { uploadTime === 0 ? <p></p> : <p>Upload time spent: {uploadTime / 1000}s</p>}
                    <label htmlFor="folderInput" className="px-4 py-2 bg-ndarkred rounded-full text-nwhite hover:bg-nlightred hover:text-white cursor-pointer">
                    Upload Datasets
                    </label>
                    {/* @ts-expect-error */}
                    <input id="folderInput" type="file" directory="" webkitdirectory="" onChange={handleFolderChange} className="hidden" />
                </div>
            </div>
        </>
    )

}

export default UploadPage;

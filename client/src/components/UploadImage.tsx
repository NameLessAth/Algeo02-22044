import React, { useState } from 'react';

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadImage = () => {
    if (!selectedFile) return

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
    <>
      <input type="file" accept="image/*" onChange={handleFileChange}/>
      <button onClick={uploadImage}>Upload Image</button>
    </>
  );
}

export default UploadImage;

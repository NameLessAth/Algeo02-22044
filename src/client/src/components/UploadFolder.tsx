import React, { useState } from 'react';

function UploadFolder() {
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFolder(event.target.files);
    }
  };

  const uploadFolder = () => {
    if (!selectedFolder) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFolder.length; i++) {
      formData.append('images', selectedFolder[i]);
    }

    fetch('/api/upload-folder', {
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
        {/* @ts-expect-error */}
        <input  type="file" directory="" webkitdirectory="" onChange={handleFolderChange} />
        <button onClick={uploadFolder}>Upload Folder</button>
    </>
  );
}

export default UploadFolder;

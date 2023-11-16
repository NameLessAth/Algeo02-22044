const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // Get the current list of files in the destination folder
    const folderPath = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(folderPath);

    // Calculate the next available index
    const fileIndex = files.length + 1;

    // Construct the new filename
    const filename = fileIndex + '.jpg';
    
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const imagePath = req.file.path;
  res.json({ message: 'Image uploaded successfully', image: imagePath });
});

app.post('/api/upload-folder', upload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  const uploadedImages = req.files.map((file) => file.path);
  res.json({ message: 'Images uploaded successfully', images: uploadedImages });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});

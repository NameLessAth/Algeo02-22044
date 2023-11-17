const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const { exec } = require('child_process');
const similarityData = require('./result');

// Image uploader
const singleImageStorage = multer.diskStorage({
  destination: 'image-uploads/',
  filename: (req, file, cb) => {
    const folderPath = path.join(__dirname, 'image-uploads');
    deleteFilesInFolder(folderPath);
    const filename = '0.jpg';
    cb(null, filename);
  },
});

const singleImageUpload = multer({ storage: singleImageStorage });

app.post('/api/upload-image', singleImageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }  
  const imagePath = req.file.path;
  res.json({ message: 'Image uploaded successfully', image: imagePath });
});

// Folder uploader
const folderImageStorage = multer.diskStorage({
  destination: 'dataset-uploads/',
  filename: (req, file, cb) => {
    const folderPath = path.join(__dirname, 'dataset-uploads');
    const files = fs.readdirSync(folderPath);
    const fileIndex = files.length;
    const filename = fileIndex + '.jpg';
    cb(null, filename);
  },
});

const folderImageUpload = multer({ storage: folderImageStorage });

app.post('/api/upload-folder', folderImageUpload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
  const uploadedImages = req.files.map((file) => file.path);
  res.json({ message: 'Images uploaded successfully', images: uploadedImages });
});

// Image deleter
function deleteFilesInFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${filePath}`);
  });
}

// Running the function
app.post('/api/run-color-similarity', (req, res) => {
  exec('ts-node ColorSimilarity.ts', (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Error executing ColorSimilarity.ts' });
    }
    if (stderr) {
      console.error('Error:', stderr);
      return res.status(500).json({ message: 'Error executing ColorSimilarity.ts' });
    }
    console.log('Output:', stdout);
    return res.json({ message: 'ColorSimilarity.ts executed successfully' });
  });
});

app.post('/api/run-texture-similarity', (req, res) => {
  exec('ts-node TextureSimilarity.ts', (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Error executing TextureSimilarity.ts' });
    }
    if (stderr) {
      console.error('Error:', stderr);
      return res.status(500).json({ message: 'Error executing TextureSimilarity.ts' });
    }
    console.log('Output:', stdout);
    return res.json({ message: 'TextureSimilarity.ts executed successfully' });
  });
});

// Similarity Data
app.get('/api/similarityData', (req, res) => {
  res.json(similarityData);
});

// Show gallery
app.get('/api/get-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'dataset-uploads', filename);
  res.sendFile(filePath);
});

// Port
app.listen(5000, () => {
  console.log('Server started on port 5000');
});

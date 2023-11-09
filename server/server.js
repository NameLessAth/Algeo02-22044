const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imagePath = req.file.path;
    res.json({ message: 'Images uploaded successfully', images: imagePath });
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

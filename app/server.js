const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.static('uploads'));
app.use('/images', express.static('C:/audiosMDS/publicidad/clonacion'));
app.use(bodyParser.json());

let currentTrack = null;

app.get('/files', (req, res) => {
  const files = [
    {
      index: 0,
      url: 'http://192.168.43.72:3001/jackpot.mp3',
      title: 'Jackpot',
      imageUrl: 'http://192.168.43.72:3001/premio.gif'
    },
    {
      index: 1,
      url: 'http://192.168.43.72:3001/superjackpot.mp3',
      title: 'Super Jackpot',
      imageUrl: 'http://192.168.43.72:3001/premio.gif'
    }
  ];
  res.json(files);
});

app.post('/select-track', (req, res) => {
  currentTrack = req.body.url ? req.body : null; 
  console.log('Track selected on server:', currentTrack);
  res.sendStatus(200);
});

app.get('/current-track', (req, res) => {
  res.json(currentTrack);
});

// Endpoint to get the list of images
app.get('/images-list', (req, res) => {
  const imagesDir = 'C:/audiosMDS/publicidad/clonacion';
  console.log('Reading directory:', imagesDir);
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return res.status(500).json({ error: 'Unable to scan directory' });
    }
    const imageFiles = files.map(file => ({
      name: file,
      url: `http://192.168.43.72:3001/images/${file}`
    }));
    console.log('Images list:', imageFiles);
    res.json(imageFiles);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://192.168.43.72:${port}`);
});

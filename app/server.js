const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.static('uploads'));
app.use(bodyParser.json());

let currentTrack = null;

app.get('/files', (req, res) => {
  const files = [
    {
      index: 0,
      url: 'http://192.168.43.72:3001/jackpot.mp3',
      title: 'Jackpot',
      imageUrl: 'http://192.168.43.72:3001/jackpot.jpg'
    },
    {
      index: 1,
      url: 'http://192.168.43.72:3001/superjackpot.mp3',
      title: 'Super Jackpot',
      imageUrl: 'http://192.168.43.72:3001/paisaje.jpg'
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://192.168.43.72:${port}`);
});
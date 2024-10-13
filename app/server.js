const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());

let currentTrack = null;

app.get('/files', (req, res) => {
  const files = [
    {
      url: 'http://localhost:3001/jackpot.mp3',
      title: 'Jackpot',
      imageUrl: 'http://localhost:3001/jackpot.jpg'
    },
    {
      url: 'http://localhost:3001/superjackpot.mp3',
      title: 'Super Jackpot',
      imageUrl: 'http://localhost:3001/jackpot.jpg'
    }
  ];
  res.json(files);
});

app.post('/select-track', (req, res) => {
  currentTrack = req.body;
  console.log('Track selected on server:', currentTrack);
  res.sendStatus(200);
});

app.get('/current-track', (req, res) => {
  res.json(currentTrack);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

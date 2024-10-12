const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.static('uploads'));

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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

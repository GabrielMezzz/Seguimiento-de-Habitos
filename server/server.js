const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/habitos', (req, res) => {
  const datos = JSON.parse(fs.readFileSync('habitos.json'));
  res.json(datos);
});

app.put('/api/habitos', (req, res) => {
  fs.writeFileSync('habitos.json', JSON.stringify(req.body, null, 2));
  res.send('ok');
});

app.listen(4000, () => {
  console.log('Servidor en http://localhost:4000');
});

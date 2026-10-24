// Middleware del servidor de desarrollo (CRA): expone endpoints para leer/escribir el JSON de hábitos.
const express = require('express');
const fs = require('fs');
const path = require('path');

// Ruta absoluta al archivo JSON que actúa como base de datos.
const DATA_FILE = path.resolve(__dirname, '../src/habitos.json');

module.exports = function (app) {
  // Permite leer el cuerpo JSON de las peticiones POST.
  app.use(express.json());

  // GET: devuelve el contenido actual del archivo JSON.
  app.get('/api/habitos', (req, res) => {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      res.type('json').send(raw);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST: sobrescribe el archivo JSON con los datos enviados.
  app.post('/api/habitos', (req, res) => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
};

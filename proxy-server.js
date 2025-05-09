// proxy-server.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Отдача статики (фронтенд)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https://yastatic.net; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'"
  );
  next();
});

// Прокси для API MITSO
app.get('/api/forms', async (req, res) => {
  try {
    const faculty = encodeURIComponent(req.query.faculty);
    const response = await fetch(`https://apps.mitso.by/frontend/web/schedule/forms?faculty=${faculty}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка прокси' });
  }
});

// Fallback для SPA (Vue Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
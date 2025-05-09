// proxy-server.js
import express from 'express';
import { join } from 'path';
import fetch from 'node-fetch';
import cors from 'cors';

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
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
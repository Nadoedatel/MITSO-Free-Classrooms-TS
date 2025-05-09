// proxy-server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/forms', async (req, res) => {
  try {
    const faculty = encodeURIComponent(req.query.faculty);
    const response = await fetch(`https://apps.mitso.by/frontend/web/schedule/forms?faculty=${faculty}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Ошибка при запросе к MITSO API' });
  }
});

const PORT = process.env.PORT || 3001; // Порт 3001, чтобы не конфликтовать с фронтендом
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
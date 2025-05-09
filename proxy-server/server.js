// proxy-server/server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // Разрешаем запросы с любого домена (можно ограничить своим фронтендом)

// Прокси для /schedule/forms
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
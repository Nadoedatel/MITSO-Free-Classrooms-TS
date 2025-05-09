import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Базовые настройки
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// CSP headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https://yastatic.net; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://apps.mitso.by"
  );
  next();
});

// CORS
app.use(cors({
  origin: [
    'https://mitso-free-classrooms-ts.onrender.com',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Статика
app.use(express.static(join(__dirname, 'dist')));

// 1. Получение форм обучения
app.get('/api/schedule/forms', async (req, res) => {
  try {
    const faculty = encodeURIComponent(req.query.faculty);
    const apiUrl = `https://apps.mitso.by/frontend/web/schedule/forms?faculty=${faculty}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    
    res.set('Content-Type', 'application/json');
    res.json(await response.json());
    
  } catch (error) {
    console.error('Forms proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

// 2. Получение курсов
app.get('/api/schedule/courses', async (req, res) => {
  try {
    const faculty = encodeURIComponent(req.query.faculty);
    const form = encodeURIComponent(req.query.form);
    const apiUrl = `https://apps.mitso.by/frontend/web/schedule/courses?faculty=${faculty}&form=${form}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    
    res.set('Content-Type', 'application/json');
    res.json(await response.json());
    
  } catch (error) {
    console.error('Courses proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

// 3. Получение групп
app.get('/api/schedule/groups', async (req, res) => {
  try {
    const faculty = encodeURIComponent(req.query.faculty);
    const form = encodeURIComponent(req.query.form);
    const course = encodeURIComponent(req.query.course);
    const apiUrl = `https://apps.mitso.by/frontend/web/schedule/groups?faculty=${faculty}&form=${form}&course=${course}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    
    res.set('Content-Type', 'application/json');
    res.json(await response.json());
    
  } catch (error) {
    console.error('Groups proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

// 4. Получение расписания группы
app.get('/api/schedule/group-schedules', async (req, res) => {
  try {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      params.append(key, value);
    }
    
    const apiUrl = `https://apps.mitso.by/frontend/web/schedule/group-schedules?${params.toString()}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    
    res.set('Content-Type', 'application/json');
    res.json(await response.json());
    
  } catch (error) {
    console.error('Schedule proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

// Fallback для SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Server Error' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
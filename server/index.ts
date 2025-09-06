import express from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Carpeta de logs
const logDir = path.join(__dirname, 'logs');
fs.mkdirSync(logDir, { recursive: true });
const traceFile = path.join(logDir, 'http_trace.jsonl');

// Endpoint para Crypto
app.get('/crypto', async (req, res) => {
  const { coin, days = '7', vs_currency = 'usd' } = req.query;

  if (!coin) return res.status(400).json({ error: 'Missing coin parameter' });

  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vs_currency}&days=${days}`;

  const start = Date.now();
  try {
    const r = await fetch(url);
    const data = await r.json();

    // Log de la request
    const entry = {
      ts: new Date().toISOString(),
      method: 'GET',
      url_base: url.split('?')[0],
      status: r.status,
      duration_ms: Date.now() - start,
      headers: {}
    };
    fs.appendFileSync(traceFile, JSON.stringify(entry) + '\n');

    res.status(r.status).json(data);
  } catch (e: any) {
    fs.appendFileSync(traceFile, JSON.stringify({
      ts: new Date().toISOString(),
      error: e?.message || 'unknown'
    }) + '\n');
    res.status(500).json({ error: 'Proxy error' });
  }
});

// Endpoint mock
app.get('/mock', (_req, res) => {
  const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock.json'), 'utf-8'));
  res.json(mockData);
});

// Arranque del servidor
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Carpeta de logs
const logDir = path.join(__dirname, "logs");
fs.mkdirSync(logDir, { recursive: true });
const traceFile = path.join(logDir, "http_trace.jsonl");

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// --- Endpoint múltiple monedas ---
app.get("/crypto", async (req, res) => {
  const { coins, days = "30", vs_currency = "usd" } = req.query;
  if (!coins) return res.status(400).json({ error: "Missing coins parameter" });

  const coinList = (coins as string).split(",");
  const results: any[] = [];

  for (const coin of coinList) {
    const url = `${COINGECKO_BASE}/coins/${coin}/market_chart?vs_currency=${vs_currency}&days=${days}`;
    const start = Date.now();
    try {
      const r = await fetch(url);
      const data = await r.json();

      const entry = {
        ts: new Date().toISOString(),
        method: "GET",
        url_base: url.split("?")[0],
        status: r.status,
        duration_ms: Date.now() - start,
      };
      fs.appendFileSync(traceFile, JSON.stringify(entry) + "\n");

      results.push({ coin, status: r.status, data });
    } catch (e: any) {
      fs.appendFileSync(
        traceFile,
        JSON.stringify({ ts: new Date().toISOString(), coin, error: e?.message || "unknown" }) + "\n"
      );
      results.push({ coin, status: 500, error: e?.message || "unknown" });
    }
  }

  res.json({ items: results });
});

app.get("/crypto/history", async (req, res) => {
  const { coin = "bitcoin", days = "30", vs_currency = "usd" } = req.query;
  const url = `${COINGECKO_BASE}/coins/${coin}/market_chart?vs_currency=${vs_currency}&days=${days}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/mock", (_req, res) => {
  const mockData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "mock.json"), "utf-8")
  );
  res.json(mockData);
});

// --- Arranque ---
app.listen(PORT, () =>
  console.log(`Backend listening on http://localhost:${PORT}`)
);


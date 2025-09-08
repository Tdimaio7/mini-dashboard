import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Logs
const logDir = path.join(__dirname, "logs");
fs.mkdirSync(logDir, { recursive: true });
const traceFile = path.join(logDir, "http_trace.jsonl");

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// Ruta principal de prueba
app.get("/", (_req, res) => {
  res.send("Servidor corriendo en 3001");
});

// Ruta de historial de precios
app.get("/crypto/history", async (req, res) => {
  const { coin = "bitcoin", days = "30", vs_currency = "usd" } = req.query;
  const url = `${COINGECKO_BASE}/coins/${coin}/market_chart?vs_currency=${vs_currency}&days=${days}`;

  const start = Date.now();
  try {
    const r = await fetch(url);
    const data = await r.json();

    // Guardar log
    const entry = {
      ts: new Date().toISOString(),
      method: "GET",
      url_base: url.split("?")[0],
      status: r.status,
      duration_ms: Date.now() - start,
    };
    fs.appendFileSync(traceFile, JSON.stringify(entry) + "\n");

    res.json(data);
  } catch (e: any) {
    fs.appendFileSync(
      traceFile,
      JSON.stringify({
        ts: new Date().toISOString(),
        coin,
        error: e?.message || "unknown",
      }) + "\n"
    );
    res.status(500).json({ error: e?.message || "unknown" });
  }
});

// ✅ Endpoint mock
app.get("/mock", (_req, res) => {
  const mockData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "mock.json"), "utf-8")
  );
  res.json(mockData);
});

// ✅ Webhook para recibir alertas
app.post("/webhook", (req, res) => {
  const event = {
    ts: new Date().toISOString(),
    type: req.body.type || "custom",
    payload: req.body,
  };
  fs.appendFileSync(
    path.join(logDir, "webhook_events.jsonl"),
    JSON.stringify(event) + "\n"
  );
  console.log("📩 Webhook recibido:", event);
  res.json({ ok: true });
});

// Endpoint para consultar eventos guardados
app.get("/events", (_req, res) => {
  try {
    const filePath = path.join(logDir, "webhook_events.jsonl");
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }

    const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    const events = lines.map((line) => JSON.parse(line));
    res.json(events);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Error leyendo eventos" });
  }
});

// Arrancar servidor
app.listen(PORT, () =>
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
);

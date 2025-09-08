import { useState } from "react";
import { useFetchData } from "./hooks/useFetchData";
import { Charts } from "./components/charts";
import "./App.css";
import {
  averagePriceByDay,
  rollingAverageByCoin,
  topNByMarketCap,
  normalizeByCoin,
  dailyPercentChangeByCoin,
} from "./utils/transform";

interface CryptoData {
  date: string;
  coin: string;
  price: number;
  volume: number;
  market_cap: number;
}

interface CoinGeckoResponse {
  prices: [number, number][];
  total_volumes: [number, number][];
  market_caps: [number, number][];
}

function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<"bitcoin" | "ethereum" | "combined">("combined");
  const [highlightCoin, setHighlightCoin] = useState("");

  const { data: btcDataRaw, loading: loadingBtc, error: errorBtc } =
    useFetchData<CoinGeckoResponse>(
      "http://localhost:3001/crypto/history?coin=bitcoin&days=30"
    );
  const { data: ethDataRaw, loading: loadingEth, error: errorEth } =
    useFetchData<CoinGeckoResponse>(
      "http://localhost:3001/crypto/history?coin=ethereum&days=30"
    );

  const loading = loadingBtc || loadingEth;
  const error = errorBtc || errorEth;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!btcDataRaw || !ethDataRaw) return <p>No data available</p>;

  // --- Normalización de datos
  const btcData: CryptoData[] = btcDataRaw.prices.map(([t, p], i) => ({
    date: new Date(t).toISOString().split("T")[0],
    coin: "bitcoin",
    price: p,
    volume: btcDataRaw.total_volumes[i]?.[1] || 0,
    market_cap: btcDataRaw.market_caps[i]?.[1] || 0,
  }));
  const ethData: CryptoData[] = ethDataRaw.prices.map(([t, p], i) => ({
    date: new Date(t).toISOString().split("T")[0],
    coin: "ethereum",
    price: p,
    volume: ethDataRaw.total_volumes[i]?.[1] || 0,
    market_cap: ethDataRaw.market_caps[i]?.[1] || 0,
  }));
  const combinedData = [...btcData, ...ethData];

  // --- Filtrado por fechas y coin
  const filteredData = combinedData.filter(
    (i) =>
      (!startDate || i.date >= startDate) &&
      (!endDate || i.date <= endDate) &&
      (selectedCoin === "combined" || i.coin === selectedCoin)
  );

  // --- Mostrar mensaje si no hay datos
  if (filteredData.length === 0) return <p>No hay datos en este rango</p>;

  // --- Transformaciones
  const avgByDay = averagePriceByDay(filteredData).map((item) => ({
    ...item,
    coin: filteredData.find((d) => d.date === item.date)?.coin || "bitcoin",
  }));
  const rollingPrice = rollingAverageByCoin(filteredData, "price");
  const normalizedPrice = normalizeByCoin(filteredData, "price");
  const dailyChange = dailyPercentChangeByCoin(filteredData, "price");
  const top5MarketCap = topNByMarketCap(filteredData, 5).map((i) => ({
    coin: i.coin,
    market_cap: i.market_cap,
  }));

  // --- Drill-down BTC vs ETH
  const diffData = filteredData.reduce<
    Record<string, { btc?: CryptoData; eth?: CryptoData }>
  >((acc, item) => {
    if (!acc[item.date]) acc[item.date] = {};
    if (item.coin === "bitcoin") acc[item.date].btc = item;
    if (item.coin === "ethereum") acc[item.date].eth = item;
    return acc;
  }, {});

  return (
    <div className="app-container">
      <h1>Mini Dashboard - BTC vs ETH</h1>

      {/* Filtros */}
      <div className="filters">
        <label>
          Fecha inicio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Coin:
          <select
            value={selectedCoin}
            onChange={(e) =>
              setSelectedCoin(e.target.value as "bitcoin" | "ethereum" | "combined")
            }
          >
            <option value="bitcoin">BTC</option>
            <option value="ethereum">ETH</option>
            <option value="combined">Combined</option>
          </select>
        </label>
        {highlightCoin && (
          <button onClick={() => setHighlightCoin("")}>Reset Drill-Down</button>
        )}
      </div>

      {/* Charts */}
      <h2>Precio Promedio por Día</h2>
      <Charts
        type="line"
        data={avgByDay}
        xKey="date"
        yKey="avgPrice"
        groupKey="coin"
        highlightValue={highlightCoin}
        onItemClick={(v) => setHighlightCoin(String(v))}
      />

      <h2>Media Móvil (7 días)</h2>
      <Charts
        type="line"
        data={rollingPrice}
        xKey="date"
        yKey="value"
        groupKey="coin"
        highlightValue={highlightCoin}
        onItemClick={(v) => setHighlightCoin(String(v))}
      />

      <h2>Precio Normalizado</h2>
      <Charts
        type="line"
        data={normalizedPrice}
        xKey="date"
        yKey="normalized"
        groupKey="coin"
        highlightValue={highlightCoin}
        onItemClick={(v) => setHighlightCoin(String(v))}
      />

      <h2>Cambio Diario (%)</h2>
      <Charts
        type="line"
        data={dailyChange}
        xKey="date"
        yKey="change"
        groupKey="coin"
        highlightValue={highlightCoin}
        onItemClick={(v) => setHighlightCoin(String(v))}
      />

      <h2>Market Cap Top 5</h2>
      <Charts
        type="bar"
        data={top5MarketCap}
        xKey="coin"
        yKey="market_cap"
        groupKey="coin"
        highlightValue={highlightCoin}
        onItemClick={(v) => setHighlightCoin(String(v))}
      />

      {/* Tabla comparativa */}
      <h2>Detalle BTC vs ETH (Top 10)</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>BTC Precio</th>
              <th>ETH Precio</th>
              <th>Diferencia</th>
              <th>BTC Market Cap</th>
              <th>ETH Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(diffData)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 10)
              .map(([date, { btc, eth }]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>
                    {btc?.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td>
                    {eth?.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td>
                    {btc && eth
                      ? (btc.price - eth.price).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : "-"}
                  </td>
                  <td>{btc?.market_cap.toLocaleString()}</td>
                  <td>{eth?.market_cap.toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

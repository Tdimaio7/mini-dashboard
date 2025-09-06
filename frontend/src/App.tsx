import { useFetchData } from "./hooks/useFetchData";
import {
  averagePriceByDay,
  rollingAverageByCoin,
  topNByMarketCap,
  dailyPercentChangeByCoin,
  normalizeByCoin,
  joinByDateCoin
} from "./utils/transform";

function App() {
  const { data, loading, error } = useFetchData("http://localhost:3001/mock");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || data.length === 0) return <p>No data available</p>;

  // Transformaciones 
  const avgByDay = averagePriceByDay(data);
  const rollingPrice = rollingAverageByCoin(data, "price");
  const topByMarketCap = topNByMarketCap(data);
  const dailyChange = dailyPercentChangeByCoin(data, "price");
  const normalizedPrice = normalizeByCoin(data, "price");

  const joinedData = joinByDateCoin(data, data);

  return (
    <div>
      <h1>Mini Dashboard</h1>

      <h2>Tabla Original</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>date</th><th>coin</th><th>price</th><th>volume</th><th>market_cap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.date}</td>
              <td>{item.coin}</td>
              <td>{item.price}</td>
              <td>{item.volume}</td>
              <td>{item.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Promedio por Día</h2>
      <table border={1}>
        <thead><tr><th>date</th><th>avgPrice</th></tr></thead>
        <tbody>
          {avgByDay.map((item, idx) => (
            <tr key={idx}><td>{item.date}</td><td>{item.avgPrice}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Media Móvil (Precio) por Coin</h2>
      <table border={1}>
        <thead><tr><th>coin</th><th>date</th><th>value</th></tr></thead>
        <tbody>
          {rollingPrice.map((item, idx) => (
            <tr key={idx}>
              <td>{item.coin}</td>
              <td>{item.date}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Top 5 por Market Cap</h2>
      <table border={1}>
        <thead><tr><th>date</th><th>coin</th><th>price</th><th>volume</th><th>market_cap</th></tr></thead>
        <tbody>
          {topByMarketCap.map((item, idx) => (
            <tr key={idx}>
              <td>{item.date}</td>
              <td>{item.coin}</td>
              <td>{item.price}</td>
              <td>{item.volume}</td>
              <td>{item.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Cambio Porcentual Diario (Precio) por Coin</h2>
      <table border={1}>
        <thead><tr><th>coin</th><th>date</th><th>change (%)</th></tr></thead>
        <tbody>
          {dailyChange.map((item, idx) => (
            <tr key={idx}>
              <td>{item.coin}</td>
              <td>{item.date}</td>
              <td>{item.change.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Precio Normalizado por Coin</h2>
      <table border={1}>
        <thead><tr><th>coin</th><th>date</th><th>normalized</th></tr></thead>
        <tbody>
          {normalizedPrice.map((item, idx) => (
            <tr key={idx}>
              <td>{item.coin}</td>
              <td>{item.date}</td>
              <td>{item.normalized.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Join de Mock consigo mismo</h2>
      <table border={1}>
        <thead><tr><th>date</th><th>coin</th><th>price</th><th>volume</th><th>market_cap</th></tr></thead>
        <tbody>
          {joinedData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.date}</td>
              <td>{item.coin}</td>
              <td>{item.price}</td>
              <td>{item.volume}</td>
              <td>{item.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

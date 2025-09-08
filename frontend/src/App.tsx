import { useFetchData } from "./hooks/useFetchData";
import {
  averagePriceByDay,
  rollingAverageByCoin,
  topNByMarketCap,
  dailyPercentChangeByCoin,
  normalizeByCoin,
} from "./utils/transform";
import { Charts } from './components/charts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

function App() {
  const { data, loading, error } = useFetchData("http://localhost:3001/mock");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || data.length === 0) return <p>No data available</p>;

  // --- Transformaciones ---
  const avgByDay = averagePriceByDay(data).map(item => ({
    ...item,
    coin: "all",
  }));

  const rollingPrice = rollingAverageByCoin(data, "price");
  const dailyChange = dailyPercentChangeByCoin(data, "price");
  const normalizedPrice = normalizeByCoin(data, "price");
  const topByMarketCap = topNByMarketCap(data);

  return (
    <div className="app-container">
      <h1>Mini Dashboard</h1>

      {/* Líneas */}
      <h2>Gráfica Promedio por Día</h2>
      <Charts data={avgByDay} xKey="date" yKey="avgPrice" groupKey="coin" />

      <h2>Gráfica Media Móvil por Coin</h2>
      <Charts data={rollingPrice} xKey="date" yKey="value" groupKey="coin" />

      <h2>Gráfica Cambio Porcentual Diario por Coin</h2>
      <Charts data={dailyChange} xKey="date" yKey="change" groupKey="coin" />

      <h2>Gráfica Precio Normalizado por Coin</h2>
      <Charts data={normalizedPrice} xKey="date" yKey="normalized" groupKey="coin" />

      {/* Barra */}
      <h2>Top 5 por Market Cap (Barras)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topByMarketCap}>
          <XAxis dataKey="coin" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="market_cap" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Donut/Pie */}
      <h2>Distribución de Volumen por Coin (Donut)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={topByMarketCap}
            dataKey="volume"
            nameKey="coin"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {topByMarketCap.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;

import { useFetchData } from "./hooks/useFetchData";
import { CoinTable } from "./components/coinTable";

function App() {
  const { data, loading, error } = useFetchData("http://localhost:3001/mock");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div>
      <h1>Mini Dashboard</h1>
      <CoinTable data={data} />
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";

export interface CoinData {
  date: string;
  coin: string;
  price: number;
  volume: number;
  market_cap: number;
}

interface FetchResult {
  data: CoinData[] | null;
  loading: boolean;
  error: string | null;
}

export const useFetchData = (url: string): FetchResult => {
  const [data, setData] = useState<CoinData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error fetching data");
        const json = await res.json();
        setData(json.items);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

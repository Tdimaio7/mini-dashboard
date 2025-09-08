export type CoinData = {
  date: string;
  coin: string;
  price: number;
  volume: number;
  market_cap: number;
};

// Para transformaciones
export type AvgByDay = {
  date: string;
  avgPrice: number;
};

export type RollingValue = {
  date: string;
  value: number;
};

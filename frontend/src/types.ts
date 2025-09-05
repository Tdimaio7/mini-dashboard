export type CoinItem = {
  date: string;
  coin: string;
  price: number;
  volume: number;
  market_cap: number;
};

export type CoinData = {
  items: CoinItem[];
};

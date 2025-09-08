import type { CoinData } from "../types";

export interface HistoryData {
  prices: [number, number][];
}

// --- Promedio por día ---
export function averagePriceByDay(items: CoinData[]) {
  const grouped: Record<string, number[]> = {};
  items.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item.price);
  });
  return Object.entries(grouped).map(([date, prices]) => ({
    date,
    avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
  }));
}

// --- Media móvil ---
export function rollingAverageByCoin(
  items: CoinData[],
  key: keyof CoinData,
  windowSize = 7
) {
  const grouped: Record<string, CoinData[]> = {};
  items.forEach((i) => {
    if (!grouped[i.coin]) grouped[i.coin] = [];
    grouped[i.coin].push(i);
  });

  const result: { coin: string; date: string; value: number }[] = [];
  Object.entries(grouped).forEach(([coin, list]) => {
    for (let i = 0; i < list.length; i++) {
      const slice = list.slice(Math.max(i - windowSize + 1, 0), i + 1);
      const sum = slice.reduce((acc, cur) => acc + (cur[key] as number), 0);
      result.push({ coin, date: list[i].date, value: sum / slice.length });
    }
  });
  return result;
}

// --- Top-N market cap ---
export function topNByMarketCap(items: CoinData[], n = 5) {
  return [...items].sort((a, b) => b.market_cap - a.market_cap).slice(0, n);
}

// --- Cambio % diario ---
export function dailyPercentChangeByCoin(
  items: CoinData[],
  key: keyof CoinData
) {
  const grouped: Record<string, CoinData[]> = {};
  items.forEach((i) => {
    if (!grouped[i.coin]) grouped[i.coin] = [];
    grouped[i.coin].push(i);
  });

  const result: { coin: string; date: string; change: number }[] = [];
  Object.entries(grouped).forEach(([coin, list]) => {
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1][key] as number;
      const curr = list[i][key] as number;
      const change = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
      result.push({ coin, date: list[i].date, change });
    }
  });
  return result;
}

// --- Normalización ---
export function normalizeByCoin(items: CoinData[], key: keyof CoinData) {
  const grouped: Record<string, CoinData[]> = {};
  items.forEach((i) => {
    if (!grouped[i.coin]) grouped[i.coin] = [];
    grouped[i.coin].push(i);
  });

  const result: { coin: string; date: string; normalized: number }[] = [];
  Object.entries(grouped).forEach(([coin, list]) => {
    const values = list.map((i) => i[key] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    list.forEach((i) =>
      result.push({
        coin,
        date: i.date,
        normalized: max === min ? 0 : ((i[key] as number) - min) / (max - min),
      })
    );
  });
  return result;
}

// --- Join ---
export function joinByDateCoin(a: CoinData[], b: CoinData[]) {
  return a.map((itemA) => {
    const match = b.find(
      (itemB) => itemB.date === itemA.date && itemB.coin === itemA.coin
    );
    return { ...itemA, ...match };
  });
}

// --- Transformación raw API ---
export function transformHistory(raw: HistoryData) {
  return raw.prices.map(([ts, price]) => ({
    date: new Date(ts).toLocaleDateString(),
    price,
  }));
}

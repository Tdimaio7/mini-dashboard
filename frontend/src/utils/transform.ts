import type { CoinData } from '../types';

// Promedio de precio por dia
export function averagePriceByDay(items: CoinData[]): { date: string; avgPrice: number }[] {
  const grouped: Record<string, number[]> = {};

  items.forEach(item => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item.price);
  });

  return Object.entries(grouped).map(([date, prices]) => ({
    date,
    avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
  }));
}

// Rolling window
export function rollingAverageByCoin(
  items: CoinData[],
  key: keyof CoinData,
  windowSize = 7
): { coin: string; date: string; value: number }[] {
  const grouped: Record<string, CoinData[]> = {};
  items.forEach(item => {
    if (!grouped[item.coin]) grouped[item.coin] = [];
    grouped[item.coin].push(item);
  });

  const result: { coin: string; date: string; value: number }[] = [];

  Object.entries(grouped).forEach(([coin, list]) => {
    // Ordenar por fecha
    const sorted = list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < sorted.length; i++) {
      const slice = sorted.slice(Math.max(i - windowSize + 1, 0), i + 1);
      const sum = slice.reduce((acc, cur) => acc + Number(cur[key]), 0);
      result.push({ coin, date: sorted[i].date, value: sum / slice.length });
    }
  });

  return result;
}

// Top‑N por market cap
export function topNByMarketCap(items: CoinData[], n = 5): CoinData[] {
  return [...items].sort((a, b) => b.market_cap - a.market_cap).slice(0, n);
}

// Cambio porcentual diario agrupado por coin
export function dailyPercentChangeByCoin(
  items: CoinData[],
  key: keyof CoinData
): { coin: string; date: string; change: number }[] {
  const grouped: Record<string, CoinData[]> = {};
  items.forEach(item => {
    if (!grouped[item.coin]) grouped[item.coin] = [];
    grouped[item.coin].push(item);
  });

  const result: { coin: string; date: string; change: number }[] = [];

  Object.entries(grouped).forEach(([coin, list]) => {
    const sorted = list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 1; i < sorted.length; i++) {
      const prev = Number(sorted[i - 1][key]);
      const curr = Number(sorted[i][key]);
      const change = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
      result.push({ coin, date: sorted[i].date, change });
    }
  });

  return result;
}

// Normalizacion agrupada por coin
export function normalizeByCoin(
  items: CoinData[],
  key: keyof CoinData
): { coin: string; date: string; normalized: number }[] {
  const grouped: Record<string, CoinData[]> = {};
  items.forEach(item => {
    if (!grouped[item.coin]) grouped[item.coin] = [];
    grouped[item.coin].push(item);
  });

  const result: { coin: string; date: string; normalized: number }[] = [];

  Object.entries(grouped).forEach(([coin, list]) => {
    const values = list.map(i => Number(i[key]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    list.forEach(i => {
      result.push({
        coin,
        date: i.date,
        normalized: max === min ? 0 : (Number(i[key]) - min) / (max - min),
      });
    });
  });

  return result;
}

// Join entre dos arrays de coindata por date y coin
export function joinByDateCoin(a: CoinData[], b: CoinData[]): (CoinData & Partial<CoinData>)[] {
  return a.map(itemA => {
    const match = b.find(itemB => itemB.date === itemA.date && itemB.coin === itemA.coin);
    return { ...itemA, ...match }; // agrega campos de b si existen
  });
}

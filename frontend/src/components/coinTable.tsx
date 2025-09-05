import React from "react";
import type { CoinData } from "../hooks/useFetchData";

interface Props {
  data: CoinData[];
}

export const CoinTable: React.FC<Props> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Coin</th>
          <th>Price</th>
          <th>Volume</th>
          <th>Market Cap</th>
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
  );
};

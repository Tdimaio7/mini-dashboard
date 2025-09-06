type CoinTableProps<T extends object> = {  
  data: T[];
};

export function CoinTable<T extends object>({ data }: CoinTableProps<T>) { 
  if (!data.length) return <p>No data available</p>;

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, j) => (
              <td key={j}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

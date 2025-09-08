import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartValue = string | number;

interface ChartsProps<T extends Record<string, ChartValue>> {
  type?: "line" | "bar" | "pie";
  data: T[];
  xKey?: keyof T;
  yKey: keyof T;
  groupKey?: keyof T;
  onItemClick?: (value: string | number) => void;
  highlightValue?: string;
  colors?: Record<string, string>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

export const Charts = <T extends Record<string, ChartValue>>({
  type = "line",
  data,
  xKey,
  yKey,
  groupKey,
  onItemClick,
  highlightValue,
}: ChartsProps<T>) => {
  if (!data || data.length === 0) return null;

  switch (type) {
    case "line": {
      if (groupKey) {
        const groups = Array.from(new Set(data.map((d) => d[groupKey] as ChartValue)));

        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey as string} />
              <YAxis />
              <Tooltip />
              <Legend />
              {groups.map((g, idx) => (
                <Line
                  key={String(g)}
                  type="monotone"
                  dataKey={yKey as string}
                  data={data.filter((d) => d[groupKey] === g)}
                  name={String(g)}
                  stroke={
                    highlightValue === String(g)
                      ? "#ff0000"
                      : COLORS[idx % COLORS.length]
                  }
                  strokeWidth={highlightValue === String(g) ? 3 : 2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  onClick={() => onItemClick && onItemClick(g)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      }

      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              key="line"
              type="monotone"
              dataKey={yKey as string}
              stroke={COLORS[0]}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    case "bar":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={yKey as string}
              fill={COLORS[0]}
              onClick={(_, index) =>
                onItemClick && onItemClick(data[index][xKey as keyof T])
              }
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey as string}
              nameKey={xKey as string}
              outerRadius={100}
              label
              onClick={(entry) =>
                onItemClick &&
                onItemClick(entry[xKey as keyof typeof entry] as ChartValue)
              }
            >
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={COLORS[idx % COLORS.length]}
                  stroke={
                    highlightValue === String(data[idx][xKey as keyof T])
                      ? "#ff0000"
                      : undefined
                  }
                  strokeWidth={
                    highlightValue === String(data[idx][xKey as keyof T])
                      ? 3
                      : 1
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};

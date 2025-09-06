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
  ResponsiveContainer
} from 'recharts';

type ChartValue = string | number;

interface ChartsProps<T extends Record<string, ChartValue>> {
  type?: 'line' | 'bar' | 'pie';
  data: T[];
  xKey?: keyof T;
  yKey: keyof T;
  groupKey?: keyof T;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF'];

export const Charts = <T extends Record<string, ChartValue>>({
  type = 'line',
  data,
  xKey,
  yKey,
  groupKey
}: ChartsProps<T>) => {
  if (!data || data.length === 0) return null;

  switch (type) {
    case 'line': {
      const lines = groupKey
        ? Array.from(new Set(data.map(d => d[groupKey] as ChartValue))).map((g, idx) => (
            <Line
              key={String(g)}
              type="monotone"
              dataKey={yKey as string}
              data={data.filter(d => d[groupKey] === g)}
              name={String(g)}
              stroke={COLORS[idx % COLORS.length]}
            />
          ))
        : [<Line key="line" type="monotone" dataKey={yKey as string} stroke={COLORS[0]} />];

      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey as string} fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey as string}
              nameKey={xKey as string}
              outerRadius={100}
              label
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
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

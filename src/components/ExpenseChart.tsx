import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer } from 'recharts';

interface Gasto {
  id: string;
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
}

interface Props {
  gastos: Gasto[];
}

const categoryColors: Record<string, string> = {
  'Alimentação': '#f59e0b',
  'Transporte': '#3b82f6',
  'Moradia': '#ef4444',
  'Saúde': '#10b981',
  'Lazer': '#8b5cf6',
  'Outros': '#6b7280'
};

export default function ExpenseChart({ gastos }: Props) {

  interface ChartData {
    name: string;
    value: number;
  }

  const data: ChartData[] = Object.values(
    gastos.reduce((acc: Record<string, ChartData>, gasto) => {
      if (!acc[gasto.categoria]) {
        acc[gasto.categoria] = { name: gasto.categoria, value: 0 };
      }
      acc[gasto.categoria].value += gasto.valor;
      return acc;
    }, {})
  );

  return (
    <div className="bg-gray-800/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">
  Gastos por categoria 📊
</h2>

      <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      outerRadius={100}
      innerRadius={50} // 🔥 deixa estilo "donut"
      paddingAngle={3}
    >
      {data.map((item, index) => (
        <Cell
          key={index}
          fill={categoryColors[item.name] || '#ccc'}
        />
      ))}
    </Pie>

    <Tooltip
      contentStyle={{
        backgroundColor: '#111827',
        border: 'none',
        borderRadius: '10px',
        color: 'white'
      }}
    />

    <Legend /> {/* 🔥 adiciona legenda */}
  </PieChart>
</ResponsiveContainer>
    </div>
  );
}
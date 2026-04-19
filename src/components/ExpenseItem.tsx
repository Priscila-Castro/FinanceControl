interface Gasto {
  id: string;
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
}

interface Props {
  gasto: Gasto;
  onRemove: (id: string) => void;
  moeda: string;
}

const categoryColors: Record<string, string> = {
  'Alimentação': 'bg-yellow-500 text-black',
  'Transporte': 'bg-blue-500 text-white',
  'Moradia': 'bg-red-500 text-white',
  'Saúde': 'bg-green-500 text-white',
  'Lazer': 'bg-purple-500 text-white',
  'Outros': 'bg-gray-600 text-white'
};

export default function ExpenseItem({ gasto, onRemove, moeda }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <p className="text-2xl font-bold text-gray-800">
            {gasto.valor.toLocaleString('pt-BR', {
              style: 'currency',
              currency: moeda || 'BRL'
            })}
          </p>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${categoryColors[gasto.categoria] || 'bg-gray-700 text-white'}`}>{gasto.categoria}
          </span>
        </div>

        {gasto.descricao && (
          <p className="text-gray-600 mb-2">{gasto.descricao}</p>
        )}

        <p className="text-sm text-gray-400">
          {new Date(gasto.data + 'T00:00:00').toLocaleDateString('pt-BR')}
        </p>
      </div>

      <button
        onClick={() => onRemove(gasto.id)}
        className="text-red-500 text-2xl p-2"
      >
        ×
      </button>
    </div>
  );
}
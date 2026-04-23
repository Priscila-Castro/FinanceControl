import React from 'react';

interface Props {
  valor: string;
  setValor: (v: string) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  data: string;
  setData: (v: string) => void;
  descricao: string;
  setDescricao: (v: string) => void;
  categorias: string[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  categoriaCustom: string;
  setCategoriaCustom: (valor: string) => void;
  moeda: string;
  recorrente: boolean;
  setRecorrente: (v: boolean) => void;
}

const simbolosMoeda: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€'
};

export default function ExpenseForm({
  valor,
  setValor,
  categoria,
  setCategoria,
  data,
  setData,
  descricao,
  setDescricao,
  categorias,
  onSubmit,
  onCancel,
  moeda,
  categoriaCustom,
  setCategoriaCustom,
  recorrente,
  setRecorrente
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-800/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg mb-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">
        Novo Gasto
      </h2>

      {/* Valor */}
      <div>
        <label className="block text-gray-300 mb-1">
          Valor ({simbolosMoeda[moeda] || 'R$'})
        </label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0.00"
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder-gray-400"
          required
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-gray-300 mb-1">
          Categoria
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white"
          required
        >
          <option value="">Selecione...</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {categoria === 'Outros' && (
          <div className="mt-3">
            <label className="block text-gray-300 mb-1">
              Nova categoria
            </label>

            <input
              type="text"
              value={categoriaCustom}
              onChange={(e) => setCategoriaCustom(e.target.value)}
              placeholder="Ex: Pets, Estudos..."
              className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white"
            />
          </div>
        )}
      </div>

      {/* Data */}
      <div>
        <label className="block text-gray-300 mb-1">
          Data
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white"
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-gray-300 mb-1">
          Descrição
        </label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: almoço"
          className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder-gray-400"
        />
      </div>

      <label className="flex items-center gap-2 mt-2 text-sm">
        <input
          type="checkbox"
          checked={recorrente}
          onChange={(e) => setRecorrente(e.target.checked)}
        />
        Repetir por 6 meses
      </label>

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-400 active:scale-95 transition transform text-white py-3 rounded-xl"
        >
          Salvar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart'

interface Gasto {
  id: string;
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
}

export default function App() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [descricao, setDescricao] = useState('');
  const [nome, setNome] = useState('');
  const [nomeTemp, setNomeTemp] = useState('');
  const [mostrarBoasVindas, setMostrarBoasVindas] = useState<boolean>(false);
  const [TotalRecebido, setTotalRecebido] = useState<string>('');
  const [MesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem('financeData') || '{}');

  if (data[MesSelecionado]) {
    setGastos(data[MesSelecionado].gastos || []);
    setTotalRecebido(data[MesSelecionado].totalRecebido || '');
  } else {
    setGastos([]);
    setTotalRecebido('');
  }
}, [MesSelecionado]);

useEffect(() => {
  const data = JSON.parse(localStorage.getItem('financeData') || '{}');

  data[MesSelecionado] = {
    gastos: gastos,
    totalRecebido: TotalRecebido
  };

  localStorage.setItem('financeData', JSON.stringify(data));
}, [gastos, TotalRecebido, MesSelecionado]);

useEffect(() => {
  if (!nome) return;

  const data = JSON.parse(localStorage.getItem('financeData') || '{}');

  if (data[nome]?.[MesSelecionado]) {
    setGastos(data[nome][MesSelecionado].gastos || []);
    setTotalRecebido(data[nome][MesSelecionado].totalRecebido || '');
  } else {
    setGastos([]);
    setTotalRecebido('');
  }
}, [MesSelecionado, nome]);

useEffect(() => {
  if (!nome) return;

  const data = JSON.parse(localStorage.getItem('financeData') || '{}');

  if (!data[nome]) {
    data[nome] = {};
  }

  data[nome][MesSelecionado] = {
    gastos,
    totalRecebido: TotalRecebido
  };

  localStorage.setItem('financeData', JSON.stringify(data));
}, [gastos, TotalRecebido, MesSelecionado, nome]);

const salvarNome = () => {
  if (!nomeTemp) return;

  localStorage.setItem('nome', nomeTemp);
  setNome(nomeTemp);

  // opcional: mostrar boas-vindas
  setMostrarBoasVindas(true);
};

useEffect(() => {
  const nomeSalvo = localStorage.getItem('nome');

  if (nomeSalvo) {
    setNome(nomeSalvo);

    const jaViu = localStorage.getItem(`jaViuBoasVindas_${nomeSalvo}`);

    if (!jaViu) {
      setMostrarBoasVindas(true);
    }
  }
}, []);

  const categorias = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Lazer',
    'Outros'
  ];

  const adicionarGasto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!valor || !categoria) return;

    const novoGasto: Gasto = {
      id: Date.now().toString(),
      valor: parseFloat(valor),
      categoria,
      data,
      descricao
    };

    setGastos([novoGasto, ...gastos]);

    setValor('');
    setCategoria('');
    setData(new Date().toISOString().split('T')[0]);
    setDescricao('');
    setMostrarFormulario(false);
  };

  const removerGasto = (id: string) => {
    setGastos(gastos.filter(g => g.id !== id));
  };

  const totalMes = gastos.reduce((acc, gasto) => acc + gasto.valor, 0);
  const saldo = parseFloat(TotalRecebido || '0') - totalMes;

  function formatarMes(mes: string) {
  const [ano, mesNum] = mes.split('-');

  const data = new Date(Number(ano), Number(mesNum) - 1);

  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}

const meses = Array.from({ length: 12 }, (_, i) => {
  const data = new Date();
  data.setMonth(data.getMonth() - i);

  return data.toISOString().slice(0, 7);
});

  if (!nome) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-4">
          Olá! 😊
        </h1>

        <p className="mb-4 text-gray-600">
          Como você se chama?
        </p>

        <input
          type="text"
          value={nomeTemp}
          onChange={(e) => setNomeTemp(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4"
          placeholder="Digite seu nome"
        />

        <button
          onClick={salvarNome}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold"
        >
          Começar
        </button>
      </div>
    </div>
  );
}

 return (
  <>
    {mostrarBoasVindas && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm text-center border border-white/10">
          <h2 className="text-xl font-bold mb-3 text-white">
            Bem-vinda, {nome}! 💙
          </h2>

          <p className="text-gray-300 mb-4">
            Este app foi criado especialmente para você começar a cuidar melhor das suas finanças.
          </p>

          <button
             onClick={() => {
              setMostrarBoasVindas(false);
              localStorage.setItem(`jaViuBoasVindas_${nome}`, 'true');
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl"
          >
            Começar
          </button>
        </div>
      </div>
    )}

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Selecionar mês */}
        <div className="bg-gray-800/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
        <p className="text-gray-300 mb-3">Selecionar mês</p>

        <div className="flex gap-2 overflow-x-auto pb-2">
        {meses.map((mes) => (
          <button
            key={mes}
            onClick={() => setMesSelecionado(mes)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            MesSelecionado === mes
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
        {formatarMes(mes)}
      </button>
    ))}
  </div>
</div>

        {/* Botão trocar usuário */}
        <button
          onClick={() => {
            localStorage.removeItem('nome');
            location.reload();
          }}
          className="w-full bg-blue-500 hover:bg-blue-400 active:scale-95 transition transform text-white py-3 rounded-xl shadow-lg"
        >
          Trocar usuário
        </button>

        {/* Header */}
        <Header total={totalMes} nome={nome} />

        {/* Card saldo */}
        <div className="bg-gray-800/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-300 mb-2">
            Total recebido no mês
          </p>

          <input
            type="number"
            value={TotalRecebido}
            onChange={(e) => setTotalRecebido(e.target.value)}
            placeholder="Ex: 3000"
            className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder-gray-400 mb-4"
          />

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Saldo restante:</span>
            <span className={`text-xl font-bold ${saldo < 0 ? 'text-red-400' : 'text-green-400'}`}>
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-sm text-gray-400 mt-3">
            Este mês você já gastou <span 
            className="font-semibold">R$ {totalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
            </span>
          </p>
        </div>

        {/* Gráfico */}
        <ExpenseChart gastos={gastos} />

        {/* Botão adicionar */}
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="w-full bg-blue-500 hover:bg-blue-400 active:scale-95 transition transform text-white py-4 rounded-xl shadow-lg"
          >
            + Adicionar Gasto
          </button>
        )}

        {/* Formulário */}
        {mostrarFormulario && (
          <ExpenseForm
            valor={valor}
            setValor={setValor}
            categoria={categoria}
            setCategoria={setCategoria}
            data={data}
            setData={setData}
            descricao={descricao}
            setDescricao={setDescricao}
            categorias={categorias}
            onSubmit={adicionarGasto}
            onCancel={() => setMostrarFormulario(false)}
          />
        )}

        {/* Lista */}
        <ExpenseList gastos={gastos} onRemove={removerGasto} />

      </div>
    </div>
  </>
);
}
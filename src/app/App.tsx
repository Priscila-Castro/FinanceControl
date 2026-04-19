import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

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
  const [categoriaCustom, setCategoriaCustom] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [step, setStep] = useState(0);
  const steps = [
    {
    text: "Aqui você escolhe o mês 📅",
    target: ".mes-selector"
  },
  {
    text: "Digite aqui quanto você recebeu no mês 💰",
    target: ".saldo-card"
  },
  {
    text: "Clique aqui para adicionar um gasto ➕",
    target: ".add-button"
  }
];
  const [mostrarTour, setMostrarTour] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [nome, setNome] = useState('');
  const [nomeTemp, setNomeTemp] = useState('');
  const [mostrarBoasVindas, setMostrarBoasVindas] = useState<boolean>(false);
  const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: moeda || 'BRL'
  });
};
  const [moeda, setMoeda] = useState('');
  const [mostrarMoeda, setMostrarMoeda] = useState(false);
  const highlightStyle = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) return {};

  const rect = el.getBoundingClientRect();

  return {
    position: 'absolute' as const,
    top: rect.top + window.scrollY - 8,
    left: rect.left + window.scrollX - 8,
    width: rect.width + 16,
    height: rect.height + 16,
    borderRadius: '12px',
    border: '2px solid #3b82f6',
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
    pointerEvents: 'none' as const,
    zIndex: 60,
  };
};
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

  const moedaSalva = localStorage.getItem(`moeda_${nome}`);

  if (!moedaSalva) {
    setMostrarMoeda(true);
  } else {
    setMoeda(moedaSalva);
    setMostrarMoeda(false);
  }
}, [nome]);

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
  if (!nome) return;

  const viu = localStorage.getItem(`tour_${nome}`);

  setMostrarTour(!viu);
}, [nome]);

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

  useEffect(() => {
    const el = document.querySelector(steps[step].target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step]);


  const [categorias, setCategorias] = useState([
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Lazer',
    'Outros'
  ]);

  useEffect(() => {
    if (!nome) return;

    const categoriasSalvas = localStorage.getItem(`categorias_${nome}`);

    if (categoriasSalvas) {
      setCategorias(JSON.parse(categoriasSalvas));
    }
  }, [nome]);

  useEffect(() => {
    if (!nome) return;

    localStorage.setItem(
      `categorias_${nome}`,
      JSON.stringify(categorias)
    );
  }, [categorias, nome]);

  const adicionarGasto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!valor || !categoria) return;

    if (
      categoria === 'Outros' &&
      categoriaCustom &&
      !categorias.includes(categoriaCustom)
    ) {
      setCategorias([...categorias, categoriaCustom]);
    }

    const novoGasto: Gasto = {
      id: Date.now().toString(),
      valor: parseFloat(valor),
      categoria: categoria === 'Outros' ? categoriaCustom : categoria,
      data,
      descricao
    };

    setGastos([novoGasto, ...gastos]);

    setValor('');
    setCategoria('');
    setData(new Date().toISOString().split('T')[0]);
    setDescricao('');
    setCategoriaCustom('');
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
    {/* Boas-vindas */}
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

    {/* TOUR */}
    {mostrarTour && (
  <>
    <div style={highlightStyle(steps[step].target)} />

    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-6 rounded-2xl shadow-xl max-w-sm w-full z-[100] border border-white/10">
      <p className="mb-4 text-center">
        {steps[step].text}
      </p>

      <div className="flex justify-between">
        <button
          onClick={() => {
            setMostrarTour(false);
            localStorage.setItem(`tour_${nome}`, 'true');
          }}
          className="text-gray-400"
        >
          Pular
        </button>

        <button
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              setMostrarTour(false);
              localStorage.setItem(`tour_${nome}`, 'true');
            }
          }}
          className="text-blue-400"
        >
          Próximo →
        </button>
      </div>
    </div>
  </>
)}

    {mostrarMoeda && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm w-full text-center border border-white/10">

          <h2 className="text-xl font-bold mb-4 text-white">
            Escolha sua moeda 💰
          </h2>

          <p className="text-gray-400 mb-4">
            Isso será usado para mostrar seus valores no app
          </p>

          <select
            value={moeda}
            onChange={(e) => setMoeda(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-gray-800 text-white border border-white/10"
          >
            <option value="">Selecione</option>
            <option value="BRL">🇧🇷 Real (R$)</option>
            <option value="EUR">🇪🇺 Euro (€)</option>
            <option value="USD">🇺🇸 Dólar ($)</option>
          </select>

          <button
            disabled={!moeda}
            onClick={() => {
              localStorage.setItem(`moeda_${nome}`, moeda);
              setMostrarMoeda(false);
            }}
            className={`w-full py-3 rounded-xl font-semibold ${
              moeda
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>

        </div>
      </div>
    )}

    {/* APP */}
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Selecionar mês */}
        <div className="mes-selector bg-gray-800/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
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

        {/* Trocar usuário */}
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
        <Header total={totalMes} nome={nome} moeda={moeda} />

        {/* Saldo */}
        <div className="saldo-card bg-gray-800/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-300 mb-2">
            Quanto você recebeu este mês 💰
          </p>

          <input
            type="number"
            value={TotalRecebido}
            onChange={(e) => setTotalRecebido(e.target.value)}
            placeholder="Ex: 3000 (seu salário)"
            className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder-gray-400 mb-4"
          />

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Saldo restante:</span>
            <span className={`text-xl font-bold ${saldo < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {formatarMoeda(saldo)}
            </span>
          </div>
        </div>

        {/* Gráfico */}
        <ExpenseChart gastos={gastos} />

        {/* Botão adicionar */}
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="add-button w-full bg-blue-500 hover:bg-blue-400 active:scale-95 transition transform text-white py-4 rounded-xl shadow-lg"
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
            categoriaCustom={categoriaCustom}
            setCategoriaCustom={setCategoriaCustom}
            onSubmit={adicionarGasto}
            onCancel={() => setMostrarFormulario(false)}
            moeda={moeda}
          />
        )}

        {/* Lista */}
        <ExpenseList
          gastos={gastos}
          onRemove={removerGasto}
          moeda={moeda}
        />

      </div>
    </div>
  </>
);
}

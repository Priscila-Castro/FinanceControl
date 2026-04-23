import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import { supabase } from '../supabaseClient';
import Auth from '../components/Auth';

interface Gasto {
  id: string;
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
}

export default function App() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [session, setSession] = useState<any>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categoriaCustom, setCategoriaCustom] = useState('');
  const [recorrente, setRecorrente] = useState(false);
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
  const [recebidoPorMes, setRecebidoPorMes] = useState<Record<string, string>>({});
  const [MesSelecionado, setMesSelecionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

useEffect(() => {
  if (!session?.user) return;

  const jaViu = localStorage.getItem(`jaViuBoasVindas_${session.user.id}`);

  if (!jaViu) {
    // ✅ Espera o nome carregar antes de mostrar
    const buscarNomeEMostrar = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setNomeUsuario(data.nome);
      }

      setMostrarBoasVindas(true);
    };

    buscarNomeEMostrar();
  }
}, [session]);

useEffect(() => {
  if (!session?.user) return;

  const moedaSalva = localStorage.getItem(`moeda_${session.user.id}`);

  if (!moedaSalva) {
    setMostrarMoeda(true);
  } else {
    setMoeda(moedaSalva);
    setMostrarMoeda(false);
  }
}, [session]);

useEffect(() => {
  if (!session?.user) return;

  const jaViu = localStorage.getItem(`jaViuBoasVindas_${session.user.id}`);

  if (!jaViu) {
    setMostrarBoasVindas(true);
  }
}, [session]);

useEffect(() => {
  if (!session?.user) return;

  const viu = localStorage.getItem(`tour_${session.user.id}`);
  setMostrarTour(!viu);
}, [session]);


useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => subscription.unsubscribe();
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

//   useEffect(() => {
//   if (!session?.user) return;

//   const categoriasSalvas = localStorage.getItem(
//     `categorias_${session.user.id}`
//   );

//   if (categoriasSalvas) {
//     setCategorias(JSON.parse(categoriasSalvas));
//   }
// }, [session]);

// useEffect(() => {
//   if (!session?.user) return;

//   localStorage.setItem(
//     `categorias_${session.user.id}`,
//     JSON.stringify(categorias)
//   );
// }, [categorias, session]);

// Buscar categorias do Supabase
useEffect(() => {
  if (!session?.user) return;
  buscarCategorias();
}, [session]);

const buscarCategorias = async () => {
  const user = session?.user;

  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('user_id', user?.id);

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    return;
  }

  const nomes = data?.map(c => c.nome) || [];

  // Mantém as categorias padrão + as do utilizador
  const categoriasPadrao = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Outros'];
  const todasCategorias = [...new Set([...categoriasPadrao, ...nomes])];

  setCategorias(todasCategorias);
};

  const adicionarGasto = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!valor || !categoria || !session?.user) return;

  if (categoria === 'Outros' && categoriaCustom && !categorias.includes(categoriaCustom)) {
  const user = session?.user;

  await supabase.from('categorias').insert([{
    nome: categoriaCustom,
    user_id: user?.id
  }]);

  setCategorias([...categorias, categoriaCustom]);
}

  const novoGasto: Gasto = {
    id: Date.now().toString(),
    valor: parseFloat(valor),
    categoria: categoria === 'Outros' ? categoriaCustom : categoria,
    data,
    descricao
  };

  try {
  const user = session?.user;
  if (!user) return;

  const gastosParaSalvar: any[] = [];

  if (recorrente) {
    for (let i = 0; i < 6; i++) {
      const novaData = new Date(data);
      novaData.setMonth(novaData.getMonth() + i);

      gastosParaSalvar.push({
        valor: parseFloat(valor),
        categoria: categoria === 'Outros' ? categoriaCustom : categoria,
        data: novaData.toISOString().split('T')[0],
        descricao,
        user_id: user.id
      });
    }
  } else {
    gastosParaSalvar.push({
      valor: parseFloat(valor),
      categoria: categoria === 'Outros' ? categoriaCustom : categoria,
      data,
      descricao,
      user_id: user.id
    });
  }

  const { data: novosGastos, error } = await supabase
    .from('gastos')
    .insert(gastosParaSalvar)
    .select();

  if (error) throw error;

  setGastos([...(novosGastos || []), ...gastos]);

  setValor('');
  setCategoria('');
  setDescricao('');
  setCategoriaCustom('');
  setRecorrente(false);
  setMostrarFormulario(false); // fecha o formulário

} catch (err) {
  console.error('Erro ao salvar no Supabase:', err);
}
};

  const removerGasto = async (id: string) => {
  try {
    await supabase.from('gastos').delete().eq('id', id);

    setGastos(gastos.filter(g => g.id !== id));
  } catch (err) {
    console.error('Erro ao remover:', err);
  }
};

  const gastosFiltrados = gastos.filter((gasto) => {
  return gasto.data.startsWith(MesSelecionado);
});

  const totalMes = gastosFiltrados.reduce((acc, gasto) => acc + gasto.valor, 0);
  const recebidoAtual = recebidoPorMes[MesSelecionado] || '0';

  const saldo = parseFloat(recebidoAtual) - totalMes;

  function formatarMes(mes: string) {
  const [ano, mesNum] = mes.split('-');

  const data = new Date(Number(ano), Number(mesNum) - 1);

  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}

const buscarRecebimentos = async () => {
  const user = session?.user;

  const { data, error } = await supabase
    .from('recebimentos')
    .select('*')
    .eq('user_id', user?.id);

  if (error) {
    console.error('Erro ao buscar recebimentos:', error);
    return;
  }

  const objeto = (data || []).reduce((acc, item) => {
    return {
      ...acc,
      [item.mes]: String(item.valor)
    };
  }, {});

  setRecebidoPorMes(objeto);
};

useEffect(() => {
  if (session) {
    buscarRecebimentos();
  }
}, [session]);
  const meses = Array.from({ length: 12 }, (_, i) => {
  const data = new Date();
  data.setMonth(data.getMonth() - i);

  return data.toISOString().slice(0, 7);
});

  const buscarGastos = async () => {
    const user = session?.user;

    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar gastos:', error);
      return;
    }

    setGastos(data || []);
};

const apagarConta = async () => {
  const confirmacao = window.confirm('Tens a certeza? Esta ação é irreversível e apaga todos os teus dados.');
  
  if (!confirmacao) return;

  const { error } = await supabase.rpc('delete_user');
  
  if (error) {
    console.error('Erro ao apagar conta:', error);
    return;
  }

  await supabase.auth.signOut();
}

  useEffect(() => {
    if (session) {
      buscarGastos();
    }
  }, [session]);

if (!session) {
  return <Auth />;
}

return (
  <>
    {/* Boas-vindas */}
    {mostrarBoasVindas && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm text-center border border-white/10">
          <h2 className="text-xl font-bold mb-3 text-white">
            Bem-vinda, {nomeUsuario}! 💙
          </h2>

          <p className="text-gray-300 mb-4">
            Este app foi criado especialmente para você começar a cuidar melhor das suas finanças.
          </p>

          <button
            onClick={() => {
              setMostrarBoasVindas(false);
              localStorage.setItem(`jaViuBoasVindas_${session?.user?.id}`, 'true');
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
            localStorage.setItem(`tour_${session?.user?.id}`, 'true');
          }}
          className="text-gray-400"
        >
          Pular
        </button>

        <button
          onClick={() => {
            if (!session?.user) return;

            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              setMostrarTour(false);
              localStorage.setItem(`tour_${session?.user?.id}`, 'true');
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
              if (!moeda || !session?.user) return;

              localStorage.setItem(`moeda_${session.user.id}`, moeda);
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

        {/* Header */}
        <Header 
          total={totalMes} 
          nome={nomeUsuario} 
          moeda={moeda}
          onLogout={async () => await supabase.auth.signOut()}
          onApagarConta={apagarConta}
        />

        {/* Saldo */}
        <div className="saldo-card bg-gray-800/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg">
          <p className="text-sm text-gray-300 mb-2">
            Quanto você recebeu este mês 💰
          </p>

          <input
            type="number"
            value={recebidoPorMes[MesSelecionado] || ''}
            onChange={async (e) => {
              const novoValor = e.target.value;

              console.log('digitando:', novoValor);
    // 1. atualiza estado local
            setRecebidoPorMes({
              ...recebidoPorMes,
              [MesSelecionado]: novoValor
            });

    // 2. salva no Supabase
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase.from('recebimentos').upsert([
      {
        user_id: user.id,
        mes: MesSelecionado,
        valor: parseFloat(novoValor)
      }
    ]);

    if (error) {
      console.error('Erro ao salvar recebimento:', error);
    }
  }}
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
        <ExpenseChart gastos={gastosFiltrados} />

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
            recorrente={recorrente}
            setRecorrente={setRecorrente}
          />
        )}

        {/* Lista */}
        <ExpenseList
          gastos={gastosFiltrados}
          onRemove={removerGasto}
          moeda={moeda}
        />

      </div>
      <footer className="text-center text-gray-400 text-sm mt-10 pb-4">
          Desenvolvido por PCastro © {new Date().getFullYear()}
      </footer>
    </div>
  </>
);
}

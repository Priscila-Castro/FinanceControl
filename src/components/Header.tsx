interface Props {
  total: number;
  nome: string;
  moeda: string;
  onLogout: () => void;
}

export default function Header({ total, nome, moeda, onLogout }: Props) {

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: moeda && moeda !== '' ? moeda : 'BRL'
    });
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {nome} 👋
        </h1>

        <p className="text-sm opacity-80">
          Vamos cuidar das suas finanças hoje
        </p>
      </div>

      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl text-white"
      >
        Sair
      </button>
    </div>
  );
}
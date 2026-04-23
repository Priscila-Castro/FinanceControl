interface Props {
  total: number;
  nome: string;
  moeda: string;
  onLogout: () => void;
  onApagarConta: () => void;
}

export default function Header({ total, nome, moeda, onLogout, onApagarConta }: Props) {

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
      <button
        onClick={onApagarConta}
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded=x1 text-red-400 text-sm"
      >
        Apagar conta
        </button>
    </div>
  );
}
interface Props {
  total: number;
  nome: string;
  moeda: string;
}

export default function Header({ total, nome, moeda }: Props) {

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: moeda && moeda !== '' ? moeda : 'BRL'
    });
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">
        Olá, {nome} 👋
      </h1>

      <p className="text-sm opacity-80">
        Vamos cuidar das suas finanças hoje
      </p>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl overflow-hidden">
        <p className="text-sm opacity-80 mb-1">
          Gastos do mês
        </p>

        <p className="text-3xl font-bold">
          {formatarMoeda(total)}
        </p>
      </div>
    </div>
  );
}
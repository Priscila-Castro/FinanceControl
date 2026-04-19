import ExpenseItem from './ExpenseItem';

interface Gasto {
  id: string;
  valor: number;
  categoria: string;
  data: string;
  descricao: string;
}

interface Props {
  gastos: Gasto[];
  onRemove: (id: string) => void;
}

export default function ExpenseList({ gastos, onRemove }: Props) {
  if (gastos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">Nenhum gasto registrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {gastos.map(gasto => (
        <ExpenseItem
          key={gasto.id}
          gasto={gasto}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
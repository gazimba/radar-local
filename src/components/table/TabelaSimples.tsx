interface Coluna {
    header: string;
    key: string;
}

interface TabelaProps {
    colunas: Coluna[];
    dados: any[];
    onDelete: (id: number) => void;
}

export function TabelaSimples({ colunas, dados, onDelete }: TabelaProps) {
    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    {colunas.map((col) => (
                        <th key={col.key} className="py-2 px-4 border-b text-left">{col.header}</th>
                    ))}
                    <th className="py-2 px-4 border-b text-center">Ações</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        {colunas.map((col) => (
                            <td key={col.key} className="py-2 px-4 border-b">
                                {item[col.key]}
                            </td>
                        ))}
                        <td className="py-2 px-4 border-b text-center">
                            <button
                                onClick={() => {
                                    if (confirm("Tem certeza que deseja excluir?")) onDelete(item.id)
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                            >
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                {dados.length === 0 && (
                    <tr>
                        <td colSpan={colunas.length + 1} className="py-4 text-center text-gray-500">
                            Nenhum registro encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
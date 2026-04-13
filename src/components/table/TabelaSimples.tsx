interface Coluna {
    header: string;
    key: string;
}

interface TabelaProps {
    colunas: Coluna[];
    dados: any[];
    onDelete: (id: number) => void;
    onEdit?: (id: number) => void;
}

export function TabelaSimples({ colunas, dados, onDelete, onEdit }: TabelaProps) {
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
                {dados.map((linha, index) => (
                    <tr key={linha.id || index} className="hover:bg-gray-50">
                        {colunas.map((col) => (
                            <td key={col.key} className="py-2 px-4 border-b">
                                {linha[col.key]}
                            </td>
                        ))}
                        {/* 1. O flex saiu do <td>... */}
                        <td className="py-2 px-4 border-b">
                            {/* 2. ...e veio para esta <div> interna! */}
                            <div className="flex gap-2 justify-center items-center">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(linha.id)}
                                        // Padronizei as cores para azul
                                        className="p-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors flex items-center gap-1 text-sm font-medium"
                                    >
                                        Editar
                                    </button>
                                )}

                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(linha.id)}
                                        className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1 text-sm font-medium"
                                    >
                                        Excluir
                                    </button>
                                )}
                            </div>
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
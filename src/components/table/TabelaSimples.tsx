export function TabelaSimples() {
    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Nome</th>
                    <th className="py-2 px-4 border-b">Descrição</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="py-2 px-4 border-b">1</td>
                    <td className="py-2 px-4 border-b">Ponto Turístico A</td>
                    <td className="py-2 px-4 border-b">Descrição do Ponto Turístico A</td>
                    <td className="py-2 px-4 border-b">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Editar
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                            Excluir
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
import { TabelaSimples } from "../../components/table/TabelaSimples";

export function Usuario() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
            <div className="bg-white p-6 rounded-lg shadow-md ">
                <TabelaSimples />
            </div>
        </div>
    )
}
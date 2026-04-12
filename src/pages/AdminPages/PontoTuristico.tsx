import { useEffect, useState } from "react";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";

export function PontoTuristico() {
    const [dados, setDados] = useState([]);

    const colunas = [
        { header: "ID", key: "id" },
        { header: "Nome", key: "nome" },
        { header: "Descrição", key: "descricao" }
    ];

    async function carregarDados() {
        const response = await api.get("/api/pontos-turisticos");
        setDados(response.data);
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/api/pontos-turisticos/${id}`);
            carregarDados();
        } catch (error) {
            alert("Erro ao excluir item.");
        }
    }

    useEffect(() => { carregarDados(); }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Pontos Turísticos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <TabelaSimples colunas={colunas} dados={dados} onDelete={handleDelete} />
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";

export function Evento() {
    const [dados, setDados] = useState([]);

    const colunas = [
        { header: "ID", key: "id" },
        { header: "Evento", key: "nome" },
        { header: "Data", key: "data" },
        { header: "Horário", key: "horario" }
    ];

    async function carregarDados() {
        const response = await api.get("/api/eventos");
        setDados(response.data);
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/api/eventos/${id}`);
            carregarDados();
        } catch (error) {
            alert("Erro ao excluir evento.");
        }
    }

    useEffect(() => { carregarDados(); }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Eventos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <TabelaSimples colunas={colunas} dados={dados} onDelete={handleDelete} />
            </div>
        </div>
    );
}
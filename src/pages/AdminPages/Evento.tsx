import { useEffect, useState } from "react";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";

export function Evento() {
    const [dados, setDados] = useState([]);

    const colunas = [
        { header: "ID", key: "id" },
        { header: "Evento", key: "nome" },
        { header: "Data", key: "data_formatada" },
        { header: "Horário", key: "horario" }
    ];

    async function carregarDados() {
        try {
            const response = await api.get("/api/eventos");

            const eventosFormatados = response.data.map((evento: any) => ({
                ...evento,
                data_formatada: new Date(evento.data).toLocaleDateString('pt-BR')
            }));

            setDados(eventosFormatados);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/api/eventos/${id}`);
            carregarDados();
        } catch (error) {
            alert("Erro ao excluir evento. Verifique a conexão com o servidor.");
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-blue-800">Gerenciar Eventos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto border border-gray-100">
                <TabelaSimples
                    colunas={colunas}
                    dados={dados}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
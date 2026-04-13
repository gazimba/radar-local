import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";

export function PontoTuristico() {
    const [dados, setDados] = useState([]);
    const navigate = useNavigate();

    const colunas = [
        { header: "ID", key: "id" },
        { header: "Nome", key: "nome" },
        { header: "Descrição", key: "descricao" }
    ];

    async function carregarDados() {
        try {
            const response = await api.get("/api/pontos-turisticos");
            setDados(response.data);
        } catch (error) {
            console.error("Erro ao carregar pontos turísticos:", error);
        }
    }

    function handleEdit(id: number) {
        navigate(`/editar-ponto-turistico/${id}`);
    }

    async function handleDelete(id: number) {
        if (window.confirm("Tem certeza que deseja excluir este ponto turístico?")) {
            try {
                await api.delete(`/api/pontos-turisticos/${id}`);
                carregarDados();
            } catch (error) {
                alert("Erro ao excluir item.");
            }
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-blue-800">Gerenciar Pontos Turísticos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto border border-gray-100">
                <TabelaSimples
                    colunas={colunas}
                    dados={dados}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            </div>
        </div>
    );
}
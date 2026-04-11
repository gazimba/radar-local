import { useEffect, useState } from "react";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";

export function Usuario() {
    const [dados, setDados] = useState([]);

    const colunas = [
        { header: "ID", key: "id" },
        { header: "Nome", key: "nome" },
        { header: "E-mail", key: "email" }
    ];

    async function carregarDados() {
        const response = await api.get("/api/usuarios");
        setDados(response.data);
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/api/usuarios/${id}`);
            carregarDados();
        } catch (error) {
            alert("Erro ao excluir usuário.");
        }
    }

    useEffect(() => { carregarDados(); }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <TabelaSimples colunas={colunas} dados={dados} onDelete={handleDelete} />
            </div>
        </div>
    );
}
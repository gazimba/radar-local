import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button/Button";

export function Usuario() {
    const [dados, setDados] = useState([]);
    const navigate = useNavigate();

    const colunas = [
        { header: "ID", key: "id" },
        { header: "Nome", key: "nome" },
        { header: "E-mail", key: "email" }
    ];

    async function carregarDados() {
        try {
            const response = await api.get("/api/usuarios");
            setDados(response.data);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }

    async function handleDelete(id: number) {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            try {
                await api.delete(`/api/usuarios/${id}`);
                carregarDados();
            } catch (error) {
                alert("Erro ao excluir usuário.");
            }
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">
                    Gerenciar Usuários
                </h1>
                <Button
                    onClick={() => navigate("/cadastrar-usuario")}
                    variant="form" 
                >
                    + Novo Usuário
                </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto border border-gray-100">
                <TabelaSimples colunas={colunas} dados={dados} onDelete={handleDelete} />
            </div>
        </div>
    );
}
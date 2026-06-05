import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaAdmin } from "../../components/table/TabelaAdmin";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../components/ui/ConfirmDialog";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    cargo: "COMUM" | "MODERADOR" | "ADMINISTRADOR";
    ativo: boolean;
}

const CARGO_BADGE: Record<string, string> = {
    COMUM: "bg-gray-100 text-gray-700",
    MODERADOR: "bg-purple-100 text-purple-700",
    ADMINISTRADOR: "bg-blue-100 text-blue-800",
};

const CARGO_LABEL: Record<string, string> = {
    COMUM: "Comum",
    MODERADOR: "Moderador",
    ADMINISTRADOR: "Admin",
};

export function Usuario() {
    const [dados, setDados] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();

    async function carregarDados() {
        try {
            const response = await api.get("/api/usuarios");
            setDados(response.data);
        } catch {
            toast.error("Erro ao carregar usuários.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => { carregarDados(); }, []);

    async function handleDelete(id: number) {
        const ok = await confirm({ mensagem: "Tem certeza que deseja excluir este usuário?", textoBotaoConfirmar: "Excluir", variante: "danger" });
        if (!ok) return;
        try {
            await api.delete(`/api/usuarios/${id}`);
            toast.success("Usuário excluído.");
            carregarDados();
        } catch {
            toast.error("Erro ao excluir usuário.");
        }
    }

    async function handleAlterarCargo(id: number, cargo: string) {
        try {
            await api.patch(`/api/usuarios/${id}/cargo`, { cargo });
            toast.success("Cargo atualizado.");
            carregarDados();
        } catch {
            toast.error("Erro ao alterar cargo.");
        }
    }

    async function handleToggleAtivo(id: number, ativo: boolean) {
        try {
            await api.patch(`/api/usuarios/${id}/ativo`, { ativo: !ativo });
            toast.success(ativo ? "Usuário bloqueado." : "Usuário desbloqueado.");
            carregarDados();
        } catch {
            toast.error("Erro ao alterar status.");
        }
    }

    const colunas = [
        { header: "Nome", key: "nome" },
        { header: "E-mail", key: "email" },
        {
            header: "Cargo", key: "cargo",
            render: (item: Usuario) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${CARGO_BADGE[item.cargo]}`}>
                    {CARGO_LABEL[item.cargo]}
                </span>
            ),
        },
        {
            header: "Status", key: "ativo",
            render: (item: Usuario) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.ativo ? "Ativo" : "Bloqueado"}
                </span>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">Gerenciar Usuários</h1>
                <Button onClick={() => navigate("/cadastrar-usuario")} variant="form">+ Novo Usuário</Button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                {carregando ? <Skeleton /> : (
                    <TabelaAdmin
                        colunas={colunas}
                        dados={dados}
                        campoBusca={["nome", "email"]}
                        acoes={(item: Usuario) => (
                            <>
                                <select
                                    value={item.cargo}
                                    onChange={e => handleAlterarCargo(item.id, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer"
                                >
                                    <option value="COMUM">Comum</option>
                                    <option value="MODERADOR">Moderador</option>
                                    <option value="ADMINISTRADOR">Admin</option>
                                </select>
                                <button
                                    onClick={() => handleToggleAtivo(item.id, item.ativo)}
                                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${item.ativo ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                                >
                                    {item.ativo ? "Bloquear" : "Desbloquear"}
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                                    Excluir
                                </button>
                            </>
                        )}
                    />
                )}
            </div>
        </div>
    );
}

function Skeleton() {
    return (
        <div className="animate-pulse flex flex-col gap-3">
            <div className="h-9 bg-gray-100 rounded-lg w-full" />
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-lg w-full" />)}
        </div>
    );
}

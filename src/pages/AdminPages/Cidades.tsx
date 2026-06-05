import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaAdmin } from "../../components/table/TabelaAdmin";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../components/ui/ConfirmDialog";

interface Cidade {
    id: number;
    nome: string;
    estado: string;
    slug: string;
    ativa: boolean;
}

export function Cidades() {
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();

    async function carregarCidades() {
        try {
            const res = await api.get("/api/cidades/todas");
            setCidades(res.data);
        } catch {
            toast.error("Erro ao carregar cidades.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => { carregarCidades(); }, []);

    async function handleToggle(id: number, ativa: boolean) {
        try {
            await api.patch(`/api/cidades/${id}/toggle`);
            toast.success(ativa ? "Cidade desativada." : "Cidade ativada.");
            carregarCidades();
        } catch {
            toast.error("Erro ao alterar status da cidade.");
        }
    }

    async function handleDelete(id: number) {
        const ok = await confirm({ mensagem: "Tem certeza que deseja remover essa cidade?", textoBotaoConfirmar: "Remover", variante: "danger" });
        if (!ok) return;
        try {
            await api.delete(`/api/cidades/${id}`);
            toast.success("Cidade removida.");
            carregarCidades();
        } catch {
            toast.error("Erro ao remover cidade.");
        }
    }

    const colunas = [
        { header: "Cidade", key: "nome" },
        { header: "Estado", key: "estado" },
        { header: "Slug", key: "slug", render: (item: Cidade) => <span className="font-mono text-xs text-gray-400">{item.slug}</span> },
        {
            header: "Status", key: "ativa",
            render: (item: Cidade) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.ativa ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.ativa ? "Ativa" : "Inativa"}
                </span>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">Gerenciar Cidades</h1>
                <Button variant="form" onClick={() => navigate("/cadastrar-cidade")}>+ Nova Cidade</Button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                {carregando ? <Skeleton /> : (
                    <TabelaAdmin
                        colunas={colunas}
                        dados={cidades}
                        campoBusca={["nome", "estado", "slug"]}
                        acoes={(item: Cidade) => (
                            <>
                                <button
                                    onClick={() => handleToggle(item.id, item.ativa)}
                                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${item.ativa ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                                >
                                    {item.ativa ? "Desativar" : "Ativar"}
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                    Remover
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

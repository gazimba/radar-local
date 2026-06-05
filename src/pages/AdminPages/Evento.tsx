import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaAdmin } from "../../components/table/TabelaAdmin";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../components/ui/ConfirmDialog";

interface EventoItem {
    id: number;
    nome: string;
    data: string;
    horario: string;
    status: string;
    ativo: boolean;
}

const STATUS_BADGE: Record<string, string> = {
    APROVADO: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    REJEITADO: "bg-red-100 text-red-700",
};

type FiltroStatus = "TODOS" | "APROVADO" | "PENDENTE" | "REJEITADO" | "INATIVO";

export function Evento() {
    const [dados, setDados] = useState<EventoItem[]>([]);
    const [filtro, setFiltro] = useState<FiltroStatus>("TODOS");
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();

    async function carregarDados() {
        try {
            const response = await api.get("/api/eventos/admin/todos");
            setDados(response.data);
        } catch {
            toast.error("Erro ao carregar eventos.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => { carregarDados(); }, []);

    const dadosFiltrados = dados.filter(e => {
        if (filtro === "INATIVO") return !e.ativo;
        if (filtro === "TODOS") return true;
        return e.ativo && e.status === filtro;
    });

    const contagens = {
        TODOS: dados.length,
        APROVADO: dados.filter(e => e.ativo && e.status === "APROVADO").length,
        PENDENTE: dados.filter(e => e.ativo && e.status === "PENDENTE").length,
        REJEITADO: dados.filter(e => e.ativo && e.status === "REJEITADO").length,
        INATIVO: dados.filter(e => !e.ativo).length,
    };

    async function handleDelete(id: number) {
        const ok = await confirm({ mensagem: "Deseja excluir permanentemente este evento?", textoBotaoConfirmar: "Excluir", variante: "danger" });
        if (!ok) return;
        try {
            await api.delete(`/api/eventos/${id}`);
            toast.success("Evento excluído.");
            carregarDados();
        } catch {
            toast.error("Erro ao excluir evento.");
        }
    }

    async function handleDesativar(id: number) {
        try {
            await api.patch(`/api/eventos/${id}/desativar`);
            toast.success("Evento desativado.");
            carregarDados();
        } catch {
            toast.error("Erro ao desativar.");
        }
    }

    async function handleReativar(id: number) {
        try {
            await api.patch(`/api/eventos/${id}/reativar`);
            toast.success("Evento reativado.");
            carregarDados();
        } catch {
            toast.error("Erro ao reativar.");
        }
    }

    const colunas = [
        { header: "Nome", key: "nome" },
        { header: "Data", key: "data", render: (item: EventoItem) => new Date(item.data).toLocaleDateString("pt-BR") },
        { header: "Horário", key: "horario" },
        {
            header: "Status", key: "status",
            render: (item: EventoItem) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.ativo ? (STATUS_BADGE[item.status] ?? "bg-gray-100") : "bg-gray-200 text-gray-500"}`}>
                    {item.ativo ? item.status : "INATIVO"}
                </span>
            ),
        },
    ];

    const filtros: { label: string; valor: FiltroStatus }[] = [
        { label: "Todos", valor: "TODOS" },
        { label: "Aprovados", valor: "APROVADO" },
        { label: "Pendentes", valor: "PENDENTE" },
        { label: "Rejeitados", valor: "REJEITADO" },
        { label: "Inativos", valor: "INATIVO" },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">Eventos</h1>
                <Button variant="form" onClick={() => navigate("/cadastrar-evento")}>+ Novo Evento</Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {filtros.map(f => (
                    <button
                        key={f.valor}
                        onClick={() => setFiltro(f.valor)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filtro === f.valor ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"}`}
                    >
                        {f.label} <span className="ml-1 opacity-70">({contagens[f.valor]})</span>
                    </button>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                {carregando ? <Skeleton /> : (
                    <TabelaAdmin
                        colunas={colunas}
                        dados={dadosFiltrados}
                        campoBusca={["nome", "horario", "status"]}
                        acoes={(item: EventoItem) => (
                            <>
                                <button onClick={() => navigate(`/editar-evento/${item.id}`)} className="px-3 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">Editar</button>
                                {item.ativo
                                    ? <button onClick={() => handleDesativar(item.id)} className="px-3 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">Desativar</button>
                                    : <button onClick={() => handleReativar(item.id)} className="px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Reativar</button>
                                }
                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Excluir</button>
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaAdmin } from "../../components/table/TabelaAdmin";
import { api } from "../../services/api";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../components/ui/ConfirmDialog";

interface PontoItem {
    id: number;
    nome: string;
    descricao: string;
    status: string;
    ativo: boolean;
    categoria: string;
}

const STATUS_BADGE: Record<string, string> = {
    APROVADO: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    REJEITADO: "bg-red-100 text-red-700",
};

type FiltroStatus = "TODOS" | "APROVADO" | "PENDENTE" | "REJEITADO" | "INATIVO";

interface Props {
    titulo: string;
    categoria: "PONTO_TURISTICO" | "HOTEL_POUSADA" | "BAR_RESTAURANTE";
    rotaCadastro: string;
    labelNovo: string;
    corBotao?: string;
    corEditar?: string;
    corDesativar?: string;
}

export function ListagemPontos({ titulo, categoria, rotaCadastro, labelNovo, corBotao = "bg-blue-700 text-white border-blue-700", corEditar = "bg-blue-100 text-blue-700 hover:bg-blue-200", corDesativar = "bg-blue-50 text-blue-500 hover:bg-blue-100" }: Props) {
    const [dados, setDados] = useState<PontoItem[]>([]);
    const [filtro, setFiltro] = useState<FiltroStatus>("TODOS");
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();

    async function carregarDados() {
        try {
            const res = await api.get(`/api/pontos-turisticos/admin/todos?categoria=${categoria}`);
            setDados(res.data);
        } catch {
            toast.error("Erro ao carregar dados.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => { carregarDados(); }, [categoria]);

    const dadosFiltrados = dados.filter(p => {
        if (filtro === "INATIVO") return !p.ativo;
        if (filtro === "TODOS") return true;
        return p.ativo && p.status === filtro;
    });

    const contagens = {
        TODOS: dados.length,
        APROVADO: dados.filter(p => p.ativo && p.status === "APROVADO").length,
        PENDENTE: dados.filter(p => p.ativo && p.status === "PENDENTE").length,
        REJEITADO: dados.filter(p => p.ativo && p.status === "REJEITADO").length,
        INATIVO: dados.filter(p => !p.ativo).length,
    };

    async function handleDelete(id: number) {
        const ok = await confirm({ mensagem: "Deseja excluir permanentemente este registro?", textoBotaoConfirmar: "Excluir", variante: "danger" });
        if (!ok) return;
        try {
            await api.delete(`/api/pontos-turisticos/${id}`);
            toast.success("Excluído com sucesso.");
            carregarDados();
        } catch {
            toast.error("Erro ao excluir.");
        }
    }

    async function handleDesativar(id: number) {
        try {
            await api.patch(`/api/pontos-turisticos/${id}/desativar`);
            toast.success("Desativado.");
            carregarDados();
        } catch { toast.error("Erro ao desativar."); }
    }

    async function handleReativar(id: number) {
        try {
            await api.patch(`/api/pontos-turisticos/${id}/reativar`);
            toast.success("Reativado.");
            carregarDados();
        } catch { toast.error("Erro ao reativar."); }
    }

    const colunas = [
        { header: "Nome", key: "nome" },
        {
            header: "Status", key: "status",
            render: (item: PontoItem) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.ativo ? (STATUS_BADGE[item.status] ?? "bg-gray-100") : "bg-gray-200 text-gray-500"}`}>
                    {item.ativo ? item.status : "INATIVO"}
                </span>
            ),
        },
        {
            header: "Descrição", key: "descricao",
            render: (item: PontoItem) => <span className="line-clamp-1 max-w-xs block text-gray-500">{item.descricao}</span>,
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
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">{titulo}</h1>
                <Button variant="form" onClick={() => navigate(rotaCadastro)}>+ {labelNovo}</Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {filtros.map(f => (
                    <button
                        key={f.valor}
                        onClick={() => setFiltro(f.valor)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filtro === f.valor ? corBotao : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
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
                        campoBusca={["nome", "status"]}
                        acoes={(item: PontoItem) => (
                            <>
                                <button onClick={() => navigate(`/editar-ponto-turistico/${item.id}`)} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${corEditar}`}>Editar</button>
                                {item.ativo
                                    ? <button onClick={() => handleDesativar(item.id)} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${corDesativar}`}>Desativar</button>
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

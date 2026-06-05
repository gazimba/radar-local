import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, Edit3, X } from "lucide-react";
import { TabelaAdmin } from "../../components/table/TabelaAdmin";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../components/ui/ConfirmDialog";

interface SugestaoItem {
    id: number;
    nome: string;
    tipo: "evento" | "ponto-turistico";
    tipo_formatado: string;
    info_adicional: string;
}

export function Sugestoes() {
    const [dados, setDados] = useState<SugestaoItem[]>([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();

    async function carregarDados() {
        try {
            const response = await api.get("/api/sugestoes");
            const { eventos, pontos } = response.data;

            const eventosFormatados: SugestaoItem[] = eventos.map((item: any) => ({
                ...item,
                tipo: "evento",
                tipo_formatado: "Evento",
                info_adicional: new Date(item.data).toLocaleDateString("pt-BR"),
            }));

            const pontosFormatados: SugestaoItem[] = pontos.map((item: any) => ({
                ...item,
                tipo: "ponto-turistico",
                tipo_formatado: "Ponto Turístico",
                info_adicional: "Local fixo",
            }));

            setDados([...eventosFormatados, ...pontosFormatados]);
        } catch {
            toast.error("Erro ao carregar sugestões.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => { carregarDados(); }, []);

    async function handleAprovar(id: number, tipo: "evento" | "ponto-turistico") {
        const endpoint = tipo === "evento" ? "eventos" : "pontos-turisticos";
        try {
            await api.patch(`/api/${endpoint}/${id}/aprovar`);
            toast.success(`${tipo === "evento" ? "Evento" : "Ponto turístico"} aprovado!`);
            carregarDados();
        } catch {
            toast.error("Não foi possível aprovar este item.");
        }
    }

    async function handleRejeitar(id: number, tipo: "evento" | "ponto-turistico") {
        const ok = await confirm({ mensagem: "Deseja rejeitar esta sugestão?", textoBotaoConfirmar: "Rejeitar", variante: "danger" });
        if (!ok) return;
        try {
            await api.patch(`/api/sugestoes/${tipo}/${id}/rejeitar`);
            toast.success("Sugestão rejeitada.");
            carregarDados();
        } catch {
            toast.error("Erro ao rejeitar sugestão.");
        }
    }

    const colunas = [
        {
            header: "Tipo", key: "tipo_formatado",
            render: (item: SugestaoItem) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.tipo === "evento" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.tipo_formatado}
                </span>
            ),
        },
        { header: "Nome", key: "nome" },
        { header: "Data / Info", key: "info_adicional" },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">Sugestões Pendentes</h1>
            <p className="text-gray-500 mb-6 text-sm">Analise e aprove ou rejeite as sugestões enviadas pelos usuários.</p>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                {carregando ? <Skeleton /> : (
                    <TabelaAdmin
                        colunas={colunas}
                        dados={dados}
                        campoBusca={["nome", "tipo_formatado"]}
                        acoes={(item: SugestaoItem) => (
                            <>
                                <button
                                    onClick={() => navigate(`/${item.tipo === "evento" ? "editar-evento" : "editar-ponto-turistico"}/${item.id}`)}
                                    className="px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1"
                                >
                                    <Edit3 size={13} /> Analisar
                                </button>
                                <button
                                    onClick={() => handleAprovar(item.id, item.tipo)}
                                    className="px-3 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                                >
                                    <Check size={13} /> Aprovar
                                </button>
                                <button
                                    onClick={() => handleRejeitar(item.id, item.tipo)}
                                    className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
                                >
                                    <X size={13} /> Rejeitar
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

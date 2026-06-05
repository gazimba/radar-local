import { useEffect, useState } from "react";
import { TabelaAdmin } from "../../components/table/TabelaAdmin";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

interface LogItem {
    id: number;
    acao: string;
    detalhes: string | null;
    createdAt: string;
    user: { id: number; nome: string };
}

const ACAO_BADGE: Record<string, string> = {
    APROVAR_PONTO: "bg-green-100 text-green-700",
    APROVAR_EVENTO: "bg-green-100 text-green-700",
    REJEITAR_SUGESTAO: "bg-red-100 text-red-700",
    DELETAR_PONTO: "bg-red-100 text-red-700",
    DELETAR_EVENTO: "bg-red-100 text-red-700",
    DESATIVAR_PONTO: "bg-orange-100 text-orange-700",
    DESATIVAR_EVENTO: "bg-orange-100 text-orange-700",
    REATIVAR_PONTO: "bg-blue-100 text-blue-700",
    REATIVAR_EVENTO: "bg-blue-100 text-blue-700",
    BLOQUEAR_USUARIO: "bg-yellow-100 text-yellow-700",
    DESBLOQUEAR_USUARIO: "bg-green-100 text-green-700",
    ALTERAR_CARGO: "bg-purple-100 text-purple-700",
};

export function Logs() {
    const [dados, setDados] = useState<LogItem[]>([]);
    const [carregando, setCarregando] = useState(true);
    const toast = useToast();

    useEffect(() => {
        api.get("/api/logs")
            .then(res => setDados(res.data))
            .catch(() => toast.error("Erro ao carregar logs."))
            .finally(() => setCarregando(false));
    }, []);

    const colunas = [
        {
            header: "Ação", key: "acao",
            render: (item: LogItem) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ACAO_BADGE[item.acao] ?? "bg-gray-100 text-gray-600"}`}>
                    {item.acao.replace(/_/g, " ")}
                </span>
            ),
        },
        { header: "Detalhes", key: "detalhes", render: (item: LogItem) => <span className="text-gray-500 text-xs">{item.detalhes ?? "—"}</span> },
        { header: "Usuário", key: "user", render: (item: LogItem) => item.user.nome },
        {
            header: "Data", key: "createdAt",
            render: (item: LogItem) => new Date(item.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">Logs de Ações</h1>
            <p className="text-gray-500 mb-6 text-sm">Histórico das últimas 200 ações realizadas no sistema.</p>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                {carregando ? (
                    <div className="animate-pulse flex flex-col gap-3">
                        <div className="h-9 bg-gray-100 rounded-lg w-full" />
                        {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-lg w-full" />)}
                    </div>
                ) : (
                    <TabelaAdmin
                        colunas={colunas}
                        dados={dados}
                        campoBusca={["acao", "detalhes"]}
                        tamanhoPagina={20}
                    />
                )}
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TabelaSimples } from "../../components/table/TabelaSimples";
import { api } from "../../services/api";
import { Check, Edit3 } from "lucide-react"; 

interface SugestaoItem {
    id: number;
    nome: string;
    tipo: "evento" | "ponto";
    tipo_formatado: string;
    info_adicional: string;
    status: string;
}

export function Sugestoes() {
    const [dados, setDados] = useState<SugestaoItem[]>([]);
    const navigate = useNavigate(); 

    const colunas = [
        { header: "Tipo", key: "tipo_formatado" },
        { header: "Nome", key: "nome" },
        { header: "Data/Info", key: "info_adicional" },
        { header: "Ações", key: "acoes" } 
    ];

    async function carregarDados() {
        try {
            const response = await api.get("/api/sugestoes");
            const { eventos, pontos } = response.data;

            const eventosFormatados: SugestaoItem[] = eventos.map((item: any) => ({
                ...item,
                tipo: "evento",
                tipo_formatado: "Evento",
                info_adicional: new Date(item.data).toLocaleDateString('pt-BR')
            }));

            const pontosFormatados: SugestaoItem[] = pontos.map((item: any) => ({
                ...item,
                tipo: "ponto",
                tipo_formatado: "Ponto Turístico",
                info_adicional: "Local Fixo"
            }));

            setDados([...eventosFormatados, ...pontosFormatados]);
        } catch (error) {
            console.error("Erro ao carregar sugestões:", error);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function handleVerDetalhes(id: number, tipo: "evento" | "ponto") {
        const rota = tipo === "evento" ? "editar-evento" : "editar-ponto-turistico";
        navigate(`/${rota}/${id}`);
    }

    async function handleAprovar(id: number, tipo: "evento" | "ponto") {
        const endpoint = tipo === "evento" ? "eventos" : "pontos-turisticos";

        try {
            await api.patch(`/api/${endpoint}/${id}/aprovar`);
            alert(`${tipo === "evento" ? "Evento" : "Ponto"} aprovado com sucesso!`);
            carregarDados();
        } catch (error) {
            console.error("Erro ao aprovar:", error);
            alert("Não foi possível aprovar este item.");
        }
    }

    const dadosComAcoes = dados.map((item) => ({
        ...item,
        acoes: (
            <div className="flex gap-2">
                <button
                    onClick={() => handleVerDetalhes(item.id, item.tipo)}
                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm font-medium"
                    title="Editar/Ver Detalhes"
                >
                    <Edit3 size={16} /> Analisar
                </button>

                <button
                    onClick={() => handleAprovar(item.id, item.tipo)}
                    className="p-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors flex items-center gap-1 text-sm font-medium"
                    title="Aprovar"
                >
                    <Check size={18} /> Aprovar
                </button>
            </div>
        )
    }));

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">
                Sugestões Pendentes
            </h1>
            <p className="text-gray-500 mb-6 text-sm">
                Analise os dados enviados pelos usuários. Você pode editar as informações antes de aprovar.
            </p>

            <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto border border-gray-200">
                <TabelaSimples
                    colunas={colunas}
                    dados={dadosComAcoes}
                    onDelete={() => { }}
                />

                {dados.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        Nenhuma sugestão pendente no momento.
                    </div>
                )}
            </div>
        </div>
    );
}
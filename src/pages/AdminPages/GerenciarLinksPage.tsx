import { useEffect, useState } from "react";
import { MapPin, Calendar, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { GerenciarLinks } from "../../components/form/GerenciarLinks";
import { api } from "../../services/api";

type Aba = "ponto-turistico" | "evento";

interface Registro {
    id: number;
    nome: string;
    cidade?: { nome: string; estado: string };
}

export function GerenciarLinksPage() {
    const [aba, setAba] = useState<Aba>("ponto-turistico");
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [expandidoId, setExpandidoId] = useState<number | null>(null);

    useEffect(() => {
        setCarregando(true);
        setExpandidoId(null);
        const endpoint = aba === "ponto-turistico"
            ? "/api/pontos-turisticos/admin/todos"
            : "/api/eventos/admin/todos";

        api.get(endpoint)
            .then(res => setRegistros(res.data))
            .catch(() => setRegistros([]))
            .finally(() => setCarregando(false));
    }, [aba]);

    function toggleExpandir(id: number) {
        setExpandidoId(prev => prev === id ? null : id);
    }

    return (
        <div className="p-6 max-w-4xl flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight flex items-center gap-2">
                    <Link2 size={20} className="text-blue-500" />
                    Links Úteis
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Gerencie os links úteis exibidos nas páginas públicas de pontos e eventos.
                </p>
            </div>

            {/* Abas */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setAba("ponto-turistico")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                        aba === "ponto-turistico"
                            ? "border-amber-500 text-amber-700"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    <MapPin size={15} />
                    Pontos Turísticos
                </button>
                <button
                    onClick={() => setAba("evento")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                        aba === "evento"
                            ? "border-green-500 text-green-700"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    <Calendar size={15} />
                    Eventos
                </button>
            </div>

            {/* Lista */}
            <div className="flex flex-col gap-2">
                {carregando && (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse h-14 bg-gray-50 rounded-xl border border-gray-100" />
                    ))
                )}

                {!carregando && registros.length === 0 && (
                    <p className="text-sm text-gray-400 italic py-6 text-center">
                        Nenhum {aba === "ponto-turistico" ? "ponto turístico" : "evento"} cadastrado.
                    </p>
                )}

                {!carregando && registros.map(reg => (
                    <div key={reg.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <button
                            onClick={() => toggleExpandir(reg.id)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex flex-col items-start min-w-0">
                                <span className="text-sm font-semibold text-gray-800 truncate">{reg.nome}</span>
                                {reg.cidade && (
                                    <span className="text-xs text-gray-400">
                                        {reg.cidade.nome}, {reg.cidade.estado}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                                    <Link2 size={12} />
                                    {expandidoId === reg.id ? "Fechar" : "Gerenciar links"}
                                </span>
                                {expandidoId === reg.id
                                    ? <ChevronUp size={15} className="text-gray-400" />
                                    : <ChevronDown size={15} className="text-gray-400" />
                                }
                            </div>
                        </button>

                        {expandidoId === reg.id && (
                            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                <GerenciarLinks tipo={aba} registroId={reg.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

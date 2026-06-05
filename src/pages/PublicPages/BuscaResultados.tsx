import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { MapPin, Calendar, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../services/api";

interface ResultadoBusca {
    id: number;
    nome: string;
    descricao: string;
    tipo: "ponto-turistico" | "evento";
    data?: string;
    imagens: { url: string }[];
}

const LIMIT = 10;

export function BuscaResultados() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const cidadeSlug = searchParams.get("cidadeSlug") ?? undefined;

    const [pontos, setPontos] = useState<ResultadoBusca[]>([]);
    const [eventos, setEventos] = useState<ResultadoBusca[]>([]);
    const [totalPontos, setTotalPontos] = useState(0);
    const [totalEventos, setTotalEventos] = useState(0);
    const [pagePontos, setPagePontos] = useState(1);
    const [pageEventos, setPageEventos] = useState(1);
    const [carregando, setCarregando] = useState(false);
    const [buscado, setBuscado] = useState(false);

    function buscar(pPage: number, eePage: number) {
        if (!q || q.length < 2) return;
        setCarregando(true);
        setBuscado(false);

        const params: Record<string, string | number> = { q, limit: LIMIT };
        if (cidadeSlug) params.cidadeSlug = cidadeSlug;

        Promise.all([
            api.get("/api/busca", { params: { ...params, page: pPage } }),
            eePage !== pPage
                ? api.get("/api/busca", { params: { ...params, page: eePage } })
                : null,
        ]).then(([resP, resE]) => {
            const dataP = resP.data;
            const dataE = resE ? resE.data : dataP;
            setPontos(dataP.pontos ?? []);
            setTotalPontos(dataP.totalPontos ?? 0);
            setEventos(dataE.eventos ?? []);
            setTotalEventos(dataE.totalEventos ?? 0);
        })
        .catch(() => { setPontos([]); setEventos([]); setTotalPontos(0); setTotalEventos(0); })
        .finally(() => { setCarregando(false); setBuscado(true); });
    }

    useEffect(() => {
        setPagePontos(1);
        setPageEventos(1);
        buscar(1, 1);
    }, [q, cidadeSlug]);

    function irParaPaginaPontos(p: number) {
        setPagePontos(p);
        buscar(p, pageEventos);
    }

    function irParaPaginaEventos(p: number) {
        setPageEventos(p);
        buscar(pagePontos, p);
    }

    const totalPagsPontos = Math.ceil(totalPontos / LIMIT);
    const totalPagsEventos = Math.ceil(totalEventos / LIMIT);
    const total = totalPontos + totalEventos;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-blue-800">
                        Resultados para <span className="text-blue-600">"{q}"</span>
                    </h1>
                    {buscado && !carregando && (
                        <p className="text-sm text-gray-400 mt-0.5">
                            {total === 0 ? "Nenhum resultado encontrado" : `${total} resultado${total > 1 ? "s" : ""} encontrado${total > 1 ? "s" : ""}`}
                        </p>
                    )}
                </div>
            </div>

            {carregando && (
                <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse flex gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                                <div className="h-3 bg-gray-50 rounded w-full" />
                                <div className="h-3 bg-gray-50 rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!carregando && buscado && total === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <Search size={40} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">Nenhum resultado para "{q}"</p>
                    <p className="text-sm text-gray-400">Tente buscar por outro termo ou verifique a cidade selecionada.</p>
                    <Link to="/" className="mt-2 text-sm text-blue-600 hover:underline font-semibold">Voltar para o início</Link>
                </div>
            )}

            {!carregando && pontos.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                        <MapPin size={14} /> Pontos Turísticos ({totalPontos})
                    </h2>
                    {pontos.map(item => <CardResultado key={item.id} item={item} />)}
                    {totalPagsPontos > 1 && (
                        <Paginacao pagina={pagePontos} total={totalPagsPontos} onChange={irParaPaginaPontos} />
                    )}
                </section>
            )}

            {!carregando && eventos.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Calendar size={14} /> Eventos ({totalEventos})
                    </h2>
                    {eventos.map(item => <CardResultado key={item.id} item={item} />)}
                    {totalPagsEventos > 1 && (
                        <Paginacao pagina={pageEventos} total={totalPagsEventos} onChange={irParaPaginaEventos} />
                    )}
                </section>
            )}
        </div>
    );
}

function CardResultado({ item }: { item: ResultadoBusca }) {
    return (
        <Link
            to={`/${item.tipo}/${item.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
            {item.imagens[0] ? (
                <img
                    src={item.imagens[0].url}
                    alt={item.nome}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
            ) : (
                <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    {item.tipo === "evento"
                        ? <Calendar size={28} className="text-blue-300" />
                        : <MapPin size={28} className="text-blue-300" />
                    }
                </div>
            )}
            <div className="flex flex-col min-w-0 gap-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${item.tipo === "evento" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                    {item.tipo === "evento" ? "Evento" : "Ponto Turístico"}
                </span>
                <span className="text-base font-bold text-gray-800 truncate">{item.nome}</span>
                <span className="text-sm text-gray-500 line-clamp-2">{item.descricao}</span>
            </div>
        </Link>
    );
}

function Paginacao({ pagina, total, onChange }: { pagina: number; total: number; onChange: (p: number) => void }) {
    return (
        <div className="flex items-center justify-center gap-2 pt-1">
            <button
                onClick={() => onChange(pagina - 1)}
                disabled={pagina <= 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-500">
                Página <span className="font-semibold text-gray-700">{pagina}</span> de <span className="font-semibold text-gray-700">{total}</span>
            </span>
            <button
                onClick={() => onChange(pagina + 1)}
                disabled={pagina >= total}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

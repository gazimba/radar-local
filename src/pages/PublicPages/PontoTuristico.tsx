import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { EventoMiniCard } from "../../components/card/EventoMiniCard";
import { PontoTuristicoCard } from "../../components/card/PontoTuristicoCard";
import { LinksUteis } from "../../components/list/LinksUteis";
import { api } from "../../services/api";
import { useCidade } from "../../context/CidadeContext";

const POR_PAGINA = 6;

function SkeletonCard() {
    return <div className="animate-pulse bg-gray-100 rounded-2xl h-64 w-full" />;
}

function SkeletonMini() {
    return <div className="animate-pulse bg-gray-100 rounded-2xl h-24 w-full" />;
}

export function PontoTuristico() {
    const [pontos, setPontos] = useState<any[]>([]);
    const [eventos, setEventos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [pagina, setPagina] = useState(1);
    const { cidadeSelecionada } = useCidade();

    useEffect(() => {
        setCarregando(true);
        setPagina(1);
        const params = cidadeSelecionada ? `?cidadeSlug=${cidadeSelecionada.slug}` : "";

        const sep = params ? "&" : "?";
        Promise.all([
            api.get(`/api/pontos-turisticos${params}${sep}categoria=PONTO_TURISTICO`),
            api.get(`/api/eventos${params}`),
        ])
            .then(([resPontos, resEventos]) => {
                setPontos(resPontos.data);
                const agora = new Date();
                setEventos(resEventos.data.filter((e: any) => new Date(e.data) >= agora).slice(0, 5));
            })
            .catch(err => console.error("Erro ao carregar dados:", err))
            .finally(() => setCarregando(false));
    }, [cidadeSelecionada]);

    const totalPaginas = Math.max(1, Math.ceil(pontos.length / POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const pontosPagina = pontos.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);
    const nomeCidade = cidadeSelecionada ? `${cidadeSelecionada.nome} — ${cidadeSelecionada.estado}` : "sua cidade";

    return (
        <>
            <Helmet>
                <title>Pontos Turísticos — {nomeCidade} | Radar Local</title>
                <meta name="description" content={`Explore os principais pontos turísticos de ${nomeCidade}. Encontre lugares incríveis para visitar.`} />
            </Helmet>

            {/* Banner da página */}
            <div className="bg-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-1">
                    <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin size={12} />
                        {cidadeSelecionada ? `${cidadeSelecionada.nome}, ${cidadeSelecionada.estado}` : "Todas as cidades"}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pontos Turísticos</h1>
                    <p className="text-blue-200 text-sm mt-0.5">
                        {cidadeSelecionada
                            ? `Explore os melhores lugares para visitar em ${cidadeSelecionada.nome}`
                            : "Selecione uma cidade no topo para filtrar os locais"}
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">

                    {/* Grid de cards */}
                    <section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {carregando
                                ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                                : pontosPagina.length === 0
                                    ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-center">
                                            <MapPin size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-medium">Nenhum ponto turístico encontrado.</p>
                                            {!cidadeSelecionada && (
                                                <p className="text-sm text-gray-400">Selecione uma cidade para ver os resultados.</p>
                                            )}
                                        </div>
                                    )
                                    : pontosPagina.map((item: any) => <PontoTuristicoCard key={item.id} ponto={item} />)
                            }
                        </div>

                        {!carregando && totalPaginas > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8">
                                <button
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={paginaAtual === 1}
                                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm text-gray-500 font-medium">
                                    {paginaAtual} / {totalPaginas}
                                </span>
                                <button
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={paginaAtual === totalPaginas}
                                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                            <div className="border-b border-gray-100 pb-3">
                                <h2 className="text-base font-bold text-blue-800">Próximos Eventos</h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {cidadeSelecionada ? `Em ${cidadeSelecionada.nome}` : "Selecione uma cidade"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                {carregando
                                    ? [...Array(3)].map((_, i) => <SkeletonMini key={i} />)
                                    : eventos.length === 0
                                        ? <p className="text-sm text-gray-400 italic text-center py-4">Nenhum evento próximo.</p>
                                        : eventos.map((evento: any) => <EventoMiniCard key={evento.id} evento={evento} />)
                                }
                            </div>

                            <Link
                                to="/evento"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm text-center"
                            >
                                Ver todos os eventos
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                            <h2 className="text-base font-bold text-blue-800 border-b border-gray-100 pb-3">Links úteis</h2>
                            <LinksUteis cidadeSlug={cidadeSelecionada?.slug ?? ""} />
                        </div>

                        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex flex-col gap-3">
                            <h2 className="text-sm font-bold text-blue-700">Conhece um local?</h2>
                            <p className="text-xs text-blue-600">Sugira pontos turísticos para ajudar quem visita a cidade.</p>
                            <Link
                                to="/sugestao"
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm text-center"
                            >
                                Enviar sugestão
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

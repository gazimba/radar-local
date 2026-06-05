import { useEffect, useState } from "react";
import { Link } from "react-router";
import { EventoCard } from "../../components/card/EventoCard";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api";
import { useCidade } from "../../context/CidadeContext";
import { Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const POR_PAGINA = 9;

function SkeletonCard() {
    return <div className="animate-pulse bg-gray-100 rounded-2xl h-64 w-full" />;
}

export function Evento() {
    const [eventos, setEventos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [mostrarPassados, setMostrarPassados] = useState(false);
    const [pagina, setPagina] = useState(1);
    const { cidadeSelecionada } = useCidade();

    useEffect(() => {
        setCarregando(true);
        setPagina(1);
        const params = cidadeSelecionada ? `?cidadeSlug=${cidadeSelecionada.slug}` : "";
        api.get(`/api/eventos${params}`)
            .then(response => setEventos(response.data))
            .catch(error => console.error("Erro ao carregar eventos:", error))
            .finally(() => setCarregando(false));
    }, [cidadeSelecionada]);

    useEffect(() => { setPagina(1); }, [mostrarPassados]);

    const agora = new Date();
    const eventosFiltrados = mostrarPassados
        ? eventos.filter(e => new Date(e.data) < agora)
        : eventos.filter(e => new Date(e.data) >= agora);

    const totalPaginas = Math.max(1, Math.ceil(eventosFiltrados.length / POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const eventosPagina = eventosFiltrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);
    const nomeCidade = cidadeSelecionada ? `${cidadeSelecionada.nome} — ${cidadeSelecionada.estado}` : "sua cidade";

    return (
        <>
            <Helmet>
                <title>Eventos — {nomeCidade} | Radar Local</title>
                <meta name="description" content={`Confira os eventos em ${nomeCidade}. Fique por dentro do que está acontecendo na sua cidade.`} />
            </Helmet>

            {/* Banner da página */}
            <div className="bg-amber-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                            <MapPin size={12} />
                            {cidadeSelecionada ? `${cidadeSelecionada.nome}, ${cidadeSelecionada.estado}` : "Todas as cidades"}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Eventos</h1>
                        <p className="text-amber-200 text-sm mt-0.5">
                            {cidadeSelecionada
                                ? `${mostrarPassados ? "Eventos passados" : "Próximos eventos"} em ${cidadeSelecionada.nome}`
                                : "Selecione uma cidade no topo para filtrar os eventos"}
                        </p>
                    </div>

                    <button
                        onClick={() => setMostrarPassados(v => !v)}
                        className={`self-start sm:self-auto px-4 py-2 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
                            mostrarPassados
                                ? "bg-white text-amber-800 border-white"
                                : "bg-amber-600 text-white border-amber-500 hover:bg-amber-500"
                        }`}
                    >
                        {mostrarPassados ? "Ver próximos" : "Ver passados"}
                    </button>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {carregando
                        ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                        : eventosPagina.length === 0
                            ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-center">
                                    <Calendar size={40} className="text-gray-200" />
                                    <p className="text-gray-400 font-medium">
                                        {mostrarPassados ? "Nenhum evento passado encontrado." : "Nenhum evento próximo no momento."}
                                    </p>
                                    {!cidadeSelecionada && (
                                        <p className="text-sm text-gray-400">Selecione uma cidade para ver os resultados.</p>
                                    )}
                                </div>
                            )
                            : eventosPagina.map((evento: any) => <EventoCard key={evento.id} evento={evento} />)
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
                            Página {paginaAtual} de {totalPaginas}
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
            </div>

            {/* Card de sugestão */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold text-amber-700">Sabe de um evento?</h2>
                        <p className="text-xs text-amber-600">Sugira eventos para ajudar quem quer aproveitar a cidade.</p>
                    </div>
                    <Link
                        to="/sugestao"
                        className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm text-center"
                    >
                        Enviar sugestão
                    </Link>
                </div>
            </div>
        </>
    );
}

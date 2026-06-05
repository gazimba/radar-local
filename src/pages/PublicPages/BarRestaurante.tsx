import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PontoTuristicoCard } from "../../components/card/PontoTuristicoCard";
import { LinksUteis } from "../../components/list/LinksUteis";
import { api } from "../../services/api";
import { useCidade } from "../../context/CidadeContext";

const POR_PAGINA = 6;

function SkeletonCard() {
    return <div className="animate-pulse bg-gray-100 rounded-2xl h-64 w-full" />;
}

export function BarRestaurante() {
    const [itens, setItens] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [pagina, setPagina] = useState(1);
    const { cidadeSelecionada } = useCidade();

    useEffect(() => {
        setCarregando(true);
        setPagina(1);
        const params = cidadeSelecionada ? `?cidadeSlug=${cidadeSelecionada.slug}&` : "?";

        api.get(`/api/pontos-turisticos${params}categoria=BAR_RESTAURANTE`)
            .then(res => setItens(res.data))
            .catch(() => setItens([]))
            .finally(() => setCarregando(false));
    }, [cidadeSelecionada]);

    const totalPaginas = Math.max(1, Math.ceil(itens.length / POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const itensPagina = itens.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);
    const nomeCidade = cidadeSelecionada ? `${cidadeSelecionada.nome} — ${cidadeSelecionada.estado}` : "sua cidade";

    return (
        <>
            <Helmet>
                <title>Bares e Restaurantes — {nomeCidade} | Radar Local</title>
                <meta name="description" content={`Onde comer e beber em ${nomeCidade}.`} />
            </Helmet>

            <div className="bg-emerald-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-1">
                    <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                        <UtensilsCrossed size={12} />
                        {cidadeSelecionada ? `${cidadeSelecionada.nome}, ${cidadeSelecionada.estado}` : "Todas as cidades"}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bares e Restaurantes</h1>
                    <p className="text-emerald-100 text-sm mt-0.5">
                        {cidadeSelecionada
                            ? `Onde comer e beber em ${cidadeSelecionada.nome}`
                            : "Selecione uma cidade no topo para filtrar"}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">

                    <section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {carregando
                                ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                                : itensPagina.length === 0
                                    ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-center">
                                            <UtensilsCrossed size={40} className="text-gray-200" />
                                            <p className="text-gray-400 font-medium">Nenhum bar ou restaurante encontrado.</p>
                                            {!cidadeSelecionada && (
                                                <p className="text-sm text-gray-400">Selecione uma cidade para ver os resultados.</p>
                                            )}
                                        </div>
                                    )
                                    : itensPagina.map((item: any) => <PontoTuristicoCard key={item.id} ponto={item} />)
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

                    <aside className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                            <h2 className="text-base font-bold text-emerald-700 border-b border-gray-100 pb-3">Links úteis</h2>
                            <LinksUteis cidadeSlug={cidadeSelecionada?.slug ?? ""} />
                        </div>
                        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 flex flex-col gap-3">
                            <h2 className="text-sm font-bold text-emerald-700">Conhece um local?</h2>
                            <p className="text-xs text-emerald-600">Sugira bares e restaurantes para ajudar quem visita a cidade.</p>
                            <Link
                                to="/sugestao"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm text-center"
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

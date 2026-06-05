import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Clock, Globe, MapPin, Phone, Star, ImageOff, ExternalLink } from "lucide-react";
import { Carrosel } from "../../components/list/Carrosel";
import { LocalizacaoMap } from "../../components/map/LocalizacaoMap";
import { SecaoComentarios } from "../../components/comentarios/SecaoComentarios";
import { api } from "../../services/api";

export function PontoTuristicoDetalhes() {
    const { id } = useParams();
    const [ponto, setPonto] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api.get(`/api/pontos-turisticos/${id}`)
            .then(res => setPonto(res.data))
            .catch(err => console.error("Erro ao carregar ponto turístico:", err))
            .finally(() => setCarregando(false));
    }, [id]);

    if (carregando) return <Skeleton />;
    if (!ponto) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-gray-400">
            <ImageOff size={40} />
            <p className="text-sm">Ponto turístico não encontrado.</p>
        </div>
    );

    const imagemCapa = ponto.imagens?.find((i: any) => i.capa)?.url ?? ponto.imagens?.[0]?.url ?? null;
    const destaques = ponto.destaques
        ? ponto.destaques.split(/[,;]/).map((d: string) => d.trim()).filter(Boolean)
        : [];
    const temCoordenadas = ponto.latitude !== 0 || ponto.longitude !== 0;
    const temSidebar = ponto.endereco || ponto.horarioFuncionamento || ponto.telefone || ponto.site;

    return (
        <>
            <Helmet>
                <title>{ponto.nome} — Radar Local</title>
                <meta name="description" content={ponto.descricao?.slice(0, 160)} />
                <meta property="og:title" content={`${ponto.nome} — Radar Local`} />
                <meta property="og:description" content={ponto.descricao?.slice(0, 160)} />
                {imagemCapa && <meta property="og:image" content={imagemCapa} />}
            </Helmet>

            {/* Hero */}
            <div className="relative w-full h-72 md:h-[420px] overflow-hidden bg-gray-900">
                {imagemCapa ? (
                    <img
                        src={imagemCapa}
                        alt={ponto.nome}
                        className="w-full h-full object-cover opacity-55"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 md:px-8">
                    <div className="max-w-5xl mx-auto">
                        {ponto.cidade && (
                            <p className="text-white/60 text-xs font-medium flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                                <MapPin size={12} />
                                {ponto.cidade.nome}, {ponto.cidade.estado}
                            </p>
                        )}
                        <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                            {ponto.nome}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">

                {/* Galeria — só quando há mais de 1 imagem */}
                {ponto.imagens?.length > 1 && (
                    <Carrosel imagens={ponto.imagens} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {/* Corpo */}
                    <div className="md:col-span-2 flex flex-col gap-8">
                        <Section titulo="Sobre o local">
                            <p className="text-gray-600 leading-relaxed text-[15px]">{ponto.descricao}</p>
                        </Section>

                        {destaques.length > 0 && (
                            <Section titulo="Destaques">
                                <div className="flex flex-wrap gap-2">
                                    {destaques.map((d: string, i: number) => (
                                        <span key={i} className="flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 font-medium">
                                            <Star size={11} className="text-blue-400 fill-blue-200 shrink-0" />
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {ponto.informacoes && (
                            <Section titulo="Informações adicionais">
                                <p className="text-gray-600 leading-relaxed text-[15px]">{ponto.informacoes}</p>
                            </Section>
                        )}

                        {ponto.links?.length > 0 && (
                            <Section titulo="Links úteis">
                                <div className="flex flex-col gap-2">
                                    {ponto.links.map((link: { id: number; titulo: string; url: string }) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition-colors text-sm font-medium w-fit"
                                        >
                                            <ExternalLink size={14} className="shrink-0" />
                                            {link.titulo}
                                        </a>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-4">
                        {temSidebar && (
                            <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informações</h3>

                                {ponto.endereco && (
                                    <InfoRow icon={<MapPin size={15} className="text-blue-400 shrink-0 mt-0.5" />}>
                                        {ponto.endereco}
                                    </InfoRow>
                                )}
                                {ponto.horarioFuncionamento && (
                                    <InfoRow icon={<Clock size={15} className="text-blue-400 shrink-0 mt-0.5" />}>
                                        {ponto.horarioFuncionamento}
                                    </InfoRow>
                                )}
                                {ponto.telefone && (
                                    <InfoRow icon={<Phone size={15} className="text-blue-400 shrink-0" />}>
                                        <a href={`tel:${ponto.telefone}`} className="hover:text-blue-600 hover:underline transition-colors">
                                            {ponto.telefone}
                                        </a>
                                    </InfoRow>
                                )}
                                {ponto.site && (
                                    <InfoRow icon={<Globe size={15} className="text-blue-400 shrink-0" />}>
                                        <a href={ponto.site} target="_blank" rel="noreferrer"
                                            className="text-blue-600 hover:underline break-all transition-colors">
                                            {ponto.site.replace(/^https?:\/\//, "")}
                                        </a>
                                    </InfoRow>
                                )}
                            </div>
                        )}
                    </aside>
                </div>

                {/* Mapa */}
                {temCoordenadas && (
                    <Section titulo="Localização no mapa">
                        <LocalizacaoMap lat={ponto.latitude} lon={ponto.longitude} nome={ponto.nome} />
                    </Section>
                )}

                <SecaoComentarios tipo="ponto-turistico" localId={ponto.id} />
            </div>
        </>
    );
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                {titulo}
            </h2>
            {children}
        </div>
    );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2.5 text-sm text-gray-700 leading-snug">
            {icon}
            <span>{children}</span>
        </div>
    );
}

function Skeleton() {
    return (
        <div className="animate-pulse">
            <div className="w-full h-72 md:h-[420px] bg-gray-200" />
            <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                    <div className="h-4 bg-gray-100 rounded w-4/6" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
                <div className="bg-gray-100 rounded-2xl h-48" />
            </div>
        </div>
    );
}

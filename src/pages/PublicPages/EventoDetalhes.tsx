import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ExternalLink, MapPin, Ticket, ImageOff, Link2 } from "lucide-react";
import { Carrosel } from "../../components/list/Carrosel";
import { LocalizacaoMap } from "../../components/map/LocalizacaoMap";
import { SecaoComentarios } from "../../components/comentarios/SecaoComentarios";
import { api } from "../../services/api";

export function EventoDetalhes() {
    const { id } = useParams();
    const [evento, setEvento] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api.get(`/api/eventos/${id}`)
            .then(res => setEvento(res.data))
            .catch(err => console.error("Erro ao carregar evento:", err))
            .finally(() => setCarregando(false));
    }, [id]);

    if (carregando) return <Skeleton />;
    if (!evento) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-gray-400">
            <ImageOff size={40} />
            <p className="text-sm">Evento não encontrado.</p>
        </div>
    );

    const imagemCapa = evento.imagens?.find((i: any) => i.capa)?.url ?? evento.imagens?.[0]?.url ?? null;
    const temCoordenadas = evento.latitude !== 0 || evento.longitude !== 0;

    const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
    });

    return (
        <>
            <Helmet>
                <title>{evento.nome} — Radar Local</title>
                <meta name="description" content={evento.descricao?.slice(0, 160)} />
                <meta property="og:title" content={`${evento.nome} — Radar Local`} />
                <meta property="og:description" content={evento.descricao?.slice(0, 160)} />
                {imagemCapa && <meta property="og:image" content={imagemCapa} />}
            </Helmet>

            {/* Hero */}
            <div className="relative w-full h-72 md:h-[420px] overflow-hidden bg-gray-900">
                {imagemCapa ? (
                    <img
                        src={imagemCapa}
                        alt={evento.nome}
                        className="w-full h-full object-cover opacity-55"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 md:px-8">
                    <div className="max-w-5xl mx-auto">
                        {evento.cidade && (
                            <p className="text-white/60 text-xs font-medium flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                                <MapPin size={12} />
                                {evento.cidade.nome}, {evento.cidade.estado}
                            </p>
                        )}
                        <div className="flex items-end gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                                {evento.nome}
                            </h1>
                            {evento.gratuito && (
                                <span className="shrink-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow mb-1">
                                    Entrada gratuita
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">

                {/* Galeria — só quando há mais de 1 imagem */}
                {evento.imagens?.length > 1 && (
                    <Carrosel imagens={evento.imagens} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {/* Corpo */}
                    <div className="md:col-span-2 flex flex-col gap-8">
                        <Section titulo="Sobre o evento">
                            <p className="text-gray-600 leading-relaxed text-[15px]">{evento.descricao}</p>
                        </Section>

                        {evento.informacoes && (
                            <Section titulo="Informações adicionais">
                                <p className="text-gray-600 leading-relaxed text-[15px]">{evento.informacoes}</p>
                            </Section>
                        )}

                        {evento.links?.length > 0 && (
                            <Section titulo="Links úteis">
                                <div className="flex flex-col gap-2">
                                    {evento.links.map((link: { id: number; titulo: string; url: string }) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-200 transition-colors text-sm font-medium w-fit"
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
                    <aside>
                        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalhes</h3>

                            <InfoRow icon={<Calendar size={15} className="text-amber-500 shrink-0 mt-0.5" />}>
                                <span className="capitalize font-medium text-amber-700">{dataFormatada}</span>
                            </InfoRow>

                            <InfoRow icon={<Clock size={15} className="text-blue-400 shrink-0" />}>
                                {evento.horario}
                            </InfoRow>

                            {evento.local && (
                                <InfoRow icon={<MapPin size={15} className="text-blue-400 shrink-0 mt-0.5" />}>
                                    {evento.local}
                                </InfoRow>
                            )}

                            <InfoRow icon={<Ticket size={15} className={evento.gratuito ? "text-green-500 shrink-0" : "text-gray-300 shrink-0"} />}>
                                <span className={evento.gratuito ? "text-green-700 font-medium" : "text-gray-500"}>
                                    {evento.gratuito ? "Entrada franca" : "Evento com ingresso"}
                                </span>
                            </InfoRow>

                            {evento.link && (
                                <>
                                    <div className="border-t border-gray-100" />
                                    <a href={evento.link} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">
                                        <ExternalLink size={14} className="shrink-0" />
                                        Mais informações / Ingressos
                                    </a>
                                </>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Mapa */}
                {temCoordenadas && (
                    <Section titulo="Localização no mapa">
                        <LocalizacaoMap lat={evento.latitude} lon={evento.longitude} nome={evento.nome} />
                    </Section>
                )}

                <SecaoComentarios tipo="evento" localId={evento.id} />
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

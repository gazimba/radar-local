import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    MapPin, CalendarDays, Users, MessageSquare,
    ClipboardList, Activity, Flag, Clock, ChevronRight,
} from "lucide-react";
import { api } from "../../services/api";

function getUser() {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

interface Sugestao {
    id: number;
    nome: string;
    tipo: "ponto" | "evento";
    sugestor: string | null;
    createdAt: string;
}

interface Log {
    id: number;
    acao: string;
    detalhes: string | null;
    createdAt: string;
    user: { nome: string };
}

interface ComentarioReportado {
    id: number;
    texto: string;
    autor: string;
    totalReports: number;
    createdAt: string;
}

interface Stats {
    pontosAprovados: number;
    eventosFuturos: number;
    sugestoesPendentes: number;
    totalComentarios: number;
    reportsPendentes: number;
    totalUsuarios: number;
    sugestoesList: Sugestao[];
    comentariosReportados: ComentarioReportado[];
    recentLogs: Log[];
}

function StatCard({ icon: Icon, label, valor, to, cor, badge }: {
    icon: React.ElementType;
    label: string;
    valor: number | string;
    to: string;
    cor: string;
    badge?: number;
}) {
    return (
        <Link to={to} className={`relative flex items-center gap-4 p-5 rounded-2xl border ${cor} hover:shadow-md transition-all`}>
            <div className="p-3 rounded-xl bg-white/60">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-2xl font-bold">{valor}</p>
                <p className="text-sm font-medium opacity-80">{label}</p>
            </div>
            {badge != null && badge > 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {badge}
                </span>
            )}
        </Link>
    );
}

function formatAcao(acao: string) {
    const map: Record<string, string> = {
        APROVAR_SUGESTAO: "Sugestão aprovada",
        REJEITAR_SUGESTAO: "Sugestão rejeitada",
        ALTERAR_CARGO: "Cargo alterado",
        BLOQUEAR_USUARIO: "Usuário bloqueado",
        DESBLOQUEAR_USUARIO: "Usuário desbloqueado",
        SILENCIAR_USUARIO: "Usuário silenciado",
        DESSILENCIAR_USUARIO: "Usuário dessilenciado",
    };
    return map[acao] ?? acao.replace(/_/g, " ").toLowerCase();
}

function tempoRelativo(data: string) {
    const diff = Date.now() - new Date(data).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}min atrás`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
}

function saudacao() {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
}

export function Home() {
    const user = getUser();
    const isAdmin = user?.cargo === "ADMINISTRADOR";
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/stats")
            .then(r => setStats(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 flex flex-col gap-8 max-w-5xl">

            {/* Cabeçalho */}
            <div>
                <h1 className="text-2xl font-bold text-blue-800">
                    {saudacao()}, {user?.nome?.split(" ")[0]}!
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {isAdmin ? "Painel do Administrador" : "Painel do Moderador"} — Radar Local
                </p>
            </div>

            {/* Cards de estatísticas */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(isAdmin ? 6 : 5)].map((_, i) => (
                        <div key={i} className="animate-pulse h-24 bg-gray-100 rounded-2xl" />
                    ))}
                </div>
            )}

            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard icon={MapPin} label="Pontos publicados" valor={stats.pontosAprovados} to="/pontos-turisticos" cor="bg-amber-50 border-amber-200 text-amber-800" />
                    <StatCard icon={CalendarDays} label="Eventos futuros" valor={stats.eventosFuturos} to="/eventos" cor="bg-green-50 border-green-200 text-green-800" />
                    <StatCard icon={ClipboardList} label="Sugestões pendentes" valor={stats.sugestoesPendentes} to="/sugestoes" cor="bg-purple-50 border-purple-200 text-purple-800" badge={stats.sugestoesPendentes} />
                    <StatCard icon={MessageSquare} label="Comentários" valor={stats.totalComentarios} to="/comentarios" cor="bg-sky-50 border-sky-200 text-sky-800" badge={stats.reportsPendentes} />
                    {isAdmin && <StatCard icon={Users} label="Usuários cadastrados" valor={stats.totalUsuarios} to="/usuarios" cor="bg-blue-50 border-blue-200 text-blue-800" />}
                </div>
            )}

            {stats && (
                <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Sugestões recentes */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <ClipboardList size={16} className="text-purple-500" />
                                Sugestões pendentes
                            </h2>
                            <Link to="/sugestoes" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                Ver todas <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {stats.sugestoesList.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-8">Nenhuma sugestão pendente</p>
                            )}
                            {stats.sugestoesList.map(s => (
                                <div key={`${s.tipo}-${s.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{s.nome}</p>
                                        <p className="text-xs text-gray-400">
                                            {s.tipo === "evento" ? "Evento" : "Local"}{s.sugestor ? ` · por ${s.sugestor}` : ""}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3 flex items-center gap-1">
                                        <Clock size={11} /> {tempoRelativo(s.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logs recentes (somente admin) */}
                    {isAdmin && (
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Activity size={16} className="text-blue-500" />
                                    Atividade recente
                                </h2>
                                <Link to="/logs" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    Ver logs <ChevronRight size={12} />
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {stats.recentLogs.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-8">Nenhuma atividade registrada</p>
                                )}
                                {stats.recentLogs.map(log => (
                                    <div key={log.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800">{formatAcao(log.acao)}</p>
                                            <p className="text-xs text-gray-400 truncate">{log.user.nome}{log.detalhes ? ` · ${log.detalhes}` : ""}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-3 flex items-center gap-1">
                                            <Clock size={11} /> {tempoRelativo(log.createdAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Comentários reportados — admin e moderador */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Flag size={16} className="text-red-500" />
                            Comentários reportados
                            {stats.reportsPendentes > 0 && (
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {stats.reportsPendentes}
                                </span>
                            )}
                        </h2>
                        <Link to="/comentarios?reportados=1" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            Ver todos <ChevronRight size={12} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.comentariosReportados.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">Nenhum comentário reportado</p>
                        )}
                        {stats.comentariosReportados.map(c => (
                            <div key={c.id} className="flex items-start justify-between px-5 py-3 hover:bg-red-50/40 transition-colors">
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-800 line-clamp-2">"{c.texto}"</p>
                                    <p className="text-xs text-gray-400 mt-0.5">por {c.autor} · {tempoRelativo(c.createdAt)}</p>
                                </div>
                                <span className="ml-3 mt-0.5 flex items-center gap-1 text-xs font-semibold text-red-500 whitespace-nowrap bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                    <Flag size={10} /> {c.totalReports} report{c.totalReports !== 1 ? "s" : ""}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                </>
            )}

            {/* Ações rápidas */}
            <div className="flex flex-wrap gap-3">
                <Link to="/sugestoes" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                    <ClipboardList size={15} /> Sugestões
                </Link>
                <Link to="/comentarios" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                    <MessageSquare size={15} /> Comentários
                </Link>
                {isAdmin && (
                    <>
                        <Link to="/usuarios" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                            <Users size={15} /> Usuários
                        </Link>
                        <Link to="/logs" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                            <Activity size={15} /> Logs
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

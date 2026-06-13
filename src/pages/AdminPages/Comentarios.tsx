import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { MessageSquare, Trash2, VolumeX, Volume2, Search, MapPin, Calendar, Flag, X } from "lucide-react";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../components/ui/ConfirmDialog";

interface Report {
    id: number;
    motivo: string | null;
    createdAt: string;
    user: { nome: string };
}

interface Comentario {
    id: number;
    texto: string;
    createdAt: string;
    user: { id: number; nome: string; foto: string | null; ativo: boolean; silenciadoAte: string | null };
    pontoTuristico: { id: number; nome: string } | null;
    evento: { id: number; nome: string } | null;
    reports: Report[];
}

const OPCOES_SILENCIO: { label: string; horas: number | null }[] = [
    { label: "1 hora", horas: 1 },
    { label: "24 horas", horas: 24 },
    { label: "7 dias", horas: 168 },
    { label: "30 dias", horas: 720 },
    { label: "Permanente", horas: null },
];

function isSilenciado(silenciadoAte: string | null): boolean {
    if (!silenciadoAte) return false;
    return new Date(silenciadoAte) > new Date();
}

function labelSilencio(silenciadoAte: string | null): string {
    if (!silenciadoAte || new Date(silenciadoAte) <= new Date()) return "";
    const ate = new Date(silenciadoAte);
    if (ate.getFullYear() >= 2099) return "Silenciado permanentemente";
    return `Silenciado até ${ate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
}

type FiltroTipo = "todos" | "ponto-turistico" | "evento";
type FiltroReport = "todos" | "reportados";

function getCargo() {
    try {
        return JSON.parse(localStorage.getItem("@radar-local:user") ?? "{}")?.cargo ?? null;
    } catch { return null; }
}

export function Comentarios() {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [pagina, setPagina] = useState(1);
    const [busca, setBusca] = useState("");
    const [buscaInput, setBuscaInput] = useState("");
    const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
    const [filtroReport, setFiltroReport] = useState<FiltroReport>("todos");
    const [carregando, setCarregando] = useState(true);

    const [menuSilenciarAberto, setMenuSilenciarAberto] = useState<number | null>(null);

    const toast = useToast();
    const confirm = useConfirm();
    const cargo = getCargo();

    const carregar = useCallback(async () => {
        setCarregando(true);
        try {
            const params: Record<string, string | number> = { page: pagina };
            if (busca) params.q = busca;
            if (filtroTipo !== "todos") params.tipo = filtroTipo;
            if (filtroReport === "reportados") params.reportados = "1";

            const res = await api.get("/api/comentarios", { params });
            setComentarios(res.data.comentarios);
            setTotal(res.data.total);
            setTotalPaginas(res.data.totalPaginas);
        } catch {
            toast.error("Erro ao carregar comentários.");
        } finally {
            setCarregando(false);
        }
    }, [pagina, busca, filtroTipo, filtroReport]);

    useEffect(() => { carregar(); }, [carregar]);

    function handleBuscar(e: React.FormEvent) {
        e.preventDefault();
        setPagina(1);
        setBusca(buscaInput);
    }

    async function handleDeletar(id: number) {
        const ok = await confirm({
            mensagem: "Deseja remover permanentemente este comentário?",
            textoBotaoConfirmar: "Remover",
            variante: "danger",
        });
        if (!ok) return;
        try {
            await api.delete(`/api/comentarios/${id}`);
            toast.success("Comentário removido.");
            carregar();
        } catch {
            toast.error("Erro ao remover comentário.");
        }
    }

    async function handleSilenciar(userId: number, nomeUsuario: string, horas: number | null) {
        const descricao = horas === null ? "permanentemente" : `por ${OPCOES_SILENCIO.find(o => o.horas === horas)?.label}`;
        const ok = await confirm({
            mensagem: `Silenciar "${nomeUsuario}" de comentários ${descricao}?`,
            textoBotaoConfirmar: "Silenciar",
            variante: "danger",
        });
        setMenuSilenciarAberto(null);
        if (!ok) return;
        try {
            await api.patch(`/api/usuarios/${userId}/silenciar`, { duracaoHoras: horas });
            toast.success(`Usuário silenciado ${descricao}.`);
            carregar();
        } catch {
            toast.error("Erro ao silenciar usuário.");
        }
    }

    async function handleDispensarReports(comentarioId: number) {
        try {
            await api.delete(`/api/comentarios/${comentarioId}/reports`);
            toast.success("Reports dispensados.");
            carregar();
        } catch {
            toast.error("Erro ao dispensar reports.");
        }
    }

    async function handleDessilenciar(userId: number, nomeUsuario: string) {
        const ok = await confirm({
            mensagem: `Remover silêncio de "${nomeUsuario}"?`,
            textoBotaoConfirmar: "Confirmar",
            variante: undefined,
        });
        if (!ok) return;
        try {
            await api.patch(`/api/usuarios/${userId}/dessilenciar`);
            toast.success("Usuário dessilenciado.");
            carregar();
        } catch {
            toast.error("Erro ao dessilenciar usuário.");
        }
    }

    const filtros: { label: string; valor: FiltroTipo }[] = [
        { label: "Todos", valor: "todos" },
        { label: "Pontos Turísticos", valor: "ponto-turistico" },
        { label: "Eventos", valor: "evento" },
    ];

    return (
        <div className="p-4 flex flex-col gap-4">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">Comentários</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {total} comentário{total !== 1 ? "s" : ""} no total
                    </p>
                </div>
            </div>

            {/* Filtros e busca */}
            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleBuscar} className="flex gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-lg px-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Search size={15} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={buscaInput}
                            onChange={e => setBuscaInput(e.target.value)}
                            placeholder="Buscar por texto ou autor..."
                            className="flex-1 text-sm py-2 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                        Buscar
                    </button>
                </form>

                <div className="flex gap-2 flex-wrap">
                    {filtros.map(f => (
                        <button
                            key={f.valor}
                            onClick={() => { setFiltroTipo(f.valor); setPagina(1); }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${filtroTipo === f.valor ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                        >
                            {f.label}
                        </button>
                    ))}
                    <button
                        onClick={() => { setFiltroReport(v => v === "reportados" ? "todos" : "reportados"); setPagina(1); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${filtroReport === "reportados" ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}
                    >
                        <Flag size={11} />
                        Reportados
                    </button>
                </div>
            </div>

            {/* Lista */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {carregando ? (
                    <div className="flex flex-col gap-0">
                        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                    </div>
                ) : comentarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <MessageSquare size={36} className="text-gray-200" />
                        <p className="text-gray-400 font-medium">Nenhum comentário encontrado.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {comentarios.map(c => (
                            <ComentarioRow
                                key={c.id}
                                comentario={c}
                                menuAberto={menuSilenciarAberto === c.user.id}
                                onToggleMenu={() => setMenuSilenciarAberto(v => v === c.user.id ? null : c.user.id)}
                                onDeletar={handleDeletar}
                                onSilenciar={handleSilenciar}
                                onDessilenciar={handleDessilenciar}
                                onDispensarReports={handleDispensarReports}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {/* Paginação */}
            {!carregando && totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                        disabled={pagina === 1}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-500 font-medium px-2">
                        {pagina} / {totalPaginas}
                    </span>
                    <button
                        onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                        disabled={pagina === totalPaginas}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}

interface RowProps {
    comentario: Comentario;
    menuAberto: boolean;
    onToggleMenu: () => void;
    onDeletar: (id: number) => void;
    onSilenciar: (userId: number, nome: string, horas: number | null) => void;
    onDessilenciar: (userId: number, nome: string) => void;
    onDispensarReports: (comentarioId: number) => void;
}

function ComentarioRow({ comentario: c, menuAberto, onToggleMenu, onDeletar, onSilenciar, onDessilenciar, onDispensarReports }: RowProps) {
    const local = c.pontoTuristico ?? c.evento;
    const tipo = c.pontoTuristico ? "ponto-turistico" : "evento";
    const silenciado = isSilenciado(c.user.silenciadoAte);
    const qtdReports = c.reports?.length ?? 0;
    const dataFormatada = new Date(c.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric",
    });

    return (
        <li className="flex flex-col sm:flex-row sm:items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors">
            {/* Avatar */}
            <div className="shrink-0">
                {c.user.foto ? (
                    <img src={c.user.foto} alt={c.user.nome} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {c.user.nome.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{c.user.nome}</span>
                    {!c.user.ativo && (
                        <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                            Bloqueado
                        </span>
                    )}
                    {silenciado && (
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5">
                            {labelSilencio(c.user.silenciadoAte)}
                        </span>
                    )}
                    <span className="text-xs text-gray-400">{dataFormatada}</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">{c.texto}</p>

                {qtdReports > 0 && (
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                            <Flag size={10} />
                            {qtdReports} report{qtdReports > 1 ? "s" : ""}
                        </span>
                        {c.reports.map(r => r.motivo).filter(Boolean).slice(0, 2).map((motivo, i) => (
                            <span key={i} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 truncate max-w-40">
                                "{motivo}"
                            </span>
                        ))}
                        <button
                            onClick={() => onDispensarReports(c.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            title="Dispensar todos os reports"
                        >
                            <X size={11} /> Dispensar
                        </button>
                    </div>
                )}

                {local && (
                    <Link
                        to={`/${tipo}/${local.id}`}
                        className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 hover:underline w-fit mt-0.5 transition-colors"
                    >
                        {tipo === "ponto-turistico"
                            ? <MapPin size={11} className="shrink-0" />
                            : <Calendar size={11} className="shrink-0" />
                        }
                        {local.nome}
                    </Link>
                )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1 shrink-0 relative">
                <button
                    onClick={() => onDeletar(c.id)}
                    title="Remover comentário"
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <Trash2 size={15} />
                </button>

                {silenciado ? (
                    <button
                        onClick={() => onDessilenciar(c.user.id, c.user.nome)}
                        title="Remover silêncio"
                        className="p-1.5 rounded-lg text-green-500 hover:text-green-700 hover:bg-green-50 transition-colors"
                    >
                        <Volume2 size={15} />
                    </button>
                ) : (
                    <div className="relative">
                        <button
                            onClick={onToggleMenu}
                            title="Silenciar usuário"
                            className="p-1.5 rounded-lg text-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                            <VolumeX size={15} />
                        </button>

                        {menuAberto && (
                            <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-44">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pt-2.5 pb-1">
                                    Silenciar por
                                </p>
                                {OPCOES_SILENCIO.map(opcao => (
                                    <button
                                        key={String(opcao.horas)}
                                        onClick={() => onSilenciar(c.user.id, c.user.nome, opcao.horas)}
                                        className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${opcao.horas === null ? "text-red-600 font-semibold" : "text-gray-700"}`}
                                    >
                                        {opcao.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </li>
    );
}

function SkeletonRow() {
    return (
        <div className="flex gap-3 px-4 py-4 animate-pulse border-b border-gray-50">
            <div className="w-9 h-9 bg-gray-100 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
        </div>
    );
}

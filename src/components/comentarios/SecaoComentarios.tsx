import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Flag } from "lucide-react";
import { api } from "../../services/api";

interface Comentario {
    id: number;
    texto: string;
    createdAt: string;
    user: { id: number; nome: string; foto: string | null };
}

function isSilenciado(user: { silenciadoAte?: string | null } | null): boolean {
    if (!user?.silenciadoAte) return false;
    return new Date(user.silenciadoAte) > new Date();
}

function mensagemSilencio(silenciadoAte: string): string {
    const ate = new Date(silenciadoAte);
    if (ate.getFullYear() >= 2099) return "Você foi silenciado permanentemente e não pode comentar.";
    return `Você está silenciado até ${ate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}.`;
}

interface Props {
    tipo: "ponto-turistico" | "evento";
    localId: number;
}

export function SecaoComentarios({ tipo, localId }: Props) {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [texto, setTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [reportados, setReportados] = useState<Set<number>>(new Set());
    const [reportando, setReportando] = useState<number | null>(null);

    const userRaw = localStorage.getItem("@radar-local:user");
    const usuarioLogado = userRaw ? JSON.parse(userRaw) : null;
    const token = localStorage.getItem("@radar-local:token");

    useEffect(() => {
        api.get(`/api/comentarios/${tipo}/${localId}`)
            .then(res => setComentarios(res.data))
            .catch(() => {});
    }, [tipo, localId]);

    async function handleEnviar(e: React.FormEvent) {
        e.preventDefault();
        if (!texto.trim()) return;

        setEnviando(true);
        setErro(null);

        try {
            const res = await api.post(
                `/api/comentarios/${tipo}/${localId}`,
                { texto },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComentarios(prev => [res.data, ...prev]);
            setTexto("");
        } catch (err: any) {
            setErro(err.response?.data?.message || "Erro ao enviar comentário.");
        } finally {
            setEnviando(false);
        }
    }

    async function handleReportar(id: number) {
        if (reportados.has(id)) return;
        setReportando(id);
        try {
            await api.post(`/api/comentarios/${id}/reportar`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReportados(prev => new Set([...prev, id]));
        } catch (err: any) {
            setErro(err.response?.data?.message || "Erro ao reportar.");
        } finally {
            setReportando(null);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await api.delete(`/api/comentarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComentarios(prev => prev.filter(c => c.id !== id));
        } catch {
            setErro("Erro ao remover comentário.");
        }
    }

    const podeModerar = usuarioLogado?.cargo === "ADMINISTRADOR" || usuarioLogado?.cargo === "MODERADOR";

    return (
        <section className="w-full mt-10">
            <h2 className="text-blue-800 font-bold text-xl uppercase border-b pb-2 mb-6">
                Comentários
            </h2>

            {usuarioLogado && isSilenciado(usuarioLogado) ? (
                <div className="mb-8 flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700">
                    <span className="text-orange-400 mt-0.5 shrink-0">🔇</span>
                    <p className="font-medium">{mensagemSilencio(usuarioLogado.silenciadoAte)}</p>
                </div>
            ) : usuarioLogado ? (
                <form onSubmit={handleEnviar} className="mb-8">
                    <textarea
                        value={texto}
                        onChange={e => setTexto(e.target.value)}
                        placeholder="Deixe seu comentário..."
                        maxLength={1000}
                        rows={3}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    {erro && <p className="text-red-600 text-sm mt-1">{erro}</p>}
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{texto.length}/1000</span>
                        <button
                            type="submit"
                            disabled={enviando || !texto.trim()}
                            className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
                        >
                            {enviando ? "Enviando..." : "Comentar"}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-gray-500 mb-6">
                    <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                        Faça login
                    </Link>{" "}
                    para deixar um comentário.
                </p>
            )}

            {comentarios.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum comentário ainda. Seja o primeiro!</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {comentarios.map(c => {
                        const isAutor = usuarioLogado?.id === c.user.id;
                        const dataFormatada = new Date(c.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        });

                        const jaReportou = reportados.has(c.id);

                        return (
                            <li key={c.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {c.user.foto ? (
                                            <img
                                                src={c.user.foto}
                                                alt={c.user.nome}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-sm">
                                                {c.user.nome.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="font-semibold text-sm text-gray-800">{c.user.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400">{dataFormatada}</span>
                                        {usuarioLogado && !isAutor && !podeModerar && (
                                            <button
                                                onClick={() => handleReportar(c.id)}
                                                disabled={jaReportou || reportando === c.id}
                                                title={jaReportou ? "Já reportado" : "Reportar comentário"}
                                                className={`flex items-center gap-1 text-xs transition-colors disabled:cursor-default ${jaReportou ? "text-orange-400" : "text-gray-400 hover:text-orange-500"}`}
                                            >
                                                <Flag size={12} />
                                                {jaReportou ? "Reportado" : "Reportar"}
                                            </button>
                                        )}
                                        {(isAutor || podeModerar) && (
                                            <button
                                                onClick={() => handleDeletar(c.id)}
                                                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{c.texto}</p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

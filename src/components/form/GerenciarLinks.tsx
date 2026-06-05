import { useEffect, useState } from "react";
import { Link2, Plus, Trash2, Pencil, Check, X, ExternalLink } from "lucide-react";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

interface LinkUtil {
    id: number;
    titulo: string;
    url: string;
}

interface Props {
    tipo: "ponto-turistico" | "evento";
    registroId: number;
}

export function GerenciarLinks({ tipo, registroId }: Props) {
    const toast = useToast();
    const [links, setLinks] = useState<LinkUtil[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [adicionando, setAdicionando] = useState(false);
    const [form, setForm] = useState({ titulo: "", url: "" });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        api.get(`/api/links/${tipo}/${registroId}`)
            .then(res => setLinks(res.data))
            .catch(() => {});
    }, [tipo, registroId]);

    function iniciarEdicao(link: LinkUtil) {
        setEditandoId(link.id);
        setAdicionando(false);
        setForm({ titulo: link.titulo, url: link.url });
    }

    function cancelar() {
        setEditandoId(null);
        setAdicionando(false);
        setForm({ titulo: "", url: "" });
    }

    async function salvar() {
        if (!form.titulo.trim() || !form.url.trim()) {
            toast.warning("Preencha o título e a URL.");
            return;
        }
        setSalvando(true);
        try {
            if (adicionando) {
                const res = await api.post(`/api/links/${tipo}/${registroId}`, form);
                setLinks(prev => [...prev, res.data]);
                toast.success("Link adicionado.");
            } else if (editandoId !== null) {
                const res = await api.put(`/api/links/${editandoId}`, form);
                setLinks(prev => prev.map(l => l.id === editandoId ? res.data : l));
                toast.success("Link atualizado.");
            }
            cancelar();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Erro ao salvar link.");
        } finally {
            setSalvando(false);
        }
    }

    async function deletar(id: number) {
        try {
            await api.delete(`/api/links/${id}`);
            setLinks(prev => prev.filter(l => l.id !== id));
            toast.success("Link removido.");
        } catch {
            toast.error("Erro ao remover link.");
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {links.length === 0 && !adicionando && (
                <p className="text-sm text-gray-400 italic">Nenhum link cadastrado.</p>
            )}

            {links.map(link => (
                <div key={link.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50">
                    {editandoId === link.id ? (
                        <FormInline
                            form={form}
                            onChange={setForm}
                            onSalvar={salvar}
                            onCancelar={cancelar}
                            salvando={salvando}
                        />
                    ) : (
                        <>
                            <Link2 size={14} className="text-blue-400 shrink-0" />
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-semibold text-gray-700 truncate">{link.titulo}</span>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-500 hover:underline truncate flex items-center gap-1"
                                >
                                    <ExternalLink size={10} />
                                    {link.url}
                                </a>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => iniciarEdicao(link)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    title="Editar"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => deletar(link.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Remover"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            {adicionando && (
                <div className="p-3 border border-blue-200 rounded-xl bg-blue-50">
                    <FormInline
                        form={form}
                        onChange={setForm}
                        onSalvar={salvar}
                        onCancelar={cancelar}
                        salvando={salvando}
                    />
                </div>
            )}

            {!adicionando && editandoId === null && (
                <button
                    onClick={() => { setAdicionando(true); setEditandoId(null); setForm({ titulo: "", url: "" }); }}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold w-fit transition-colors"
                >
                    <Plus size={15} />
                    Adicionar link
                </button>
            )}
        </div>
    );
}

function FormInline({
    form,
    onChange,
    onSalvar,
    onCancelar,
    salvando,
}: {
    form: { titulo: string; url: string };
    onChange: (f: { titulo: string; url: string }) => void;
    onSalvar: () => void;
    onCancelar: () => void;
    salvando: boolean;
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <input
                type="text"
                placeholder="Título (ex: Site oficial)"
                value={form.titulo}
                onChange={e => onChange({ ...form, titulo: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                maxLength={100}
            />
            <input
                type="url"
                placeholder="URL (ex: https://...)"
                value={form.url}
                onChange={e => onChange({ ...form, url: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
            <div className="flex gap-2 justify-end">
                <button
                    onClick={onCancelar}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={13} /> Cancelar
                </button>
                <button
                    onClick={onSalvar}
                    disabled={salvando}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                    <Check size={13} /> {salvando ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </div>
    );
}

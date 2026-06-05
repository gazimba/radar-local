import { useEffect, useRef, useState } from "react";
import { Link2, Plus, Trash2, Pencil, Check, X, ArrowUp, ArrowDown, ExternalLink, Search, MapPin } from "lucide-react";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

interface Cidade {
    id: number;
    nome: string;
    estado: string;
    slug: string;
}

interface LinkCidade {
    id: number;
    titulo: string;
    url: string;
    ordem: number;
}

export function GerenciarLinksCidade() {
    const toast = useToast();
    const inputRef = useRef<HTMLInputElement>(null);

    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [busca, setBusca] = useState("");
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null);
    const [cidadeSlug, setCidadeSlug] = useState("");

    const [links, setLinks] = useState<LinkCidade[]>([]);
    const [carregandoLinks, setCarregandoLinks] = useState(false);

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [adicionando, setAdicionando] = useState(false);
    const [form, setForm] = useState({ titulo: "", url: "" });
    const [salvando, setSalvando] = useState(false);

    const cidadesFiltradas = busca.trim().length === 0
        ? cidades
        : cidades.filter(c =>
            `${c.nome} ${c.estado}`.toLowerCase().includes(busca.toLowerCase())
        );

    // Carregar cidades
    useEffect(() => {
        api.get("/api/cidades")
            .then(res => setCidades(res.data))
            .catch(() => {});
    }, []);

    function selecionarCidade(c: Cidade) {
        setCidadeSelecionada(c);
        setCidadeSlug(c.slug);
        setBusca(`${c.nome}, ${c.estado}`);
        setDropdownAberto(false);
    }

    // Carregar links da cidade selecionada
    useEffect(() => {
        if (!cidadeSlug) return;
        setCarregandoLinks(true);
        setEditandoId(null);
        setAdicionando(false);
        api.get(`/api/links-cidade/${cidadeSlug}`)
            .then(res => setLinks(res.data))
            .catch(() => setLinks([]))
            .finally(() => setCarregandoLinks(false));
    }, [cidadeSlug]);

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
                const res = await api.post(`/api/links-cidade/${cidadeSlug}`, form);
                setLinks(prev => [...prev, res.data]);
                toast.success("Link adicionado.");
            } else if (editandoId !== null) {
                const res = await api.put(`/api/links-cidade/${editandoId}`, form);
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
            await api.delete(`/api/links-cidade/${id}`);
            setLinks(prev => {
                const nova = prev.filter(l => l.id !== id);
                return nova.map((l, i) => ({ ...l, ordem: i }));
            });
            toast.success("Link removido.");
        } catch {
            toast.error("Erro ao remover link.");
        }
    }

    async function mover(index: number, direcao: "up" | "down") {
        const nova = [...links];
        const alvo = direcao === "up" ? index - 1 : index + 1;
        if (alvo < 0 || alvo >= nova.length) return;

        [nova[index], nova[alvo]] = [nova[alvo], nova[index]];
        const reordenada = nova.map((l, i) => ({ ...l, ordem: i }));
        setLinks(reordenada);

        try {
            await api.patch(`/api/links-cidade/${cidadeSlug}/reordenar`, {
                ids: reordenada.map(l => l.id),
            });
        } catch {
            toast.error("Erro ao salvar nova ordem.");
        }
    }

    return (
        <div className="p-6 max-w-3xl flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight flex items-center gap-2">
                    <Link2 size={20} className="text-blue-500" />
                    Links Úteis da Cidade
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Gerencie os links exibidos na sidebar da página pública (ex: site da prefeitura, portal do turismo).
                </p>
            </div>

            {/* Busca de cidade */}
            <div className="relative max-w-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cidade</label>
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Digite o nome da cidade..."
                        value={busca}
                        onChange={e => { setBusca(e.target.value); setDropdownAberto(true); }}
                        onFocus={() => setDropdownAberto(true)}
                        onBlur={() => setTimeout(() => setDropdownAberto(false), 150)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    />
                </div>

                {dropdownAberto && cidadesFiltradas.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                        {cidadesFiltradas.map(c => (
                            <button
                                key={c.id}
                                onMouseDown={() => selecionarCidade(c)}
                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors ${cidadeSelecionada?.id === c.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"}`}
                            >
                                <MapPin size={13} className="text-gray-400 shrink-0" />
                                {c.nome}, {c.estado}
                            </button>
                        ))}
                    </div>
                )}

                {dropdownAberto && busca.trim().length > 0 && cidadesFiltradas.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-400">
                        Nenhuma cidade encontrada.
                    </div>
                )}
            </div>

            {/* Lista de links */}
            {!cidadeSelecionada && (
                <p className="text-sm text-gray-400 italic">Selecione uma cidade para gerenciar os links.</p>
            )}
            <div className={`flex flex-col gap-2 ${!cidadeSelecionada ? "hidden" : ""}`}>
                {carregandoLinks && (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse h-14 bg-gray-50 rounded-xl border border-gray-100" />
                    ))
                )}

                {!carregandoLinks && links.length === 0 && !adicionando && (
                    <p className="text-sm text-gray-400 italic">Nenhum link cadastrado para esta cidade.</p>
                )}

                {!carregandoLinks && links.map((link, index) => (
                    <div key={link.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {editandoId === link.id ? (
                            <div className="p-4">
                                <FormInline
                                    form={form}
                                    onChange={setForm}
                                    onSalvar={salvar}
                                    onCancelar={cancelar}
                                    salvando={salvando}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 px-4 py-3">
                                {/* Botões de ordem */}
                                <div className="flex flex-col gap-0.5 shrink-0">
                                    <button
                                        onClick={() => mover(index, "up")}
                                        disabled={index === 0}
                                        className="p-1 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                        title="Mover para cima"
                                    >
                                        <ArrowUp size={13} />
                                    </button>
                                    <button
                                        onClick={() => mover(index, "down")}
                                        disabled={index === links.length - 1}
                                        className="p-1 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                        title="Mover para baixo"
                                    >
                                        <ArrowDown size={13} />
                                    </button>
                                </div>

                                {/* Conteúdo */}
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-semibold text-gray-800 truncate">{link.titulo}</span>
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

                                {/* Ações */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => { setEditandoId(link.id); setAdicionando(false); setForm({ titulo: link.titulo, url: link.url }); }}
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
                            </div>
                        )}
                    </div>
                ))}

                {!carregandoLinks && adicionando && (
                    <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
                        <FormInline
                            form={form}
                            onChange={setForm}
                            onSalvar={salvar}
                            onCancelar={cancelar}
                            salvando={salvando}
                        />
                    </div>
                )}
            </div>

            {cidadeSelecionada && !adicionando && editandoId === null && !carregandoLinks && (
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
        <div className="flex flex-col gap-2">
            <input
                type="text"
                placeholder="Título (ex: Site da Prefeitura)"
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

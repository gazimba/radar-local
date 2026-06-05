import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Calendar } from "lucide-react";
import { api } from "../../services/api";
import { useCidade } from "../../context/CidadeContext";

interface ResultadoBusca {
    id: number;
    nome: string;
    descricao: string;
    tipo: "ponto-turistico" | "evento";
    data?: string;
    imagens: { url: string }[];
}

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export function BuscaGlobal() {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
    const [aberto, setAberto] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { cidadeSelecionada } = useCidade();

    const queryDebounced = useDebounce(query, 350);

    useEffect(() => {
        if (queryDebounced.length < 2) {
            setResultados([]);
            return;
        }

        setCarregando(true);
        const params: Record<string, string> = { q: queryDebounced };
        if (cidadeSelecionada?.slug) params.cidadeSlug = cidadeSelecionada.slug;

        api.get("/api/busca", { params })
            .then((res) => {
                const todos: ResultadoBusca[] = [
                    ...res.data.pontos,
                    ...res.data.eventos,
                ];
                setResultados(todos);
                setAberto(todos.length > 0);
            })
            .catch(() => setResultados([]))
            .finally(() => setCarregando(false));
    }, [queryDebounced, cidadeSelecionada]);

    useEffect(() => {
        function handleClickFora(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    function handleSelecionar(item: ResultadoBusca) {
        setQuery("");
        setAberto(false);
        navigate(`/${item.tipo}/${item.id}`);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && query.trim().length >= 2) {
            setAberto(false);
            const params = new URLSearchParams({ q: query.trim() });
            if (cidadeSelecionada?.slug) params.set("cidadeSlug", cidadeSelecionada.slug);
            navigate(`/busca?${params.toString()}`);
        }
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => resultados.length > 0 && setAberto(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar pontos turísticos e eventos..."
                    className="bg-transparent w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
                {carregando && (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                )}
            </div>

            {aberto && resultados.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {resultados.map((item) => (
                        <button
                            key={`${item.tipo}-${item.id}`}
                            onClick={() => handleSelecionar(item)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                            {item.imagens[0] ? (
                                <img
                                    src={item.imagens[0].url}
                                    alt={item.nome}
                                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    {item.tipo === "evento"
                                        ? <Calendar size={18} className="text-blue-400" />
                                        : <MapPin size={18} className="text-blue-400" />
                                    }
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-gray-800 truncate">{item.nome}</span>
                                <span className="text-xs text-gray-400">
                                    {item.tipo === "evento" ? "Evento" : "Ponto Turístico"}
                                </span>
                            </div>
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            setAberto(false);
                            const params = new URLSearchParams({ q: query.trim() });
                            if (cidadeSelecionada?.slug) params.set("cidadeSlug", cidadeSelecionada.slug);
                            navigate(`/busca?${params.toString()}`);
                        }}
                        className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <Search size={13} />
                        Ver todos os resultados para "{query}"
                    </button>
                </div>
            )}

            {aberto && query.length >= 2 && resultados.length === 0 && !carregando && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3">
                    <p className="text-sm text-gray-400">Nenhum resultado para "{query}"</p>
                </div>
            )}
        </div>
    );
}

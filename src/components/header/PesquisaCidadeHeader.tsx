import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useCidade } from "../../context/CidadeContext";

export function PesquisaCidadeHeader() {
    const { cidadeSelecionada, cidades, selecionarCidade } = useCidade();
    const [aberto, setAberto] = useState(false);
    const [busca, setBusca] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const cidadesFiltradas = cidades.filter((c) =>
        `${c.nome} ${c.estado}`.toLowerCase().includes(busca.toLowerCase())
    );

    useEffect(() => {
        function handleClickFora(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setAberto(false);
                setBusca("");
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setAberto((v) => !v)}
                className="flex items-center gap-2 h-11 px-4 rounded-lg border border-blue-600 bg-blue-200/10 text-blue-900 text-sm font-medium hover:bg-blue-100 transition-colors min-w-56"
            >
                <MapPin size={16} className="text-blue-600 shrink-0" />
                <span className="flex-1 text-left truncate">
                    {cidadeSelecionada
                        ? `${cidadeSelecionada.nome} - ${cidadeSelecionada.estado}`
                        : "Selecione uma cidade"}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-500 shrink-0 transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
                />
            </button>

            {aberto && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Buscar cidade..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <ul className="max-h-56 overflow-y-auto">
                        {cidadesFiltradas.length === 0 && (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">
                                Nenhuma cidade encontrada
                            </li>
                        )}
                        {cidadesFiltradas.map((cidade) => (
                            <li key={cidade.id}>
                                <button
                                    onClick={() => {
                                        selecionarCidade(cidade);
                                        setAberto(false);
                                        setBusca("");
                                    }}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left hover:bg-blue-50 transition-colors ${
                                        cidadeSelecionada?.slug === cidade.slug
                                            ? "bg-blue-50 text-blue-700 font-semibold"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <MapPin size={14} className="text-blue-400 shrink-0" />
                                    {cidade.nome} - {cidade.estado}
                                    {cidadeSelecionada?.slug === cidade.slug && (
                                        <span className="ml-auto text-blue-500 text-xs">✓ selecionada</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

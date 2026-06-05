import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

export interface Coluna<T = any> {
    header: string;
    key: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface TabelaAdminProps<T = any> {
    colunas: Coluna<T>[];
    dados: T[];
    acoes?: (item: T) => React.ReactNode;
    tamanhoPagina?: number;
    campoBusca?: (keyof T)[];
}

type Direcao = "asc" | "desc";

function getValor(item: any, key: string): any {
    return key.split(".").reduce((obj, k) => obj?.[k], item);
}

function comparar(a: any, b: any, direcao: Direcao): number {
    const va = a ?? "";
    const vb = b ?? "";
    const resultado = String(va).localeCompare(String(vb), "pt-BR", { numeric: true, sensitivity: "base" });
    return direcao === "asc" ? resultado : -resultado;
}

export function TabelaAdmin<T extends { id?: number | string }>({
    colunas,
    dados,
    acoes,
    tamanhoPagina = 10,
    campoBusca,
}: TabelaAdminProps<T>) {
    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState<{ key: string; direcao: Direcao } | null>(null);
    const [pagina, setPagina] = useState(1);

    const dadosFiltrados = useMemo(() => {
        if (!busca.trim()) return dados;
        const termo = busca.toLowerCase();
        const campos = campoBusca ?? (colunas.filter(c => !c.render).map(c => c.key as keyof T));
        return dados.filter(item =>
            campos.some(campo => {
                const val = getValor(item, String(campo));
                return String(val ?? "").toLowerCase().includes(termo);
            })
        );
    }, [dados, busca, campoBusca, colunas]);

    const dadosOrdenados = useMemo(() => {
        if (!ordenacao) return dadosFiltrados;
        return [...dadosFiltrados].sort((a, b) =>
            comparar(getValor(a, ordenacao.key), getValor(b, ordenacao.key), ordenacao.direcao)
        );
    }, [dadosFiltrados, ordenacao]);

    const totalPaginas = Math.max(1, Math.ceil(dadosOrdenados.length / tamanhoPagina));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const inicio = (paginaAtual - 1) * tamanhoPagina;
    const dadosPagina = dadosOrdenados.slice(inicio, inicio + tamanhoPagina);

    function toggleOrdenacao(key: string) {
        setOrdenacao(prev => {
            if (prev?.key === key) {
                return prev.direcao === "asc" ? { key, direcao: "desc" } : null;
            }
            return { key, direcao: "asc" };
        });
        setPagina(1);
    }

    function handleBusca(valor: string) {
        setBusca(valor);
        setPagina(1);
    }

    function IconeOrdenacao({ col }: { col: Coluna }) {
        if (col.sortable === false) return null;
        if (ordenacao?.key === col.key) {
            return ordenacao.direcao === "asc"
                ? <ChevronUp size={14} className="inline ml-1 text-blue-600" />
                : <ChevronDown size={14} className="inline ml-1 text-blue-600" />;
        }
        return <ChevronsUpDown size={14} className="inline ml-1 text-gray-300" />;
    }

    const temAcoes = !!acoes;
    const colSpan = colunas.length + (temAcoes ? 1 : 0);

    return (
        <div className="flex flex-col gap-3">
            {/* Barra de busca */}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={busca}
                    onChange={e => handleBusca(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                />
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {colunas.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && toggleOrdenacao(col.key)}
                                    className={`text-left px-4 py-3 text-gray-600 font-semibold whitespace-nowrap select-none ${col.sortable !== false ? "cursor-pointer hover:text-blue-700" : ""} ${col.className ?? ""}`}
                                >
                                    {col.header}
                                    <IconeOrdenacao col={col} />
                                </th>
                            ))}
                            {temAcoes && (
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold whitespace-nowrap">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dadosPagina.length === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-8 text-center text-gray-400">
                                    {busca ? "Nenhum resultado encontrado." : "Nenhum registro cadastrado."}
                                </td>
                            </tr>
                        ) : (
                            dadosPagina.map((item, idx) => (
                                <tr key={item.id ?? idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    {colunas.map(col => (
                                        <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className ?? ""}`}>
                                            {col.render ? col.render(item) : String(getValor(item, col.key) ?? "—")}
                                        </td>
                                    ))}
                                    {temAcoes && (
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {acoes!(item)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
                <span>
                    {dadosOrdenados.length === 0
                        ? "Nenhum resultado"
                        : `${inicio + 1}–${Math.min(inicio + tamanhoPagina, dadosOrdenados.length)} de ${dadosOrdenados.length} registro${dadosOrdenados.length !== 1 ? "s" : ""}`
                    }
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPagina(1)}
                        disabled={paginaAtual === 1}
                        className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                        «
                    </button>
                    <button
                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                        disabled={paginaAtual === 1}
                        className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                        ‹
                    </button>
                    <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                        {paginaAtual} / {totalPaginas}
                    </span>
                    <button
                        onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                        ›
                    </button>
                    <button
                        onClick={() => setPagina(totalPaginas)}
                        disabled={paginaAtual === totalPaginas}
                        className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    );
}

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../services/api";

interface Cidade {
    id: number;
    nome: string;
    estado: string;
    slug: string;
}

interface CidadeContextData {
    cidadeSelecionada: Cidade | null;
    cidades: Cidade[];
    selecionarCidade: (cidade: Cidade) => void;
    carregando: boolean;
}

const CidadeContext = createContext<CidadeContextData>({} as CidadeContextData);

const STORAGE_KEY = "@radar-local:cidade";

export function CidadeProvider({ children }: { children: ReactNode }) {
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api.get("/api/cidades").then((res) => {
            const lista: Cidade[] = res.data;
            setCidades(lista);

            const salva = localStorage.getItem(STORAGE_KEY);
            if (salva) {
                const parsed = JSON.parse(salva);
                // Confirma que ainda está ativa
                const ainda = lista.find((c) => c.slug === parsed.slug);
                if (ainda) {
                    setCidadeSelecionada(ainda);
                    setCarregando(false);
                    return;
                }
            }

            // Se só tem uma cidade ativa, seleciona automaticamente
            if (lista.length === 1) {
                setCidadeSelecionada(lista[0]);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(lista[0]));
            }

            setCarregando(false);
        }).catch(() => setCarregando(false));
    }, []);

    function selecionarCidade(cidade: Cidade) {
        setCidadeSelecionada(cidade);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cidade));
    }

    return (
        <CidadeContext.Provider value={{ cidadeSelecionada, cidades, selecionarCidade, carregando }}>
            {children}
        </CidadeContext.Provider>
    );
}

export function useCidade() {
    return useContext(CidadeContext);
}

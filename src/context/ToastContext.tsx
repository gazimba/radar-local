import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastTipo = "success" | "error" | "warning" | "info";

interface ToastItem {
    id: number;
    mensagem: string;
    tipo: ToastTipo;
}

interface ToastContextProps {
    toast: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        warning: (msg: string) => void;
        info: (msg: string) => void;
    };
}

const ToastContext = createContext<ToastContextProps | null>(null);

const ICONES: Record<ToastTipo, React.ElementType> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const ESTILOS: Record<ToastTipo, string> = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
};

const ICONE_COR: Record<ToastTipo, string> = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
};

let contador = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const adicionar = useCallback((mensagem: string, tipo: ToastTipo) => {
        const id = ++contador;
        setToasts(prev => [...prev, { id, mensagem, tipo }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const remover = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg: string) => adicionar(msg, "success"),
        error: (msg: string) => adicionar(msg, "error"),
        warning: (msg: string) => adicionar(msg, "warning"),
        info: (msg: string) => adicionar(msg, "info"),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map(t => {
                    const Icone = ICONES[t.tipo];
                    return (
                        <div
                            key={t.id}
                            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium pointer-events-auto animate-in slide-in-from-right-4 ${ESTILOS[t.tipo]}`}
                        >
                            <Icone size={18} className={`shrink-0 mt-0.5 ${ICONE_COR[t.tipo]}`} />
                            <span className="flex-1">{t.mensagem}</span>
                            <button onClick={() => remover(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
    return ctx.toast;
}

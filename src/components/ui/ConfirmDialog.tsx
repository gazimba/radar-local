import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
    titulo?: string;
    mensagem: string;
    textoBotaoConfirmar?: string;
    variante?: "danger" | "warning";
}

interface ConfirmContextProps {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextProps | null>(null);

interface DialogState extends ConfirmOptions {
    resolve: (val: boolean) => void;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [dialogo, setDialogo] = useState<DialogState | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise(resolve => {
            setDialogo({ ...options, resolve });
        });
    }, []);

    function responder(valor: boolean) {
        dialogo?.resolve(valor);
        setDialogo(null);
    }

    const botaoCor = dialogo?.variante === "warning"
        ? "bg-yellow-500 hover:bg-yellow-600"
        : "bg-red-500 hover:bg-red-600";

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {dialogo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={22} className="shrink-0 text-yellow-500 mt-0.5" />
                            <div>
                                {dialogo.titulo && (
                                    <h3 className="font-bold text-gray-800 text-base mb-1">{dialogo.titulo}</h3>
                                )}
                                <p className="text-gray-600 text-sm">{dialogo.mensagem}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => responder(false)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => responder(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${botaoCor}`}
                            >
                                {dialogo.textoBotaoConfirmar ?? "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm deve ser usado dentro de ConfirmProvider");
    return ctx.confirm;
}

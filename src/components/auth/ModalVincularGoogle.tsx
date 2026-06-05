import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../../services/api";
import { Input } from "../form/input/InputField";
import { Button } from "../ui/button/Button";

interface Props {
    dados: { email: string; googleId: string; foto?: string };
    onSucesso: (user: any, token: string) => void;
    onFechar: () => void;
}

export function ModalVincularGoogle({ dados, onSucesso, onFechar }: Props) {
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    async function handleVincular() {
        if (!senha) return;
        setCarregando(true);
        setErro(null);

        try {
            const res = await api.post("/api/sessions/google/vincular", {
                email: dados.email,
                senha,
                googleId: dados.googleId,
                foto: dados.foto,
            });
            onSucesso(res.data.user, res.data.token);
        } catch (err: any) {
            setErro(err.response?.data?.message || "Erro ao vincular conta.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
                <button onClick={onFechar} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-blue-800 mb-2">Vincular conta Google</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Já existe uma conta com o e-mail <strong>{dados.email}</strong>.
                    Digite sua senha para vincular o Google a esta conta.
                </p>

                {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{erro}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Senha atual</label>
                    <Input
                        variant="form"
                        type="password"
                        placeholder="Sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleVincular()}
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" type="button" onClick={onFechar} className="flex-1 border-gray-300 text-gray-600">
                        Cancelar
                    </Button>
                    <Button
                        variant="form"
                        type="button"
                        onClick={handleVincular}
                        disabled={carregando || !senha}
                        className="flex-1"
                    >
                        {carregando ? "Vinculando..." : "Vincular e entrar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

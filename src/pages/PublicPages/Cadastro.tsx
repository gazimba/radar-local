import { useActionState, useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, MapPin, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { BotaoGoogle } from "../../components/auth/BotaoGoogle";
import { ModalVincularGoogle } from "../../components/auth/ModalVincularGoogle";

async function cadastroAction(_prevState: FormState | null, formData: FormData): Promise<FormState> {
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;
    const confirmarSenha = formData.get("confirmarSenha") as string;

    if (senha !== confirmarSenha) {
        return { message: "As senhas não coincidem.", status: "error" };
    }

    if (senha.length < 8) {
        return { message: "A senha deve ter no mínimo 8 caracteres.", status: "error" };
    }

    try {
        const response = await api.post("/api/usuarios/registro", { nome, email, senha });
        return { message: response.data.message, status: "success" };
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Erro ao criar conta. Tente novamente.",
            status: "error",
        };
    }
}

export function Cadastro() {
    const [state, formAction, isPending] = useActionState(cadastroAction, null);
    const [dadosVincular, setDadosVincular] = useState<{ email: string; googleId: string; foto?: string } | null>(null);
    const [erroGoogle, setErroGoogle] = useState<string | null>(null);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    function handleSucesso(user: any, token: string) {
        localStorage.setItem("@radar-local:user", JSON.stringify(user));
        localStorage.setItem("@radar-local:token", token);
        window.location.href = "/";
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <div className="flex w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Painel esquerdo — identidade visual */}
                <div className="hidden md:flex flex-col justify-between w-2/5 bg-gradient-to-br from-blue-800 to-blue-600 p-10 text-white">
                    <div className="flex items-center gap-2">
                        <MapPin size={22} className="text-orange-300" />
                        <span className="font-bold text-lg tracking-wide">Radar Local</span>
                    </div>

                    <div className="flex flex-col gap-5">
                        <h2 className="text-3xl font-bold leading-snug">
                            Faça parte da comunidade!
                        </h2>
                        <ul className="flex flex-col gap-3">
                            {[
                                "Descubra pontos turísticos e eventos",
                                "Envie sugestões de novos locais",
                                "Comente e avalie lugares",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-blue-100">
                                    <CheckCircle2 size={16} className="text-orange-300 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-blue-300 text-xs">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="text-white font-semibold hover:underline">
                            Faça login
                        </Link>
                    </p>
                </div>

                {/* Painel direito — formulário */}
                <div className="flex flex-col justify-center w-full md:w-3/5 bg-white p-8 md:p-12 gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Criar conta</h1>
                        <p className="text-gray-400 text-sm mt-1">Cadastre-se para contribuir com o Radar Local</p>
                    </div>

                    {state?.status !== "success" ? (
                        <>
                            <div>
                                <BotaoGoogle
                                    onSucesso={handleSucesso}
                                    onVincular={setDadosVincular}
                                    onErro={setErroGoogle}
                                />
                                {erroGoogle && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-3">{erroGoogle}</p>}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400 whitespace-nowrap">ou cadastre-se com e-mail</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <form action={formAction} className="flex flex-col gap-4">
                                <FormResposta state={state} />

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="nome">
                                        Nome completo
                                    </label>
                                    <Input name="nome" variant="form" type="text" id="nome" placeholder="Seu nome" required />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="email">
                                        E-mail
                                    </label>
                                    <Input name="email" variant="form" type="email" id="email" placeholder="exemplo@email.com" required />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="senha">
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <Input
                                                name="senha"
                                                variant="form"
                                                type={mostrarSenha ? "text" : "password"}
                                                id="senha"
                                                placeholder="Mín. 8 caracteres"
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMostrarSenha(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="confirmarSenha">
                                            Confirmar senha
                                        </label>
                                        <div className="relative">
                                            <Input
                                                name="confirmarSenha"
                                                variant="form"
                                                type={mostrarConfirmar ? "text" : "password"}
                                                id="confirmarSenha"
                                                placeholder="Repita a senha"
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMostrarConfirmar(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {mostrarConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    disabled={isPending}
                                    variant="default"
                                    type="submit"
                                    className="w-full mt-1 font-semibold uppercase tracking-wide"
                                >
                                    {isPending ? "Criando conta..." : "Criar Conta"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <FormResposta state={state} />
                    )}

                    <p className="text-sm text-gray-400 text-center md:hidden">
                        Já tem conta?{" "}
                        <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>

            {dadosVincular && (
                <ModalVincularGoogle
                    dados={dadosVincular}
                    onSucesso={handleSucesso}
                    onFechar={() => setDadosVincular(null)}
                />
            )}
        </div>
    );
}

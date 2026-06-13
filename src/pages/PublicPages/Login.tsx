import { useActionState, useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { BotaoGoogle } from "../../components/auth/BotaoGoogle";
import { ModalVincularGoogle } from "../../components/auth/ModalVincularGoogle";

type LoginState = FormState | { status: "nao_ativada"; message: string; email: string };

async function loginAction(_prevState: any, formData: FormData): Promise<LoginState> {
    const data = Object.fromEntries(formData);

    try {
        const response = await api.post("/api/sessions", {
            email: data.email,
            senha: data.password,
        });

        localStorage.setItem("@radar-local:user", JSON.stringify(response.data.user));
        localStorage.setItem("@radar-local:token", response.data.token);

        return { message: "Login realizado com sucesso! Redirecionando...", status: "success" };
    } catch (error: any) {
        if (error.response?.status === 403) {
            return { status: "nao_ativada", message: error.response.data.message, email: String(data.email) };
        }
        return {
            message: error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.",
            status: "error",
        };
    }
}

export function Login() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const [erro, setErro] = useState<string | null>(null);
    const [dadosVincular, setDadosVincular] = useState<{ email: string; googleId: string; foto?: string } | null>(null);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [reenviando, setReenviando] = useState(false);
    const [msgReenvio, setMsgReenvio] = useState<string | null>(null);

    async function handleReenviarAtivacao(email: string) {
        setReenviando(true);
        setMsgReenvio(null);
        try {
            const res = await api.post("/api/ativar/reenviar", { email });
            setMsgReenvio(res.data.message);
        } catch {
            setMsgReenvio("Erro ao reenviar. Tente novamente.");
        } finally {
            setReenviando(false);
        }
    }

    useEffect(() => {
        if (state?.status === "success") {
            const timer = setTimeout(() => { window.location.href = "/"; }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state]);

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

                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold leading-snug">
                            Bem-vindo de volta!
                        </h2>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Acesse sua conta e continue descobrindo e compartilhando os melhores lugares da sua cidade.
                        </p>
                    </div>

                    <p className="text-blue-300 text-xs">
                        Não tem uma conta?{" "}
                        <Link to="/cadastro" className="text-white font-semibold hover:underline">
                            Cadastre-se grátis
                        </Link>
                    </p>
                </div>

                {/* Painel direito — formulário */}
                <div className="flex flex-col justify-center w-full md:w-3/5 bg-white p-8 md:p-12 gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Entrar na conta</h1>
                        <p className="text-gray-400 text-sm mt-1">Use seu e-mail ou continue com o Google</p>
                    </div>

                    <div>
                        <BotaoGoogle
                            onSucesso={handleSucesso}
                            onVincular={setDadosVincular}
                            onErro={setErro}
                        />
                        {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-3">{erro}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 whitespace-nowrap">ou entre com e-mail</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {state?.status === "nao_ativada" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col gap-2">
                            <p className="text-sm text-yellow-800 font-medium">{state.message}</p>
                            {msgReenvio
                                ? <p className="text-sm text-green-700">{msgReenvio}</p>
                                : <button
                                    type="button"
                                    onClick={() => handleReenviarAtivacao(state.email)}
                                    disabled={reenviando}
                                    className="text-sm text-yellow-700 underline hover:text-yellow-900 text-left disabled:opacity-50"
                                >
                                    {reenviando ? "Reenviando..." : "Reenviar e-mail de ativação"}
                                </button>
                            }
                        </div>
                    )}

                    <form action={formAction} className="flex flex-col gap-4">
                        <FormResposta state={state?.status !== "nao_ativada" ? state : null} />

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="email">
                                E-mail
                            </label>
                            <Input name="email" variant="form" type="email" id="email" placeholder="exemplo@email.com" required />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-gray-700 text-sm font-semibold" htmlFor="password">
                                    Senha
                                </label>
                                <Link to="/esqueci-senha" className="text-xs text-blue-600 hover:underline">
                                    Esqueci minha senha
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    name="password"
                                    variant="form"
                                    type={mostrarSenha ? "text" : "password"}
                                    id="password"
                                    placeholder="Sua senha"
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

                        <Button disabled={isPending} variant="default" type="submit" className="w-full mt-1 font-semibold uppercase tracking-wide">
                            {isPending ? "Validando acesso..." : "Entrar"}
                        </Button>
                    </form>

                    <p className="text-sm text-gray-400 text-center md:hidden">
                        Não tem conta?{" "}
                        <Link to="/cadastro" className="text-blue-700 font-semibold hover:underline">
                            Cadastre-se
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

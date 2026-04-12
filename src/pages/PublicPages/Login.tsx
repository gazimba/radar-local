import { useActionState, useEffect } from "react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";

async function loginAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);

    try {
        const response = await api.post("/api/sessions", {
            email: data.email,
            senha: data.password
        });

        localStorage.setItem("@radar-local:user", JSON.stringify(response.data.user));
        localStorage.setItem("@radar-local:token", response.data.token);

        return { message: "Login realizado com sucesso! Redirecionando...", status: "success" };
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.",
            status: "error"
        };
    }
}

export function Login() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    useEffect(() => {
        if (state?.status === "success") {
            const timer = setTimeout(() => {
                window.location.href = "/";
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-2 p-8 m-8 bg-white rounded-3xl shadow-md max-w-md w-full border border-gray-100 transition-all hover:shadow-lg">
                <h1 className="text-3xl font-bold text-blue-800 text-center pb-2 uppercase tracking-tight">
                    Login
                </h1>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Acesse o painel administrativo do Radar Local
                </p>

                <form action={formAction} className="flex flex-col gap-5 w-full">
                    <FormResposta state={state} />

                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="email">
                            E-mail
                        </label>
                        <Input
                            name="email"
                            variant="form"
                            type="email"
                            id="email"
                            placeholder="exemplo@email.com"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="password">
                            Senha
                        </label>
                        <Input
                            name="password"
                            variant="form"
                            type="password"
                            id="password"
                            placeholder="Sua senha secreta"
                            required
                        />
                    </div>

                    <Button
                        disabled={isPending}
                        variant="default"
                        type="submit"
                        className="w-full mt-2 text-lg font-semibold uppercase"
                    >
                        {isPending ? "Validando acesso..." : "Entrar no Sistema"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
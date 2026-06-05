import { useActionState } from "react";
import { Link } from "react-router";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";

async function solicitarResetAction(_prevState: FormState | null, formData: FormData): Promise<FormState> {
    const email = formData.get("email") as string;

    try {
        const response = await api.post("/api/senha/solicitar", { email });
        return { message: response.data.message, status: "success" };
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Erro ao processar solicitação. Tente novamente.",
            status: "error",
        };
    }
}

export function EsqueciSenha() {
    const [state, formAction, isPending] = useActionState(solicitarResetAction, null);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-2 p-8 m-8 bg-white rounded-3xl shadow-md max-w-md w-full border border-gray-100">
                <h1 className="text-3xl font-bold text-blue-800 text-center pb-2 uppercase tracking-tight">
                    Esqueci minha senha
                </h1>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Informe seu e-mail e enviaremos um link para redefinir sua senha
                </p>

                <form action={formAction} className="flex flex-col gap-5 w-full">
                    <FormResposta state={state} />

                    {state?.status !== "success" && (
                        <>
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

                            <Button
                                disabled={isPending}
                                variant="default"
                                type="submit"
                                className="w-full mt-2 text-lg font-semibold uppercase"
                            >
                                {isPending ? "Enviando..." : "Enviar link de redefinição"}
                            </Button>
                        </>
                    )}
                </form>

                <p className="text-sm text-gray-500 mt-4">
                    Lembrou a senha?{" "}
                    <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
}

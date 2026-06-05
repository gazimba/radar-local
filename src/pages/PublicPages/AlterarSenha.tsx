import { useActionState } from "react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";

async function alterarSenhaAction(_prevState: FormState | null, formData: FormData): Promise<FormState> {
    const senhaAtual = formData.get("senhaAtual") as string;
    const novaSenha = formData.get("novaSenha") as string;
    const confirmarSenha = formData.get("confirmarSenha") as string;

    if (novaSenha !== confirmarSenha) {
        return { message: "As senhas não coincidem.", status: "error" };
    }

    if (novaSenha.length < 8) {
        return { message: "A nova senha deve ter no mínimo 8 caracteres.", status: "error" };
    }

    try {
        const response = await api.patch("/api/usuarios/alterar-senha", { senhaAtual, novaSenha });
        return { message: response.data.message, status: "success" };
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Erro ao alterar senha. Tente novamente.",
            status: "error",
        };
    }
}

export function AlterarSenha() {
    const [state, formAction, isPending] = useActionState(alterarSenhaAction, null);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-2 p-8 m-8 bg-white rounded-3xl shadow-md max-w-md w-full border border-gray-100">
                <h1 className="text-3xl font-bold text-blue-800 text-center pb-2 uppercase tracking-tight">
                    Alterar Senha
                </h1>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Escolha uma senha segura com no mínimo 8 caracteres
                </p>

                <form action={formAction} className="flex flex-col gap-5 w-full">
                    <FormResposta state={state} />

                    {state?.status !== "success" && (
                        <>
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="senhaAtual">
                                    Senha atual
                                </label>
                                <Input
                                    name="senhaAtual"
                                    variant="form"
                                    type="password"
                                    id="senhaAtual"
                                    placeholder="Sua senha atual"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="novaSenha">
                                    Nova senha
                                </label>
                                <Input
                                    name="novaSenha"
                                    variant="form"
                                    type="password"
                                    id="novaSenha"
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2 ml-1" htmlFor="confirmarSenha">
                                    Confirmar nova senha
                                </label>
                                <Input
                                    name="confirmarSenha"
                                    variant="form"
                                    type="password"
                                    id="confirmarSenha"
                                    placeholder="Repita a nova senha"
                                    required
                                />
                            </div>

                            <Button
                                disabled={isPending}
                                variant="default"
                                type="submit"
                                className="w-full mt-2 text-lg font-semibold uppercase"
                            >
                                {isPending ? "Salvando..." : "Salvar nova senha"}
                            </Button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

import { useActionState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";

async function cadastrarCidadeAction(_prevState: FormState | null, formData: FormData): Promise<FormState> {
    const nome = formData.get("nome") as string;
    const estado = formData.get("estado") as string;

    if (estado.length !== 2) {
        return { message: "Use a sigla do estado com 2 letras (ex: MG, SP, RJ).", status: "error" };
    }

    try {
        await api.post("/api/cidades", { nome, estado: estado.toUpperCase() });
        return { message: "Cidade cadastrada com sucesso!", status: "success" };
    } catch (error: any) {
        return {
            message: error.response?.data?.message || "Erro ao cadastrar cidade.",
            status: "error",
        };
    }
}

export function CadastroCidade() {
    const [state, formAction, isPending] = useActionState(cadastrarCidadeAction, null);
    const navigate = useNavigate();

    return (
        <div className="p-4 max-w-lg">
            <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight mb-6">
                Cadastrar Cidade
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <form action={formAction} className="flex flex-col gap-5">
                    <FormResposta state={state} />

                    {state?.status === "success" ? (
                        <Button variant="form" type="button" onClick={() => navigate("/cidades")}>
                            Voltar para cidades
                        </Button>
                    ) : (
                        <>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
                                    Nome da cidade
                                </label>
                                <Input name="nome" variant="form" placeholder="Ex: Congonhas" required />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
                                    Estado (sigla)
                                </label>
                                <Input
                                    name="estado"
                                    variant="form"
                                    placeholder="Ex: MG"
                                    maxLength={2}
                                    className="uppercase"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                                    onClick={() => navigate("/cidades")}
                                >
                                    Cancelar
                                </Button>
                                <Button disabled={isPending} variant="form" type="submit" className="flex-1">
                                    {isPending ? "Salvando..." : "Cadastrar"}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

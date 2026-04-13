import { useActionState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { api } from "../../services/api";

async function cadastrarUsuarioAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);

    try {
        await api.post('api/usuarios', {
            nome: data.nome,
            email: data.email,
            senha: data.senha,
        });

        return { message: "Usuário cadastrado com sucesso!", status: "success" };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar. Verifique os dados.";
        return { message: errorMessage, status: "error" };
    }
}

export function CadastroUsuario() {
    const navigate = useNavigate();
    const [state, formAction, isPending] = useActionState(cadastrarUsuarioAction, null);

    useEffect(() => {
        if (state?.status === "success") {
            const timer = setTimeout(() => {
                navigate("/usuarios");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [state, navigate]);

    return (
        <div className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">
                Cadastro de Usuário
            </h1>
            <p className="mt-2 text-gray-600 mb-4">
                Aqui você pode cadastrar um novo administrador para o sistema.
            </p>

            <form action={formAction} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 min-w-md">

                <FormResposta state={state} />

                <div className="mb-4 mt-2">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="nome">Nome</label>
                    <Input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder="Digite o nome do usuário"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">E-mail</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Digite o e-mail do usuário"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="senha">Senha</label>
                    <Input
                        type="password"
                        id="senha"
                        name="senha"
                        placeholder="Digite a senha do usuário"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Cadastrando..." : "Cadastrar Usuário"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
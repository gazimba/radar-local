import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { useActionState } from "react";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { api } from "../../services/api";

async function cadastrarPontoAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);

    try {
        await api.post('api/pontos-turisticos', {
            nome: data.nome,
            descricao: data.descricao,
            destaques: data.destaques,
            informacoes: data.informacoes,
            latitude: parseFloat(String(data.latitude)),
            longitude: parseFloat(String(data.longitude)),
        });

        return { message: "Cadastrado com sucesso!", status: "success" };
    } catch (error) {
        return { message: "Erro ao cadastrar. Verifique os dados.", status: "error" };
    }
}

export function CadastroPontoTuristico() {
    const [state, formAction, isPending] = useActionState(cadastrarPontoAction, null);
    return (
        <div className="p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Ponto Turístico</h1>

            <form className="bg-white p-6 rounded-lg shadow-md" action={formAction}>

                <FormResposta state={state} />

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nome">Nome do Ponto Turístico</label>
                    <Input id="nome" name="nome" placeholder="Digite o nome do ponto turístico" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descricao">Sobre o local</label>
                    <TextArea id="descricao" name="descricao" placeholder="Digite a descrição do ponto turístico" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="destaques">Destaques</label>
                    <TextArea id="destaques" name="destaques" placeholder="Digite os destaques do ponto turístico" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">Informações adicionais</label>
                    <TextArea id="informacoes" name="informacoes" placeholder="Digite as informações adicionais" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Localização</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                            <span>Longitude:</span>
                            <Input id="lon" name="longitude" placeholder="Longitude" />
                        </div>
                        <div className="col-span-1">
                            <span>Latitude:</span>
                            <Input id="lat" name="latitude" placeholder="Latitude" />
                        </div>
                    </div>
                </div>
                {/* <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="imagem">Imagem</label>
                    <div className="flex gap-2 justify-center items-center">
                        <Input id="imagem" name="imagemUrl" placeholder="URL da imagem" />
                        <Button variant="form" type="button">Upload</Button>
                    </div>
                </div> */}

                <div className="mb-4 mt-4 flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Salvando..." : "Cadastrar"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
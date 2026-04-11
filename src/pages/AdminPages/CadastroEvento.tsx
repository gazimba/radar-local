import { useActionState } from "react";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { api } from "../../services/api";

async function cadastrarEventoAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);

    try {
        await api.post('api/eventos', {
            nome: data.nome,
            descricao: data.descricao,
            data: data.data,
            horario: data.horario,
            informacoes: data.informacoes,
            latitude: parseFloat(String(data.latitude)),
            longitude: parseFloat(String(data.longitude)),
        });

        return { message: "Cadastrado com sucesso!", status: "success" };
    } catch (error) {
        return { message: "Erro ao cadastrar. Verifique os dados.", status: "error" };
    }
}

export function CadastroEvento() {
    const [state, formAction, isPending] = useActionState(cadastrarEventoAction, null);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Evento</h1>
            <form className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-2" action={formAction}>
                
                <FormResposta state={state} />
                
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nome">
                        Nome do Evento
                    </label>
                    <Input id="nome" name="nome" placeholder="Digite o nome do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descricao">
                        Sobre o Evento
                    </label>
                    <TextArea id="descricao" name="descricao" placeholder="Digite a descrição do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-1">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="destques">
                        Data
                    </label>
                    <Input id="data" name="data" placeholder="Digite a data do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-1">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">
                        Horário
                    </label>
                    <Input id="horario" name="horario" placeholder="Digite o horário do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">
                        Informações adicionais
                    </label>
                    <TextArea id="informacoes" name="informacoes" placeholder="Digite as informações adicionais do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="localizacao">
                        Localização
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                            <span>Longitude:</span>
                            <Input id="lon" name="longitude" placeholder="Digite a localização do ponto turístico" />
                        </div>
                        <div className="col-span-1">
                            <span>Latitude:</span>
                            <Input id="lat" name="latitude" placeholder="Digite a localização do ponto turístico" />
                        </div>
                    </div>
                </div>
                {/* <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="localizacao">
                        Imagem
                    </label>
                    <div className="flex gap-2 justify-center items-center">
                        <Input id="imagem" name="imagem" placeholder="Digite a URL da imagem do ponto turístico" />
                        <Button variant="form" type="submit" className="">
                            Upload
                        </Button>
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
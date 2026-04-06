import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";

export function CadastroEvento() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Evento</h1>
            <form className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nome">
                        Nome do Evento
                    </label>
                    <Input id="nome" placeholder="Digite o nome do ponto turístico" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descricao">
                        Sobre o Evento
                    </label>
                    <TextArea id="descricao" placeholder="Digite a descrição do ponto turístico" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-1">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="destques">
                        Data
                    </label>
                    <Input id="data" placeholder="Digite a data do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-1">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">
                        Horário
                    </label>
                    <Input id="horario" placeholder="Digite o horário do evento" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">
                        Informações adicionais
                    </label>
                    <TextArea id="informacoes" placeholder="Digite as informações adicionais do ponto turístico" />
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="localizacao">
                        Localização
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                            <span>Longitude:</span>
                            <Input id="lon" placeholder="Digite a localização do ponto turístico" />
                        </div>
                        <div className="col-span-1">
                            <span>Latitude:</span>
                            <Input id="lat" placeholder="Digite a localização do ponto turístico" />
                        </div>
                    </div>
                </div>
                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="localizacao">
                        Imagem
                    </label>
                    <div className="flex gap-2 justify-center items-center">
                        <Input id="imagem" placeholder="Digite a URL da imagem do ponto turístico" />
                        <Button variant="form" type="submit" className="">
                            Upload
                        </Button>
                    </div>
                </div>
                <div className="mb-4 mt-4 flex justify-end col-span-1 md:col-span-2">
                    <Button type="submit" className="">
                        Cadastrar
                    </Button>
                </div>
            </form>
        </div>
    )

}
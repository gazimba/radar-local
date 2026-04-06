import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";

export function CadastroPontoTuristico() {
    return (
        <div className="p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Ponto Turístico</h1>
            <form className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nome">
                        Nome do Ponto Turístico
                    </label>
                    <Input id="nome" placeholder="Digite o nome do ponto turístico" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descricao">
                        Sobre o local
                    </label>
                    <TextArea id="descricao" placeholder="Digite a descrição do ponto turístico" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="destques">
                        Destaques
                    </label>
                    <TextArea id="destques" placeholder="Digite os destaques do ponto turístico" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">
                        Informações adicionais
                    </label>
                    <TextArea id="informacoes" placeholder="Digite as informações adicionais do ponto turístico" />
                </div>
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="mb-4 mt-4 flex justify-end">
                    <Button type="submit" className="">
                        Cadastrar
                    </Button>
                </div>
            </form>
        </div>
    )
}
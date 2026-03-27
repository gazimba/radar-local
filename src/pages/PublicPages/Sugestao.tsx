import { useState } from "react";
import { Input } from "../../components/form/input/InputField";
import { Select } from "../../components/form/input/SelectField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";

export function Sugestao() {
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("ponto-turistico");
    const [descricao, setDescricao] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [endereco, setEndereco] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    
    return (
        <div className="max-w-6xl m-8 p-8 flex flex-col items-center bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-blue-800 font-bold text-2xl uppercase">Sugestão de Locais e eventos</h1>
            <h2 className="text-gray-700 text-lg mt-4">
                Quer sugerir um novo local ou evento para a comunidade? Preencha o formulário abaixo com as informações relevantes, e nossa equipe irá avaliar sua sugestão para possível inclusão no Radar Local. Agradecemos sua contribuição para tornar nosso guia ainda mais completo e útil para todos os visitantes!
            </h2>
            <form className="w-full mt-6">
                <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
                            Categoria
                        </label>
                        <Select variant="form" onChange={(e) => setCategoria(e.target.value)}>
                            <option value="ponto-turistico">Ponto Turístico</option>
                            <option value="evento">Evento</option>
                        </Select>
                    </div>
                    <div className="col-span-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                            Identificação do ponto turístico
                        </label>
                        <Input variant="form" onChange={(e)=> setNome(e.target.value)} />
                    </div>
                    <div className="col-span-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
                            Descrição
                        </label>
                        <TextArea rows={4} onChange={(e)=>setDescricao(e.target.value)}/>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="localizacao">
                            Estado 
                        </label>
                        <Input variant="form" onChange={(e)=>setEstado(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="localizacao">
                            Cidade 
                        </label>
                        <Input variant="form" onChange={(e)=>setCidade(e.target.value)} />
                    </div>
                    <div className="col-span-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="localizacao">
                            Endereço 
                        </label>
                        <Input variant="form" onChange={(e)=>setEndereco(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="localizacao">
                            Localização (latitude) 
                        </label>
                        <Input variant="form" onChange={(e)=>setLatitude(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                            Localização (longitude) 
                        </label>
                        <Input variant="form" onChange={(e)=>setLongitude(e.target.value)} />
                    </div>
                    <Button className="mt-4 col-span-4" variant="default">
                        Enviar Sugestão
                    </Button>
                </div>
            </form>
        </div>
    )
}
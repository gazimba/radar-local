import { useActionState, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { api } from "../../services/api";

async function salvarPontoAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);
    const id = data.id as string;

    try {
        const payload = {
            nome: data.nome,
            descricao: data.descricao,
            destaques: data.destaques,
            informacoes: data.informacoes,
            latitude: parseFloat(String(data.latitude)),
            longitude: parseFloat(String(data.longitude)),
        };

        if (id) {
            await api.put(`api/pontos-turisticos/${id}`, payload);
            return { message: "Ponto turístico atualizado com sucesso!", status: "success" };
        } else {
            await api.post('api/pontos-turisticos', payload);
            return { message: "Ponto turístico cadastrado com sucesso!", status: "success" };
        }
    } catch (error) {
        return { message: "Erro ao salvar. Verifique os dados.", status: "error" };
    }
}

export function CadastroPontoTuristico() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [state, formAction, isPending] = useActionState(salvarPontoAction, null);
    const [ponto, setPonto] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(isEditMode);

    useEffect(() => {
        if (id) {
            api.get(`api/pontos-turisticos/${id}`)
                .then((response) => {
                    setPonto(response.data);
                })
                .catch(() => {
                    alert("Erro ao buscar os dados do ponto turístico.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (state?.status === "success") {
            if (isEditMode) {
                window.location.reload();
            } else {
                navigate("/eventos");
            }

        }
    }, [state, isEditMode, navigate]);

    if (isLoading) {
        return <div className="p-4">Carregando dados do ponto turístico...</div>;
    }

    return (
        <div className="p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">
                {isEditMode ? "Editar Ponto Turístico" : "Cadastro de Ponto Turístico"}
            </h1>
            <p className="text-gray-500 mb-6 text-sm">
                {isEditMode ? "Altere os dados do ponto turístico conforme necessário." : "Preencha os campos abaixo para cadastrar um novo ponto turístico. Certifique-se de fornecer informações precisas."}
            </p>

            <form className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-2" action={formAction}>

                <FormResposta state={state} />

                {isEditMode && <input type="hidden" name="id" value={id} />}

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nome">Nome do Ponto Turístico</label>
                    <Input id="nome" name="nome" defaultValue={ponto?.nome} placeholder="Digite o nome do ponto turístico" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descricao">Sobre o local</label>
                    <TextArea id="descricao" name="descricao" defaultValue={ponto?.descricao} placeholder="Digite a descrição do ponto turístico" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="destaques">Destaques</label>
                    <TextArea id="destaques" name="destaques" defaultValue={ponto?.destaques} placeholder="Digite os destaques do ponto turístico" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">Informações adicionais</label>
                    <TextArea id="informacoes" name="informacoes" defaultValue={ponto?.informacoes} placeholder="Digite as informações adicionais" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2">Localização</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                            <span>Latitude:</span>
                            <Input id="lat" name="latitude" type="number" step="any" defaultValue={ponto?.latitude} placeholder="-20.5011" />
                        </div>
                        <div className="col-span-1">
                            <span>Longitude:</span>
                            <Input id="lon" name="longitude" type="number" step="any" defaultValue={ponto?.longitude} placeholder="-43.8510" />
                        </div>
                    </div>
                </div>

                <div className="mb-4 col-span-1 md:col-span-2 flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Salvando..." : (isEditMode ? "Atualizar" : "Cadastrar")}
                    </Button>
                </div>
            </form>
        </div>
    )
}
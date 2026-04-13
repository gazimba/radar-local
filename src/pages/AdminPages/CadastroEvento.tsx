import { useActionState, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { api } from "../../services/api";

async function salvarEventoAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);
    const id = data.id as string;

    try {
        const payload = {
            nome: data.nome,
            descricao: data.descricao,
            data: data.data,
            horario: data.horario,
            informacoes: data.informacoes,
            latitude: parseFloat(String(data.latitude)),
            longitude: parseFloat(String(data.longitude)),
        };

        if (id) {
            await api.put(`api/eventos/${id}`, payload);
            return { message: "Evento atualizado com sucesso!", status: "success" };
        } else {
            await api.post('api/eventos', payload);
            return { message: "Evento cadastrado com sucesso!", status: "success" };
        }
    } catch (error) {
        return { message: "Erro ao salvar. Verifique os dados.", status: "error" };
    }
}

export function CadastroEvento() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [state, formAction, isPending] = useActionState(salvarEventoAction, null);
    const [evento, setEvento] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            api.get(`api/eventos/${id}`)
                .then((response) => {
                    setEvento(response.data);
                })
                .catch(() => {
                    alert("Erro ao buscar os dados do evento.");
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
        return <div className="p-4">Carregando dados do evento...</div>;
    }

    return (
        <div className="p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-1 text-blue-800 uppercase tracking-tight">
                {isEditMode ? "Editar Evento" : "Cadastro de Evento"}
            </h1>
            <p className="text-gray-500 mb-6 text-sm">
                {isEditMode ? "Altere os dados do evento conforme necessário." : "Preencha os campos abaixo para cadastrar um novo evento. Certifique-se de fornecer informações precisas."}
            </p>

            <form className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-2" action={formAction}>
                <FormResposta state={state} />

                {isEditMode && <input type="hidden" name="id" value={id} />}

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nome">
                        Nome do Evento
                    </label>
                    <Input id="nome" name="nome" defaultValue={evento?.nome} placeholder="Digite o nome do evento" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descricao">
                        Sobre o Evento
                    </label>
                    <TextArea id="descricao" name="descricao" defaultValue={evento?.descricao} placeholder="Digite a descrição do evento" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-1">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="data">
                        Data
                    </label>
                    <Input id="data" name="data" type="date" defaultValue={evento?.data?.split('T')[0]} placeholder="Digite a data do evento" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-1">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="horario">
                        Horário
                    </label>
                    <Input id="horario" name="horario" type="time" defaultValue={evento?.horario} placeholder="Digite o horário do evento" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="informacoes">
                        Informações adicionais
                    </label>
                    <TextArea id="informacoes" name="informacoes" defaultValue={evento?.informacoes} placeholder="Digite as informações adicionais do evento" />
                </div>

                <div className="mb-4 col-span-1 md:col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="localizacao">
                        Localização
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                            <span>Latitude:</span>
                            <Input id="lat" name="latitude" type="number" step="any" defaultValue={evento?.latitude} placeholder="-20.5011" />
                        </div>
                        <div className="col-span-1">
                            <span>Longitude:</span>
                            <Input id="lon" name="longitude" type="number" step="any" defaultValue={evento?.longitude} placeholder="-43.8510" />
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
import { useActionState, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Calendar, Clock, MapPin, Link2, Ticket, FileText, Image } from "lucide-react";
import { GerenciarLinks } from "../../components/form/GerenciarLinks";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { UploadImagens } from "../../components/form/UploadImagens";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

async function salvarEventoAction(_prevState: any, formData: FormData): Promise<FormState & { novoId?: number }> {
    const data = Object.fromEntries(formData);
    const id = data.id as string;

    try {
        const payload = {
            nome: data.nome,
            descricao: data.descricao,
            data: data.data,
            horario: data.horario,
            local: data.local || undefined,
            link: data.link || undefined,
            gratuito: data.gratuito === "true",
            informacoes: data.informacoes,
            latitude: parseFloat(String(data.latitude)) || 0,
            longitude: parseFloat(String(data.longitude)) || 0,
        };

        if (id) {
            await api.put(`/api/eventos/${id}`, payload);
            return { message: "Evento atualizado com sucesso!", status: "success" };
        } else {
            const res = await api.post("/api/eventos", payload);
            return { message: "Evento criado! Adicione fotos abaixo.", status: "success", novoId: res.data.id };
        }
    } catch {
        return { message: "Erro ao salvar. Verifique os dados.", status: "error" };
    }
}

function SecaoLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="col-span-full flex items-center gap-2 pt-2 pb-1 border-b border-gray-100">
            <Icon size={15} className="text-blue-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
    );
}

export function CadastroEvento() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const toast = useToast();
    const [state, formAction, isPending] = useActionState(salvarEventoAction, null);
    const [evento, setEvento] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [imagens, setImagens] = useState<any[]>([]);
    const [novoId, setNovoId] = useState<number | null>(null);
    const [gratuito, setGratuito] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            Promise.all([
                api.get(`/api/eventos/${id}`),
                api.get(`/api/imagens/evento/${id}`),
            ])
                .then(([resEvento, resImagens]) => {
                    setEvento(resEvento.data);
                    setGratuito(resEvento.data.gratuito ?? false);
                    setImagens(resImagens.data);
                })
                .catch(() => toast.error("Erro ao carregar dados do evento."))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    useEffect(() => {
        if (state?.status === "success") {
            if ((state as any).novoId) {
                setNovoId((state as any).novoId);
            } else if (isEditMode) {
                toast.success("Evento atualizado!");
            }
        }
    }, [state]);

    if (isLoading) {
        return (
            <div className="p-6 flex flex-col gap-4">
                <div className="animate-pulse h-8 bg-gray-100 rounded w-64" />
                {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-12 bg-gray-50 rounded" />)}
            </div>
        );
    }

    const registroId = novoId ?? (id ? Number(id) : null);

    return (
        <div className="p-6 max-w-5xl flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">
                    {isEditMode ? "Editar Evento" : "Cadastro de Evento"}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    {isEditMode ? "Altere os dados conforme necessário." : "Preencha os campos para cadastrar um novo evento."}
                </p>
            </div>

            <form action={formAction} className="flex flex-col gap-6">
                <FormResposta state={state} />
                {isEditMode && <input type="hidden" name="id" value={id} />}
                <input type="hidden" name="gratuito" value={String(gratuito)} />

                {/* Informações principais */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={FileText} label="Informações principais" />

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Nome do Evento *</label>
                        <Input name="nome" variant="form" defaultValue={evento?.nome} placeholder="Ex: Festa do Rosário de Congonhas" required />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Descrição *</label>
                        <TextArea name="descricao" defaultValue={evento?.descricao} placeholder="Descreva o evento, sua programação e o que o torna especial..." rows={4} />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Informações adicionais</label>
                        <TextArea name="informacoes" defaultValue={evento?.informacoes} placeholder="Dicas, regras, dress code, como chegar, estacionamento..." rows={3} />
                    </div>
                </div>

                {/* Data, horário e local */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={Calendar} label="Data, horário e local" />

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" /> Data *</span>
                        </label>
                        <Input name="data" variant="form" type="date" defaultValue={evento?.data?.split("T")[0]} required />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> Horário *</span>
                        </label>
                        <Input name="horario" variant="form" defaultValue={evento?.horario} placeholder="Ex: 19h às 23h ou A partir das 20h" required />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> Local</span>
                        </label>
                        <Input name="local" variant="form" defaultValue={evento?.local} placeholder="Ex: Praça da Basílica, Teatro Municipal..." />
                    </div>
                </div>

                {/* Ingressos e links */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={Ticket} label="Ingressos e links" />

                    <div className="col-span-full">
                        <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                            <div
                                onClick={() => setGratuito(v => !v)}
                                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${gratuito ? "bg-green-400" : "bg-gray-200"}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${gratuito ? "translate-x-4" : "translate-x-0"}`} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                Evento gratuito
                                {gratuito && <span className="ml-2 text-xs text-green-600 font-normal">✓ Entrada franca</span>}
                            </span>
                        </label>
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Link2 size={13} className="text-gray-400" /> Link do evento</span>
                        </label>
                        <Input name="link" variant="form" defaultValue={evento?.link} placeholder="https://exemplo.com/evento ou link de ingressos" />
                    </div>
                </div>

                {/* Coordenadas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={MapPin} label="Coordenadas para o mapa (opcional)" />

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Latitude</label>
                        <Input name="latitude" variant="form" type="number" step="any" defaultValue={evento?.latitude || ""} placeholder="-20.5011" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Longitude</label>
                        <Input name="longitude" variant="form" type="number" step="any" defaultValue={evento?.longitude || ""} placeholder="-43.8510" />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" className="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-50" onClick={() => navigate("/eventos")}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Salvando..." : (isEditMode ? "Atualizar" : "Cadastrar")}
                    </Button>
                </div>
            </form>

            {/* Links úteis */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <Link2 size={15} className="text-blue-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Links úteis</span>
                    <span className="text-xs text-gray-400 ml-1">(site do evento, ingressos, redes sociais...)</span>
                </div>
                {registroId ? (
                    <GerenciarLinks tipo="evento" registroId={registroId} />
                ) : (
                    <p className="text-sm text-gray-400 italic">Salve o formulário acima para gerenciar os links.</p>
                )}
            </div>

            {/* Upload de fotos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <Image size={15} className="text-blue-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fotos</span>
                    <span className="text-xs text-gray-400 ml-1">(máx. 5 — JPEG, PNG ou WebP)</span>
                </div>
                {registroId ? (
                    <>
                        <UploadImagens tipo="evento" registroId={registroId} imagensIniciais={imagens} />
                        {novoId && (
                            <div className="mt-4 flex justify-end">
                                <Button variant="default" onClick={() => navigate("/eventos")}>Concluir</Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
                        <Image size={18} className="text-gray-300 shrink-0" />
                        Salve o formulário acima para liberar o upload de fotos.
                    </div>
                )}
            </div>
        </div>
    );
}

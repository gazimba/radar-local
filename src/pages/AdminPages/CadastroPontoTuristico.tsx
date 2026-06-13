import { useActionState, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MapPin, Clock, Phone, Globe, FileText, Info, Image, Link2 } from "lucide-react";
import { GerenciarLinks } from "../../components/form/GerenciarLinks";
import { Input } from "../../components/form/input/InputField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { UploadImagens } from "../../components/form/UploadImagens";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

async function salvarPontoAction(_prevState: any, formData: FormData): Promise<FormState & { novoId?: number }> {
    const data = Object.fromEntries(formData);
    const id = data.id as string;

    try {
        const payload = {
            nome: data.nome,
            descricao: data.descricao,
            destaques: data.destaques || "",
            informacoes: data.informacoes,
            endereco: data.endereco || undefined,
            horarioFuncionamento: data.horarioFuncionamento || undefined,
            telefone: data.telefone || undefined,
            site: data.site || undefined,
            latitude: parseFloat(String(data.latitude)) || 0,
            longitude: parseFloat(String(data.longitude)) || 0,
            ...(data.categoria ? { categoria: data.categoria } : {}),
        };

        if (id) {
            await api.put(`/api/pontos-turisticos/${id}`, payload);
            return { message: "Atualizado com sucesso!", status: "success" };
        } else {
            const res = await api.post("/api/pontos-turisticos", payload);
            return { message: "Criado! Adicione fotos abaixo.", status: "success", novoId: res.data.id };
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

type Categoria = "PONTO_TURISTICO" | "HOTEL_POUSADA" | "BAR_RESTAURANTE";

const LABELS: Record<Categoria, { singular: string; rota: string }> = {
    PONTO_TURISTICO: { singular: "Ponto Turístico", rota: "/pontos-turisticos" },
    HOTEL_POUSADA:   { singular: "Hotel / Pousada",  rota: "/hoteis-pousadas" },
    BAR_RESTAURANTE: { singular: "Bar / Restaurante", rota: "/bares-restaurantes" },
};

export function CadastroPontoTuristico({ categoriaFixa = "PONTO_TURISTICO" as Categoria }: { categoriaFixa?: Categoria }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const label = LABELS[categoriaFixa];
    const toast = useToast();
    const [state, formAction, isPending] = useActionState(salvarPontoAction, null);
    const [ponto, setPonto] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [imagens, setImagens] = useState<any[]>([]);
    const [novoId, setNovoId] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            Promise.all([
                api.get(`/api/pontos-turisticos/${id}`),
                api.get(`/api/imagens/ponto-turistico/${id}`),
            ])
                .then(([resPonto, resImagens]) => {
                    setPonto(resPonto.data);
                    setImagens(resImagens.data);
                })
                .catch(() => toast.error("Erro ao carregar dados do ponto turístico."))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    useEffect(() => {
        if (state?.status === "success") {
            if ((state as any).novoId) {
                setNovoId((state as any).novoId);
            } else if (isEditMode) {
                toast.success("Ponto turístico atualizado!");
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
                    {isEditMode ? `Editar ${label.singular}` : `Cadastro de ${label.singular}`}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    {isEditMode ? "Altere os dados conforme necessário." : `Preencha os campos para cadastrar um novo ${label.singular.toLowerCase()}.`}
                </p>
            </div>

            <form action={formAction} className="flex flex-col gap-6">
                <FormResposta state={state} />
                {isEditMode && <input type="hidden" name="id" value={id} />}
                <input type="hidden" name="categoria" value={categoriaFixa} />

                {/* Informações principais */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={FileText} label="Informações principais" />

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Nome do Ponto Turístico *</label>
                        <Input name="nome" variant="form" defaultValue={ponto?.nome} placeholder="Ex: Basílica do Senhor Bom Jesus de Matosinhos" required />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Descrição *</label>
                        <TextArea name="descricao" defaultValue={ponto?.descricao} placeholder="Descreva o local, sua história e o que torna ele especial..." rows={4} />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Informações adicionais</label>
                        <TextArea name="informacoes" defaultValue={ponto?.informacoes} placeholder="Dicas de visita, acessibilidade, estacionamento, observações..." rows={3} />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Info size={13} className="text-gray-400" /> Principais destaques</span>
                        </label>
                        <Input name="destaques" variant="form" defaultValue={ponto?.destaques} placeholder="Ex: Vista panorâmica, trilha ecológica, restaurante próximo (separados por vírgula)" />
                        <p className="text-xs text-gray-400 mt-1">Separe os destaques por vírgula. Aparecem como tags na página pública.</p>
                    </div>
                </div>

                {/* Localização e contato */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={MapPin} label="Localização e contato" />

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> Endereço</span>
                        </label>
                        <Input name="endereco" variant="form" defaultValue={ponto?.endereco} placeholder="Ex: Praça da Basílica, s/n — Congonhas, MG" />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" /> Telefone</span>
                        </label>
                        <Input name="telefone" variant="form" defaultValue={ponto?.telefone} placeholder="(31) 99999-9999" />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Globe size={13} className="text-gray-400" /> Site</span>
                        </label>
                        <Input name="site" variant="form" defaultValue={ponto?.site} placeholder="https://exemplo.com.br" />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-gray-400" /> Horário de funcionamento</span>
                        </label>
                        <Input name="horarioFuncionamento" variant="form" defaultValue={ponto?.horarioFuncionamento} placeholder="Ex: Seg-Sex: 8h às 18h | Sáb: 8h às 12h | Dom: fechado" />
                    </div>
                </div>

                {/* Coordenadas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SecaoLabel icon={MapPin} label="Coordenadas para o mapa" />

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Latitude</label>
                        <Input name="latitude" variant="form" type="number" step="any" defaultValue={ponto?.latitude} placeholder="-20.5011" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1.5">Longitude</label>
                        <Input name="longitude" variant="form" type="number" step="any" defaultValue={ponto?.longitude} placeholder="-43.8510" />
                    </div>
                    <p className="col-span-full text-xs text-gray-400">
                        Acesse <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Maps</a>, clique com o botão direito sobre o local e copie as coordenadas.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" className="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-50" onClick={() => navigate(label.rota)}>
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
                    <span className="text-xs text-gray-400 ml-1">(site oficial, compra de ingressos, redes sociais...)</span>
                </div>
                {registroId ? (
                    <GerenciarLinks tipo="ponto-turistico" registroId={registroId} />
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
                        <UploadImagens tipo="ponto-turistico" registroId={registroId} imagensIniciais={imagens} permitirCapa />
                        {novoId && (
                            <div className="mt-4 flex justify-end">
                                <Button variant="default" onClick={() => navigate(label.rota)}>
                                    Concluir
                                </Button>
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

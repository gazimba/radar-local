import { useActionState, useState } from "react";
import { Link } from "react-router";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Select } from "../../components/form/input/SelectField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";
import { UploadImagens } from "../../components/form/UploadImagens";
import { CheckCircle, LogIn, Ticket } from "lucide-react";

interface SugestaoResult extends FormState {
    id?: number;
    tipo?: "ponto-turistico" | "evento";
}

async function sugerirLocalAction(_prevState: SugestaoResult | null, formData: FormData): Promise<SugestaoResult> {
    const data = Object.fromEntries(formData);

    try {
        const res = await api.post("/api/sugestoes", {
            categoria: data.categoria,
            nome: String(data.nome),
            descricao: String(data.descricao),
            informacoes: String(data.informacoes),
            latitude: parseFloat(String(data.latitude)) || 0,
            longitude: parseFloat(String(data.longitude)) || 0,
            // evento
            data: data.data ? String(data.data) : undefined,
            horario: data.horario ? String(data.horario) : undefined,
            local: data.local ? String(data.local) : undefined,
            link: data.link ? String(data.link) : undefined,
            gratuito: data.gratuito === "true",
            // ponto turístico
            destaques: data.destaques ? String(data.destaques) : undefined,
            endereco: data.endereco ? String(data.endereco) : undefined,
            horarioFuncionamento: data.horarioFuncionamento ? String(data.horarioFuncionamento) : undefined,
            telefone: data.telefone ? String(data.telefone) : undefined,
            site: data.site ? String(data.site) : undefined,
        });

        return { message: res.data.message, status: "success", id: res.data.id, tipo: data.categoria === "evento" ? "evento" : "ponto-turistico" };
    } catch {
        return { message: "Erro ao enviar sugestão. Verifique os campos.", status: "error" };
    }
}

function getUser() {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

export function Sugestao() {
    const [state, formAction, isPending] = useActionState(sugerirLocalAction, null);
    const [categoria, setCategoria] = useState("ponto-turistico");
    const isPonto = ["ponto-turistico", "hotel-pousada", "bar-restaurante"].includes(categoria);
    const [gratuito, setGratuito] = useState(false);
    const usuarioLogado = getUser();

    if (!usuarioLogado) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 max-w-md w-full flex flex-col items-center gap-6 text-center">
                    <LogIn size={48} className="text-blue-600" />
                    <h2 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">Login necessário</h2>
                    <p className="text-gray-500 text-sm">Você precisa estar logado para enviar uma sugestão de local ou evento.</p>
                    <Link to="/login" className="w-full py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors text-sm text-center">
                        Fazer login
                    </Link>
                    <Link to="/cadastro" className="text-sm text-blue-700 hover:underline">
                        Não tem conta? Cadastre-se
                    </Link>
                </div>
            </div>
        );
    }

    // Sugestão enviada com sucesso — mostrar upload de imagens
    if (state?.status === "success" && state.id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 max-w-xl w-full flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center gap-2">
                        <CheckCircle size={48} className="text-green-500" />
                        <h2 className="text-2xl font-bold text-blue-800 uppercase tracking-tight">Sugestão enviada!</h2>
                        <p className="text-gray-500 text-sm">{state.message}</p>
                    </div>

                    {usuarioLogado ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-gray-700 font-semibold text-sm">Deseja adicionar fotos? (opcional)</p>
                            <UploadImagens tipo={state.tipo!} registroId={state.id} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center">
                            <Link to="/login" className="text-blue-700 font-semibold hover:underline">Faça login</Link> para adicionar fotos à sua sugestão.
                        </p>
                    )}

                    <Link to="/" className="w-full text-center py-2 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors text-sm">
                        Voltar para o início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
            <div className="flex flex-col gap-6 bg-white rounded-3xl shadow-md border border-gray-100 p-8 max-w-2xl w-full">
                <div className="text-center">
                    <h1 className="text-blue-800 font-bold text-2xl uppercase tracking-tight">
                        Sugestão de Local ou Evento
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Contribua com a comunidade! Nossa equipe avalia cada sugestão antes de publicar.
                    </p>
                </div>

                <form action={formAction} className="flex flex-col gap-5">
                    <FormResposta state={state} />
                    <input type="hidden" name="gratuito" value={String(gratuito)} />

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Categoria</label>
                            <Select name="categoria" variant="form" value={categoria} onChange={e => { setCategoria(e.target.value); setGratuito(false); }}>
                                <option value="ponto-turistico">Ponto Turístico</option>
                                <option value="hotel-pousada">Hotel / Pousada</option>
                                <option value="bar-restaurante">Bar / Restaurante</option>
                                <option value="evento">Evento</option>
                            </Select>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
                            <Input name="nome" placeholder="Ex: Mirante da Serra" variant="form" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
                        <TextArea name="descricao" rows={4} placeholder="Conte um pouco sobre este local ou evento..." required />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Informações adicionais</label>
                        <TextArea name="informacoes" rows={2} placeholder="Dicas úteis, acessibilidade, estacionamento..." required />
                    </div>

                    {isPonto && (
                        <>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Principais destaques</label>
                                <Input name="destaques" placeholder="Ex: Vista panorâmica, trilha, restaurante próximo..." variant="form" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Endereço <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <Input name="endereco" placeholder="Ex: Praça da Basílica, s/n" variant="form" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Horário de funcionamento <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <Input name="horarioFuncionamento" placeholder="Ex: Seg-Sex: 8h às 18h" variant="form" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Telefone <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <Input name="telefone" placeholder="(31) 99999-9999" variant="form" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Site <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <Input name="site" placeholder="https://exemplo.com.br" variant="form" />
                                </div>
                            </div>
                        </>
                    )}

                    {categoria === "evento" && !isPonto && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Data do Evento</label>
                                    <Input name="data" type="date" variant="form" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Horário</label>
                                    <Input name="horario" type="time" variant="form" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Local <span className="text-gray-400 font-normal">(opcional)</span></label>
                                <Input name="local" placeholder="Ex: Praça da Basílica, Teatro Municipal..." variant="form" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Link do evento <span className="text-gray-400 font-normal">(opcional)</span></label>
                                <Input name="link" placeholder="https://exemplo.com/evento" variant="form" />
                            </div>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                                    <div
                                        onClick={() => setGratuito(v => !v)}
                                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${gratuito ? "bg-green-400" : "bg-gray-200"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${gratuito ? "translate-x-4" : "translate-x-0"}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Ticket size={14} className="text-gray-400" />
                                        Evento gratuito
                                        {gratuito && <span className="ml-1 text-xs text-green-600 font-normal">✓ Entrada franca</span>}
                                    </span>
                                </label>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Latitude <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <Input name="latitude" type="number" step="any" placeholder="-20.5011" variant="form" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Longitude <span className="text-gray-400 font-normal">(opcional)</span></label>
                            <Input name="longitude" type="number" step="any" placeholder="-43.8510" variant="form" />
                        </div>
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full py-3 text-base font-semibold uppercase tracking-wide">
                        {isPending ? "Enviando..." : "Enviar Sugestão"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

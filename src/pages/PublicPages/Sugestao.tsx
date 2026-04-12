import { useActionState, useState } from "react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Select } from "../../components/form/input/SelectField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";

async function sugerirLocalAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);

    try {
        await api.post("/api/sugestoes", {
            categoria: data.categoria,
            nome: String(data.nome),
            descricao: String(data.descricao),
            informacoes: String(data.informacoes),
            latitude: parseFloat(String(data.latitude)) || 0,
            longitude: parseFloat(String(data.longitude)) || 0,
            data: data.data ? String(data.data) : undefined,
            horario: data.horario ? String(data.horario) : undefined,
            destaques: data.destaques ? String(data.destaques) : undefined,
        });

        return { message: "Sugestão enviada com sucesso! Nossa equipe irá avaliar.", status: "success" };
    } catch (error) {
        console.error("Erro ao enviar:", error);
        return { message: "Erro ao enviar sugestão. Verifique os campos.", status: "error" };
    }
}

export function Sugestao() {
    const [state, formAction, isPending] = useActionState(sugerirLocalAction, null);
    const [categoria, setCategoria] = useState("ponto-turistico");

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-2 p-8 m-8 bg-white rounded-3xl shadow-md max-w-4xl w-full border border-gray-100 transition-all hover:shadow-lg">
                <h1 className="text-blue-800 font-bold text-2xl uppercase tracking-tight text-center">
                    Sugestão de Locais e Eventos
                </h1>
                <p className="text-gray-500 text-sm mt-4 text-center max-w-2xl">
                    Quer sugerir um novo local ou evento para a comunidade? Preencha o formulário abaixo.
                    Nossa equipe avaliará sua contribuição para tornar o Radar Local ainda mais completo!
                </p>

                <form action={formAction} className="w-full mt-8">
                    <FormResposta state={state} />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <div className="col-span-1 md:col-span-4 lg:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Categoria</label>
                            <Select
                                name="categoria"
                                variant="form"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="ponto-turistico">Ponto Turístico</option>
                                <option value="evento">Evento</option>
                            </Select>
                        </div>

                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Nome da Sugestão</label>
                            <Input name="nome" placeholder="Ex: Mirante da Serra" variant="form" required />
                        </div>

                        <div className="col-span-1 md:col-span-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Descrição</label>
                            <TextArea name="descricao" rows={4} placeholder="Conte-nos um pouco sobre este local ou evento..." required />
                        </div>

                        <div className="col-span-1 md:col-span-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Informações Adicionais</label>
                            <Input name="informacoes" placeholder="Endereço, contatos, dicas úteis..." variant="form" required />
                        </div>

                        {categoria === "ponto-turistico" && (
                            <div className="col-span-1 md:col-span-4 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Principais Destaques</label>
                                <Input name="destaques" placeholder="Ex: Vista panorâmica, trilha, restaurante próximo..." variant="form" />
                            </div>
                        )}

                        {categoria === "evento" && (
                            <>
                                <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Data do Evento</label>
                                    <Input name="data" type="date" variant="form" required={categoria === "evento"} />
                                </div>

                                <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Horário</label>
                                    <Input name="horario" type="time" variant="form" required={categoria === "evento"} />
                                </div>
                            </>
                        )}

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Latitude (Opcional)</label>
                            <Input name="latitude" type="number" step="any" placeholder="-20.5011" variant="form" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Longitude (Opcional)</label>
                            <Input name="longitude" type="number" step="any" placeholder="-43.8510" variant="form" />
                        </div>

                        <div className="col-span-1 md:col-span-4 flex justify-end mt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full md:w-auto px-10 py-3 uppercase tracking-wide font-semibold"
                            >
                                {isPending ? "Enviando..." : "Enviar Sugestão"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
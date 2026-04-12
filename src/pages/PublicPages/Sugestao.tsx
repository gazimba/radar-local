import { useActionState } from "react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Select } from "../../components/form/input/SelectField";
import { TextArea } from "../../components/form/input/TextAreaField";
import { Button } from "../../components/ui/button/Button";
import { FormResposta, type FormState } from "../../components/form/FormResposta";

async function sugerirLocalAction(_prevState: any, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData);

    try {
        const rota = data.categoria === "evento" ? "/api/evento" : "/api/ponto-turistico";

        await api.post(rota, {
            nome: data.nome,
            descricao: data.descricao,
            informacoes: `Endereço: ${data.endereco}, ${data.cidade}/${data.estado}`,
            latitude: parseFloat(String(data.latitude)) || 0,
            longitude: parseFloat(String(data.longitude)) || 0,
            data: data.categoria === "evento" ? new Date().toISOString() : undefined,
            horario: data.categoria === "evento" ? "A definir" : undefined,
        });

        return { message: "Sugestão enviada com sucesso! Nossa equipe irá avaliar.", status: "success" };
    } catch (error) {
        return { message: "Erro ao enviar sugestão. Verifique os campos.", status: "error" };
    }
}

export function Sugestao() {
    const [state, formAction, isPending] = useActionState(sugerirLocalAction, null);

    return (
        <div className="max-w-6xl m-8 p-8 flex flex-col items-center bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-blue-800 font-bold text-2xl uppercase text-center">Sugestão de Locais e Eventos</h1>
            <p className="text-gray-700 text-lg mt-4 text-center leading-relaxed">
                Quer sugerir um novo local ou evento para a comunidade? Preencha o formulário abaixo.
                Nossa equipe avaliará sua contribuição para tornar o Radar Local ainda mais completo!
            </p>

            <form action={formAction} className="w-full mt-8">
                <FormResposta state={state} />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Categoria</label>
                        <Select name="categoria" variant="form" defaultValue="ponto-turistico">
                            <option value="ponto-turistico">Ponto Turístico</option>
                            <option value="evento">Evento</option>
                        </Select>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nome da Sugestão</label>
                        <Input name="nome" placeholder="Ex: Mirante da Serra" variant="form" required />
                    </div>

                    <div className="col-span-1 md:col-span-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Descrição / Por que sugerir este local?</label>
                        <TextArea name="descricao" rows={4} placeholder="Conte-nos um pouco sobre este local..." required />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                        <Input name="estado" placeholder="Minas Gerais" variant="form" required />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Cidade</label>
                        <Input name="cidade" placeholder="Congonhas" variant="form" required />
                    </div>

                    <div className="col-span-1 md:col-span-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Endereço Aproximado</label>
                        <Input name="endereco" placeholder="Rua, Bairro ou Referência" variant="form" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Latitude (Opcional)</label>
                        <Input name="latitude" type="number" step="any" variant="form" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Longitude (Opcional)</label>
                        <Input name="longitude" type="number" step="any" variant="form" />
                    </div>

                    <Button
                        disabled={isPending}
                        className="mt-6 col-span-1 md:col-span-4 py-6 text-lg uppercase tracking-wider"
                    >
                        {isPending ? "Enviando..." : "Enviar Sugestão"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
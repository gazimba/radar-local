import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2, X } from "lucide-react";
import { api } from "../../services/api";

interface Imagem {
    id: number;
    url: string;
    publicId: string;
    capa: boolean;
}

interface UploadImagensProps {
    tipo: "ponto-turistico" | "evento";
    registroId: number;
    imagensIniciais?: Imagem[];
    permitirCapa?: boolean;
}

const FORMATOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];
const TAMANHO_MAXIMO_MB = 5;
const LIMITE = 5;

export function UploadImagens({ tipo, registroId, imagensIniciais = [], permitirCapa = false }: UploadImagensProps) {
    const [imagens, setImagens] = useState<Imagem[]>(imagensIniciais);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSelecionar(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivos = Array.from(e.target.files || []);
        if (!arquivos.length) return;

        setErro(null);

        const disponiveis = LIMITE - imagens.length;
        if (disponiveis <= 0) {
            setErro(`Limite de ${LIMITE} imagens atingido.`);
            return;
        }

        const selecionados = arquivos.slice(0, disponiveis);

        for (const arquivo of selecionados) {
            if (!FORMATOS_ACEITOS.includes(arquivo.type)) {
                setErro("Formato inválido. Use JPEG, PNG ou WebP.");
                return;
            }
            if (arquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
                setErro(`Cada imagem deve ter no máximo ${TAMANHO_MAXIMO_MB}MB.`);
                return;
            }
        }

        setEnviando(true);
        try {
            for (const arquivo of selecionados) {
                const formData = new FormData();
                formData.append("imagem", arquivo);
                const res = await api.post(`/api/imagens/${tipo}/${registroId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setImagens((prev) => [...prev, res.data]);
            }
        } catch (err: any) {
            setErro(err.response?.data?.message || "Erro ao enviar imagem.");
        } finally {
            setEnviando(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    async function handleDeletarImagem(imagemId: number) {
        try {
            await api.delete(`/api/imagens/${imagemId}`);
            setImagens((prev) => prev.filter((i) => i.id !== imagemId));
        } catch {
            setErro("Erro ao remover imagem.");
        }
    }

    async function handleDefinirCapa(imagemId: number) {
        try {
            await api.patch(`/api/imagens/${tipo}/${registroId}/capa/${imagemId}`);
            setImagens((prev) => prev.map((i) => ({ ...i, capa: i.id === imagemId })));
        } catch {
            setErro("Erro ao definir capa.");
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Preview das imagens */}
            {imagens.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {imagens.map((imagem) => (
                        <div key={imagem.id} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-square">
                            <img src={imagem.url} alt="" className="w-full h-full object-cover" />

                            {imagem.capa && (
                                <span className="absolute top-1 left-1 bg-orange-400 text-white text-xs px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                                    <Star size={10} /> Capa
                                </span>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {permitirCapa && !imagem.capa && (
                                    <button
                                        type="button"
                                        onClick={() => handleDefinirCapa(imagem.id)}
                                        title="Definir como capa"
                                        className="p-1.5 bg-orange-400 rounded-full text-white hover:bg-orange-500 transition-colors"
                                    >
                                        <Star size={14} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeletarImagem(imagem.id)}
                                    title="Remover imagem"
                                    className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Botão de upload */}
            {imagens.length < LIMITE && (
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${enviando ? "border-gray-200 bg-gray-50 cursor-not-allowed" : "border-blue-300 hover:border-blue-400 hover:bg-blue-50"}`}>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleSelecionar}
                        disabled={enviando}
                    />
                    <ImagePlus size={20} className="text-blue-400 shrink-0" />
                    <span className="text-sm text-gray-600">
                        {enviando
                            ? "Enviando..."
                            : `Adicionar fotos (${imagens.length}/${LIMITE}) — JPEG, PNG ou WebP, máx. ${TAMANHO_MAXIMO_MB}MB cada`}
                    </span>
                </label>
            )}

            {/* Erro */}
            {erro && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <X size={14} className="shrink-0" />
                    {erro}
                    <button type="button" onClick={() => setErro(null)} className="ml-auto text-red-400 hover:text-red-600">
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}

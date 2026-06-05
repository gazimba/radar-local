import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";

interface Imagem {
    id: number;
    url: string;
    capa: boolean;
}

interface CarroselProps {
    imagens: Imagem[];
}

export function Carrosel({ imagens }: CarroselProps) {
    const [ativa, setAtiva] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);

    if (!imagens || imagens.length === 0) {
        return (
            <div className="w-full h-64 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300 my-4">
                <ImageOff size={40} />
                <span className="text-sm">Nenhuma foto cadastrada</span>
            </div>
        );
    }

    function anterior() { setAtiva(v => (v === 0 ? imagens.length - 1 : v - 1)); }
    function proxima() { setAtiva(v => (v === imagens.length - 1 ? 0 : v + 1)); }

    return (
        <>
            <div className="w-full my-4 flex flex-col gap-3">
                {/* Imagem principal */}
                <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group"
                    onClick={() => setLightbox(ativa)}>
                    <img
                        src={imagens[ativa].url}
                        alt={`Foto ${ativa + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {imagens.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); anterior(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); proxima(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                {ativa + 1} / {imagens.length}
                            </span>
                        </>
                    )}
                </div>

                {/* Miniaturas */}
                {imagens.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {imagens.map((img, i) => (
                            <button key={img.id} onClick={() => setAtiva(i)}
                                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === ativa ? "border-blue-500 opacity-100" : "border-transparent opacity-60 hover:opacity-90"}`}>
                                <img src={img.url} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}>
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setLightbox(null)}>
                        <X size={28} />
                    </button>
                    {imagens.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); setLightbox(v => v === 0 ? imagens.length - 1 : v! - 1); }}
                                className="absolute left-4 text-white hover:text-gray-300 bg-black/40 rounded-full p-2">
                                <ChevronLeft size={28} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setLightbox(v => v === imagens.length - 1 ? 0 : v! + 1); }}
                                className="absolute right-4 text-white hover:text-gray-300 bg-black/40 rounded-full p-2">
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}
                    <img src={imagens[lightbox].url} alt={`Foto ${lightbox + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        onClick={e => e.stopPropagation()} />
                    <span className="absolute bottom-4 text-white/70 text-sm">{lightbox + 1} / {imagens.length}</span>
                </div>
            )}
        </>
    );
}

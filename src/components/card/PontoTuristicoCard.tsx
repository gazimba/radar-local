import { Button } from "../ui/button/Button";
import { useNavigate } from "react-router";
import { MapPin } from "lucide-react";

interface PontoTuristicoProps {
    ponto: {
        id: number;
        nome: string;
        descricao: string;
        destaques?: string;
        imagens?: { url: string }[];
    }
}

export function PontoTuristicoCard({ ponto }: PontoTuristicoProps) {
    const navigate = useNavigate();
    const imagemCapa = ponto.imagens?.[0]?.url;

    return (
        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-52">
                {imagemCapa ? (
                    <img src={imagemCapa} alt={ponto.nome} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <MapPin size={40} className="text-blue-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h1 className="text-lg font-extrabold tracking-tight uppercase leading-tight">
                        {ponto.nome}
                    </h1>
                </div>
            </div>
            <div className="p-5">
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 text-sm">
                    {ponto.descricao}
                </p>
                <Button className="w-full" onClick={() => navigate(`/ponto-turistico/${ponto.id}`)}>
                    Ver detalhes
                </Button>
            </div>
        </div>
    );
}

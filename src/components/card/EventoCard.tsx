import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button/Button";
import { useNavigate } from "react-router";

interface EventoCardProps {
    evento: {
        id: number;
        nome: string;
        descricao: string;
        data: string | Date;
        horario: string;
        local?: string;
        gratuito?: boolean;
        imagens?: { url: string }[];
    }
}

export function EventoCard({ evento }: EventoCardProps) {
    const navigate = useNavigate();
    const imagemCapa = evento.imagens?.[0]?.url;

    const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
    });

    return (
        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-52">
                {imagemCapa ? (
                    <img src={imagemCapa} alt={evento.nome} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                        <Calendar size={40} className="text-orange-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {evento.gratuito && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Gratuito
                    </span>
                )}
                <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h1 className="text-lg font-extrabold tracking-tight uppercase leading-tight">
                        {evento.nome}
                    </h1>
                </div>
            </div>
            <div className="p-5">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1 text-amber-700 font-semibold capitalize">
                        <Calendar size={14} /> {dataFormatada}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} /> {evento.horario}
                    </span>
                    {evento.local && (
                        <span className="flex items-center gap-1">
                            <MapPin size={14} /> {evento.local}
                        </span>
                    )}
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2 text-sm">
                    {evento.descricao}
                </p>
                <Button className="w-full" onClick={() => navigate(`/evento/${evento.id}`)}>
                    Ver detalhes
                </Button>
            </div>
        </div>
    );
}

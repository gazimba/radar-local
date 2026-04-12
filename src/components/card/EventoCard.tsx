import { Clock } from "lucide-react";
import { Button } from "../ui/button/Button";
import { useNavigate } from "react-router";

interface EventoCardProps {
    evento: {
        id: number;
        nome: string;
        descricao: string;
        data: string | Date;
        horario: string;
        informacoes: string;
    }
}

export function EventoCard({ evento }: EventoCardProps) {
    const navigate = useNavigate();

    const dataObj = new Date(evento.data);
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long'
    });

    return (
        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-72 w-2xl">
                <img
                    src="/images/basilica-bom-jesus.jpg"
                    alt={`Foto de ${evento.nome}`}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-4xl font-extrabold tracking-tight uppercase leading-none">
                        {evento.nome}
                    </h1>
                    <p className="text-lg mt-2 font-light opacity-90">
                        Congonhas, Minas Gerais
                    </p>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="flex text-xl font-semibold text-gray-500 gap-2 items-center">
                        <span className="text-amber-700 capitalize">
                            {dataFormatada}
                        </span>| <Clock size={20} /> {evento.horario}
                    </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                    {evento.descricao}
                </p>
                <Button className="w-full" onClick={() => navigate(`/evento/${evento.id}`)}>
                    VER DETALHES
                </Button>
            </div>
        </div>
    )
}
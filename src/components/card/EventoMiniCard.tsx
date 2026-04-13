import { Clock } from "lucide-react";
import { Link } from "react-router";

interface EventoMiniCardProps {
    evento: {
        id: number;
        nome: string;
        data: string | Date;
        horario: string;
        informacoes: string;
    }
}

export function EventoMiniCard({ evento }: EventoMiniCardProps) {
    const dataObj = new Date(evento.data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex overflow-hidden w-full font-sans">
            <div className="bg-amber-600 text-white p-5 flex flex-col items-center justify-center min-w-22.5 text-center">
                <span className="text-5xl font-extrabold tracking-tighter leading-none">
                    {dia}
                </span>
                <span className="text-xl font-bold uppercase tracking-wider mt-1">
                    {mes}
                </span>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1 gap-2">
                <div>
                    <h3 className="text-xl font-bold text-gray-950 leading-snug line-clamp-2">
                        {evento.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-1.5">
                        <Clock size={15} />
                        <span className="line-clamp-2">{evento.horario} - {evento.informacoes}</span>
                    </p>
                </div>
                <Link
                    to={`/evento/${evento.id}`}
                    className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
                >
                    Ver programação
                </Link>
            </div>
        </div>
    );
}
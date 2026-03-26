import { Clock } from "lucide-react";
import { Link } from "react-router";

export function EventoMiniCard() {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex overflow-hidden w-full font-sans">
            <div className="bg-amber-600 text-white p-5 flex flex-col items-center justify-center min-w-22.5 text-center">
                <span className="text-5xl font-extrabold tracking-tighter leading-none">
                    15
                </span>
                <span className="text-xl font-bold uppercase tracking-wider mt-1">
                    JUL
                </span>
            </div>
            <div className="p-5 flex flex-col justify-between flex-1 gap-2">
                <div>
                    <h3 className="text-xl font-bold text-gray-950 leading-snug line-clamp-2">
                        Festival de Inverno de Congonhas
                    </h3>
                    <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-1.5">
                        <Clock size={15} />
                        <span>19:00 - Praça da Basílica</span>
                    </p>
                </div>
                <Link to={"/"} className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group">
                    Ver programação
                </Link>
            </div>
        </div>
    )
}
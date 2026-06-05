import { Link, useNavigate } from "react-router";
import { MapPin, ArrowLeft, Home } from "lucide-react";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-6">
            <div className="flex flex-col items-center text-center max-w-md gap-6">

                {/* Ícone decorativo */}
                <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center">
                        <MapPin size={52} className="text-blue-300" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        404
                    </span>
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-blue-800 tracking-tight">
                        Página não encontrada
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        O endereço que você tentou acessar não existe ou foi movido.
                        Verifique o link ou volte para a página inicial.
                    </p>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 flex-1 h-11 px-4 rounded-xl border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </button>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 flex-1 h-11 px-4 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-semibold text-sm transition-colors"
                    >
                        <Home size={16} />
                        Ir para o início
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { Button } from "../ui/button/Button";
import { useNavigate } from "react-router";

interface PontoTuristicoProps {
    ponto: {
        id: number;
        nome: string;
        descricao: string;
        destaques: string;
    }
}

export function PontoTuristicoCard({ ponto }: PontoTuristicoProps) {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-72 w-2xl">
                <img
                    src="/images/basilica-bom-jesus.jpg"
                    alt={`Foto de ${ponto.nome}`}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-2xl font-extrabold tracking-tight uppercase leading-none max-w-sm">
                        {ponto.nome}
                    </h1>
                    <p className="text-lg mt-2 font-light opacity-90">
                        Minas Gerais
                    </p>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-amber-700">
                        {ponto.destaques || "Histórico | Monumento"}
                    </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                    {ponto.descricao}
                </p>
                <Button className="w-full" onClick={() => navigate(`/ponto-turistico/${ponto.id}`)}>
                    VER DETALHES
                </Button>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { EventoMiniCard } from "../../components/card/EventoMiniCard";
import { PontoTuristicoCard } from "../../components/card/PontoTuristicoCard";
import { LinksUteis } from "../../components/list/LinksUteis";
import { api } from "../../services/api";

export function PontoTuristico() {
    const [pontos, setPontos] = useState([]);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        api.get("/api/pontos-turisticos")
            .then(response => setPontos(response.data))
            .catch(err => console.error("Erro ao carregar pontos:", err));
        api.get("/api/eventos")
            .then(response => setEventos(response.data.slice(0, 5)))
            .catch(err => console.error("Erro ao carregar eventos:", err));
    }, []);

    return (
        <>
            <div className="flex flex-col px-8 w-full h-full items-center">
                <div className="flex flex-col lg:flex-row gap-6 ">
                    <div className="flex flex-col lg:max-w-4xl my-6">
                        <h1 className="text-3xl font-bold mb-4 text-blue-800">Pontos Turísticos</h1>
                        <p className="text-md text-gray-500 italic">
                            Confira os principais pontos turísticos de Congonhas e planeje sua visita!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-6">
                            {pontos.map((item: any) => (
                                <PontoTuristicoCard key={item.id} ponto={item} />
                            ))}

                            {pontos.length === 0 && (
                                <p className="text-gray-400">Nenhum ponto turístico encontrado.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:p-6 lg:border-l border-gray-200 lg:max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Eventos</h2>
                        <p className="text-md text-gray-500 italic">
                            Confira os eventos programados para 2026!
                        </p>

                        <div className="grid md:grid-cols-1 gap-6 my-6">
                            {eventos.map((evento: any) => (
                                <EventoMiniCard key={evento.id} evento={evento} />
                            ))}

                            <Link to={"/evento"} className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-lg text-center">
                                VER TODOS OS EVENTOS
                            </Link>
                        </div>

                        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Links úteis</h2>
                        <LinksUteis />
                    </div>
                </div>
            </div>
        </>
    );
}
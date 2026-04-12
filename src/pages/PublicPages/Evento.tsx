import { useEffect, useState } from "react";
import { EventoCard } from "../../components/card/EventoCard";
import { api } from "../../services/api";

export function Evento() {
    const [eventos, setEventos] = useState([]);
    useEffect(() => {
        api.get("/api/eventos")
            .then(response => {
                setEventos(response.data);
            })
            .catch(error => {
                console.error("Erro ao carregar eventos:", error);
            });
    }, []);

    return (
        <>
            <div className="flex flex-col px-8 w-full h-full items-center">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col lg:max-w-6xl my-6">
                        <h1 className="text-3xl font-bold mb-4 text-blue-800">Eventos</h1>
                        <p className="text-md text-gray-500 italic">
                            Confira os próximos eventos programados para este local no ano de 2026 e não perca nada!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                            {eventos.map((evento: any) => (
                                <EventoCard key={evento.id} evento={evento} />
                            ))}
                            {eventos.length === 0 && (
                                <p className="text-gray-400 col-span-full">
                                    Nenhum evento encontrado no momento.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
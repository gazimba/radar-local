import { EventoCard } from "../../components/card/EventoCard";

export function Evento() {
    return (
        <>
            <div className="flex flex-col px-8 w-full h-full items-center">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Ponto Turístico */}
                    <div className="flex flex-col lg:max-w-6xl my-6">
                        <h1 className="text-3xl font-bold mb-4 text-blue-800">Eventos</h1>
                        <p className="text-md text-gray-500 italic">
                            Confira os próximos eventos programados para este local no ano de 2026 e não perca nada!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                            <EventoCard />
                            <EventoCard />
                            <EventoCard />
                            <EventoCard />
                            <EventoCard />
                        </div>
                    </div>
                    {/* 
                    <div className="flex flex-col md:p-6 lg:border-l border-gray-200 lg:min-w-sm">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Links úteis</h2>
                        <LinksUteis />
                    </div> */}
                </div>
            </div>
        </>
    )
}
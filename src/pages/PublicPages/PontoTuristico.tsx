import { Link } from "react-router";
import { EventoMiniCard } from "../../components/card/EventoMiniCard";
import { PontoTuristicoCard } from "../../components/card/PontoTuristicoCard";
import { PesquisaCidadeHeader } from "../../components/header/PesquisaCidadeHeader";
import { LinksUteis } from "../../components/list/LinksUteis";

export function PontoTuristico() {
    return (
        <>
            <PesquisaCidadeHeader />
            <div className="grid grid-cols-12 w-full h-screen">
                <div className="col-span-1" />
                <div className="col-span-10 flex flex-col lg:flex-row gap-6">
                    {/* Ponto Turístico */}
                    <div className="flex flex-col lg:max-w-6xl">
                        <h1 className="text-3xl font-bold mb-4 text-blue-800">Pontos Turísticos</h1>
                        <p className="text-md text-gray-500 italic">
                            Confira os principais pontos turísticos de Congonhas e planeje sua visita para aproveitar ao máximo cada atração!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-6">
                            <PontoTuristicoCard />
                            <PontoTuristicoCard />
                            <PontoTuristicoCard />
                            <PontoTuristicoCard />
                            <PontoTuristicoCard />
                        </div>
                    </div>
                    {/* Eventos e links úteis */}
                    <div className="flex flex-col md:p-6 lg:border-l border-gray-200 lg:min-w-sm">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Eventos</h2>
                        <p className="text-md text-gray-500 italic">
                            Confira os eventos programados para este local no ano de 2026 e não perca nada!
                        </p>
                        <div className="grid md:grid-cols-1 gap-6 my-6">
                            <EventoMiniCard />
                            <EventoMiniCard />
                            <EventoMiniCard />
                            <EventoMiniCard />
                            <EventoMiniCard />
                            <Link to={"/evento"} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-lg text-center">
                                VER TODOS OS EVENTOS
                            </Link>
                        </div>
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Links úteis</h2>
                        <LinksUteis />
                    </div>
                </div>
                <div className="col-span-1" />
            </div>
        </>
    )
}
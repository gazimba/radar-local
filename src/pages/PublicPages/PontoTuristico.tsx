import { Link } from "react-router";
import { EventoMiniCard } from "../../components/card/EventoMiniCard";
import { PontoTuristicoCard } from "../../components/card/PontoTuristicoCard";
import { PesquisaCidadeHeader } from "../../components/header/PesquisaCidadeHeader";

export function PontoTuristico() {
    return (
        <>
            <PesquisaCidadeHeader />
            <div className="grid grid-cols-12 w-full h-screen">
                <div className="col-span-1" />
                <div className="col-span-10 lg:col-span-7 flex flex-col">
                    <h1 className="text-3xl font-bold mb-4 text-blue-800">Pontos Turísticos</h1>
                    <p className="text-md text-gray-500 italic">
                        Confira os principais pontos turísticos de Congonhas e planeje sua visita para aproveitar ao máximo cada atração!
                    </p>
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 my-6">
                        <PontoTuristicoCard />
                        <PontoTuristicoCard />
                        <PontoTuristicoCard />
                        <PontoTuristicoCard />
                        <PontoTuristicoCard />
                    </div>
                </div>
                <div className="col-span-10 lg:col-span-3 flex flex-col p-6 border-l border-gray-200">
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
                        <Link to={"/eventos"} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-lg text-center">
                            VER TODOS OS EVENTOS
                        </Link>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800">Links úteis</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>
                            <a href="https://www.cidadedecongonhas.mg.gov.br/turismo" className="text-amber-600 hover:text-amber-700">
                                Site oficial da cidade
                            </a>
                        </li>
                        <li>
                            <a href="https://www.cidadedecongonhas.mg.gov.br/turismo" className="text-amber-600 hover:text-amber-700">
                                Portal do turismo
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col-span-1" />
            </div>
        </>
    )
}
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Carrosel } from "../../components/list/Carrosel";
import { LocalizacaoMap } from "../../components/map/LocalizacaoMap";
import { api } from "../../services/api";

export function PontoTuristicoDetalhes() {
    const { id } = useParams();
    const [ponto, setPonto] = useState<any>(null);

    useEffect(() => {
        api.get(`/api/pontos-turisticos/${id}`)
            .then(response => setPonto(response.data))
            .catch(err => console.error("Erro ao carregar ponto turístico:", err));
    }, [id]);

    if (!ponto) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Carregando detalhes do local...
            </div>
        );
    }

    return (
        <div className="max-w-6xl m-8 p-8 flex flex-col items-center bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-blue-800 font-bold text-3xl uppercase mb-4 text-center">
                {ponto.nome}
            </h1>

            <Carrosel />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 w-full">
                <div className="col-span-2">
                    <h2 className="text-blue-800 font-bold text-xl mt-6 uppercase border-b pb-2">
                        Sobre o local
                    </h2>
                    <p className="text-gray-700 text-lg mt-4 leading-relaxed">
                        {ponto.descricao}
                    </p>

                    <h3 className="text-blue-800 font-bold text-xl mt-8 uppercase border-b pb-2">
                        Destaques
                    </h3>
                    <p className="text-gray-700 text-lg mt-4 leading-relaxed">
                        {ponto.destaques}
                    </p>
                </div>

                <div className="col-span-1 md:border-l md:pl-6">
                    <h2 className="text-blue-800 font-bold text-xl mt-6 uppercase border-b pb-2">
                        Informações adicionais
                    </h2>
                    <p className="text-gray-700 text-lg mt-4 leading-relaxed">
                        {ponto.informacoes}
                    </p>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                        <p className="text-blue-900 font-semibold">Localização em Congonhas</p>
                        <p className="text-blue-700 text-sm mt-1">
                            Use o mapa abaixo para ver as coordenadas exatas e planejar sua rota.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full mt-10 h-96 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                <LocalizacaoMap
                    lat={ponto.latitude}
                    lon={ponto.longitude}
                />
            </div>
        </div>
    );
}
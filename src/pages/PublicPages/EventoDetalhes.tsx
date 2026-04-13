import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Carrosel } from "../../components/list/Carrosel";
import { LocalizacaoMap } from "../../components/map/LocalizacaoMap";
import { api } from "../../services/api";

export function EventoDetalhes() {
    const { id } = useParams();
    const [evento, setEvento] = useState<any>(null);

    useEffect(() => {
        api.get(`/api/eventos/${id}`)
            .then(response => setEvento(response.data))
            .catch(err => console.error("Erro ao carregar detalhes do evento:", err));
    }, [id]);

    if (!evento) {
        return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
    }

    const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="m-auto max-w-6xl p-8 flex flex-col items-center bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-blue-800 font-bold text-3xl uppercase mb-4">{evento.nome}</h1>

            <Carrosel />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 w-full">
                <div className="col-span-2">
                    <h2 className="text-blue-800 font-bold text-xl mt-6 uppercase border-b pb-2">Sobre o evento</h2>
                    <p className="text-gray-700 text-lg mt-4 leading-relaxed">
                        {evento.descricao}
                    </p>

                    <h3 className="text-blue-800 font-bold text-xl mt-8 uppercase border-b pb-2">Informações adicionais</h3>
                    <p className="text-gray-700 text-lg mt-4 leading-relaxed">
                        {evento.informacoes}
                    </p>
                </div>

                <div className="col-span-1 md:border-l md:pl-6">
                    <h2 className="text-blue-800 font-bold text-xl mt-6 uppercase border-b pb-2">Data e Horário</h2>
                    <div className="mt-4">
                        <p className="text-amber-700 font-bold text-xl">{dataFormatada}</p>
                        <p className="text-gray-600 text-lg mt-1">{evento.horario}</p>
                    </div>

                    <h2 className="text-blue-800 font-bold text-xl mt-8 uppercase border-b pb-2">Localização</h2>
                    <p className="text-gray-700 text-md mt-4 italic">
                        As coordenadas exatas podem ser conferidas no mapa abaixo.
                    </p>
                </div>
            </div>

            <div className="w-full mt-10 rounded-2xl overflow-hidden shadow-inner h-96">
                <LocalizacaoMap
                    lat={evento.latitude}
                    lon={evento.longitude}
                />
            </div>
        </div>
    );
}
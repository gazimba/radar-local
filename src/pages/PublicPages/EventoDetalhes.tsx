import { Carrosel } from "../../components/list/Carrosel";
import { LocalizacaoMap } from "../../components/map/LocalizacaoMap";

export function EventoDetalhes() {
    return (
        <div className="max-w-6xl m-8 p-8 flex flex-col items-center bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-blue-800 font-bold text-2xl uppercase">Jubileu</h1>
            <Carrosel />
            <div className="grid grid-cols-3 gap-8 mt-6">
                <div className="col-span-2">
                    <h2 className="text-blue-800 font-bold text-xl mt-6 uppercase">Sobre o evento</h2>
                    <p className="text-gray-700 text-lg mt-4">
                        A Basílica do Bom Jesus de Matosinhos é um dos principais pontos turísticos de Congonhas, Minas Gerais.
                    </p>
                    <h3 className="text-blue-800 font-bold text-xl mt-6 uppercase">Informações adicionais</h3>
                    <p className="text-gray-700 text-lg mt-4">
                        A construção da basílica começou em 1757 e foi concluída em 1773. Ela é famosa por abrigar as esculturas dos Doze Profetas, criadas pelo artista Aleijadinho.
                    </p>
                </div>
                <div className="col-span-1 md:border-l md:pl-6">
                    <h2 className="text-blue-800 font-bold text-xl mt-6 uppercase">Data/Horário</h2>
                    <p className="text-gray-700 text-lg mt-4">
                        A basílica é um importante local de peregrinação e recebe milhares de visitantes todos os anos. Além das esculturas, o interior da basílica é ricamente decorado com azulejos portugueses e pinturas barrocas.
                    </p>
                </div>
            </div>
            <LocalizacaoMap />
        </div>
    )
}
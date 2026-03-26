export function PontoTuristicoCard() {
    return (
        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden font-sans hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-72">
                <img
                    src="/images/basilica-bom-jesus.jpg"
                    alt="Foto da Basílica do Bom Jesus de Matosinhos"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradiente */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-4xl font-extrabold tracking-tight uppercase leading-none">
                        Basílica do Bom Jesus de Matosinhos
                    </h1>
                    <p className="text-lg mt-2 font-light opacity-90">
                        Congonhas, Minas Gerais
                    </p>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-amber-700">
                        Histórico | Monumento
                    </h2>
                    {/* <div className="flex items-center gap-1.5 text-lg">
                        <span className="font-bold text-gray-900">0.0</span>
                        <span className="text-gray-500">★</span>
                        <span className="text-gray-600 text-sm">(0 avaliações)</span>
                    </div> */}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                    Patrimônio Cultural da Humanidade pela UNESCO, o santuário abriga as famosas esculturas dos 12 Profetas esculpidas em pedra-sabão pelo mestre Aleijadinho, além das emocionantes Capelas dos Passos da Paixão de Cristo.
                </p>
                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-lg">
                    VER DETALHES
                </button>
            </div>
        </div>
    )
}
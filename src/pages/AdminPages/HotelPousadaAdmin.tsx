import { ListagemPontos } from "./ListagemPontos";

export function HotelPousadaAdmin() {
    return (
        <ListagemPontos
            titulo="Hotéis e Pousadas"
            categoria="HOTEL_POUSADA"
            rotaCadastro="/cadastrar-hotel-pousada"
            labelNovo="Novo Hotel/Pousada"
            corBotao="bg-indigo-700 text-white border-indigo-700"
            corEditar="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            corDesativar="bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
        />
    );
}

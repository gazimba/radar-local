import { ListagemPontos } from "./ListagemPontos";

export function BarRestauranteAdmin() {
    return (
        <ListagemPontos
            titulo="Bares e Restaurantes"
            categoria="BAR_RESTAURANTE"
            rotaCadastro="/cadastrar-bar-restaurante"
            labelNovo="Novo Bar/Restaurante"
            corBotao="bg-emerald-700 text-white border-emerald-700"
            corEditar="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            corDesativar="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
        />
    );
}

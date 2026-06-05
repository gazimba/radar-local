import { ListagemPontos } from "./ListagemPontos";

export function PontoTuristico() {
    return (
        <ListagemPontos
            titulo="Pontos Turísticos"
            categoria="PONTO_TURISTICO"
            rotaCadastro="/cadastrar-ponto-turistico"
            labelNovo="Novo Ponto"
            corBotao="bg-blue-700 text-white border-blue-700"
            corEditar="bg-blue-100 text-blue-700 hover:bg-blue-200"
            corDesativar="bg-blue-50 text-blue-500 hover:bg-blue-100"
        />
    );
}

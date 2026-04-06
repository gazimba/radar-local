import { TabelaSimples } from "../../components/table/TabelaSimples";

export function PontoTuristico() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Pontos Turísticos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md ">
                <TabelaSimples />
            </div>
        </div>
    )
}
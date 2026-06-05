import { MapPinPlus, Search } from "lucide-react";
import { Button } from "../../components/ui/button/Button";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { PesquisaCidadeHeader } from "../../components/header/PesquisaCidadeHeader";
import { useCidade } from "../../context/CidadeContext";

function getIsLogged() {
    return !!localStorage.getItem("@radar-local:token");
}

export function Home() {
    const navigate = useNavigate();
    const { cidadeSelecionada } = useCidade();
    const isLogged = getIsLogged();

    function handleBuscar() {
        if (!cidadeSelecionada) return;
        navigate("/ponto-turistico");
    }

    return (
        <>
        <Helmet>
            <title>Radar Local — Descubra o melhor da sua cidade</title>
            <meta name="description" content="Explore pontos turísticos, eventos e atrações da sua cidade. Contribua com sugestões e ajude a comunidade local." />
            <meta property="og:title" content="Radar Local — Descubra o melhor da sua cidade" />
            <meta property="og:description" content="Explore pontos turísticos, eventos e atrações da sua cidade." />
            <meta property="og:type" content="website" />
        </Helmet>
        <div
            className="grid grid-cols-3 w-full h-screen bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: "url('/images/background-elipse.svg')" }}
        >
            {/* Coluna da Esquerda */}
            <div />

            {/* Coluna do Meio */}
            <div className="flex flex-col items-center justify-center gap-6 w-full">
                <img src="/images/radar-local-logo.svg" alt="Logo do sistema radar local" />

                <div className="flex flex-row gap-2 w-full justify-center items-center">
                    <PesquisaCidadeHeader />
                    <Button
                        className="h-11"
                        onClick={handleBuscar}
                        disabled={!cidadeSelecionada}
                        title={!cidadeSelecionada ? "Selecione uma cidade primeiro" : "Explorar"}
                    >
                        <Search size={22} />
                    </Button>
                </div>

                {/* Banner de sugestão para visitantes */}
                {!isLogged && (
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl px-5 py-3 shadow-sm max-w-sm w-full">
                        <MapPinPlus size={22} className="text-orange-400 shrink-0" />
                        <p className="text-sm text-gray-600">
                            Conhece um lugar incrível?{" "}
                            <Link to="/cadastro" className="text-orange-500 font-semibold hover:underline">
                                Cadastre-se
                            </Link>{" "}
                            e envie sua sugestão!
                        </p>
                    </div>
                )}

                <p className="text-center text-sm">
                    Ao utilizar este serviço você automaticamente concorda com nossos{" "}
                    <Link to="/terms" className="text-amber-500 hover:underline">termos de uso</Link> e{" "}
                    <Link to="/privacy" className="text-amber-500 hover:underline">políticas de privacidade</Link>.
                </p>
            </div>

            {/* Coluna da Direita */}
            <div />
        </div>
        </>
    );
}
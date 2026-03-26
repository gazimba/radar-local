import { Search } from "lucide-react";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { Link, useNavigate } from "react-router";

export function Home() {
    const navigate = useNavigate();
    return (
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
                    <Input value={"Congonhas - Minas Gerais"} />
                    <Button
                        className="h-full"
                        onClick={() => navigate("/ponto-turistico")}
                        value={"Congonhas - Minas Gerais"}
                    >
                        <Search size={30} />
                    </Button>
                </div>
                <p className="text-center text-sm">
                    Ao utilizar este serviço você automaticamente concorda com nossos{" "}
                    <Link to="/terms" className="text-amber-500 hover:underline">termos de uso</Link> e{" "}
                    <Link to="/privacy" className="text-amber-500 hover:underline">políticas de privacidade</Link>.
                </p>
            </div>

            {/* Coluna da Direita */}
            <div />
        </div>
    )
}
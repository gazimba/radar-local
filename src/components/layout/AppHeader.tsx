import { Link, useNavigate } from "react-router";
import { PesquisaCidadeHeader } from "../header/PesquisaCidadeHeader";
import { Plus } from "lucide-react";
import { Button } from "../ui/button/Button";

export function AppHeader() {
    const navigate = useNavigate();
    return (
        <div className="top-0 flex w-full bg-white border-gray-200 z-1 lg:border-b py-4">
            <div className="flex flex-row items-center justify-between grow px-6">
                <Link to="/">
                    <img src="/images/radar-logo2.png" alt="Radar Local" className="w-30" />
                </Link>
                <div className="lg:min-w-150">
                    <PesquisaCidadeHeader />
                </div>
                <Button className="flex gap-2 justify-center items-center" onClick={()=> navigate("/sugestao")}>
                    <Plus size={20} /> Sugerir local/evento
                </Button>
            </div>
        </div>
    )
}
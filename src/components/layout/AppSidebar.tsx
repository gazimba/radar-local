import { CircleChevronRight, LogOut } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button/Button";

export function AppSidebar() {
    function handleSignOut() {
        localStorage.removeItem("@radar-local:user");
        localStorage.removeItem("@radar-local:token");
        window.location.href = "/";
    }
    return (
        <aside className={`h-full bg-gray-800 text-white p-4 flex flex-col justify-between`}>
            <div className="">
                <Link to="/cadastrar-ponto-turistico" className="py-2 px-4 rounded hover:bg-gray-700 transition-colors flex">
                    <CircleChevronRight className="mr-2 text-amber-300" />
                    Cadastrar Ponto Turístico
                </Link>
                <Link to="/pontos-turisticos" className="flex py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    <CircleChevronRight className="mr-2 text-amber-300" />
                    Pontos Turísticos
                </Link>
                <Link to="/cadastrar-evento" className="flex py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    <CircleChevronRight className="mr-2 text-green-300" />
                    Cadastrar Evento
                </Link>
                <Link to="/eventos" className="flex py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    <CircleChevronRight className="mr-2 text-green-300" />
                    Eventos
                </Link>
                <Link to="/usuarios" className="flex py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    <CircleChevronRight className="mr-2 text-blue-300" />
                    Usuários
                </Link>
            </div>
            <div className="border-t border-gray-700 pt-4">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all" onClick={handleSignOut}>
                    <LogOut size={18} />
                    Sair
                </Button>
            </div>
        </aside>
    )
}
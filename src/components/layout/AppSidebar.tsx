import { Link } from "react-router";

export function AppSidebar() {
    return (
        <aside className={`h-full bg-gray-800 text-white p-4`}>          
            <div>
                <Link to="/admin" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    Dashboard
                </Link>
                <Link to="/admin/usuarios" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    Usuários
                </Link>
                <Link to="/admin/configuracoes" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                    Configurações
                </Link>
            </div>
        </aside>
    )
}
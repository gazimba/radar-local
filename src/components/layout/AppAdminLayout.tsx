import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { AppSidebar } from "./AppSidebar";

export function AppAdminLayout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="flex-none">
                <AppHeader />
            </header>
            <main className="flex flex-1 overflow-hidden">
                {/* w-20: Tamanho padrão encolhido (vai de celulares até telas md).
      hover:w-64: Expande quando você passa o mouse.
      lg:w-64: A partir de telas grandes, ela fica expandida o tempo todo.
    */}
                <aside className="h-full border-r bg-gray-900 transition-all duration-300 w-20 hover:w-64 lg:w-64 group overflow-hidden flex flex-col">
                    <AppSidebar />
                </aside>

                <div className="flex-1 w-full h-full overflow-y-auto bg-gray-50">
                    <Outlet />
                </div>
            </main>
            <footer className="flex-none">
                <AppFooter />
            </footer>
        </div>
    )
}
import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayoutAdmin() {
    return (
        <div>
            <header>
                <AppHeader />
            </header>
            <main className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                <Outlet />
            </main>
            <footer>
                <AppFooter />
            </footer>
        </div>
    )
}
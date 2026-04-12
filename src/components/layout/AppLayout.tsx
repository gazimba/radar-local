import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="flex-none">
                <AppHeader />
            </header>
            <main className=" overflow-hidden">
                <div className="w-full h-screen bg-gray-100 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
            <footer className="flex-none">
                <AppFooter />
            </footer>
        </div>
    )
}
import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <AppHeader />
            </header>
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <footer className="flex-none">
                <AppFooter />
            </footer>
        </div>
    )
}
import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="flex-none">
                <AppHeader />
            </header>
            <main className="h-screen w-full overflow-hidden"> 
                <div className="h-full w-full overflow-y-auto flex p-4">
                    <div className="w-full flex items-center justify-center">
                        <Outlet />
                    </div>
                </div>
            </main>
            <footer className="flex-none">
                <AppFooter />
            </footer>
        </div>
    )
}
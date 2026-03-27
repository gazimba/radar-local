import { Outlet } from "react-router";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout () {
    return (
        <div>
            <header>
                <AppHeader />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <AppFooter />
            </footer>
        </div>
    )
}
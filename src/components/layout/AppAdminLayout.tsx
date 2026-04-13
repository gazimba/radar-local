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
            <main className="grid grid-cols-6 flex-1 overflow-hidden">
                <div className="col-span-1 h-full border-r">
                    <AppSidebar />
                </div>
                <div className="col-span-5 w-full h-full overflow-y-auto">
                    <Outlet />
                </div>
            </main>
            <footer className="flex-none">
                <AppFooter />
            </footer>
        </div>
    )
}
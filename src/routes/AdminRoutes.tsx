import { Route, Routes } from "react-router";
import { NotFound } from "../pages/PublicPages/NotFound";
import { AppAdminLayout } from "../components/layout/AppAdminLayout";
import { Home } from "../pages/AdminPages/Home";

export function AdminRoutes() {
    return(
        <Routes>
            {/* Layout principal */}
            <Route element={<AppAdminLayout />}>
                <Route index element={<Home />} />
            </Route>
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
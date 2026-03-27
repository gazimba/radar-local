import { Route, Routes } from "react-router";
import { Home } from "../pages/PublicPages/Home";
import { NotFound } from "../pages/PublicPages/NotFound";
import { AppLayoutAdmin } from "../components/layout/AppLayoutAdmin";

export function AdminRoutes() {
    return(
        <Routes>
            {/* Layout principal */}
            <Route element={<AppLayoutAdmin />}>
                <Route index element={<Home />} />
            </Route>
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
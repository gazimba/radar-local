import { Route, Routes } from "react-router";
import { Home } from "../pages/PublicPages/Home";
import { NotFound } from "../pages/PublicPages/NotFound";

export function AdminRoutes() {
    return(
        <Routes>
            {/* Layout principal */}
            <Route path="/">
                <Route index element={<Home />} />
            </Route>
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
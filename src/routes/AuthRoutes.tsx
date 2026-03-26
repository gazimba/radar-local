import { Route, Routes } from "react-router";
import { Home } from "../pages/PublicPages/Home";
import { NotFound } from "../pages/PublicPages/NotFound";
import { PontoTuristico } from "../pages/PublicPages/PontoTuristico";

export function AuthRoutes() {
    return(
        <Routes>
            {/* Layout principal */}
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="/ponto-turistico" element={<PontoTuristico />} />
            </Route>
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
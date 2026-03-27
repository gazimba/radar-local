import { Route, Routes } from "react-router";
import { Home } from "../pages/PublicPages/Home";
import { NotFound } from "../pages/PublicPages/NotFound";
import { PontoTuristico } from "../pages/PublicPages/PontoTuristico";
import { PontoTuristicoDetalhes } from "../pages/PublicPages/PontoTuristicoDetalhes";
import { Evento } from "../pages/PublicPages/Evento";
import { EventoDetalhes } from "../pages/PublicPages/EventoDetalhes";
import { AppLayout } from "../components/layout/AppLayout";
import { Sugestao } from "../pages/PublicPages/Sugestao";
import { Login } from "../pages/PublicPages/Login";

export function AuthRoutes() {
    return(
        <Routes>
            {/* Layout principal */}
            <Route index element={<Home />} />
            <Route element={<AppLayout />}>
                <Route path="/ponto-turistico" element={<PontoTuristico />} />
                <Route path="/ponto-turistico/:id" element={<PontoTuristicoDetalhes />} />
                <Route path="/evento" element={<Evento />} />
                <Route path="/evento/:id" element={<EventoDetalhes />} />
                <Route path="/sugestao" element={<Sugestao />} />
                <Route path="/login" element={<Login />} />
            </Route>
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
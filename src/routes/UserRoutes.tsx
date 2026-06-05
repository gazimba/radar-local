import { Route, Routes } from "react-router";
import { Home } from "../pages/PublicPages/Home";
import { NotFound } from "../pages/PublicPages/NotFound";
import { PontoTuristico } from "../pages/PublicPages/PontoTuristico";
import { PontoTuristicoDetalhes } from "../pages/PublicPages/PontoTuristicoDetalhes";
import { Evento } from "../pages/PublicPages/Evento";
import { EventoDetalhes } from "../pages/PublicPages/EventoDetalhes";
import { AppLayout } from "../components/layout/AppLayout";
import { Sugestao } from "../pages/PublicPages/Sugestao";
import { MinhaConta } from "../pages/PublicPages/MinhaConta";
import { BuscaResultados } from "../pages/PublicPages/BuscaResultados";
import { HotelPousada } from "../pages/PublicPages/HotelPousada";
import { BarRestaurante } from "../pages/PublicPages/BarRestaurante";

export function UserRoutes() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route element={<AppLayout />}>
                <Route path="/ponto-turistico" element={<PontoTuristico />} />
                <Route path="/ponto-turistico/:id" element={<PontoTuristicoDetalhes />} />
                <Route path="/evento" element={<Evento />} />
                <Route path="/evento/:id" element={<EventoDetalhes />} />
                <Route path="/hotel-pousada" element={<HotelPousada />} />
                <Route path="/hotel-pousada/:id" element={<PontoTuristicoDetalhes />} />
                <Route path="/bar-restaurante" element={<BarRestaurante />} />
                <Route path="/bar-restaurante/:id" element={<PontoTuristicoDetalhes />} />
                <Route path="/sugestao" element={<Sugestao />} />
                <Route path="/minha-conta" element={<MinhaConta />} />
                <Route path="/busca" element={<BuscaResultados />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

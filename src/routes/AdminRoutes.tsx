import { Navigate, Route, Routes } from "react-router";
import { NotFound } from "../pages/PublicPages/NotFound";
import { AppAdminLayout } from "../components/layout/AppAdminLayout";
import { AppLayout } from "../components/layout/AppLayout";
import { Home } from "../pages/AdminPages/Home";
import { CadastroPontoTuristico } from "../pages/AdminPages/CadastroPontoTuristico";
import { PontoTuristico } from "../pages/AdminPages/PontoTuristico";
import { CadastroEvento } from "../pages/AdminPages/CadastroEvento";
import { Evento } from "../pages/AdminPages/Evento";
import { Usuario } from "../pages/AdminPages/Usuario";
import { Sugestoes } from "../pages/AdminPages/Sugestoes";
import { CadastroUsuario } from "../pages/AdminPages/CadastroUsuario";
import { Cidades } from "../pages/AdminPages/Cidades";
import { CadastroCidade } from "../pages/AdminPages/CadastroCidade";
import { Logs } from "../pages/AdminPages/Logs";
import { Comentarios } from "../pages/AdminPages/Comentarios";
import { GerenciarLinksPage } from "../pages/AdminPages/GerenciarLinksPage";
import { GerenciarLinksCidade } from "../pages/AdminPages/GerenciarLinksCidade";
import { HotelPousadaAdmin } from "../pages/AdminPages/HotelPousadaAdmin";
import { BarRestauranteAdmin } from "../pages/AdminPages/BarRestauranteAdmin";
import { MinhaConta } from "../pages/PublicPages/MinhaConta";

function getCargo(): string | null {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        return raw ? JSON.parse(raw)?.cargo ?? null : null;
    } catch {
        return null;
    }
}

export function AdminRoutes() {
    const cargo = getCargo();
    const isAdmin = cargo === "ADMINISTRADOR";
    const isModerador = cargo === "MODERADOR";

    return (
        <Routes>
            <Route element={<AppAdminLayout />}>
                <Route index element={<Home />} />
                <Route path="sugestoes" element={<Sugestoes />} />
                <Route path="comentarios" element={<Comentarios />} />
                <Route path="links" element={<GerenciarLinksPage />} />
                <Route path="links-cidade" element={<GerenciarLinksCidade />} />
                <Route path="pontos-turisticos" element={<PontoTuristico />} />
                <Route path="editar-ponto-turistico/:id" element={<CadastroPontoTuristico />} />
                <Route path="hoteis-pousadas" element={<HotelPousadaAdmin />} />
                <Route path="bares-restaurantes" element={<BarRestauranteAdmin />} />
                <Route path="cadastrar-hotel-pousada" element={isAdmin || isModerador ? <CadastroPontoTuristico categoriaFixa="HOTEL_POUSADA" /> : <Navigate to="/" />} />
                <Route path="cadastrar-bar-restaurante" element={isAdmin || isModerador ? <CadastroPontoTuristico categoriaFixa="BAR_RESTAURANTE" /> : <Navigate to="/" />} />
                <Route path="eventos" element={<Evento />} />
                <Route path="editar-evento/:id" element={<CadastroEvento />} />
                <Route path="cadastrar-ponto-turistico" element={isAdmin || isModerador ? <CadastroPontoTuristico /> : <Navigate to="/" />} />
                <Route path="cadastrar-evento" element={isAdmin || isModerador ? <CadastroEvento /> : <Navigate to="/" />} />
                <Route path="usuarios" element={isAdmin ? <Usuario /> : <Navigate to="/" />} />
                <Route path="cadastrar-usuario" element={isAdmin ? <CadastroUsuario /> : <Navigate to="/" />} />
                <Route path="cidades" element={isAdmin ? <Cidades /> : <Navigate to="/" />} />
                <Route path="cadastrar-cidade" element={isAdmin ? <CadastroCidade /> : <Navigate to="/" />} />
                <Route path="logs" element={isAdmin ? <Logs /> : <Navigate to="/" />} />
            </Route>
            {/* Rotas com layout público (header + footer) */}
            <Route element={<AppLayout />}>
                <Route path="minha-conta" element={<MinhaConta />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
import { Route, Routes } from "react-router";
import { NotFound } from "../pages/PublicPages/NotFound";
import { AppAdminLayout } from "../components/layout/AppAdminLayout";
import { Home } from "../pages/AdminPages/Home";
import { CadastroPontoTuristico } from "../pages/AdminPages/CadastroPontoTuristico";
import { PontoTuristico } from "../pages/AdminPages/PontoTuristico";
import { CadastroEvento } from "../pages/AdminPages/CadastroEvento";
import { Evento } from "../pages/AdminPages/Evento";
import { Usuario } from "../pages/AdminPages/Usuario";
import { Sugestoes } from "../pages/AdminPages/Sugestoes";

export function AdminRoutes() {
    return (
        <Routes>
            {/* Layout principal */}
            <Route element={<AppAdminLayout />}>
                <Route index element={<Home />} />
                <Route path="sugestoes" element={<Sugestoes />} />
                <Route path="cadastrar-ponto-turistico" element={<CadastroPontoTuristico />} />
                <Route path="pontos-turisticos" element={<PontoTuristico />} />
                <Route path="cadastrar-evento" element={<CadastroEvento />} />
                <Route path="eventos" element={<Evento />} />
                <Route path="usuarios" element={<Usuario />} />
            </Route>
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
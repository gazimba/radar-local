import { BrowserRouter } from "react-router";
import { AdminRoutes } from "./AdminRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./UserRoutes";

type Cargo = "COMUM" | "ADMINISTRADOR" | "MODERADOR";

function getCargoUsuario(): Cargo | null {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        if (!raw) return null;
        const user = JSON.parse(raw);
        return user?.cargo ?? null;
    } catch {
        return null;
    }
}

export function Routes() {
    const cargo = getCargoUsuario();

    return (
        <BrowserRouter basename="/">
            {cargo === "ADMINISTRADOR" || cargo === "MODERADOR" ? (
                <AdminRoutes />
            ) : cargo === "COMUM" ? (
                <UserRoutes />
            ) : (
                <AuthRoutes />
            )}
        </BrowserRouter>
    );
}
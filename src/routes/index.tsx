import { BrowserRouter } from "react-router";
import { AdminRoutes } from "./AdminRoutes";
import { AuthRoutes } from "./AuthRoutes";

export function Routes() {
    const user = localStorage.getItem("@radar-local:user");
    return (
        <BrowserRouter basename="/">
            {user ? <AdminRoutes /> : <AuthRoutes />}
        </BrowserRouter>
    );
}
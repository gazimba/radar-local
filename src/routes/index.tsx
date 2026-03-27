import { BrowserRouter } from "react-router"; 
import { AdminRoutes } from "./AdminRoutes";
import { AuthRoutes } from "./AuthRoutes";

export function Routes() {
    var session = true

    function Route() {
        if (session == true) {
                return <AdminRoutes />;
        }
        return <AuthRoutes />
    }
    
    return (
        <BrowserRouter>
            <Route />
        </BrowserRouter>
    )
}
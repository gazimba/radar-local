import { GoogleLogin } from "@react-oauth/google";
import { api } from "../../services/api";

interface BotaoGoogleProps {
    onSucesso: (user: any, token: string) => void;
    onVincular: (dados: { email: string; googleId: string; foto?: string }) => void;
    onErro: (mensagem: string) => void;
}

export function BotaoGoogle({ onSucesso, onVincular, onErro }: BotaoGoogleProps) {
    async function handleCredential(credential: string) {
        try {
            const res = await api.post("/api/sessions/google", { credential });
            onSucesso(res.data.user, res.data.token);
        } catch (err: any) {
            if (err.response?.status === 409) {
                onVincular({
                    email: err.response.data.email,
                    googleId: err.response.data.googleId,
                    foto: err.response.data.foto,
                });
            } else {
                onErro(err.response?.data?.message || "Erro ao autenticar com Google.");
            }
        }
    }

    return (
        <GoogleLogin
            onSuccess={(res) => {
                if (res.credential) handleCredential(res.credential);
            }}
            onError={() => onErro("Falha ao autenticar com Google.")}
            width="100%"
            text="continue_with"
            shape="rectangular"
            logo_alignment="left"
        />
    );
}

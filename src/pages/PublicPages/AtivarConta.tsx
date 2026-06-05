import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../../services/api";

type Status = "carregando" | "sucesso" | "erro";

export function AtivarConta() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<Status>("carregando");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("erro");
            setMensagem("Token de ativação não encontrado na URL.");
            return;
        }

        api.get(`/api/ativar?token=${token}`)
            .then((res) => {
                setStatus("sucesso");
                setMensagem(res.data.message);
            })
            .catch((err) => {
                setStatus("erro");
                setMensagem(err.response?.data?.message || "Erro ao ativar conta. O link pode ter expirado.");
            });
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 p-8 m-8 bg-white rounded-3xl shadow-md max-w-md w-full border border-gray-100">
                {status === "carregando" && (
                    <>
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-600">Ativando sua conta...</p>
                    </>
                )}

                {status === "sucesso" && (
                    <>
                        <div className="text-5xl">✅</div>
                        <h1 className="text-2xl font-bold text-blue-800 text-center">Conta ativada!</h1>
                        <p className="text-gray-600 text-center">{mensagem}</p>
                        <Link
                            to="/login"
                            className="mt-2 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors"
                        >
                            Ir para o login
                        </Link>
                    </>
                )}

                {status === "erro" && (
                    <>
                        <div className="text-5xl">❌</div>
                        <h1 className="text-2xl font-bold text-red-700 text-center">Erro na ativação</h1>
                        <p className="text-gray-600 text-center">{mensagem}</p>
                        <Link
                            to="/cadastro"
                            className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Tentar cadastro novamente
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

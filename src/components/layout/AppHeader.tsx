import { Link, useLocation, useNavigate } from "react-router";
import { PesquisaCidadeHeader } from "../header/PesquisaCidadeHeader";
import { BuscaGlobal } from "../header/BuscaGlobal";
import { BedDouble, Calendar, ChevronDown, KeyRound, LogIn, LogOut, MapPin, Plus, UserCircle, UtensilsCrossed } from "lucide-react";
import { Button } from "../ui/button/Button";
import { useEffect, useRef, useState } from "react";

function getUserData(): { nome: string; foto?: string; cargo?: string } | null {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        if (!raw) return null;
        const user = JSON.parse(raw);
        if (!user?.nome) return null;
        return { nome: user.nome.split(" ")[0], foto: user.foto, cargo: user.cargo };
    } catch {
        return null;
    }
}

const NAV_LINKS = [
    { to: "/ponto-turistico", label: "Pontos Turísticos",  icon: MapPin,          cor: "border-blue-600 text-blue-700" },
    { to: "/hotel-pousada",   label: "Hotéis e Pousadas",  icon: BedDouble,       cor: "border-indigo-600 text-indigo-700" },
    { to: "/bar-restaurante", label: "Bares e Restaurantes", icon: UtensilsCrossed, cor: "border-emerald-600 text-emerald-700" },
    { to: "/evento",          label: "Eventos",             icon: Calendar,        cor: "border-amber-500 text-amber-700" },
];

export function AppHeader() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const token = localStorage.getItem("@radar-local:token");
    const userData = getUserData();
    const primeiroNome = userData?.nome ?? null;
    const fotoUsuario = userData?.foto ?? null;
    const isLogged = !!token && !!primeiroNome;
    const isPrivilegiado = userData?.cargo === "ADMINISTRADOR" || userData?.cargo === "MODERADOR";

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickFora(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    function handleSair() {
        localStorage.removeItem("@radar-local:user");
        localStorage.removeItem("@radar-local:token");
        window.location.href = "/";
    }

    return (
        <div className="top-0 flex flex-col w-full bg-white border-gray-200 z-1 lg:border-b">
            <div className="flex flex-row items-center justify-between grow px-6 py-4">
                <Link to="/">
                    <img src="/images/radar-logo2.png" alt="Radar Local" className="w-30" />
                </Link>
                {!isPrivilegiado && (
                    <div className="flex items-center gap-3 lg:min-w-150">
                        <BuscaGlobal />
                        <PesquisaCidadeHeader />
                    </div>
                )}
                <div className="flex gap-2 items-center">
                    {isLogged && !isPrivilegiado && (
                        <Button
                            className="flex gap-2 justify-center items-center"
                            onClick={() => navigate("/sugestao")}
                        >
                            <Plus size={20} /> Sugerir local/evento
                        </Button>
                    )}
                    {!isLogged && (
                        <>
                            <Button
                                className="flex gap-2 justify-center items-center"
                                onClick={() => navigate("/login")}
                                variant="form"
                            >
                                <LogIn size={20} />
                                Login
                            </Button>
                            <Button
                                className="flex gap-2 justify-center items-center"
                                onClick={() => navigate("/cadastro")}
                            >
                                Cadastre-se
                            </Button>
                        </>
                    )}

                    {isLogged && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownAberto((v) => !v)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-blue-800 font-semibold"
                            >
                                {fotoUsuario
                                ? <img src={fotoUsuario} alt={primeiroNome ?? ""} className="w-7 h-7 rounded-full object-cover border border-blue-200" />
                                : <UserCircle size={22} className="text-blue-600" />
                            }
                                <span>{primeiroNome}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform duration-200 ${dropdownAberto ? "rotate-180" : ""}`}
                                />
                            </button>

                            {dropdownAberto && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    <button
                                        onClick={() => { setDropdownAberto(false); navigate("/minha-conta"); }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <KeyRound size={16} className="text-blue-600" />
                                        Minha conta
                                    </button>
                                    <div className="border-t border-gray-100" />
                                    <button
                                        onClick={handleSair}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Barra de navegação por categoria — oculta para admin/moderador */}
            {!isPrivilegiado && (
                <nav className="border-t border-gray-100 overflow-x-auto">
                    <div className="flex px-6 gap-1">
                        {NAV_LINKS.map(({ to, label, icon: Icon, cor }) => {
                            const ativo = pathname === to || pathname.startsWith(to + "/");
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                        ativo
                                            ? cor
                                            : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                                    }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
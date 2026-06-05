import { useState } from "react";
import {
    Calendar, ChevronDown, Home, MapPin, Settings, Lightbulb, MessageSquare, Link2, BedDouble, UtensilsCrossed,
} from "lucide-react";
import { Link, useLocation } from "react-router";

function getCargo(): string | null {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        return raw ? JSON.parse(raw)?.cargo ?? null : null;
    } catch { return null; }
}

function getUser() {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
        >
            <span className="shrink-0">{icon}</span>
            <span className="truncate lg:inline hidden group-hover:inline whitespace-nowrap">{label}</span>
        </Link>
    );
}

interface DropdownGroupProps {
    icon: React.ReactNode;
    label: string;
    color: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function DropdownGroup({ icon, label, color, children, defaultOpen = false }: DropdownGroupProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div>
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
                <span className={`shrink-0 ${color}`}>{icon}</span>
                <span className="flex-1 text-left truncate lg:inline hidden group-hover:inline whitespace-nowrap">{label}</span>
                <ChevronDown
                    size={14}
                    className={`shrink-0 transition-transform duration-200 lg:inline hidden group-hover:inline ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="mt-1 ml-4 pl-3 border-l border-gray-700 flex flex-col gap-0.5">
                    {children}
                </div>
            )}
        </div>
    );
}

function SubItem({ to, label, active }: { to: string; label: string; active: boolean }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                active
                    ? "text-white bg-gray-700 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
        >
            <span className="lg:inline hidden group-hover:inline whitespace-nowrap">{label}</span>
        </Link>
    );
}

export function AppSidebar() {
    const cargo = getCargo();
    const user = getUser();
    const isAdmin = cargo === "ADMINISTRADOR";
    const podeGerenciar = isAdmin || cargo === "MODERADOR";
    const { pathname } = useLocation();

    return (
        <aside className="h-full flex flex-col justify-between py-4 px-3 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-1">
                {/* Dashboard */}
                <NavItem to="/" icon={<Home size={17} />} label="Dashboard" active={pathname === "/"} />

                {/* Sugestões */}
                <NavItem
                    to="/sugestoes"
                    icon={<Lightbulb size={17} className="text-purple-400" />}
                    label="Sugestões"
                    active={pathname.startsWith("/sugestoes")}
                />

                {/* Comentários */}
                <NavItem
                    to="/comentarios"
                    icon={<MessageSquare size={17} className="text-pink-400" />}
                    label="Comentários"
                    active={pathname.startsWith("/comentarios")}
                />

                {/* Links Úteis da Cidade */}
                <NavItem
                    to="/links-cidade"
                    icon={<Link2 size={17} className="text-cyan-400" />}
                    label="Links da Cidade"
                    active={pathname === "/links-cidade"}
                />

                <div className="my-2 border-t border-gray-700" />

                {/* Pontos Turísticos */}
                <DropdownGroup
                    icon={<MapPin size={17} />}
                    label="Pontos Turísticos"
                    color="text-amber-400"
                    defaultOpen={pathname.includes("ponto")}
                >
                    <SubItem to="/pontos-turisticos" label="Listar pontos" active={pathname === "/pontos-turisticos"} />
                    {podeGerenciar && (
                        <SubItem to="/cadastrar-ponto-turistico" label="Cadastrar novo" active={pathname === "/cadastrar-ponto-turistico"} />
                    )}
                </DropdownGroup>

                {/* Hotéis e Pousadas */}
                <DropdownGroup
                    icon={<BedDouble size={17} />}
                    label="Hotéis e Pousadas"
                    color="text-indigo-400"
                    defaultOpen={pathname.includes("hotel")}
                >
                    <SubItem to="/hoteis-pousadas" label="Listar" active={pathname === "/hoteis-pousadas"} />
                    {podeGerenciar && (
                        <SubItem to="/cadastrar-hotel-pousada" label="Cadastrar novo" active={pathname === "/cadastrar-hotel-pousada"} />
                    )}
                </DropdownGroup>

                {/* Bares e Restaurantes */}
                <DropdownGroup
                    icon={<UtensilsCrossed size={17} />}
                    label="Bares e Restaurantes"
                    color="text-emerald-400"
                    defaultOpen={pathname.includes("bar")}
                >
                    <SubItem to="/bares-restaurantes" label="Listar" active={pathname === "/bares-restaurantes"} />
                    {podeGerenciar && (
                        <SubItem to="/cadastrar-bar-restaurante" label="Cadastrar novo" active={pathname === "/cadastrar-bar-restaurante"} />
                    )}
                </DropdownGroup>

                {/* Eventos */}
                <DropdownGroup
                    icon={<Calendar size={17} />}
                    label="Eventos"
                    color="text-green-400"
                    defaultOpen={pathname.includes("evento")}
                >
                    <SubItem to="/eventos" label="Listar eventos" active={pathname === "/eventos"} />
                    {podeGerenciar && (
                        <SubItem to="/cadastrar-evento" label="Cadastrar novo" active={pathname === "/cadastrar-evento"} />
                    )}
                </DropdownGroup>

                {/* Administrador */}
                {isAdmin && (
                    <>
                        <div className="my-2 border-t border-gray-700" />
                        <DropdownGroup
                            icon={<Settings size={17} />}
                            label="Administrador"
                            color="text-blue-400"
                            defaultOpen={
                                pathname.startsWith("/usuarios") ||
                                pathname.startsWith("/cidades") ||
                                pathname.startsWith("/logs")
                            }
                        >
                            <SubItem
                                to="/usuarios"
                                label="Usuários"
                                active={pathname.startsWith("/usuarios") || pathname.startsWith("/cadastrar-usuario")}
                            />
                            <SubItem
                                to="/cidades"
                                label="Cidades"
                                active={pathname.startsWith("/cidades") || pathname.startsWith("/cadastrar-cidade")}
                            />
                            <SubItem
                                to="/logs"
                                label="Logs de ações"
                                active={pathname.startsWith("/logs")}
                            />
                        </DropdownGroup>
                    </>
                )}
            </div>

            {/* Rodapé: perfil + sair */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
                <Link
                    to="/minha-conta"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    {user?.foto
                        ? <img src={user.foto} alt={user.nome} className="w-7 h-7 rounded-full object-cover border border-gray-500 shrink-0" />
                        : <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {user?.nome?.[0]?.toUpperCase()}
                          </div>
                    }
                    <div className="flex flex-col min-w-0 lg:flex hidden group-hover:flex">
                        <span className="text-white text-xs font-semibold truncate">{user?.nome}</span>
                        <span className="text-gray-400 text-xs truncate capitalize">{cargo?.toLowerCase()}</span>
                    </div>
                </Link>

            </div>
        </aside>
    );
}

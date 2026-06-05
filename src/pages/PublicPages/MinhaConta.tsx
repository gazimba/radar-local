import { useRef, useState } from "react";
import { Camera, Eye, EyeOff, KeyRound, Mail, ShieldCheck, UserCircle } from "lucide-react";
import { api } from "../../services/api";
import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";
import { useToast } from "../../context/ToastContext";

function getUser() {
    try {
        const raw = localStorage.getItem("@radar-local:user");
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

const CARGO_LABEL: Record<string, { label: string; cor: string }> = {
    COMUM: { label: "Usuário", cor: "bg-gray-100 text-gray-600" },
    MODERADOR: { label: "Moderador", cor: "bg-blue-100 text-blue-700" },
    ADMINISTRADOR: { label: "Administrador", cor: "bg-orange-100 text-orange-700" },
};

export function MinhaConta() {
    const [user, setUser] = useState(getUser());
    const [nome, setNome] = useState(user?.nome || "");
    const [salvandoNome, setSalvandoNome] = useState(false);
    const [uploadandoFoto, setUploadandoFoto] = useState(false);

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [msgSenha, setMsgSenha] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const fotoInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const temSenha = Boolean(user?.senha || !user?.googleId);
    const cargo = user?.cargo ?? "COMUM";
    const cargoInfo = CARGO_LABEL[cargo] ?? CARGO_LABEL.COMUM;

    function persistirUser(atualizado: any) {
        setUser(atualizado);
        localStorage.setItem("@radar-local:user", JSON.stringify(atualizado));
    }

    async function salvarNome() {
        if (!nome.trim() || nome === user?.nome) return;
        setSalvandoNome(true);
        try {
            const res = await api.patch("/api/usuarios/perfil", { nome });
            persistirUser({ ...user, nome: res.data.user.nome });
            toast.success("Nome atualizado!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erro ao salvar nome.");
        } finally {
            setSalvandoNome(false);
        }
    }

    async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        const FORMATOS = ["image/jpeg", "image/png", "image/webp"];
        if (!FORMATOS.includes(arquivo.type)) { toast.error("Formato inválido. Use JPEG, PNG ou WebP."); return; }
        if (arquivo.size > 3 * 1024 * 1024) { toast.error("A foto deve ter no máximo 3MB."); return; }
        setUploadandoFoto(true);
        try {
            const formData = new FormData();
            formData.append("foto", arquivo);
            const res = await api.post("/api/usuarios/foto", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            persistirUser({ ...user, foto: res.data.user.foto });
            toast.success("Foto atualizada!");
        } catch {
            toast.error("Erro ao enviar foto.");
        } finally {
            setUploadandoFoto(false);
            if (fotoInputRef.current) fotoInputRef.current.value = "";
        }
    }

    async function alterarSenha() {
        if (novaSenha !== confirmarSenha) { setMsgSenha({ texto: "As senhas não coincidem.", tipo: "error" }); return; }
        if (novaSenha.length < 8) { setMsgSenha({ texto: "Mínimo 8 caracteres.", tipo: "error" }); return; }
        setSalvandoSenha(true);
        setMsgSenha(null);
        try {
            await api.patch("/api/usuarios/alterar-senha", { senhaAtual, novaSenha });
            setMsgSenha({ texto: "Senha alterada com sucesso!", tipo: "success" });
            setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("");
        } catch (err: any) {
            setMsgSenha({ texto: err.response?.data?.message || "Erro ao alterar senha.", tipo: "error" });
        } finally {
            setSalvandoSenha(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-10 flex flex-col gap-6">

            {/* Cabeçalho */}
            <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Minha Conta</h1>

            {/* Grid principal: coluna esquerda + coluna direita */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start align-start">

                {/* Coluna esquerda — perfil (2/5) */}
                <div className="lg:col-span-2 flex flex-col gap-4">

                    {/* Card identidade */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-blue-700 to-blue-500" />
                        <div className="px-5 pb-5">
                            <div className="flex items-end justify-between -mt-9 mb-3">
                                <div className="relative group">
                                    {user?.foto
                                        ? <img src={user.foto} alt={user.nome} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow" />
                                        : <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow flex items-center justify-center text-blue-700 text-xl font-bold">
                                            {user?.nome?.[0]?.toUpperCase()}
                                          </div>
                                    }
                                    <button
                                        type="button"
                                        onClick={() => fotoInputRef.current?.click()}
                                        disabled={uploadandoFoto}
                                        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity disabled:cursor-wait"
                                        title="Alterar foto"
                                    >
                                        {uploadandoFoto
                                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <Camera size={16} className="text-white" />
                                        }
                                    </button>
                                    <input ref={fotoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFotoChange} />
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cargoInfo.cor}`}>
                                    {cargoInfo.label}
                                </span>
                            </div>

                            <h2 className="text-base font-bold text-gray-800 leading-tight">{user?.nome}</h2>
                            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                                <Mail size={12} />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            {user?.googleId && (
                                <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-2">
                                    <ShieldCheck size={12} />
                                    Conta Google vinculada
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card editar nome */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                            <UserCircle size={14} className="text-blue-500" />
                            Informações pessoais
                        </h3>
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-1.5">Nome completo</label>
                            <div className="flex gap-2">
                                <Input
                                    variant="form"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    placeholder="Seu nome completo"
                                />
                                <Button
                                    variant="form"
                                    onClick={salvarNome}
                                    disabled={salvandoNome || nome === user?.nome || !nome.trim()}
                                    className="whitespace-nowrap"
                                >
                                    {salvandoNome ? "..." : "Salvar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna direita — segurança (3/5) */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    {temSenha ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <KeyRound size={14} className="text-blue-500" />
                                Alterar senha
                            </h3>

                            <div>
                                <label className="block text-gray-600 text-sm font-semibold mb-1.5">Senha atual</label>
                                <div className="relative">
                                    <Input
                                        variant="form"
                                        type={mostrarSenhaAtual ? "text" : "password"}
                                        value={senhaAtual}
                                        onChange={e => setSenhaAtual(e.target.value)}
                                        placeholder="Sua senha atual"
                                        className="pr-10"
                                    />
                                    <button type="button" onClick={() => setMostrarSenhaAtual(v => !v)} tabIndex={-1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {mostrarSenhaAtual ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1.5">Nova senha</label>
                                    <div className="relative">
                                        <Input
                                            variant="form"
                                            type={mostrarNovaSenha ? "text" : "password"}
                                            value={novaSenha}
                                            onChange={e => setNovaSenha(e.target.value)}
                                            placeholder="Mín. 8 caracteres"
                                            className="pr-10"
                                        />
                                        <button type="button" onClick={() => setMostrarNovaSenha(v => !v)} tabIndex={-1}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {mostrarNovaSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1.5">Confirmar senha</label>
                                    <div className="relative">
                                        <Input
                                            variant="form"
                                            type={mostrarConfirmar ? "text" : "password"}
                                            value={confirmarSenha}
                                            onChange={e => setConfirmarSenha(e.target.value)}
                                            placeholder="Repita a nova senha"
                                            className="pr-10"
                                        />
                                        <button type="button" onClick={() => setMostrarConfirmar(v => !v)} tabIndex={-1}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {mostrarConfirmar ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {msgSenha && (
                                <p className={`text-sm px-3 py-2 rounded-lg ${msgSenha.tipo === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                    {msgSenha.texto}
                                </p>
                            )}

                            <Button variant="default" onClick={alterarSenha} disabled={salvandoSenha} className="w-full font-semibold uppercase tracking-wide">
                                {salvandoSenha ? "Salvando..." : "Alterar senha"}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-3 text-center min-h-40">
                            <ShieldCheck size={32} className="text-blue-300" />
                            <p className="text-sm text-gray-400">
                                Sua conta usa autenticação via Google.<br />
                                Não é necessário definir uma senha.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

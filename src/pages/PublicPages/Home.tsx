import { InputField } from "../../components/form/input/InputField";

export function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full h-screen" style={{ backgroundImage: "url('/images/background-elipse.svg')" }}>
            <img src="/images/radar-local-logo.svg" alt="Logo do sistema radar local" />
            <InputField />
            <p>
                Ao utilizar este serviço você automaticamente concorda
                com nossos <a href="/terms" className="text-amber-500 hover:underline">termos de uso</a> e <a href="/privacy" className="text-amber-500 hover:underline">políticas de privacidade</a>.
            </p>
        </div>
    )
}
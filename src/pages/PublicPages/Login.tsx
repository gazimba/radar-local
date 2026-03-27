import { Input } from "../../components/form/input/InputField";
import { Button } from "../../components/ui/button/Button";

export function Login(){
    return (
        <div className="flex flex-col items-center gap-2 p-8 m-8 bg-white rounded-md shadow-md">
            <h1 className="text-3xl font-bold text-center pb-6">Login</h1>
            <form className=" flex flex-col gap-4 w-100">
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <Input variant="form" type="email" id="email" placeholder="Digite seu email" />
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Senha
                    </label>
                    <Input variant="form" type="password" id="password" placeholder="Digite sua senha" />
                </div>
                <Button variant="form" type="submit" className="w-full">
                    Entrar
                </Button>
            </form>
        </div>
    )
}
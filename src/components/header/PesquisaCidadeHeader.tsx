import { ArrowLeft, Search } from "lucide-react";
import { Input } from "../form/input/InputField";
import { Button } from "../ui/button/Button";
import { Link } from "react-router";

export function PesquisaCidadeHeader() {
    return (
        <div className="grid grid-cols-12 my-6 justify-center items-center">
            <div className="col-span-1" />
            <div className="col-span-10 mb-4">
                <Link to={"/"} className="text-sm font-medium text-gray-400 flex uppercase items-center gap-2">
                    <ArrowLeft /> voltar
                </Link>
            </div>
            <div className="col-span-1" />
            <div className="col-span-1" />
            <div className="col-span-10 flex flex-row gap-2">
                <Input value={"Congonhas - Minas Gerais"} />
                <Button>
                    <Search size={30} />
                </Button>
            </div>
            <div className="col-span-1" />
        </div>
    )
}
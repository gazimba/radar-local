import { Search } from "lucide-react";
import { Input } from "../form/input/InputField";
import { Button } from "../ui/button/Button";

export function PesquisaCidadeHeader() {
    return (
        <div className="flex flex-row gap-2">
            <Input value={"Congonhas - Minas Gerais"} />
            <Button>
                <Search size={30} />
            </Button>
        </div>
    )
}
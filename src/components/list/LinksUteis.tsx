import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { api } from "../../services/api";

interface LinkCidade {
    id: number;
    titulo: string;
    url: string;
}

interface Props {
    cidadeSlug: string;
}

export function LinksUteis({ cidadeSlug }: Props) {
    const [links, setLinks] = useState<LinkCidade[]>([]);

    useEffect(() => {
        if (!cidadeSlug) return;
        api.get(`/api/links-cidade/${cidadeSlug}`)
            .then(res => setLinks(res.data))
            .catch(() => setLinks([]));
    }, [cidadeSlug]);

    if (links.length === 0) return (
        <p className="text-sm text-gray-400 italic">Nenhum link cadastrado.</p>
    );

    return (
        <ul className="flex flex-col gap-2">
            {links.map(link => (
                <li key={link.id}>
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                    >
                        <ExternalLink size={13} className="shrink-0" />
                        {link.titulo}
                    </a>
                </li>
            ))}
        </ul>
    );
}

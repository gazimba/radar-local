import { Navigation } from "lucide-react";

interface MapProps {
    lat: number;
    lon: number;
    nome?: string;
}

export function LocalizacaoMap({ lat, lon, nome }: MapProps) {
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
    const direcaoUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <iframe
                    title={nome ? `Localização de ${nome}` : "Localização no Mapa"}
                    src={mapUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
            <a
                href={direcaoUrl}
                target="_blank"
                rel="noreferrer"
                className="self-start flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
                <Navigation size={15} />
                Como chegar
            </a>
        </div>
    );
}

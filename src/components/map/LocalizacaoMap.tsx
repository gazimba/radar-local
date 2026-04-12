interface MapProps {
    lat: number;
    lon: number;
}

export function LocalizacaoMap({ lat, lon }: MapProps) {
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

    return (
        <div className="w-full h-full mt-6 rounded-2xl overflow-hidden shadow-inner">
            <iframe
                title="Localização no Mapa"
                src={mapUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
            />
        </div>
    );
}
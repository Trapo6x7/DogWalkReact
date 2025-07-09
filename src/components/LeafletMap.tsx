
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500); // délai augmenté pour laisser la modale s'afficher
  }, [map]);
  return null;
}
export default function LeafletMap({ coordinates }: { coordinates: [number, number] | null }) {
  const isMobile = window.innerWidth <= 600;
  if (!coordinates || coordinates.length !== 2 || coordinates.some(isNaN)) {
    return <span className="text-[0.9rem] text-secondary-brown" role="alert" aria-live="polite">Coordonnées invalides</span>;
  }
  return (
    <section
      role="region"
      aria-label={`Carte interactive centrée sur les coordonnées ${coordinates[0]}, ${coordinates[1]}`}
      tabIndex={0}
      className={`w-full ${isMobile ? 'h-[200px]' : 'h-[300px]'} rounded-lg overflow-hidden`}
      style={{ width: '100%' }}
    >
      <article aria-label="Carte Leaflet interactive" className="w-full h-full">
        <MapContainer
          key={coordinates ? coordinates.join(',') : 'empty'}
          center={coordinates}
          zoom={13}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <InvalidateMapSize />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CartoDB"
          />
          <Marker position={coordinates} />
        </MapContainer>
      </article>
    </section>
  );
}


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
    return <span className="text-[0.9rem] text-secondary-brown">Coordonnées invalides</span>;
  }
  return (
    <MapContainer
      key={coordinates ? coordinates.join(',') : 'empty'}
      center={coordinates}
      zoom={13}
      className={`w-full ${isMobile ? 'h-[200px]' : 'h-[300px]'} rounded-lg overflow-hidden`}
      style={{ width: '100%' }}
    >
      <InvalidateMapSize />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CartoDB"
      />
      <Marker position={coordinates} />
    </MapContainer>
  );
}

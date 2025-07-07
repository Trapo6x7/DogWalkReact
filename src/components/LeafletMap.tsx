
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
    return <span style={{ color: '#7B4E2E', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>Coordonnées invalides</span>;
  }
  return (
    <MapContainer
      key={coordinates ? coordinates.join(',') : 'empty'}
      center={coordinates}
      zoom={13}
      style={{ width: '100%', height: isMobile ? 200 : 300, borderRadius: 8, overflow: 'hidden' }}
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

import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

interface LeafletMapProps {
  coordinates: [number, number] | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ coordinates }) => {
  if (!coordinates || coordinates.length !== 2 || coordinates.some((coord) => isNaN(coord))) {
    return <p style={{ fontSize: '0.875rem', color: 'var(--secondary-brown)' }}>Coordonnées invalides ou géolocalisation indisponible.</p>;
  }

  return (
    <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <MapContainer
        center={coordinates}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={coordinates} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

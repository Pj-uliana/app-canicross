"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Position {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

interface LeafletMapProps {
  currentPosition: Position | null;
  trail: Position[];
}

function MapUpdater({ currentPosition }: { currentPosition: Position | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (currentPosition) {
      map.setView([currentPosition.lat, currentPosition.lng], 15);
    }
  }, [currentPosition, map]);
  
  return null;
}

export default function LeafletMap({ currentPosition, trail }: LeafletMapProps) {
  const defaultCenter: [number, number] = currentPosition 
    ? [currentPosition.lat, currentPosition.lng]
    : [-23.5505, -46.6333]; // São Paulo default

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {currentPosition && (
        <>
          <Marker position={[currentPosition.lat, currentPosition.lng]} />
          <MapUpdater currentPosition={currentPosition} />
        </>
      )}
      
      {trail.length > 1 && (
        <Polyline
          positions={trail.map(pos => [pos.lat, pos.lng] as [number, number])}
          color="blue"
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}

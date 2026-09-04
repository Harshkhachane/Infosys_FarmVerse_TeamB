import { useEffect, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css'

export interface GeoPoint {
  lat: number;
  lng: number;
}

interface LiveSatelliteMapProps {
  center: GeoPoint;
  points: GeoPoint[];
  mode: 'draw' | 'pin';
  onMapClick: (point: GeoPoint) => void;
  userLocation?: GeoPoint | null;
  locationAccuracy?: number | null;
  locationName?: string;
}

type MapMode = 'satellite' | 'hybrid' | 'street' | 'terrain';

const mapModes: { id: MapMode; label: string; icon: string }[] = [
  { id: 'satellite', label: 'Satellite', icon: 'satellite_alt' },
  { id: 'hybrid', label: 'Hybrid', icon: 'layers' },
  { id: 'street', label: 'Street', icon: 'map' },
  { id: 'terrain', label: 'Terrain', icon: 'landscape' }
];

function MapInteraction({ onMapClick }: Pick<LiveSatelliteMapProps, 'onMapClick'>) {
  useMapEvents({
    click(event) {
      onMapClick({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });
  return null;
}

function RecenterMap({ center }: { center: GeoPoint }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([center.lat, center.lng], Math.max(map.getZoom(), 17), { duration: 1.2 });
  }, [center.lat, center.lng, map]);

  return null;
}

export default function LiveSatelliteMap({
  center,
  points,
  mode,
  onMapClick,
  userLocation,
  locationAccuracy,
  locationName
}: LiveSatelliteMapProps) {
  const positions: LatLngExpression[] = points.map(point => [point.lat, point.lng]);
  const labelPosition = points.length
    ? {
        lat: points.reduce((sum, point) => sum + point.lat, 0) / points.length,
        lng: points.reduce((sum, point) => sum + point.lng, 0) / points.length
      }
    : center;
  const [mapMode, setMapMode] = useState<MapMode>('satellite');
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

  const baseLayer = mapMode === 'street'
    ? {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
      }
    : mapMode === 'terrain'
      ? {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri'
        }
      : {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
        };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={17}
        minZoom={3}
        maxZoom={20}
        zoomControl
        className="h-full w-full z-0"
      >
        <TileLayer key={mapMode} attribution={baseLayer.attribution} url={baseLayer.url} maxZoom={20} />
        {mapMode === 'hybrid' && (
          <TileLayer
            attribution="Labels &copy; Esri"
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={20}
          />
        )}
        <RecenterMap center={center} />
        <MapInteraction onMapClick={onMapClick} />
        {userLocation && locationAccuracy && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={locationAccuracy}
            pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.12, weight: 1 }}
          />
        )}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{ color: '#ffffff', fillColor: '#2563eb', fillOpacity: 1, weight: 3 }}
          >
            <Tooltip direction="top" offset={[0, -8]}>Your live location</Tooltip>
          </CircleMarker>
        )}
        {points.length >= 3 && (
          <Polygon
            positions={positions}
            pathOptions={{ color: '#f8fafc', fillColor: '#2b5c27', fillOpacity: 0.34, weight: 3 }}
          />
        )}
        {points.map((point, index) => (
          <CircleMarker
            key={`${point.lat}-${point.lng}-${index}`}
            center={[point.lat, point.lng]}
            radius={5}
            pathOptions={{ color: '#183d1c', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
          />
        ))}
        {locationName && locationName !== 'Area name unavailable' && (
          <CircleMarker
            center={[labelPosition.lat, labelPosition.lng]}
            radius={2}
            pathOptions={{ color: '#183d1c', fillColor: '#183d1c', fillOpacity: 1, weight: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -5]} opacity={0.96}>
              <span className="font-semibold">{locationName}</span>
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="absolute left-3 top-20 z-[500]">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setIsModeMenuOpen(open => !open);
          }}
          className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-[11px] font-extrabold text-[#183d1c] shadow-md hover:bg-gray-50"
          title="Change map mode"
        >
          <span className="material-symbols-outlined text-lg">
            {mapModes.find(item => item.id === mapMode)?.icon}
          </span>
          {mapModes.find(item => item.id === mapMode)?.label}
          <span className="material-symbols-outlined text-sm">
            {isModeMenuOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isModeMenuOpen && (
          <div
            className="mt-2 w-36 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl"
            onClick={event => event.stopPropagation()}
          >
            {mapModes.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMapMode(item.id);
                  setIsModeMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[11px] font-bold transition-colors ${
                  mapMode === item.id
                    ? 'bg-[#183d1c] text-white'
                    : 'text-[#42493e] hover:bg-[#f1f4ef]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

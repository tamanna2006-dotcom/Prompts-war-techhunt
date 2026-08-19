// src/components/LeafletMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { startIcon, destIcon, havenIcon, hazardIcon } from './CustomMarkers';
import MapSideControls from './MapSideControls';
import MapLegend from './MapLegend';
import { useGeolocation } from '../hooks/useGeolocation';

// Nominatim fetch for Indian locations
const fetchSuggestions = async (query) => {
  if (!query) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(
    query
  )}&limit=5`;
  const res = await fetch(url, {
    headers: {
      // Provide a identifying User-Agent per Nominatim policy
      'User-Agent': 'GuardianRouteAI/1.0 (contact@example.com)'
    }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((item) => ({
    name: item.display_name,
    coords: [parseFloat(item.lat), parseFloat(item.lon)]
  }));
};

// Pulsating user location icon (blue/green)
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="pulse"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const fetchRoute = async (origin, destination) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Routing request failed');
  const data = await res.json();
  const route = data.routes[0];
  return {
    coords: route.geometry.coordinates.map((c) => [c[1], c[0]]), // flip to [lat,lng]
    distance: (route.distance / 1000).toFixed(2), // km
    duration: Math.round(route.duration / 60) // mins
  };
};

export default function LeafletMap({ hazards = [], havens = [] }) {
  const { location, loading: geoLoading, refreshLocation } = useGeolocation();
  const [originCoord, setOriginCoord] = useState(null);
  const [destCoord, setDestCoord] = useState(null);
  const [routeData, setRouteData] = useState({ coords: [], distance: null, duration: null });
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDest, setSearchDest] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  // Debounce timers
  const originTimer = useRef(null);
  const destTimer = useRef(null);

  // Set origin from GPS when user clicks button
  const handleUseGPS = () => {
    refreshLocation();
    setOriginCoord([location.lat, location.lng]);
    setSearchOrigin('My Location');
  };

  // Update route when both points are set
  useEffect(() => {
    if (originCoord && destCoord) {
      fetchRoute(originCoord, destCoord)
        .then((r) => setRouteData(r))
        .catch((err) => console.error(err));
    }
  }, [originCoord, destCoord]);

  // Handle typing in origin input
  const handleOriginChange = (e) => {
    const val = e.target.value;
    setSearchOrigin(val);
    if (originTimer.current) clearTimeout(originTimer.current);
    originTimer.current = setTimeout(async () => {
      const suggestions = await fetchSuggestions(val);
      setOriginSuggestions(suggestions);
    }, 300);
  };

  // Handle typing in destination input
  const handleDestChange = (e) => {
    const val = e.target.value;
    setSearchDest(val);
    if (destTimer.current) clearTimeout(destTimer.current);
    destTimer.current = setTimeout(async () => {
      const suggestions = await fetchSuggestions(val);
      setDestSuggestions(suggestions);
    }, 300);
  };

  // When a suggestion is selected (origin)
  const handleOriginSelect = (e) => {
    const name = e.target.value;
    setSearchOrigin(name);
    const sug = originSuggestions.find((s) => s.name === name);
    if (sug) setOriginCoord(sug.coords);
    else if (name === 'My Location') setOriginCoord([location.lat, location.lng]);
  };

  // When a suggestion is selected (destination)
  const handleDestSelect = (e) => {
    const name = e.target.value;
    setSearchDest(name);
    const sug = destSuggestions.find((s) => s.name === name);
    if (sug) setDestCoord(sug.coords);
  };

  // Map pan to origin when set (fallback to Delhi if still null)
  const MapAutoPan = () => {
    const map = useMap();
    if (originCoord) map.setView(originCoord, 14, { animate: true });
    else map.setView([28.6139, 77.2090], 14, { animate: true });
    return null;
  };

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2 items-start sm:items-center">
        <button
          onClick={handleUseGPS}
          className="px-3 py-1.5 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition"
        >
          Use My GPS Location
        </button>
        <input
          list="origin-suggestions"
          value={searchOrigin}
          onChange={handleOriginChange}
          onBlur={handleOriginSelect}
          placeholder="Origin"
          className="p-2 rounded-md bg-slate-800 text-white"
        />
        <datalist id="origin-suggestions">
          {originSuggestions.map((s) => (
            <option key={s.name} value={s.name} />
          ))}
        </datalist>
        <input
          list="dest-suggestions"
          value={searchDest}
          onChange={handleDestChange}
          onBlur={handleDestSelect}
          placeholder="Destination"
          className="p-2 rounded-md bg-slate-800 text-white"
        />
        <datalist id="dest-suggestions">
          {destSuggestions.map((s) => (
            <option key={s.name} value={s.name} />
          ))}
        </datalist>
      </div>

      {/* Stats overlay */}
      {routeData.distance && (
        <div className="absolute top-4 right-4 z-40 glass-panel p-2 rounded-xl shadow-md w-48">
          <p className="text-sm font-medium text-gray-200">Distance: {routeData.distance} km</p>
          <p className="text-sm text-gray-300">Time: {routeData.duration} min</p>
          <p className="text-sm text-emerald-400">Safety Index: 88/100</p>
        </div>
      )}

      <MapContainer
        center={originCoord || [28.6139, 77.2090]}
        zoom={14}
        scrollWheelZoom={false}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        className="h-[500px] w-full z-1"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {/* Auto‑pan to origin when set */}
        <MapAutoPan />
        {/* User location marker */}
        {originCoord && (
          <Marker position={originCoord} icon={userLocationIcon} />
        )}
        {/* Destination marker */}
        {destCoord && (
          <Marker position={destCoord} icon={destIcon} />
        )}
        {/* Hazard markers */}
        {hazards.map((h, idx) => (
          <Marker key={`hazard-${idx}`} position={[h.lat, h.lng]} icon={hazardIcon} />
        ))}
        {/* Safe haven markers */}
        {havens.map((h, idx) => (
          <Marker key={`haven-${idx}`} position={[h.lat, h.lng]} icon={havenIcon} />
        ))}
        {/* Route polyline */}
        {routeData.coords.length > 0 && (
          <Polyline
            positions={routeData.coords}
            pathOptions={{ color: '#2563eb', weight: 6, opacity: 0.9 }}
          />
        )}
        <MapSideControls routeBounds={L.latLngBounds(routeData.coords)} />
      </MapContainer>
      <MapLegend />
    </>
  );
}

import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, MapPin, Layers } from 'lucide-react';

/**
 * Floating side controls for the Leaflet map.
 * Props:
 *   - routeBounds: L.LatLngBounds object representing the route extents.
 */
export default function MapSideControls({ routeBounds }) {
  const map = useMap();

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };
  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };
  const handleRecenter = () => {
    if (map && routeBounds) {
      map.fitBounds(routeBounds, { padding: [50, 50] });
    }
  };
  const handleToggleHeatmap = () => {
    console.log('Heatmap toggle clicked'); // placeholder for future heatmap logic
  };

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-lg rounded-xl p-2 shadow-lg flex flex-col space-y-2 z-40">
      <button onClick={handleZoomIn} className="p-2 rounded-full bg-white/70 hover:bg-white/90 shadow-md" aria-label="Zoom In">
        <Plus className="w-5 h-5 text-gray-800" />
      </button>
      <button onClick={handleZoomOut} className="p-2 rounded-full bg-white/70 hover:bg-white/90 shadow-md" aria-label="Zoom Out">
        <Minus className="w-5 h-5 text-gray-800" />
      </button>
      <button onClick={handleRecenter} className="p-2 rounded-full bg-white/70 hover:bg-white/90 shadow-md" aria-label="Center Route">
        <MapPin className="w-5 h-5 text-gray-800" />
      </button>
      <button onClick={handleToggleHeatmap} className="p-2 rounded-full bg-white/70 hover:bg-white/90 shadow-md" aria-label="Toggle Heatmap">
        <Layers className="w-5 h-5 text-gray-800" />
      </button>
    </div>
  );
}

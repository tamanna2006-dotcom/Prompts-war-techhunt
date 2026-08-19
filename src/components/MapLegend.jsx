// src/components/MapLegend.jsx
import React from 'react';
import { MapPin, XCircle, AlertTriangle, Hospital } from 'lucide-react';

/**
 * MapLegend - a floating glass‑morphism panel that explains the map symbols.
 * Position: top‑right corner of the map, overlayed on the map container.
 */
export default function MapLegend() {
  return (
    <div className="absolute top-4 right-4 z-40">
      <div className="glass-panel p-4 rounded-xl shadow-lg w-48">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Map Legend</h3>
        <ul className="space-y-1 text-xs text-gray-200">
          <li className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Start Point (A)</span>
          </li>
          <li className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Destination (B)</span>
          </li>
          <li className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Hazard</span>
          </li>
          <li className="flex items-center space-x-2">
            <Hospital className="w-4 h-4 text-cyan-400" />
            <span>Safe Haven</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

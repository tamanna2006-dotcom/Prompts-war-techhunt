import L from 'leaflet';

// Helper to create a colored badge with a letter
const createBadgeIcon = (color, letter) => {
  const html = `<div style="
    background:${color};
    color:white;
    width:30px;height:30px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-weight:bold;
    font-size:16px;">
    ${letter}
  </div>`;
  return L.divIcon({ html, className: '', iconSize: [30, 30] });
};

export const startIcon = createBadgeIcon('#10b981', 'A'); // green
export const destIcon = createBadgeIcon('#ef4444', 'B'); // red

// Simple circle icons for havens and hazards using data‑URL SVGs
export const havenIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`),
  iconSize: [28, 28]
});

export const hazardIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4h.01"/><circle cx="12" cy="12" r="10"/></svg>`),
  iconSize: [28, 28]
});

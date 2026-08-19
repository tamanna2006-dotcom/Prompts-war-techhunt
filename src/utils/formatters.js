/**
 * Formatting and payload generator helpers for GuardianRoute AI
 */

export function formatCoordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return '37.7749° N, 122.4194° W';
  }
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

export function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Builds standard compliant emergency SMS text message payload
 */
export function generateEmergencySmsPayload({
  userName = 'Solo Traveler',
  origin = 'Current Location',
  destination = 'Dorms',
  coords = { lat: 37.7749, lng: -122.4194 },
  battery = 78,
  timestamp = formatTimestamp(),
  customNote = ''
}) {
  const mapUrl = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
  return `🚨 EMERGENCY SOS ALERT from ${userName}!
📍 Location: ${formatCoordinates(coords.lat, coords.lng)}
🗺️ Live Map: ${mapUrl}
🚶 Route: ${origin} ➡️ ${destination}
🔋 Phone Battery: ${battery}% | ⏰ Time: ${timestamp}
${customNote ? `💬 Note: "${customNote}"\n` : ''}⚠️ Automated distress alert triggered via GuardianRoute AI. Please call or dispatch emergency assistance immediately!`;
}

/**
 * Generates an interactive mock tracking URL
 */
export function generateShareUrl(tripId = 'gr-9942') {
  return `${window.location.origin}/?track=${tripId}&secure=true`;
}

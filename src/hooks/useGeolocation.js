import { useState, useEffect, useCallback } from 'react';

// Default realistic fallback coordinates (San Francisco Downtown / University perimeter)
const FALLBACK_LOCATION = {
  lat: 37.7749,
  lng: -122.4194,
  accuracy: 12,
  isSimulated: true,
  address: '450 University Ave (Simulated Location)'
};

export function useGeolocation() {
  const [location, setLocation] = useState(FALLBACK_LOCATION);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocation(FALLBACK_LOCATION);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          isSimulated: false,
          address: 'Current Live GPS Location'
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLocation(FALLBACK_LOCATION);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getCurrentPosition();
    }, 0);
    return () => clearTimeout(timer);
  }, [getCurrentPosition]);

  return {
    location,
    error,
    loading,
    refreshLocation: getCurrentPosition
  };
}

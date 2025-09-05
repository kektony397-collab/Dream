
import { useState, useRef, useCallback, useEffect } from 'react';

export interface GeolocationData {
  speed: number;
  distance: number;
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const useGeolocation = (isTracking: boolean) => {
  const [locationData, setLocationData] = useState<GeolocationData>({
    speed: 0,
    distance: 0,
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<GeolocationCoordinates | null>(null);
  const totalDistance = useRef<number>(0);

  const stopTracking = useCallback(() => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const handleSuccess = (position: GeolocationPosition) => {
    setError(null); // Clear previous errors on success
    const { latitude, longitude, speed } = position.coords;
    
    // Convert speed from m/s to km/h, handle null speed
    const currentSpeed = speed ? speed * 3.6 : 0;
    
    if (lastPosition.current) {
      const distanceIncrement = haversineDistance(
        lastPosition.current.latitude,
        lastPosition.current.longitude,
        latitude,
        longitude
      );
      totalDistance.current += distanceIncrement;
    }

    lastPosition.current = position.coords;
    
    setLocationData({
      speed: currentSpeed,
      distance: totalDistance.current,
      latitude,
      longitude,
    });
  };

  const handleError = (err: GeolocationPositionError) => {
    let message = `An unknown error occurred (Code: ${err.code}).`;
    switch(err.code) {
        case err.PERMISSION_DENIED:
            message = "Geolocation permission was denied. Please enable location access for this site in your browser settings.";
            break;
        case err.POSITION_UNAVAILABLE:
            message = "Location information is currently unavailable. This could be due to a poor GPS signal or no network access.";
            break;
        case err.TIMEOUT:
            message = "The request to get your location timed out. Please check your connection and try again.";
            break;
    }
    setError(message);
    stopTracking();
  };
  
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    
    // Reset state before starting
    setError(null);
    lastPosition.current = null;

    // Load initial distance from localStorage
    const savedDistance = parseFloat(localStorage.getItem('totalDistance') || '0');
    totalDistance.current = savedDistance;
    setLocationData(prev => ({ ...prev, distance: savedDistance }));

    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
  }, [stopTracking]);


  // Save total distance to localStorage when it changes
  useEffect(() => {
    if (isTracking) {
        localStorage.setItem('totalDistance', locationData.distance.toString());
    }
  }, [locationData.distance, isTracking]);


  return { locationData, error, startTracking, stopTracking };
};

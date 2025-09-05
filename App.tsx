
import React, { useState, useCallback, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { RefuelModal } from './components/RefuelModal';
import { useGeolocation } from './hooks/useGeolocation';
import { useFuelLogic } from './hooks/useFuelLogic';
import { TANK_CAPACITY } from './constants';

const App: React.FC = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    locationData,
    error: geoError,
    startTracking,
    stopTracking,
  } = useGeolocation(isTracking);

  const { fuelData, logRefuel } = useFuelLogic(locationData.distance);

  const handleStart = () => {
    // Check for secure context (HTTPS) which is required by most browsers for Geolocation
    if (!window.isSecureContext) {
      alert("This feature requires a secure connection (HTTPS). Geolocation might not work on an HTTP connection.");
    }

    startTracking();
    setIsTracking(true);

    // Request notification permission as an enhancement, not a blocker.
    // Only ask if permission hasn't been granted or denied yet.
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleStop = () => {
    stopTracking();
    setIsTracking(false);
  };
  
  const handleRefuel = (liters: number) => {
    logRefuel(liters);
    setIsModalOpen(false);
  };
  
  // Effect for stop detection notification
  useEffect(() => {
    let stopTimer: number | null = null;
    if (isTracking && locationData.speed < 1 && !geoError) {
      stopTimer = window.setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Bike Stopped', {
            body: 'Your bike has been stationary for a while.',
            icon: 'https://picsum.photos/192' // Replace with a proper icon
          });
        }
      }, 5000); // 5 seconds
    }
    return () => {
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, [isTracking, locationData.speed, geoError]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between p-4 selection:bg-red-700/50">
      <main className="flex-grow flex flex-col items-center justify-center">
        {geoError && !isTracking && <p className="text-red-400 mb-4 text-center">Error: {geoError}</p>}
        {isTracking ? (
          <Dashboard 
            locationData={locationData} 
            fuelData={fuelData} 
            onStop={handleStop} 
            onRefuelClick={() => setIsModalOpen(true)}
            error={geoError}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-gray-300">
              Honda <span className="text-red-600">Dream Yug</span>
            </h1>
            <p className="text-lg text-gray-400 mt-2 mb-8">Ready to ride?</p>
            <button
              onClick={handleStart}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg shadow-red-600/30 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Start Tracking
            </button>
          </div>
        )}
      </main>
      <Footer />
      {isModalOpen && (
        <RefuelModal 
          onClose={() => setIsModalOpen(false)} 
          onRefuel={handleRefuel}
          maxFuel={TANK_CAPACITY - fuelData.level}
        />
      )}
    </div>
  );
};

export default App;


import React from 'react';
import { Speedometer } from './Speedometer';
import { MetricCard } from './MetricCard';
import { FuelGauge } from './FuelGauge';
import type { GeolocationData } from '../hooks/useGeolocation';
import type { FuelData } from '../hooks/useFuelLogic';

interface DashboardProps {
  locationData: GeolocationData;
  fuelData: FuelData;
  onStop: () => void;
  onRefuelClick: () => void;
  error?: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ locationData, fuelData, onStop, onRefuelClick, error }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 p-4">
      {error && (
        <div className="w-full bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-2xl mb-4 text-center shadow-lg">
          <p className="font-bold text-lg mb-1">Tracking Error</p>
          <p>{error}</p>
        </div>
      )}

      <Speedometer speed={locationData.speed} />
      
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <MetricCard title="Distance" value={locationData.distance.toFixed(2)} unit="km" />
        <MetricCard title="Est. Range" value={fuelData.range.toFixed(0)} unit="km" />
        <MetricCard title="Avg. Mileage" value={fuelData.currentAvgMileage.toFixed(1)} unit="km/l" />
      </div>
      
      <FuelGauge level={fuelData.level} capacity={fuelData.capacity} />
      
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={onRefuelClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-blue-600/30 transition-all duration-300 ease-in-out"
        >
          Log Refill
        </button>
        <button
          onClick={onStop}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-red-600/30 transition-all duration-300 ease-in-out"
        >
          Stop Tracking
        </button>
      </div>
    </div>
  );
};

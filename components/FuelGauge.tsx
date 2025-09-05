
import React from 'react';

interface FuelGaugeProps {
  level: number;
  capacity: number;
}

export const FuelGauge: React.FC<FuelGaugeProps> = ({ level, capacity }) => {
  const percentage = Math.max(0, Math.min(100, (level / capacity) * 100));
  
  let barColorClass = 'bg-green-500';
  if (percentage < 50) barColorClass = 'bg-yellow-500';
  if (percentage < 20) barColorClass = 'bg-red-600';

  return (
    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Fuel Level</p>
        <p className="text-lg font-bold text-white">
          {level.toFixed(2)} / {capacity} L
        </p>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div 
          className={`h-4 rounded-full transition-all duration-500 ease-in-out ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};


import React from 'react';

interface SpeedometerProps {
  speed: number;
}

const MAX_SPEED = 120;

export const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const safeSpeed = Math.min(Math.max(speed, 0), MAX_SPEED);
  // Rotation: -120deg (0 km/h) to 120deg (120 km/h) -> 240deg total range
  const rotation = (safeSpeed / MAX_SPEED) * 240 - 120;
  
  const isOptimalSpeed = speed >= 40 && speed <= 50;

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
      {/* Gauge Background */}
      <div className={`absolute w-full h-full rounded-full bg-gray-800 border-8 border-gray-700 transition-all duration-500 ${isOptimalSpeed ? 'shadow-[0_0_40px_10px_rgba(34,197,94,0.5)] border-green-500' : 'shadow-lg shadow-black/50'}`}></div>
      
      {/* Ticks */}
      <div className="absolute w-full h-full">
        {Array.from({ length: 13 }).map((_, i) => {
          const value = i * 10;
          const tickRotation = (i / 12) * 240 - 120;
          const isMajorTick = i % 2 === 0;
          return (
            <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${tickRotation}deg)` }}>
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${isMajorTick ? 'w-1 h-4 bg-white' : 'w-0.5 h-2 bg-gray-400'} rounded-full`}></div>
              {isMajorTick && (
                 <span className="absolute top-8 left-1/2 -translate-x-1/2 text-lg font-bold" style={{ transform: `rotate(${-tickRotation}deg)` }}>{value}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Needle */}
      <div className="absolute w-2 h-1/2 bottom-1/2 origin-bottom transition-transform duration-500 ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
        <div className="w-full h-full bg-red-600 rounded-t-full"></div>
      </div>
      <div className="absolute w-8 h-8 bg-black rounded-full border-4 border-gray-600 z-10"></div>
      
      {/* Digital Readout */}
      <div className="absolute bottom-1/4 text-center z-10">
        <span className="text-6xl md:text-7xl font-black text-white tracking-tighter">
          {Math.round(safeSpeed)}
        </span>
        <span className="block text-xl text-gray-400 font-medium">km/h</span>
      </div>
    </div>
  );
};


import { useState, useEffect, useRef } from 'react';
import { TANK_CAPACITY, AVERAGE_MILEAGE } from '../constants';

export interface FuelData {
  level: number;
  range: number;
  capacity: number;
  currentAvgMileage: number;
}

interface FuelState {
  initialFuel: number;
  distanceAtRefill: number;
}

export const useFuelLogic = (currentTotalDistance: number) => {
  const [fuelData, setFuelData] = useState<FuelData>({
    level: TANK_CAPACITY,
    range: TANK_CAPACITY * AVERAGE_MILEAGE,
    capacity: TANK_CAPACITY,
    currentAvgMileage: AVERAGE_MILEAGE,
  });

  const fuelStateRef = useRef<FuelState>({
    initialFuel: TANK_CAPACITY,
    distanceAtRefill: 0,
  });

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('fuelState');
    const savedDistance = parseFloat(localStorage.getItem('totalDistance') || '0');

    if (savedState) {
      const parsedState: FuelState = JSON.parse(savedState);
      fuelStateRef.current = {
        ...parsedState,
        distanceAtRefill: parsedState.distanceAtRefill,
      };
    } else {
        // if no fuel state, assume distance at last refill was the last saved total distance
        fuelStateRef.current.distanceAtRefill = savedDistance;
    }

    // Initialize with full tank if no state is found
    if(!savedState) {
        localStorage.setItem('fuelState', JSON.stringify(fuelStateRef.current));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update fuel level and range based on distance traveled
  useEffect(() => {
    const { initialFuel, distanceAtRefill } = fuelStateRef.current;
    const distanceSinceRefill = Math.max(0, currentTotalDistance - distanceAtRefill);
    
    const fuelUsed = distanceSinceRefill / AVERAGE_MILEAGE;
    const currentFuelLevel = Math.max(0, initialFuel - fuelUsed);
    const estimatedRange = currentFuelLevel * AVERAGE_MILEAGE;
    
    const actualMileage = distanceSinceRefill > 0 ? (distanceSinceRefill / (initialFuel - currentFuelLevel)) : AVERAGE_MILEAGE;

    setFuelData({
      level: currentFuelLevel,
      range: estimatedRange,
      capacity: TANK_CAPACITY,
      currentAvgMileage: isNaN(actualMileage) || !isFinite(actualMileage) ? AVERAGE_MILEAGE : actualMileage,
    });
  }, [currentTotalDistance]);

  const logRefuel = (liters: number) => {
    const currentLevel = fuelData.level;
    const newFuelLevel = Math.min(TANK_CAPACITY, currentLevel + liters);

    const newState: FuelState = {
      initialFuel: newFuelLevel,
      distanceAtRefill: currentTotalDistance,
    };

    fuelStateRef.current = newState;
    localStorage.setItem('fuelState', JSON.stringify(newState));

    // Force an immediate update of the fuel data state
    const estimatedRange = newFuelLevel * AVERAGE_MILEAGE;
    setFuelData(prev => ({
        ...prev,
        level: newFuelLevel,
        range: estimatedRange,
    }));
  };

  return { fuelData, logRefuel };
};

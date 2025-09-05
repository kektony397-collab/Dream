
import React, { useState } from 'react';

interface RefuelModalProps {
  onClose: () => void;
  onRefuel: (liters: number) => void;
  maxFuel: number;
}

export const RefuelModal: React.FC<RefuelModalProps> = ({ onClose, onRefuel, maxFuel }) => {
  const [liters, setLiters] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelAmount = parseFloat(liters);
    if (!isNaN(fuelAmount) && fuelAmount > 0 && fuelAmount <= maxFuel) {
      onRefuel(fuelAmount);
    } else {
      alert(`Please enter a valid amount between 0.1 and ${maxFuel.toFixed(2)} liters.`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-sm m-4">
        <h2 className="text-2xl font-bold text-white mb-4">Log Petrol Refill</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="liters" className="block text-sm font-medium text-gray-400 mb-2">
            Enter amount in liters (Max: {maxFuel.toFixed(2)} L)
          </label>
          <input
            id="liters"
            type="number"
            step="0.01"
            min="0.1"
            max={maxFuel.toFixed(2)}
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="e.g., 5.5"
            autoFocus
          />
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

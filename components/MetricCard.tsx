
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700 shadow-lg">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-bold text-white mt-1">
        {value} <span className="text-xl font-normal text-gray-300">{unit}</span>
      </p>
    </div>
  );
};

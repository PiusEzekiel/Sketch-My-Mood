
import React from 'react';

interface MoodChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MoodChip: React.FC<MoodChipProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${
        isActive
          ? 'bg-white text-black border-white shadow-lg shadow-white/20'
          : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

export default MoodChip;

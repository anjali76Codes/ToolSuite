// // AIPalette.jsx
import React from "react";

const AIPalette = ({ prompt, onApply }) => {
  // Convert comma-separated hex codes into an array and trim whitespace
  const colors = prompt.split(',').map(color => color.trim());

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Generated Palette</h2>
      <div className="flex flex-wrap gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-20 h-20 rounded-lg shadow-md border border-gray-200"
            style={{ backgroundColor: color }}
            title={color}
          >
            <div className="text-xs text-center mt-20 text-gray-700">{color}</div>
          </div>
        ))}
      </div>

      {onApply && (
        <button
          onClick={() => onApply(colors)}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Use This Palette
        </button>
      )}
    </div>
  );
};

export default AIPalette;

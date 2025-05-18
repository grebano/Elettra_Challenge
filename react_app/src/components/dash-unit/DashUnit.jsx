import React from "react";

const DashUnit = ({
  datum,
  unit = "°C",
  label = "Current Temperature",
  icon,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 w-full flex flex-col relative overflow-hidden group">
      {/* Background pattern */}
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

      {/* Icon */}
      {icon && (
        <div className="absolute top-3 right-3 text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <div className="flex items-baseline">
          <h2
            className={`text-2xl font-bold ${
              datum === null ? "text-gray-300" : "text-gray-800"
            } transition-colors duration-300`}
          >
            {datum === null ? "--" : datum}
          </h2>
          <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>
        </div>
      </div>

      {/* Bottom indicator bar - could be dynamic based on value */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
    </div>
  );
};

export default DashUnit;

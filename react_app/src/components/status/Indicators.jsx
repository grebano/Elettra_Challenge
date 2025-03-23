import React from "react";

const Indicators = ({ dataReceived, dataStopped, dataError }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-center bg-white p-5 rounded-xl shadow-md border border-gray-100 w-full max-w-3xl backdrop-blur-sm bg-white/90">
      <StatusIndicator
        active={dataReceived}
        label="Data Received"
        activeColor="bg-emerald-500"
        textColor="text-emerald-700"
        pulseEffect={dataReceived}
      />
      <StatusIndicator
        active={dataStopped}
        label="Data Stopped"
        activeColor="bg-amber-500"
        textColor="text-amber-700"
        pulseEffect={dataStopped}
      />
      <StatusIndicator
        active={dataError}
        label="Data Error"
        activeColor="bg-rose-500"
        textColor="text-rose-700"
        pulseEffect={dataError}
      />
    </div>
  );
};

const StatusIndicator = ({
  active,
  label,
  activeColor,
  textColor,
  pulseEffect,
}) => (
  <div
    className={`flex items-center px-4 py-2 rounded-full ${
      active ? "bg-gray-50" : "bg-white"
    } border border-gray-100 shadow-sm transition-all duration-300`}
  >
    <div className="relative mr-2">
      <div
        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
          active ? activeColor : "bg-gray-300"
        }`}
        title={label}
      ></div>
      {pulseEffect && (
        <div
          className={`absolute top-0 left-0 w-3 h-3 rounded-full ${activeColor} opacity-75 animate-ping`}
        ></div>
      )}
    </div>
    <span
      className={`text-sm font-medium ${
        active ? textColor : "text-gray-500"
      } transition-colors duration-300`}
    >
      {label}
    </span>
  </div>
);

export default Indicators;

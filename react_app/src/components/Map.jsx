import React from "react";
import Map from "./map/Map";

function LeafletMap({ lastMarker, fixedMarkers }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Location Dashboard
        </h2>
        <p className="text-sm text-gray-500">Realtime location tracking</p>
      </div>

      <div className="bg-white p-1 rounded-xl shadow-sm">
        <Map lastMarker={lastMarker} fixedMarkers={fixedMarkers} />
      </div>
    </div>
  );
}

export default LeafletMap;

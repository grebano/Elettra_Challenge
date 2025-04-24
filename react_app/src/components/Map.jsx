import React from "react";
import Map from "./map/Map";

function LeafletMap({ lastMarker, fixedMarkers }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Realtime tracking
        </h2>
      </div>

      <div className="bg-white p-1 rounded-xl shadow-sm">
        <Map lastMarker={lastMarker} fixedMarkers={fixedMarkers} />
      </div>
    </div>
  );
}

export default LeafletMap;

import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  Polyline,
} from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Calculate distance between two points in kilometers
const calculateDistance = (point1, point2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2[0] - point1[0]);
  const dLon = toRad(point2[1] - point1[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1[0])) *
      Math.cos(toRad(point2[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate total path distance from a list of position points
const calculateTotalDistance = (positions) => {
  if (!positions || positions.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < positions.length; i++) {
    totalDistance += calculateDistance(positions[i - 1], positions[i]);
  }

  return totalDistance;
};

// Premium marker with pulse effect and shadow
const premiumMarker = (color, size = 12) =>
  divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-8 h-8 bg-${color}-200 opacity-70 rounded-full animate-ping"></div>
        <div class="w-${size / 4} h-${
      size / 4
    } bg-${color}-500 rounded-full shadow-lg border-2 border-white z-10"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

// Enhanced pan to marker with smooth animation
const PanToLastMarker = ({ lastMarker }) => {
  const map = useMap();
  const prevMarkerRef = useRef(null);

  useEffect(() => {
    if (
      lastMarker?.position &&
      JSON.stringify(prevMarkerRef.current) !== JSON.stringify(lastMarker)
    ) {
      map.flyTo(lastMarker.position, 14, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.5,
      });
      prevMarkerRef.current = lastMarker;
    }
  }, [lastMarker, map]);

  return null;
};

// Enhanced fit bounds with padding
const FitBounds = ({ fixedMarkers }) => {
  const map = useMap();

  useEffect(() => {
    if (fixedMarkers && fixedMarkers.length > 0) {
      const bounds = fixedMarkers.map((marker) => marker.position);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1,
      });
    }
  }, [fixedMarkers, map]);

  return null;
};

// Custom map attribution component
const CustomAttribution = () => {
  return (
    <div className="absolute bottom-0 right-0 bg-white bg-opacity-70 py-1 px-2 text-xs text-gray-700 z-50">
      Map data ©{" "}
      <a
        href="https://www.openstreetmap.org/copyright"
        className="text-blue-600 hover:text-blue-800"
      >
        OpenStreetMap
      </a>{" "}
      contributors
    </div>
  );
};

// Map Controls Component separated for stability
const MapControls = ({ mapStyle, setMapStyle }) => {
  return (
    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-md p-2 z-50">
      <div className="flex space-x-1">
        <button
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            mapStyle === "light"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setMapStyle("light")}
        >
          Light
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            mapStyle === "dark"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setMapStyle("dark")}
        >
          Dark
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            mapStyle === "satellite"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setMapStyle("satellite")}
        >
          Satellite
        </button>
      </div>
    </div>
  );
};

// Separate Total Distance component for stability
const TotalDistanceDisplay = ({ totalDistance }) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-50 text-center min-w-32">
      <h3 className="text-sm font-semibold text-gray-600">Total Distance</h3>
      <p className="text-xl font-bold text-blue-600">
        {totalDistance.toFixed(2)} km
      </p>
    </div>
  );
};

const Map = ({ lastMarker, fixedMarkers = [] }) => {
  const [allMarkers, setAllMarkers] = useState([]);
  const [mapStyle, setMapStyle] = useState("light");
  const [totalDistance, setTotalDistance] = useState(0);
  const lastMarkerRef = useRef(null);
  const mapRef = useRef(null);

  // Update markers and calculate distance
  useEffect(() => {
    // Create a new array with fixed markers
    const newMarkers = [...allMarkers];

    // Add the last marker if it exists and is new
    if (
      lastMarker &&
      (!lastMarkerRef.current ||
        JSON.stringify(lastMarker) !== JSON.stringify(lastMarkerRef.current))
    ) {
      newMarkers.push(lastMarker);
      lastMarkerRef.current = lastMarker;
    }

    // Set the markers
    setAllMarkers(newMarkers);

    // Calculate the total distance with the positions
    if (newMarkers.length >= 2) {
      const positions = newMarkers.map((marker) => marker.position);
      const distance = calculateTotalDistance(positions);
      setTotalDistance(distance);
    } else {
      setTotalDistance(0);
    }
  }, [lastMarker, fixedMarkers]);

  // Map tile sources
  const mapTiles = {
    light: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    },
    dark: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  };

  const getColorClass = (colorName) => {
    // Map color names to Tailwind color classes
    const colorMap = {
      red: "red",
      green: "green",
      blue: "blue",
      yellow: "yellow",
      purple: "purple",
      orange: "orange",
      pink: "pink",
      teal: "teal",
      indigo: "indigo",
      gray: "gray",
    };
    return colorMap[colorName] || "blue";
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      {/* Map Controls - now a separate stable component */}
      <MapControls mapStyle={mapStyle} setMapStyle={setMapStyle} />

      <div className="w-full h-[500px] md:h-[700px] lg:h-[800px]" ref={mapRef}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className={`w-full h-full rounded-xl ${
            mapStyle === "dark" ? "contrast-110 brightness-105" : ""
          }`}
          zoomControl={false}
        >
          <TileLayer
            url={mapTiles[mapStyle].url}
            attribution={mapTiles[mapStyle].attribution}
          />

          {/* Polyline to connect markers */}
          {allMarkers.length > 1 && (
            <Polyline
              positions={allMarkers.map((marker) => marker.position)}
              color="#3388ff"
              weight={3}
              opacity={0.7}
              dashArray="5, 10"
            />
          )}

          {/* Render all markers */}
          {[...fixedMarkers, ...allMarkers].map((marker, index) => (
            <Marker
              key={`marker-${index}`}
              position={marker.position}
              icon={premiumMarker(
                getColorClass(marker.color) || "green",
                marker.size || 12
              )}
            >
              <Popup className="rounded-lg overflow-hidden shadow-lg">
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {marker.popupText || "Location"}
                  </h3>
                  {marker.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {marker.description}
                    </p>
                  )}
                  {marker.timestamp && (
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(marker.timestamp).toLocaleString()}
                    </div>
                  )}
                  {marker.image && (
                    <img
                      src={marker.image}
                      alt={marker.popupText || "Location"}
                      className="w-full rounded-md mt-2"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <ZoomControl position="bottomright" />
          <FitBounds fixedMarkers={fixedMarkers} />
          <PanToLastMarker lastMarker={lastMarker} />
          <CustomAttribution />
        </MapContainer>
      </div>

      {/* Total distance display */}
      <TotalDistanceDisplay totalDistance={totalDistance} />
    </div>
  );
};

export default Map;

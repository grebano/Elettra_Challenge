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
const marker = (colorHex = "#3b82f6", size = 12) =>
  divIcon({
    className: "",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${colorHex};
        border-radius: 50%;
        border: 2px solid white;
      "></div>
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
const FitBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = markers.map((marker) => marker.position);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1,
      });
    }
  }, [markers, map]);

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

const Map = ({ lastMarker, fixedMarkers = [] }) => {
  // Separate the route markers (dynamic) from fixed markers
  const [routeMarkers, setRouteMarkers] = useState([]);
  const [mapStyle, setMapStyle] = useState("light");
  const [totalDistance, setTotalDistance] = useState(0);
  const lastMarkerRef = useRef(null);
  const mapRef = useRef(null);

  // Prepare fixed markers format from JSON
  const preparedFixedMarkers = fixedMarkers;

  // Update route markers when a new marker arrives
  useEffect(() => {
    if (
      lastMarker &&
      (!lastMarkerRef.current ||
        JSON.stringify(lastMarker) !== JSON.stringify(lastMarkerRef.current))
    ) {
      // Add the new marker to route markers
      setRouteMarkers((prevMarkers) => [...prevMarkers, lastMarker]);
      lastMarkerRef.current = lastMarker;
    }
  }, [lastMarker]);

  // Calculate the distance for dynamic route markers only
  useEffect(() => {
    if (routeMarkers.length >= 2) {
      const positions = routeMarkers.map((marker) => marker.position);
      const distance = calculateTotalDistance(positions);
      setTotalDistance(distance);
    } else {
      setTotalDistance(0);
    }
  }, [routeMarkers]);

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
    if (!colorName) return "blue"; // Default fallback

    // Normalize input (remove #, lowercase, trim whitespace)
    const normalizedColor = colorName
      .toString()
      .trim()
      .replace(/^#/, "")
      .toLowerCase();

    // Map color names/hex codes to Tailwind base classes
    const colorMap = {
      // Named colors
      red: "red",
      green: "green",
      blue: "blue",
      yellow: "yellow",
      purple: "purple",
      orange: "orange",
      pink: "pink",
      teal: "teal",
      gray: "gray",
      black: "gray", // Maps to gray (no intensity)
      white: "gray", // Maps to gray (no intensity)

      // Hex codes (without #)
      ff0000: "red",
      "00ff00": "green",
      "0000ff": "blue",
      ffff00: "yellow",
      ff00ff: "fuchsia",
      ff9900: "orange",
      ff19e4: "pink",
      "19ffc2": "teal",
      "000000": "gray", // black → gray
      ffffff: "gray", // white → gray
    };

    return colorMap[normalizedColor] || "blue"; // Fallback to blue
  };

  // All markers displayed on the map
  const allMarkersForDisplay = [...preparedFixedMarkers, ...routeMarkers];

  return (
    <div className="flex flex-col space-y-4">
      {/* Map container and controls wrapper */}
      <div className="relative w-full">
        {/* Map type selector - positioned above the map */}
        <div className="absolute top-0 right-0 z-10 bg-white rounded-bl-lg shadow-lg overflow-hidden z-1001">
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mapStyle === "light"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setMapStyle("light")}
            >
              Light
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mapStyle === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setMapStyle("dark")}
            >
              Dark
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mapStyle === "satellite"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setMapStyle("satellite")}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Map container */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <div
            className="w-full h-[500px] md:h-[700px] lg:h-[800px]"
            ref={mapRef}
          >
            <MapContainer
              center={[40.92, 9.51]} // Centered on your data
              zoom={13}
              className={`w-full h-full ${
                mapStyle === "dark" ? "contrast-110 brightness-105" : ""
              }`}
              zoomControl={false}
            >
              <TileLayer
                url={mapTiles[mapStyle].url}
                attribution={mapTiles[mapStyle].attribution}
              />

              {/* Render all markers */}
              {allMarkersForDisplay.map((marker, index) => (
                <Marker
                  key={`marker-${index}`}
                  position={marker.position}
                  icon={marker(
                    getColorClass(marker.color) || "blue",
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
              <FitBounds markers={allMarkersForDisplay} />
              <PanToLastMarker lastMarker={lastMarker} />
              <CustomAttribution />
            </MapContainer>

            {/* Total distance display - fixed at the bottom of the map */}
            <div className="absolute bottom-0 left-0 w-full flex justify-center pb-4 z-10 pointer-events-none z-1001">
              <div className="bg-white px-6 py-2 rounded-full shadow-lg pointer-events-auto border-2 border-blue-500">
                <div className="flex items-center">
                  <div className="font-medium text-gray-700 mr-2">
                    Total Distance:
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {totalDistance.toFixed(2)} km
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;

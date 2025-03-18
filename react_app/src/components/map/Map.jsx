import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon with color
const coloredIcon = (color) =>
  divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [10, 10],
  });

// Move the map to the last marker
const PanToLastMarker = ({ lastMarker }) => {
  const map = useMap();

  useEffect(() => {
    if (lastMarker?.position) {
      map.panTo(lastMarker.position, { animate: true, duration: 1 });
    }
  }, [lastMarker, map]);

  return null;
};

const Map = ({ lastMarker, fixedMarkers }) => {
  // State to store the markers
  const [markers, setMarkers] = useState([]);

  //Update the markers state when a new marker is received
  useEffect(() => {
    if (lastMarker) {
      setMarkers((prev) => [...prev, lastMarker]);
    }
  }, [lastMarker]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {fixedMarkers.map((marker, index) => (
        <Marker key={`fixed-${index}`} position={marker.position} icon={coloredIcon(marker.color)}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
      {markers.map((marker, index) => (
        <Marker key={`marker-${index}`} position={marker.position} icon={coloredIcon('green')}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
      <PanToLastMarker lastMarker={lastMarker} />
    </MapContainer>
  );
};

export default Map;
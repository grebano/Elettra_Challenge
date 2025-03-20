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
  // State per i marker e per la modalità espansa
  const [markers, setMarkers] = useState([]);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  // Aggiorna lo stato dei marker quando ne arriva uno nuovo
  useEffect(() => {
    if (lastMarker) {
      setMarkers((prev) => [...prev, lastMarker]);
    }
  }, [lastMarker]);

  // Log per debug quando lo stato di espansione cambia
  useEffect(() => {
    console.log("Map expanded state:", isMapExpanded);
  }, [isMapExpanded]);
  
  // Gestisce il click sulla mappa per espandere/ridurre
  const handleMapClick = (e) => {
    // Stop propagation è necessario per evitare che il click arrivi ai componenti sottostanti
    e.stopPropagation();
    setIsMapExpanded(!isMapExpanded);
    console.log("Map clicked, new state:", !isMapExpanded);
  };

  return (
    <div 
      className={`map-container ${isMapExpanded ? 'expanded' : ''}`}
      onClick={handleMapClick}
    >
      <MapContainer
        center={[0, 0]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        // Importante: evitare che i click sulla mappa attivino l'espansione/riduzione
        onClick={(e) => e.originalEvent.stopPropagation()}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {fixedMarkers && fixedMarkers.map((marker, index) => (
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
    </div>
  );
};

export default Map;
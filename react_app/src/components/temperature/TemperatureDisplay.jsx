import React from 'react';
import './TemperatureDisplay.css';

const TemperatureDisplay = ({ temperature, unit = '°C', label = 'Current Temperature' }) => {
    return (
        <div>
            <h2 className="temperature">
                {temperature === null ? '--' : temperature}{unit}
            </h2>
            <p className="temp-label">{label}</p>
        </div>
    );
};

export default TemperatureDisplay;
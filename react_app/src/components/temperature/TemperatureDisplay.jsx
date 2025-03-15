import React from 'react';
import './TemperatureDisplay.css';

const TemperatureDisplay = ({ temperature, unit = '°C' }) => {
    return (
        <div>
            <h2 className="temperature">
                {temperature === null ? '--' : temperature}{unit}
            </h2>
            <p className="temp-label">Current Temperature</p>
        </div>
    );
};

export default TemperatureDisplay;
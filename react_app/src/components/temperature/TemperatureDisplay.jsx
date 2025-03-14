import React from 'react';
import './TemperatureDisplay.css';

const TemperatureDisplay = ({ temperature, unit = '°C' }) => {
    return (
        <div className="container">
            <h2 className="temperature">
                {temperature === null ? '--' : temperature}{unit}
            </h2>
            <p className="label">Current Temperature</p>
        </div>
    );
};

export default TemperatureDisplay;
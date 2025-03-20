import React from 'react';
import './DashUnit.css'

const DashUnit = ({ datum, unit = '°C', label = 'Current Temperature' }) => {
    return (
        <div className="dash-unit-container">
            <h2 className="temperature">
                {datum === null ? '--' : datum}<span className="text-sm">{unit}</span>
            </h2>
            <p className="temp-label">{label}</p>
        </div>
    );
};

export default DashUnit;
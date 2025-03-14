import React from 'react';

const TemperatureDisplay = ({ temperature, unit = '°C' }) => {
    return (
        <div style={styles.container}>
            <h2 style={styles.temperature}>
                {temperature} {unit}
            </h2>
            <p style={styles.label}>Current Temperature</p>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    temperature: {
        fontSize: '48px',
        margin: '0',
        color: '#333',
    },
    label: {
        fontSize: '16px',
        color: '#666',
    },
};

export default TemperatureDisplay;
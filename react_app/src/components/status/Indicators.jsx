import React from "react";
import "./Indicators.css"; // Import the CSS file for styling

const Indicators = ({ dataReceived, dataStopped, dataError, mqttConnectionStatus}) => {
  return (
    <div className="indicators">
      <div className="indicator-item">
        <div
          className={`indicator ${dataReceived ? "green" : "off"}`}
          title="Data Received"
        ></div>
        <span className="indicator-label">Data Received</span>
      </div>
      <div className="indicator-item">
        <div
          className={`indicator ${dataStopped ? "orange" : "off"}`}
          title="Data Stopped"
        ></div>
        <span className="indicator-label">Data Stopped</span>
      </div>
      <div className="indicator-item">
        <div
          className={`indicator ${dataError ? "red" : "off"}`}
          title="Data Error"
        ></div>
        <span className="indicator-label">Data Error</span>
      </div>
      <div className="indicator-item">
        <div
          className={`indicator ${mqttConnectionStatus ? "green" : "red"}`}
          title="Server Status"
        ></div>
        <span className="indicator-label">MQTT</span>
      </div>
    </div>
  );
};

export default Indicators;
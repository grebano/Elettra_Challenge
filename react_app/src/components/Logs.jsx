import React, { use } from "react";

function Logs({ logs }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    window.api.receive("log", (log) => {
      setLogs((logs) => [...logs, log]);
    });
  }, []);

  return (
    <div className="app-container">
      <div className="logs-container">
        <h2>Logs</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

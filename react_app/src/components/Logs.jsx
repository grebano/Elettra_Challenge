import React, { useRef, useEffect } from "react";

function Logs({ events }) {
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Auto scroll to the bottom when new logs arrive
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const getLogIcon = (type) => {
    const baseClasses = "flex-shrink-0";
    switch (type) {
      case "error":
        return (
          <svg
            className={`${baseClasses} w-4 h-4 sm:w-5 sm:h-5 text-red-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 9l-6 6m0-6l6 6"
            ></path>
          </svg>
        );
      case "warning":
        return (
          <svg
            className={`${baseClasses} w-4 h-4 sm:w-5 sm:h-5 text-amber-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        );
      case "success":
        return (
          <svg
            className={`${baseClasses} w-4 h-4 sm:w-5 sm:h-5 text-green-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4"
            ></path>
          </svg>
        );
      case "info":
      default:
        return (
          <svg
            className={`${baseClasses} w-4 h-4 sm:w-5 sm:h-5 text-blue-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 16v-4m0-4h.01"
            ></path>
          </svg>
        );
    }
  };

  const getLogClassNames = (type) => {
    const baseClasses =
      "flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 border-l-2 sm:border-l-4 mb-1 rounded-r transition-all hover:bg-gray-50 dark:hover:bg-gray-800";

    switch (type) {
      case "error":
        return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/10`;
      case "warning":
        return `${baseClasses} border-amber-500 bg-amber-50 dark:bg-amber-900/10`;
      case "success":
        return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/10`;
      case "info":
      default:
        return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-900/10`;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header - now more responsive */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 sm:gap-2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
            <path strokeLinecap="round" strokeWidth="2" d="M12 8v4l3 3"></path>
          </svg>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
            Event Logs
          </h2>
          <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
            {events?.length || 0}
          </span>
        </div>

        {/* Optional responsive controls could go here */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() =>
              logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 transition-colors py-1 px-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/10"
          >
            Latest
          </button>
        </div>
      </div>

      {/* Logs list - now more responsive */}
      <div className="flex-1 overflow-y-auto p-1 sm:p-2 bg-gray-50 dark:bg-gray-900">
        {events && events.length > 0 ? (
          <div className="space-y-0.5 sm:space-y-1">
            {events.map((event, index) => (
              <div key={index} className={getLogClassNames(event.type)}>
                {getLogIcon(event.type)}
                <div className="flex-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words overflow-hidden">
                  {event.message}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 hidden xs:flex items-center whitespace-nowrap ml-1">
                  {event.timestamp}
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 sm:h-64 text-gray-400">
            <p className="text-xs sm:text-sm">No events logged yet</p>
            <p className="text-xs mt-1 hidden sm:block">
              Events will appear here as they occur
            </p>
          </div>
        )}
      </div>

      {/* Small screen scroll to bottom button - shows only on small screens */}
      <div className="sm:hidden flex justify-center p-1 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() =>
            logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="text-xs text-blue-500 py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/20"
        >
          Latest
        </button>
      </div>
    </div>
  );
}

export default Logs;

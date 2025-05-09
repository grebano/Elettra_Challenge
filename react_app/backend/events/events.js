let callback = () => {};

module.exports = {
  sendEvent: (event) => {
    callback(event);

    switch (event.type) {
      case "error":
        console.error("Error event:", event.message);
        break;
      case "info":
        console.info("Info event:", event.message);
        break;
      case "warning":
        console.warn("Warning event:", event.message);
        break;
      case "success":
        console.log("Success event:", event.message);
        break;
      default:
        console.log("Event:", event);
        break;
    }
  },
  eventCallback: (cb) => {
    callback = cb;
  },
};

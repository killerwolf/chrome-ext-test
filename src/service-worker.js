if (chrome.sidePanel) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
} else {
  console.error("chrome.sidePanel is undefined. Ensure the API is supported and permissions are set.");
}

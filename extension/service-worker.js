let isRecording = false;

// Handle the extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage and side panel
  chrome.storage.local.set({ isRecording: false, screenshots: [] });

  // Enable side panel
  if (chrome.sidePanel) {
    chrome.sidePanel.setOptions({
      enabled: true,
      path: 'sidepanel.html'
    }).catch(error => {
      console.error('Error initializing side panel:', error);
    });
  }
});

// Handle toolbar icon clicks
chrome.action.onClicked.addListener((tab) => {
  // When the extension icon is clicked, show side panel
  chrome.windows.getCurrent(async () => {
    try {
      await chrome.sidePanel.setOptions({
        enabled: true,
        path: 'sidepanel.html'
      });
    } catch (error) {
      console.error('Error setting side panel options:', error);
    }
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        // Store the screenshot with associated data
        chrome.storage.local.get(['screenshots'], (result) => {
          const screenshots = result.screenshots || [];
          screenshots.push({
            imgData: dataUrl,
            timestamp: Date.now(),
            title: request.title || 'Screenshot',
            url: request.url
          });
          chrome.storage.local.set({ screenshots: screenshots }, () => {
            sendResponse({ success: true });
          });
        });
      }
    });
    return true; // Required for async response
  }
  
  if (request.action === "toggleRecording") {
    isRecording = request.enabled;
    chrome.storage.local.set({ isRecording: isRecording });
    
    // Notify all tabs about the recording state change
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        try {
          chrome.tabs.sendMessage(tab.id, {
            action: "recordingStateChanged",
            enabled: isRecording
          });
        } catch (e) {
          console.error('Error sending message to tab:', e);
        }
      });
    });
    sendResponse({ success: true });
    return true;
  }
});
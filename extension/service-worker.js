let isRecording = false;
let connectedTabs = new Set();

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

// Handle tabs being removed
chrome.tabs.onRemoved.addListener((tabId) => {
  connectedTabs.delete(tabId);
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
  // Handle content script initialization
  if (request.action === "contentScriptReady") {
    if (sender.tab && sender.tab.id) {
      connectedTabs.add(sender.tab.id);
      // Send current recording state to newly connected content script
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "recordingStateChanged",
        enabled: isRecording
      }).catch(() => {
        // Tab might have been closed or refreshed, ignore errors
        connectedTabs.delete(sender.tab.id);
      });
    }
    sendResponse({ success: true });
    return true;
  }

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
    
    // Notify all connected tabs about the recording state change
    Array.from(connectedTabs).forEach(tabId => {
      chrome.tabs.sendMessage(tabId, {
        action: "recordingStateChanged",
        enabled: isRecording
      }).catch(() => {
        // Tab might have been closed or refreshed, remove it from connected tabs
        connectedTabs.delete(tabId);
      });
    });
    
    sendResponse({ success: true });
    return true;
  }
});
let isRecording = false;
let connectedTabs = new Set();

// Handle the extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.storage.local.set({ isRecording: false, screenshots: [] });
});

// Handle new tab connections
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'content-script') {
    const tabId = port.sender.tab.id;
    console.log('Tab connected:', tabId);
    connectedTabs.add(tabId);

    port.onDisconnect.addListener(() => {
      console.log('Tab disconnected:', tabId);
      connectedTabs.delete(tabId);
    });

    // Send initial state
    port.postMessage({ action: 'recordingStateChanged', enabled: isRecording });
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request.action);

  if (request.action === 'contentScriptReady') {
    if (sender.tab?.id) {
      connectedTabs.add(sender.tab.id);
      try {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'recordingStateChanged',
          enabled: isRecording
        });
      } catch (error) {
        console.error('Error sending message to tab:', error);
      }
    }
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'captureScreenshot') {
    if (!sender.tab?.id) {
      sendResponse({ error: 'No tab ID found' });
      return true;
    }

    // Get the active tab first
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Tab query error:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
        return;
      }

      const activeTab = tabs[0];
      if (!activeTab) {
        sendResponse({ error: 'No active tab found' });
        return;
      }

      // Ensure we have the necessary permissions
      chrome.permissions.request({
        permissions: ['activeTab']
      }, (granted) => {
        if (!granted) {
          sendResponse({ error: 'Screenshot permission denied' });
          return;
        }

        // Capture the visible tab
        chrome.tabs.captureVisibleTab(
          null,
          { format: 'png', quality: 100 },
          (dataUrl) => {
            if (chrome.runtime.lastError) {
              console.error('Screenshot error:', chrome.runtime.lastError);
              sendResponse({ error: chrome.runtime.lastError.message });
              return;
            }

            // Save screenshot to storage
            chrome.storage.local.get(['screenshots'], (result) => {
              const screenshots = result.screenshots || [];
              screenshots.push({
                imgData: dataUrl,
                timestamp: Date.now(),
                title: request.title || 'Screenshot',
                url: request.url
              });

              chrome.storage.local.set({ screenshots }, () => {
                if (chrome.runtime.lastError) {
                  console.error('Storage error:', chrome.runtime.lastError);
                  sendResponse({ error: chrome.runtime.lastError.message });
                } else {
                  console.log('Screenshot saved successfully');
                  sendResponse({ success: true });
                }
              });
            });
          }
        );
      });
    });
    return true;
  }

  if (request.action === 'toggleRecording') {
    console.log('Toggle recording:', request.enabled);
    isRecording = request.enabled;
    chrome.storage.local.set({ isRecording });

    // Notify all connected tabs
    Array.from(connectedTabs).forEach(tabId => {
      try {
        chrome.tabs.sendMessage(tabId, {
          action: 'recordingStateChanged',
          enabled: isRecording
        });
      } catch (error) {
        console.error('Error notifying tab:', tabId, error);
        connectedTabs.delete(tabId);
      }
    });

    sendResponse({ success: true });
    return true;
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  connectedTabs.delete(tabId);
});
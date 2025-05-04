document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startRecording');
  const stopBtn = document.getElementById('stopRecording');
  const openSidePanelBtn = document.getElementById('openSidePanel');
  const statusDiv = document.getElementById('status');

  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? '#dc3545' : '#666';
    console.log(`Status update: ${message}`);
  }

  // Start recording
  startBtn.addEventListener('click', async () => {
    try {
      // First request activeTab permission explicitly
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found');
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          console.log('Injected recording script');
          return true;
        }
      });

      chrome.runtime.sendMessage({ 
        action: 'toggleRecording', 
        enabled: true 
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Toggle error:', chrome.runtime.lastError);
          updateStatus('Error starting recording', true);
          return;
        }
        
        if (response?.success) {
          startBtn.disabled = true;
          stopBtn.disabled = false;
          updateStatus('Recording started');
        } else {
          updateStatus('Failed to start recording', true);
        }
      });
      
    } catch (error) {
      console.error('Start error:', error);
      updateStatus('Error: ' + error.message, true);
    }
  });

  // Stop recording
  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      action: 'toggleRecording', 
      enabled: false 
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Toggle error:', chrome.runtime.lastError);
        updateStatus('Error stopping recording', true);
        return;
      }

      if (response?.success) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        updateStatus('Recording stopped');
      } else {
        updateStatus('Failed to stop recording', true);
      }
    });
  });

  // Open side panel
  openSidePanelBtn.addEventListener('click', async () => {
    try {
      if (chrome.sidePanel) {
        await chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
        updateStatus('Opening side panel...');
      } else {
        throw new Error('Side panel not supported');
      }
    } catch (error) {
      console.error('Side panel error:', error);
      updateStatus('Error opening side panel', true);
    }
  });

  // Initialize state
  chrome.storage.local.get(['isRecording'], (result) => {
    const isRecording = result.isRecording || false;
    startBtn.disabled = isRecording;
    stopBtn.disabled = !isRecording;
    console.log('Initial recording state:', isRecording);
  });
});

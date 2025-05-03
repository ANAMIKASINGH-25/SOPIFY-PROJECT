document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startRecording');
  const stopBtn = document.getElementById('stopRecording');
  const openSidePanelBtn = document.getElementById('openSidePanel');
  const statusDiv = document.getElementById('status');

  // Function to update status message
  function updateStatus(message) {
    statusDiv.textContent = message;
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  }

  // Start recording
  startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      action: 'toggleRecording', 
      enabled: true 
    }, () => {
      if (chrome.runtime.lastError) {
        updateStatus('Error starting recording');
        return;
      }
      startBtn.disabled = true;
      stopBtn.disabled = false;
      updateStatus('Recording started');
      // Close popup after starting recording
      window.close();
    });
  });

  // Stop recording
  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      action: 'toggleRecording', 
      enabled: false 
    }, () => {
      if (chrome.runtime.lastError) {
        updateStatus('Error stopping recording');
        return;
      }
      startBtn.disabled = false;
      stopBtn.disabled = true;
      updateStatus('Recording stopped');
      // Close popup after stopping recording
      window.close();
    });
  });

  // Open side panel using Chrome API directly
  openSidePanelBtn.addEventListener('click', () => {
    if (chrome.sidePanel) {
      chrome.sidePanel.open().catch(error => {
        console.error('Error opening side panel:', error);
        updateStatus('Error opening side panel');
      });
    } else {
      updateStatus('Side panel not supported');
    }
    window.close();
  });

  // Check initial recording state
  chrome.storage.local.get(['isRecording'], (result) => {
    const isRecording = result.isRecording || false;
    startBtn.disabled = isRecording;
    stopBtn.disabled = !isRecording;
  });
});

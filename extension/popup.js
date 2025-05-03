document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startRecording');
  const stopBtn = document.getElementById('stopRecording');
  const openSidePanelBtn = document.getElementById('openSidePanel');
  const statusDiv = document.getElementById('status');

  function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? '#dc3545' : '#666';
    if (!isError) {
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.style.color = '#666';
      }, 2000);
    }
  }

  // Retry mechanism for extension commands
  async function sendMessageWithRetry(message, maxAttempts = 3) {
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        const response = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
        return response;
      } catch (error) {
        attempt++;
        if (attempt === maxAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // Start recording with retry
  startBtn.addEventListener('click', async () => {
    try {
      const response = await sendMessageWithRetry({ 
        action: 'toggleRecording', 
        enabled: true 
      });
      
      if (response && response.success) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        updateStatus('Recording started');
      } else {
        throw new Error('Failed to start recording');
      }
    } catch (error) {
      updateStatus('Error starting recording. Please try again.', true);
      console.error('Start recording error:', error);
      return;
    }
    window.close();
  });

  // Stop recording with retry
  stopBtn.addEventListener('click', async () => {
    try {
      const response = await sendMessageWithRetry({ 
        action: 'toggleRecording', 
        enabled: false 
      });
      
      if (response && response.success) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        updateStatus('Recording stopped');
      } else {
        throw new Error('Failed to stop recording');
      }
    } catch (error) {
      updateStatus('Error stopping recording. Please try again.', true);
      console.error('Stop recording error:', error);
      return;
    }
    window.close();
  });

  // Open side panel
  openSidePanelBtn.addEventListener('click', async () => {
    try {
      if (chrome.sidePanel) {
        await chrome.sidePanel.open();
        updateStatus('Opening side panel...');
      } else {
        throw new Error('Side panel not supported');
      }
    } catch (error) {
      updateStatus('Error opening side panel. Please try again.', true);
      console.error('Side panel error:', error);
      return;
    }
    window.close();
  });

  // Initialize state with retry
  async function initializeState() {
    try {
      const result = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['isRecording'], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
      
      const isRecording = result.isRecording || false;
      startBtn.disabled = isRecording;
      stopBtn.disabled = !isRecording;
    } catch (error) {
      console.error('Error initializing state:', error);
      updateStatus('Error loading state. Please reload.', true);
    }
  }

  initializeState();
});

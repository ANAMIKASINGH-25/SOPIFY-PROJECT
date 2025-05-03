document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const screenshotsContainer = document.getElementById('screenshots');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalClose = document.querySelector('.modal-close');

    // Initial state setup
    stopBtn.disabled = true;

    function updateScreenshotDisplay() {
        chrome.storage.local.get(['screenshots'], function(result) {
            screenshotsContainer.innerHTML = '';
            const screenshots = result.screenshots || [];
            
            if (screenshots.length === 0) {
                const noScreenshots = document.createElement('div');
                noScreenshots.className = 'no-screenshots';
                noScreenshots.textContent = 'No screenshots yet. Start recording to capture interactions.';
                screenshotsContainer.appendChild(noScreenshots);
                return;
            }

            // Display screenshots in reverse chronological order
            screenshots.reverse().forEach((screenshot, index) => {
                const container = document.createElement('div');
                container.className = 'screenshot-container';
                container.style.animationDelay = `${index * 0.1}s`;

                const title = document.createElement('div');
                title.className = 'screenshot-title';
                title.textContent = screenshot.title || 'Screenshot';

                const timestamp = document.createElement('div');
                timestamp.className = 'screenshot-timestamp';
                timestamp.textContent = new Date(screenshot.timestamp).toLocaleString();

                const img = document.createElement('img');
                img.className = 'screenshot-image';
                img.src = screenshot.imgData;
                img.alt = screenshot.title || 'Screenshot';
                img.loading = 'lazy'; // Enable lazy loading for better performance
                
                // Add click handler for full-size view
                img.addEventListener('click', () => {
                    modalImg.src = screenshot.imgData;
                    modal.style.display = 'block';
                    requestAnimationFrame(() => {
                        modal.classList.add('show');
                    });
                });

                container.appendChild(title);
                container.appendChild(timestamp);
                container.appendChild(img);
                screenshotsContainer.appendChild(container);
            });
        });
    }

    // Start recording
    startBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ 
            action: 'toggleRecording', 
            enabled: true 
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error starting recording:', chrome.runtime.lastError);
                return;
            }
            if (response && response.success) {
                startBtn.disabled = true;
                stopBtn.disabled = false;
            }
        });
    });

    // Stop recording
    stopBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ 
            action: 'toggleRecording', 
            enabled: false 
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error stopping recording:', chrome.runtime.lastError);
                return;
            }
            if (response && response.success) {
                startBtn.disabled = false;
                stopBtn.disabled = true;
            }
        });
    });

    // Clear all screenshots
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all screenshots? This action cannot be undone.')) {
            chrome.storage.local.set({ screenshots: [] }, () => {
                updateScreenshotDisplay();
                // Show feedback
                const noScreenshots = document.createElement('div');
                noScreenshots.className = 'no-screenshots';
                noScreenshots.textContent = 'All screenshots cleared.';
                screenshotsContainer.appendChild(noScreenshots);
            });
        }
    });

    // Modal close handlers with smooth transition
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match the CSS transition duration
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle escape key for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.screenshots) {
            updateScreenshotDisplay();
        }
    });

    // Check initial recording state
    chrome.storage.local.get(['isRecording'], (result) => {
        const isRecording = result.isRecording || false;
        startBtn.disabled = isRecording;
        stopBtn.disabled = !isRecording;
    });

    // Initial load of screenshots
    updateScreenshotDisplay();
});
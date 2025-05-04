let isEnabled = false;
let port = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

// Function to establish connection with service worker
function connectToServiceWorker() {
    if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
        console.error('Max connection attempts reached');
        return;
    }

    try {
        port = chrome.runtime.connect({ name: 'content-script' });
        console.log('Connected to service worker');

        port.onMessage.addListener((message) => {
            console.log('Received message:', message);
            if (message.action === 'recordingStateChanged') {
                isEnabled = message.enabled;
            }
        });

        port.onDisconnect.addListener(() => {
            console.log('Disconnected from service worker');
            if (chrome.runtime.lastError) {
                console.error('Connection error:', chrome.runtime.lastError);
            }
            port = null;
            connectionAttempts++;
            setTimeout(connectToServiceWorker, 1000);
        });

    } catch (error) {
        console.error('Connection error:', error);
        connectionAttempts++;
        setTimeout(connectToServiceWorker, 1000);
    }
}

// Initialize connection
connectToServiceWorker();

// Function to capture screenshot with title
function captureScreenshot(title) {
    if (!isEnabled) return;
    
    try {
        chrome.runtime.sendMessage({
            action: 'captureScreenshot',
            url: window.location.href,
            title: title
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Screenshot error:', chrome.runtime.lastError);
                if (port) port.disconnect();
            }
        });
    } catch (error) {
        console.error('Screenshot error:', error);
        if (port) port.disconnect();
    }
}

// Message listener for direct messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);
    if (message.action === 'recordingStateChanged') {
        isEnabled = message.enabled;
        sendResponse({ status: 'ok' });
    }
    return true;
});

// Track clicks
document.addEventListener('click', (e) => {
    if (!isEnabled) return;
    const target = e.target;
    const elementType = target.tagName.toLowerCase();
    const elementText = target.textContent?.trim().substring(0, 30) || '';
    const title = `Clicked ${elementType}${elementText ? ': ' + elementText : ''} at (${e.clientX}, ${e.clientY})`;
    captureScreenshot(title);
});

// Track text selection
document.addEventListener('mouseup', (e) => {
    if (!isEnabled) return;
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
        const truncatedText = selectedText.length > 30 ? 
            selectedText.substring(0, 30) + '...' : 
            selectedText;
        captureScreenshot(`Selected text: "${truncatedText}"`);
    }
});

// Track document edits
document.addEventListener('input', (e) => {
    if (!isEnabled) return;
    const target = e.target;
    if (target.matches('input, textarea, [contenteditable="true"]')) {
        const text = target.value || target.textContent || '';
        const truncatedText = text.length > 30 ? 
            text.substring(0, 30) + '...' : 
            text;
        captureScreenshot(`Edited text: "${truncatedText}"`);
    }
});

// Initialize observers for dynamic content
const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;
    
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('input, textarea, [contenteditable="true"]')) {
                        // New editable element added
                        captureScreenshot(`New input element added: ${node.tagName.toLowerCase()}`);
                    }
                }
            });
        }
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Log initialization
console.log('Content script initialized');

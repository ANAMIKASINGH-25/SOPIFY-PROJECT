// Initialize state
let isEnabled = true;
let previousContent = new Map();
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

// Function to establish connection with service worker
function establishConnection() {
  if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
    console.log("Max connection attempts reached");
    return;
  }

  chrome.runtime.sendMessage({ action: "contentScriptReady" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("Retrying connection...");
      connectionAttempts++;
      setTimeout(establishConnection, 1000); // Retry after 1 second
    }
  });
}

// Initialize connection
establishConnection();

// Special handling for Google Docs
function initializeGoogleDocsHandlers() {
  // Find the main editor iframe in Google Docs
  const editorIframe = document.querySelector('.docs-editor-container iframe');
  if (editorIframe) {
    try {
      const editorDocument = editorIframe.contentDocument || editorIframe.contentWindow.document;
      
      // Add handlers to the editor document
      setupEditTracking(editorDocument.body);
      
      // Handle text selection in Google Docs
      editorDocument.addEventListener('mouseup', (e) => {
        if (!isEnabled) return;
        const selection = editorDocument.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
          const truncatedText = selectedText.length > 30 ? 
            selectedText.substring(0, 30) + '...' : 
            selectedText;
          captureScreenshot(`Selected text in Google Docs: "${truncatedText}"`);
        }
      });

      // Handle edits in Google Docs
      editorDocument.addEventListener('input', () => {
        if (!isEnabled) return;
        captureScreenshot('Edit made in Google Docs');
      });
    } catch (e) {
      console.log('Error accessing Google Docs iframe:', e);
    }
  }
}

// Function to capture screenshot with title
function captureScreenshot(title) {
  if (!isEnabled) return;
  
  chrome.runtime.sendMessage({
    action: "captureScreenshot",
    url: window.location.href,
    title: title
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error capturing screenshot:", chrome.runtime.lastError);
      // Attempt to reestablish connection if needed
      establishConnection();
    }
  });
}

// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setExtensionState") {
    isEnabled = message.enabled;
    sendResponse({ status: "ok" });
  }
  if (message.action === "recordingStateChanged") {
    isEnabled = message.enabled;
    sendResponse({ status: "ok" });
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
function setupEditTracking(element) {
  if (!previousContent.has(element)) {
    previousContent.set(element, element.value || element.textContent || '');
  }

  const handleEdit = (e) => {
    if (!isEnabled) return;
    
    const target = e.target;
    const currentContent = target.value || target.textContent || '';
    const previousValue = previousContent.get(target) || '';
    
    if (currentContent !== previousValue) {
      const oldText = previousValue.substring(0, 30);
      const newText = currentContent.substring(0, 30);
      captureScreenshot(`Changed text from "${oldText}" to "${newText}"`);
      previousContent.set(target, currentContent);
    }
  };

  element.addEventListener('input', handleEdit);
  element.addEventListener('change', handleEdit);
}

// Initialize edit tracking for existing elements
function initializeEditTracking() {
  document.querySelectorAll('input[type="text"], input[type="search"], textarea, [contenteditable="true"]')
    .forEach(setupEditTracking);

  // Check if we're on Google Docs and initialize special handlers
  if (window.location.hostname === 'docs.google.com') {
    // Wait for Google Docs to fully load
    const checkForEditor = setInterval(() => {
      if (document.querySelector('.docs-editor-container iframe')) {
        clearInterval(checkForEditor);
        initializeGoogleDocsHandlers();
      }
    }, 1000);
  }
}

// Track dynamically added elements
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches('input[type="text"], input[type="search"], textarea, [contenteditable="true"]')) {
            setupEditTracking(node);
          }
          node.querySelectorAll('input[type="text"], input[type="search"], textarea, [contenteditable="true"]')
            .forEach(setupEditTracking);
        }
      });
    }
  }
});

// Start observing with broader scope for Google Docs
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// Initialize tracking
initializeEditTracking();

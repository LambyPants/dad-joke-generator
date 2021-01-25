console.log('Hello from the background script!');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('BACKGROUND:', { request, sender });
});

import DadJoke from './components/dad-joke';

let KneeSlapper;
let timeout;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, setup, punchline, userTimeout, source } = request;
  if (action === 'tellJoke') {
    // async because we are using a setTimeout
    (async () => {
      if (
        KneeSlapper &&
        KneeSlapper.widget.getAttribute('fade') === null &&
        source === 'background'
      ) {
        return;
      }
      ensureReady(source);
      KneeSlapper = new DadJoke(setup, punchline);
      KneeSlapper.init();
      timeout = setTimeout(() => {
        KneeSlapper.fadeAway();
      }, Number(userTimeout) * 1000 + 2000);
    })();
    // keep the messaging channel open for sendResponse
    return true;
  }
});

function ensureReady() {
  if (KneeSlapper) {
    // if we already have a joke, clean it up
    KneeSlapper.remove();
    KneeSlapper = undefined;
    clearTimeout(timeout);
  }
}

window.addEventListener('dad-joke-click', () => {
  ensureReady();
});

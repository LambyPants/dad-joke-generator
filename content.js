import DadJoke from './components/dad-joke';

let KneeSlapper;
let timeout;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, setup, punchline } = request;
  if (action === 'tellJoke') {
    // async because we are using a setTimeout
    (async () => {
      ensureReady();
      KneeSlapper = new DadJoke(setup, punchline);
      KneeSlapper.init();
      timeout = setTimeout(() => {
        KneeSlapper.fadeAway();
        sendResponse('Joke is all done! Ready for a new one!');
      }, 6000);
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

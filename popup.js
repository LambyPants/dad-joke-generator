// upper-scope variables available in all functions
let dadJokeButton;
let settingsButton;
let backButton;
let aboutButton;
let selectFrequency;
let selectTimeout;

let cachedUser;

document.addEventListener(
  'DOMContentLoaded',
  () => {
    // this is the button we click to get a new joke
    chrome.runtime.sendMessage({ type: 'getUser' }, (user) => {
      cachedUser = user;
      dadJokeButton = document.getElementById('dadJoke');
      settingsButton = document.getElementById('settings');
      aboutButton = document.getElementById('about');
      backButton = document.getElementById('backButton');
      selectFrequency = document.getElementById('frequency');
      selectTimeout = document.getElementById('timeout');
      dadJokeButton.addEventListener('click', handleDadJokeClick);
      settingsButton.addEventListener('click', handleOptionClick);
      aboutButton.addEventListener('click', handleOptionClick);
      backButton.addEventListener('click', handleOptionClick);
      selectFrequency.querySelectorAll('option').forEach((item) => {
        if (item.value === cachedUser.frequency) {
          item.setAttribute('selected', '');
        }
      });
      selectFrequency.addEventListener('change', (e) => {
        chrome.runtime.sendMessage(
          { type: 'setFrequency', value: e.target.value },
          (updatedUser) => {
            cachedUser = updatedUser;
          },
        );
      });
      selectTimeout.querySelectorAll('option').forEach((item) => {
        if (item.value === cachedUser.timeout) {
          item.setAttribute('selected', '');
        }
      });
      selectTimeout.addEventListener('change', (e) => {
        chrome.runtime.sendMessage(
          { type: 'setTimeout', value: e.target.value },
          (updatedUser) => {
            cachedUser = updatedUser;
          },
        );
      });
    });
  },
  false,
);

function handleOptionClick({ currentTarget }) {
  const currentPage = currentTarget.getAttribute('data-page');
  document.querySelectorAll('.page').forEach((item) => {
    const itemPage = item.getAttribute('data-page');
    if (itemPage === currentPage) {
      item.removeAttribute('hidden');
    } else {
      item.setAttribute('hidden', '');
    }
  });
  if (currentPage === 'home') {
    backButton.setAttribute('hidden', '');
  } else {
    backButton.removeAttribute('hidden');
  }
}

async function handleDadJokeClick() {
  // disable the button until we hear a response
  dadJokeButton.setAttribute('disabled', '');
  // get the joke data
  chrome.runtime.sendMessage({ type: 'getJoke', source: 'click' }, () => {
    dadJokeButton.removeAttribute('disabled');
    // query tabs and grab the active one
  });
}

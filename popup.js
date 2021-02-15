// upper-scope variables available in all functions
let dadJokeButton;
let settingsButton;
let backButton;
let aboutButton;

document.addEventListener('DOMContentLoaded', () => {
  // this is the button we click to get a new joke
  dadJokeButton = document.getElementById('dadJoke');
  settingsButton = document.getElementById('settings');
  aboutButton = document.getElementById('about');
  backButton = document.getElementById('backButton');
  dadJokeButton.addEventListener('click', handleDadJokeClick);
  settingsButton.addEventListener('click', handleOptionClick);
  aboutButton.addEventListener('click', handleOptionClick);
  backButton.addEventListener('click', handleOptionClick);
});

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
  const setupJoke = await fetch(
    'https://official-joke-api.appspot.com/random_joke',
  );
  const { setup, punchline } = await setupJoke.json();
  // query tabs and grab the active one
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send a mesage to that active tab
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'tellJoke', punchline, setup },
      (response) => {
        dadJokeButton.removeAttribute('disabled');
      },
    );
  });
}

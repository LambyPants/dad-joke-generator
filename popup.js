// upper-scope variables available in all functions
let dadJokeButton;
let setupLine;
let punchlineLine;

document.addEventListener('DOMContentLoaded', () => {
  // first we select all the DOM elements which do things
  // this is the button we click to get a new joke
  dadJokeButton = document.getElementById('dadJoke');
  // italicized setup line
  setupLine = document.getElementById('setup');
  // bold punchline
  punchlineLine = document.getElementById('punchline');

  dadJokeButton.addEventListener('click', handleDadJokeClick);
});

async function handleDadJokeClick() {
  // disable the button until we hear a response
  dadJokeButton.setAttribute('disabled', '');
  // get the joke data
  const setupJoke = await fetch(
    'https://official-joke-api.appspot.com/random_joke',
  );
  const { punchline, setup } = await setupJoke.json();
  // <!---------- DEMO PHASE 1 START -------------->
  // setupLine.innerText = setup;
  // punchlineLine.innerText = punchline;
  // <!---------- DEMO PHASE 1 END ---------------->

  // <!---------- DEMO PHASE 2 START -------------->

  // query tabs and grab the active one
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // send a mesage to that active tab
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'tellJoke', punchline, setup },
      (response) => {
        console.log('Received from content.js:', { response });
        dadJokeButton.removeAttribute('disabled');
      },
    );
  });
  // <!---------- DEMO PHASE 2 EMD --------------->
}

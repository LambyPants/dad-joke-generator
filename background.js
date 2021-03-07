const NEW_USER = {
  id: 'local',
  frequency: 'never',
  timeout: '5',
};

let cachedUser;
let cachedSetup = '';
let cachedPunchline = '';

let notificationAlarm;

const createAlarm = (period) => {
  console.log('period: ', period);
  notificationAlarm = chrome.alarms.create('myAlarm', {
    delayInMinutes: period,
  });
};

const randomNum = (max, min) => {
  return Math.max(Math.round(Math.random() * max), min);
};

const setAlarm = ({ frequency }) => {
  chrome.alarms.clearAll();
  switch (frequency) {
    case 'veryHigh':
      createAlarm(randomNum(1, 1));
      break;
    case 'high':
      createAlarm(randomNum(70, 45));
    case 'medium':
      createAlarm(randomNum(180, 60));
      break;
    case 'low':
      createAlarm(randomNum(360, 120));
      break;
    default:
  }
};

chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log('alarm: ', alarm);
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs && tabs[0] && tabs[0].id) {
      tellDadJoke('background', () => {});
    }
  });
  if (cachedUser) {
    setAlarm(cachedUser);
  }
});

const getUserData = (cb) => {
  chrome.storage.sync.get('user', async ({ user }) => {
    let foundUser = user;
    if (!foundUser || !foundUser.id) {
      foundUser = NEW_USER;
      chrome.storage.sync.set({ user: NEW_USER });
    }
    cachedUser = foundUser;
    console.log('user: ', cachedUser);
    if (!cachedPunchline || !cachedSetup) {
      await getJoke();
    }
    cb(foundUser);
  });
};

const setUserTimeout = (value, cb) => {
  const updatedUser = { ...cachedUser, timeout: value };
  chrome.storage.sync.set({ user: updatedUser }, () => {
    cb(updatedUser);
  });
};

const setUserFrequency = (value, cb) => {
  const updatedUser = { ...cachedUser, frequency: value };
  chrome.storage.sync.set({ user: updatedUser }, () => {
    setAlarm(updatedUser);
    cb(updatedUser);
  });
};

const getJoke = async () => {
  const setupJoke = await fetch(
    'https://official-joke-api.appspot.com/random_joke',
  );
  const { setup, punchline } = await setupJoke.json();
  console.log('setup: ', setup);
  cachedSetup = setup;
  cachedPunchline = punchline;
};

const tellDadJoke = (source, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!cachedPunchline || !cachedSetup) {
      await getJoke();
    }
    // send a mesage to that active tab
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'tellJoke',
      punchline: cachedPunchline,
      setup: cachedSetup,
      userFrequency: cachedUser.frequency,
      userTimeout: cachedUser.timeout,
      source: source || 'background',
    });
    await getJoke();
    sendResponse(cachedUser);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message: ', message);
  if (message.type === 'getUser') {
    getUserData(sendResponse);
  }
  if (message.type === 'setTimeout') {
    setUserTimeout(message.value, sendResponse);
  }
  if (message.type === 'setFrequency') {
    setUserFrequency(message.value, sendResponse);
  }
  if (message.type === 'getJoke') {
    tellDadJoke(message.source, sendResponse);
  }
  return true; // keep the messaging channel open for sendResponse
});

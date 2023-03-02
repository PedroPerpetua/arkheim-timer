// Auxiliary functions from: https://stackoverflow.com/a/70402480/13525157

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound(source, volume) {
  await createOffscreen();
  await chrome.runtime.sendMessage({ play: { source, volume } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Required to play the alarm sound."
  });
}

// Adjust badge count
async function setBadgeCount() {
  // from useTimersManager
  const STORAGE_KEY = "ARKHEIM_TIMER__TIMERS__STORAGE_KEY";
  const storage = await chrome.storage.sync.get(STORAGE_KEY);
  // The sync.get method returns a "filtered" object with the lookup key
  const storageObj = storage[STORAGE_KEY];
  const currentTime = new Date().getTime();
  let count = 0;
  for (const timer of storageObj) {
    const remaining = timer.end - currentTime;
    if (remaining < 0 && !timer.dismissed) count +=1;
  }
  await chrome.action.setBadgeText({text: count.toString()});
}

// On startup, set the right badge count
chrome.runtime.onStartup.addListener(async () => {
  await setBadgeCount();
});

// Add a listener for when alarms time out
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("[BACKGROUND] TRIGGERED", alarm.name);
  // from useTimersManager
  const ALARM_KEY = "ARKHEIM_TIMER";
  const timerPrefix = alarm.name.split(";")[0];
  if (timerPrefix !== ALARM_KEY) return;
  const ALLOWED_GAP = 10000 // 10 seconds
  // Check how long it was supposed to play
  const currentTime =  new Date().getTime();
  if (currentTime < alarm.scheduledTime + ALLOWED_GAP) {
    playSound("beep.mp3", 1);
  }
  // Fix the timers badge
  await setBadgeCount();
});

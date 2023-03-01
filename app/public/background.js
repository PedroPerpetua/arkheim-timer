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

// Add a listener for when alarms time out
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("[BACKGROUND] TRIGGERED", alarm.name);
  playSound("beep.mp3", 1)
  // Increase the badge in case the popup is closed
  // If the popup is open it'll automatically re-adjust to the correct value
  chrome.action.getBadgeText({}).then((t) => {
    const count = Number(t);
    chrome.action.setBadgeText({text: (count+1).toString()});
  });
});

const message = "Happy birthday Jaidan";
const speakBtn = document.getElementById("speakBtn");
const statusEl = document.getElementById("status");
let pendingSpeak = false;

function updateStatus(text) {
  statusEl.textContent = text;
}

function pickMaleVoice(voices) {
  const preferred = voices.find((voice) =>
    /male|man|masc|m|guy/i.test(voice.name)
  );
  if (preferred) {
    return preferred;
  }
  return voices.find((voice) => /en/i.test(voice.lang)) || voices[0];
}

function speakMessage() {
  if (!("speechSynthesis" in window)) {
    updateStatus("Sorry, this browser does not support speech.");
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    pendingSpeak = true;
    updateStatus("Loading voices...");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  const voice = pickMaleVoice(voices);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onstart = () => updateStatus("Speaking...");
  utterance.onend = () => updateStatus("Done. Tap again to replay.");
  utterance.onerror = () => updateStatus("Could not play audio.");

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

speakBtn.addEventListener("click", speakMessage);

window.speechSynthesis.onvoiceschanged = () => {
  updateStatus("Ready.");
  if (pendingSpeak) {
    pendingSpeak = false;
    speakMessage();
  }
};

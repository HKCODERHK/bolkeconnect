// Mouth: browser text-to-speech (TTS) behind a small interface.
const synth = window.speechSynthesis

export const isSynthesisSupported = Boolean(synth)

// Chrome loads voices late; asking once now warms the list up.
synth?.getVoices()

function pickVoice(lang) {
  const voices = synth.getVoices()
  const language = lang.split('-')[0]
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.replace('_', '-').startsWith(language)) ||
    null
  )
}

// Returns true if it spoke, false if this device has no voice for the language
// (then the UI shows text only).
export function speak(text, lang) {
  if (!synth) return false
  const voice = pickVoice(lang)
  if (!voice) return false
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = voice
  utterance.lang = voice.lang
  synth.speak(utterance)
  return true
}

// Barge-in: stop the bot immediately when the customer starts talking.
export function cancelSpeech() {
  synth?.cancel()
}

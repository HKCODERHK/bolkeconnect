import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { LANGUAGES, DEFAULT_SHOP_LANGUAGES } from './config/languages'
import { isRecognitionSupported, useSpeechRecognition } from './speech/recognition'
import { cancelSpeech, speak } from './speech/synthesis'
import LanguagePicker from './components/LanguagePicker'
import MicButton from './components/MicButton'
import ChatBubbles from './components/ChatBubbles'
import TypedInput from './components/TypedInput'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const ERROR_HELP = {
  'not-allowed': 'Microphone is blocked. Allow it in the browser, or type your order below.',
  'no-speech': "I didn't hear anything. Tap the mic and try again.",
  'audio-capture': 'No microphone found. You can type your order below.',
  network: 'Speech service had a network problem. Try again or type.',
}

let nextId = 1

function App() {
  const [lang, setLang] = useState(DEFAULT_SHOP_LANGUAGES[0])
  const [messages, setMessages] = useState([])

  // Render's free server sleeps; wake it up as soon as the page opens.
  useEffect(() => {
    axios.get(`${SERVER_URL}/health`).catch(() => {})
  }, [])

  const addMessage = (role, text) => setMessages((prev) => [...prev, { id: nextId++, role, text }])

  // Phase 1: the bot just echoes what it heard. In Phase 2 this becomes the LLM call.
  const handleCustomerText = useCallback(
    (text) => {
      addMessage('user', text)
      const reply = `${LANGUAGES[lang].echoPrefix} ${text}`
      addMessage('bot', reply)
      const spoke = speak(reply, lang)
      if (!spoke) addMessage('bot', '(No voice for this language on this device, so text only.)')
    },
    [lang],
  )

  const { listening, interim, error, start, stop } = useSpeechRecognition({
    lang,
    onFinal: handleCustomerText,
  })

  const toggleMic = () => {
    if (listening) return stop()
    cancelSpeech() // barge-in: stop the bot if it is talking
    start()
  }

  return (
    <main className="mx-auto flex h-dvh max-w-xl flex-col bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-xl font-bold">BolkeConnect</h1>
          <p className="text-xs text-slate-500">बोलके: order by speaking</p>
        </div>
        <LanguagePicker value={lang} onChange={setLang} options={DEFAULT_SHOP_LANGUAGES} />
      </header>

      <ChatBubbles messages={messages} interim={interim} />

      <footer className="space-y-3 border-t border-slate-200 bg-white p-4">
        {!isRecognitionSupported && (
          <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">
            This browser can't listen. Please use Chrome or Edge for voice, or type your order.
          </p>
        )}
        {error && <p className="text-sm text-red-600">{ERROR_HELP[error] || `Speech error: ${error}`}</p>}
        <div className="flex justify-center">
          <MicButton listening={listening} onClick={toggleMic} disabled={!isRecognitionSupported} />
        </div>
        <TypedInput onSend={handleCustomerText} />
      </footer>
    </main>
  )
}

export default App

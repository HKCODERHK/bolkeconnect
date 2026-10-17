// Ears: browser speech-to-text (ASR) behind a small interface.
// If we later switch to a paid ASR service, only this file changes.
import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

export const isRecognitionSupported = Boolean(SpeechRecognitionAPI)

export function useSpeechRecognition({ lang, onFinal }) {
  const recognitionRef = useRef(null)
  const onFinalRef = useRef(onFinal)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('') // live text while the customer is still speaking
  const [error, setError] = useState(null)

  // Keep the latest callback without restarting the recognizer.
  useEffect(() => {
    onFinalRef.current = onFinal
  }, [onFinal])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    if (!SpeechRecognitionAPI) return
    recognitionRef.current?.abort()
    setError(null)

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang // e.g. hi-IN, mr-IN, en-IN
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event) => {
      let interimText = ''
      let finalText = ''
      let confidence = null
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
          confidence = result[0].confidence
        } else {
          interimText += result[0].transcript
        }
      }
      setInterim(interimText)
      if (finalText.trim()) onFinalRef.current(finalText.trim(), confidence)
    }
    recognition.onerror = (event) => setError(event.error) // 'not-allowed', 'no-speech', ...
    recognition.onend = () => {
      setListening(false)
      setInterim('')
    }

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [lang])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  return { listening, interim, error, start, stop }
}

import { useState } from 'react'

// Fallback for browsers without speech recognition (e.g. Firefox) or denied mic access.
function TypedInput({ onSend }) {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or type your order here"
        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2"
      />
      <button type="submit" className="rounded-lg bg-slate-800 px-4 py-2 text-white">
        Send
      </button>
    </form>
  )
}

export default TypedInput

import { useEffect, useRef } from 'react'

function ChatBubbles({ messages, interim }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, interim])

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.length === 0 && !interim && (
        <p className="pt-10 text-center text-slate-400">Tap the mic and speak, or type below.</p>
      )}
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <p
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 shadow'
            }`}
          >
            {m.text}
          </p>
        </div>
      ))}
      {interim && (
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl bg-emerald-200 px-4 py-2 italic text-emerald-900">{interim}</p>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}

export default ChatBubbles

import { FaMicrophone, FaStop } from 'react-icons/fa'

function MicButton({ listening, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={listening ? 'Stop listening' : 'Start speaking'}
      className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white shadow-lg transition
        ${listening ? 'animate-pulse bg-red-500' : 'bg-emerald-600 hover:bg-emerald-700'}
        disabled:cursor-not-allowed disabled:bg-slate-300`}
    >
      {listening ? <FaStop /> : <FaMicrophone />}
    </button>
  )
}

export default MicButton

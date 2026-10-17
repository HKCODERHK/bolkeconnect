import { LANGUAGES } from '../config/languages'

function LanguagePicker({ value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      Language
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
      >
        {options.map((code) => (
          <option key={code} value={code}>
            {LANGUAGES[code].label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default LanguagePicker

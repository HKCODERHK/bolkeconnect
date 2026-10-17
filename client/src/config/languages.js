// One place that lists every language the app can speak/listen to.
// Adding a language = adding one entry here (plus catalog aliases for the shop).
// Each shop later picks a subset through its own `languages[]` setting.
export const LANGUAGES = {
  'en-IN': { label: 'English', echoPrefix: 'You said:' },
  'hi-IN': { label: 'हिन्दी (Hindi)', echoPrefix: 'आपने कहा:' },
  'mr-IN': { label: 'मराठी (Marathi)', echoPrefix: 'तुम्ही म्हणालात:' },
}

// Until shops exist in the database (Phase 2), every language above is offered.
export const DEFAULT_SHOP_LANGUAGES = Object.keys(LANGUAGES)

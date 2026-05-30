// Generates and persists an anonymous session ID in localStorage
// Used to prevent the same person from confirming an issue twice
// Member 2 imports getSessionId() and passes it to confirmIssue()

const SESSION_KEY = 'fmh_session_id'

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server' // SSR safety

  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    // Generate a random ID and persist it
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

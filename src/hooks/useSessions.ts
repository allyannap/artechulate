import { useCallback, useEffect, useState } from 'react'
import type { Session } from '../types'

const STORAGE_KEY = 'artechulate:sessions'

function loadSessions(): Session[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  const addSession = useCallback((session: Session) => {
    setSessions((prev) => [session, ...prev])
  }, [])

  return { sessions, addSession }
}

import { useState } from 'react'
import type { Audience, Topic } from './types'
import { useSessions } from './hooks/useSessions'
import { useTones } from './hooks/useTones'
import Header, { type View } from './components/Header'
import LandingView from './components/LandingView'
import SpinScreen from './components/SpinScreen'
import ResearchOverlay from './components/ResearchOverlay'
import SpeechOverlay from './components/SpeechOverlay'
import SessionSummary from './components/SessionSummary'
import HistoryView from './components/HistoryView'

type Phase = 'idle' | 'research' | 'speech' | 'summary'

function App() {
  const [view, setView] = useState<View>('home')
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null)
  const [currentAudience, setCurrentAudience] = useState<Audience>('recruiter')
  const [resetSignal, setResetSignal] = useState(0)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const { sessions, addSession } = useSessions()
  const { primeAudio } = useTones()

  const clearRecording = () => {
    setRecordingUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  const handleStartResearch = (topic: Topic, audience: Audience) => {
    primeAudio()
    clearRecording()
    setCurrentTopic(topic)
    setCurrentAudience(audience)
    setPhase('research')
  }

  const handleSpeechDone = (url: string | null) => {
    setRecordingUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setPhase('summary')
  }

  const handleTryAnother = () => {
    clearRecording()
    setCurrentTopic(null)
    setPhase('idle')
    setResetSignal((n) => n + 1)
  }

  const handleDismissOverlay = () => {
    if (phase === 'summary') clearRecording()
    setPhase('idle')
  }

  const handleSave = (selfRating: number, notes: string) => {
    if (!currentTopic) return
    addSession({
      id: crypto.randomUUID(),
      topic: currentTopic.name,
      category: currentTopic.category,
      audience: currentAudience,
      date: new Date().toISOString(),
      selfRating,
      notes,
    })
  }

  return (
    <div className="hero-gradient min-h-screen">
      <Header view={view} onNavigate={setView} />
      <main>
        {view === 'home' && <LandingView />}
        {view === 'history' && <HistoryView sessions={sessions} />}
        {view === 'spin' && (
          <SpinScreen onStartResearch={handleStartResearch} resetSignal={resetSignal} />
        )}
      </main>

      {phase === 'research' && currentTopic && (
        <ResearchOverlay
          topic={currentTopic}
          audience={currentAudience}
          onDone={() => setPhase('speech')}
          onDismiss={handleDismissOverlay}
        />
      )}
      {phase === 'speech' && currentTopic && (
        <SpeechOverlay
          topic={currentTopic}
          audience={currentAudience}
          onDone={handleSpeechDone}
          onDismiss={handleDismissOverlay}
        />
      )}
      {phase === 'summary' && currentTopic && (
        <SessionSummary
          topic={currentTopic}
          audience={currentAudience}
          recordingUrl={recordingUrl}
          onSave={handleSave}
          onTryAnother={handleTryAnother}
          onDismiss={handleDismissOverlay}
        />
      )}
    </div>
  )
}

export default App

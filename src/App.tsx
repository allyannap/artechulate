import { useState } from 'react'
import type { Audience, Topic } from './types'
import { useSessions } from './hooks/useSessions'
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
  const { sessions, addSession } = useSessions()

  const handleStartResearch = (topic: Topic, audience: Audience) => {
    setCurrentTopic(topic)
    setCurrentAudience(audience)
    setPhase('research')
  }

  const handleTryAnother = () => {
    setCurrentTopic(null)
    setPhase('idle')
    setResetSignal((n) => n + 1)
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
        />
      )}
      {phase === 'speech' && currentTopic && (
        <SpeechOverlay
          topic={currentTopic}
          audience={currentAudience}
          onDone={() => setPhase('summary')}
        />
      )}
      {phase === 'summary' && currentTopic && (
        <SessionSummary
          topic={currentTopic}
          audience={currentAudience}
          onSave={handleSave}
          onTryAnother={handleTryAnother}
        />
      )}
    </div>
  )
}

export default App

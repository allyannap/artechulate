import { useCallback, useEffect, useRef, useState } from 'react'

type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'stopped' | 'denied' | 'unsupported'

interface UseSpeechRecorderResult {
  status: RecorderStatus
  error: string | null
  startRecording: () => Promise<boolean>
  stopRecording: () => Promise<Blob | null>
}

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
  return candidates.find((type) => MediaRecorder.isTypeSupported(type))
}

export function useSpeechRecorder(): UseSpeechRecorderResult {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const stopPromiseRef = useRef<{
    resolve: (blob: Blob | null) => void
  } | null>(null)

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => cleanupStream(), [cleanupStream])

  const startRecording = useCallback(async () => {
    setError(null)

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      setError('Recording isn’t supported in this browser.')
      return false
    }

    if (typeof MediaRecorder === 'undefined') {
      setStatus('unsupported')
      setError('Recording isn’t supported in this browser.')
      return false
    }

    try {
      setStatus('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const mimeType = pickMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onstop = () => {
        const type = recorder.mimeType || mimeType || 'audio/webm'
        const blob =
          chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type }) : null
        cleanupStream()
        setStatus('stopped')
        stopPromiseRef.current?.resolve(blob)
        stopPromiseRef.current = null
      }

      recorder.start(250)
      setStatus('recording')
      return true
    } catch {
      cleanupStream()
      setStatus('denied')
      setError('Microphone access was blocked. You can still reflect — just no replay.')
      return false
    }
  }, [cleanupStream])

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') {
      cleanupStream()
      setStatus((prev) => (prev === 'recording' ? 'stopped' : prev))
      return null
    }

    return new Promise<Blob | null>((resolve) => {
      stopPromiseRef.current = { resolve }
      try {
        recorder.stop()
      } catch {
        cleanupStream()
        setStatus('stopped')
        resolve(null)
        stopPromiseRef.current = null
      }
    })
  }, [cleanupStream])

  return { status, error, startRecording, stopRecording }
}

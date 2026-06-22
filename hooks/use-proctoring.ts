import { useState, useEffect, useCallback } from "react"

export type ViolationType = "tab_switch" | "window_blur" | "fullscreen_exit"

export interface ProctoringLog {
  type: ViolationType
  timestamp: string
}

export function useProctoring(isActive: boolean) {
  const [tabSwitches, setTabSwitches] = useState(0)
  const [windowBlurs, setWindowBlurs] = useState(0)
  const [fullscreenLeaves, setFullscreenLeaves] = useState(0)
  const [logs, setLogs] = useState<ProctoringLog[]>([])
  const [showWarning, setShowWarning] = useState(false)
  const [hasShownWarning, setHasShownWarning] = useState(false)

  const logViolation = useCallback((type: ViolationType) => {
    setLogs((prev) => [...prev, { type, timestamp: new Date().toISOString() }])
    
    // Only show warning once
    if (!hasShownWarning) {
      setShowWarning(true)
      setHasShownWarning(true)
    }
  }, [hasShownWarning])

  // Track Tab Switching (Visibility API)
  useEffect(() => {
    if (!isActive) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1)
        logViolation("tab_switch")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isActive, logViolation])

  // Track Window Blur (Losing focus on the browser window entirely)
  useEffect(() => {
    if (!isActive) return

    const handleBlur = () => {
      setWindowBlurs((prev) => prev + 1)
      logViolation("window_blur")
    }

    window.addEventListener("blur", handleBlur)
    return () => {
      window.removeEventListener("blur", handleBlur)
    }
  }, [isActive, logViolation])

  // Track Fullscreen Exit
  useEffect(() => {
    if (!isActive) return

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenLeaves((prev) => prev + 1)
        logViolation("fullscreen_exit")
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [isActive, logViolation])

  // Function to forcefully enter fullscreen
  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
      })
    }
  }, [])

  const dismissWarning = useCallback(() => {
    setShowWarning(false)
  }, [])

  return {
    tabSwitches,
    windowBlurs,
    fullscreenLeaves,
    logs,
    showWarning,
    dismissWarning,
    enterFullscreen
  }
}

"use client"

import { useState, useEffect } from "react"
import { QuizIntro } from "@/components/quiz-intro"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizComplete } from "@/components/quiz-complete"
import { useParams } from "next/navigation"
import { useProctoring } from "@/hooks/use-proctoring"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

interface Quiz {
  id: string
  title: string
  description: string | null
  is_active: boolean
  time_per_question: number
  questions: Question[]
}

type QuizState = "loading" | "intro" | "taking" | "completed" | "already-taken" | "not-found"

export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string
  const [state, setState] = useState<QuizState>("loading")
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set())
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finalScore, setFinalScore] = useState<number | undefined>(undefined)

  // Advanced Proctoring Hook
  const {
    tabSwitches,
    windowBlurs,
    fullscreenLeaves,
    logs,
    showWarning,
    dismissWarning,
    enterFullscreen
  } = useProctoring(state === "taking")

  const loadQuiz = async (restoredState?: string) => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`)
      if (!response.ok) throw new Error("Failed to load quiz")
      const data = await response.json()

      console.log("Quiz loaded:", data)
      setQuiz(data)
      setState(prevState => {
        if (restoredState) return restoredState as QuizState
        if (prevState === "already-taken" || prevState === "taking") return prevState
        return "intro"
      })
    } catch (error) {
      console.error("Quiz loading error:", error)
      setState("not-found")
    }
  }

  const checkPreviousAttempt = () => {
    const attemptKey = `quiz_attempt_${quizId}`
    const progressKey = `quiz_progress_${quizId}`
    
    const previousAttempt = localStorage.getItem(attemptKey)
    const savedProgress = localStorage.getItem(progressKey)
    
    if (previousAttempt === "completed") {
      console.log("Quiz already completed, setting state to already-taken")
      return "already-taken"
    }
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        console.log("Restoring saved progress:", progress)
        
        setStudentName(progress.studentName || "")
        setStudentEmail(progress.studentEmail || "")
        setAttemptId(progress.attemptId || null)
        setCurrentQuestionIndex(progress.currentQuestionIndex || 0)
        setAnswers(progress.answers || {})
        setAnsweredQuestions(new Set(progress.answeredQuestions || []))
        
        if (progress.state && progress.state !== "intro") {
          return progress.state
        }
      } catch (error) {
        console.error("Error parsing saved progress:", error)
        localStorage.removeItem(progressKey)
      }
    }
    return undefined
  }

  useEffect(() => {
    const restoredState = checkPreviousAttempt()
    loadQuiz(restoredState)
  }, [quizId])

  // Save progress whenever state changes
  useEffect(() => {
    if (state === "taking" && quiz && studentName && studentEmail) {
      saveProgress()
    }
  }, [state, currentQuestionIndex, answers, answeredQuestions, studentName, studentEmail, quiz])

  const saveProgress = () => {
    const progressKey = `quiz_progress_${quizId}`
    const progress = {
      studentName,
      studentEmail,
      attemptId,
      currentQuestionIndex,
      answers,
      answeredQuestions: Array.from(answeredQuestions),
      state,
      timestamp: Date.now()
    }
    
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress))
      console.log("Progress saved:", progress)
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  const startQuiz = async (name: string, email: string) => {
    if (isStarting) return
    setIsStarting(true)
    setStudentName(name)
    setStudentEmail(email)

    // Force fullscreen mode
    enterFullscreen()

    try {
      const browserFingerprint = generateBrowserFingerprint()
      
      const response = await fetch(`/api/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: name,
          student_email: email,
          browser_fingerprint: browserFingerprint
        })
      })

      if (!response.ok) throw new Error("Failed to create attempt")
      const attempt = await response.json()

      setAttemptId(attempt.id)
      setState("taking")
      saveProgress()
    } catch (error) {
      console.error("Error starting quiz:", error)
      setIsStarting(false)
    }
  }

  const generateBrowserFingerprint = () => {
    const fingerprint = 
      navigator.userAgent +
      navigator.language +
      screen.width +
      screen.height +
      new Date().getTimezoneOffset() +
      navigator.platform

    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    return `fp_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`
  }

  const handleAnswerChange = (answer: string) => {
    if (!quiz) return
    const questionId = quiz.questions[currentQuestionIndex].id
    
    if (answeredQuestions.has(questionId)) {
      console.log("Question already answered, ignoring change")
      return
    }
    
    setAnsweredQuestions(prev => new Set([...prev, questionId]))
    setAnswers({ ...answers, [questionId]: answer })
    saveProgress()
  }

  const goToNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      saveProgress()
    }
  }

  const submitQuiz = async (terminated = false) => {
    if (!quiz || !attemptId) return
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          answers,
          tabSwitches,
          windowBlurs,
          fullscreenLeaves,
          proctoringLogs: logs,
          terminated: false // per requirements, never terminate
        })
      })

      if (response.status === 404) {
        localStorage.removeItem(`quiz_attempt_${quizId}`)
        localStorage.removeItem(`quiz_progress_${quizId}`)
        alert("Your quiz session was invalid or expired. The page will reload so you can start again.")
        window.location.reload()
        return
      }

      if (!response.ok) throw new Error("Failed to submit answers")
      const result = await response.json()
      
      // Save final score state
      setFinalScore(result.score)

      // Clean up local progress
      localStorage.setItem(`quiz_attempt_${quizId}`, "completed")
      localStorage.removeItem(`quiz_progress_${quizId}`)

      setState("completed")
      
      // Exit fullscreen mode if still active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => console.error(e));
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      setIsSubmitting(false)
    }
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (state === "not-found") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h1>
          <p className="text-gray-600">The quiz you're looking for doesn't exist or is no longer active.</p>
        </div>
      </div>
    )
  }

  if (state === "already-taken") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Quiz Already Completed
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              You have already taken this quiz and cannot retake it.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Quiz ID: <span className="font-mono text-gray-700">{quizId}</span></p>
            </div>
            <p className="text-gray-500 text-sm">
              If you believe this is an error, please contact your teacher.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (state === "intro" && quiz) {
    return (
      <QuizIntro
        quiz={{
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          question_count: quiz.questions.length,
        }}
        onStart={startQuiz}
        isStarting={isStarting}
      />
    )
  }

  if (state === "taking" && quiz) {
    if (!quiz.questions || quiz.questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Questions Found</h1>
            <p className="text-gray-600">This quiz has no questions available.</p>
          </div>
        </div>
      )
    }

    if (currentQuestionIndex >= quiz.questions.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Error</h1>
            <p className="text-gray-600">Question index is out of range.</p>
          </div>
        </div>
      )
    }

    const currentQuestion = quiz.questions[currentQuestionIndex]
    const selectedAnswer = answers[currentQuestion.id] || ""
    const hasAnswered = answeredQuestions.has(currentQuestion.id)

    return (
      <>
        {/* Proctoring Warning Modal */}
        <AlertDialog open={showWarning} onOpenChange={dismissWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600 flex items-center">
                <span className="text-2xl mr-2">⚠️</span> Suspicious Activity Detected
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-700">
                You have switched tabs, changed windows, or exited fullscreen. 
                <br /><br />
                <strong>This incident has been recorded.</strong> Please remain focused on the quiz window. Further violations will also be logged. Do not do it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={dismissWarning} className="bg-red-600 hover:bg-red-700">
                I Understand, Return to Quiz
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <QuizQuestion
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerChange={handleAnswerChange}
          onNext={goToNext}
          onSubmit={() => submitQuiz(false)}
          canGoNext={selectedAnswer !== ""}
          isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
          hasAnswered={hasAnswered}
          isSubmitting={isSubmitting}
          timeLimit={quiz.time_per_question || 30}
        />
      </>
    )
  }

  if (state === "completed" && quiz) {
    return (
      <QuizComplete
        quiz={{ title: quiz.title }}
        studentName={studentName}
        score={finalScore}
        totalQuestions={quiz.questions.length}
        isTerminated={false}
      />
    )
  }

  return null
}

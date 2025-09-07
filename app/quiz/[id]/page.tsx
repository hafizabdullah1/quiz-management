"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { QuizIntro } from "@/components/quiz-intro"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizComplete } from "@/components/quiz-complete"
import { useParams } from "next/navigation"

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

interface Quiz {
  id: string
  title: string
  description: string | null
  is_active: boolean
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
  const supabase = createClient()

  useEffect(() => {
    checkPreviousAttempt()
    loadQuiz()
  }, [quizId])

  // Save progress whenever state changes
  useEffect(() => {
    if (state === "taking" && quiz && studentName && studentEmail) {
      saveProgress()
    }
  }, [state, currentQuestionIndex, answers, answeredQuestions, studentName, studentEmail, quiz])

  const loadQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          questions(
            id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            question_order
          )
        `)
        .order('question_order', { foreignTable: 'questions' })
        .eq("id", quizId)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        console.error("Quiz loading error:", error)
        setState("not-found")
        return
      }

      console.log("Quiz loaded:", data)
      setQuiz(data)
      setState(prevState => prevState === "already-taken" ? "already-taken" : "intro")
    } catch (error) {
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
      setState("already-taken")
      return
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
          setState(progress.state)
        }
      } catch (error) {
        console.error("Error parsing saved progress:", error)
        localStorage.removeItem(progressKey)
      }
    }
  }

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

    // Create quiz attempt record
    try {
      const browserFingerprint = generateBrowserFingerprint()
      const { data: attempt, error } = await supabase
        .from("quiz_attempts")
        .insert({
          quiz_id: quizId,
          student_name: name,
          student_email: email,
          browser_fingerprint: browserFingerprint,
          total_questions: quiz?.questions?.length || 0,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating attempt:", error)
        setIsStarting(false)
        return
      }

      setAttemptId(attempt.id)
      setState("taking")
      saveProgress()
    } catch (error) {
      console.error("Error starting quiz:", error)
      setIsStarting(false)
    }
  }

  const generateBrowserFingerprint = () => {
    // Create a simple hash-based fingerprint instead of using canvas data
    const fingerprint = 
      navigator.userAgent +
      navigator.language +
      screen.width +
      screen.height +
      new Date().getTimezoneOffset() +
      navigator.platform

    // Create a simple hash to keep it under the size limit
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return `fp_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`
  }

  const handleAnswerChange = (answer: string) => {
    if (!quiz) return
    const questionId = quiz.questions[currentQuestionIndex].id
    
    // Check if this question has already been answered
    if (answeredQuestions.has(questionId)) {
      console.log("Question already answered, ignoring change")
      return
    }
    
    // Add to answered questions set
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

  const submitQuiz = async () => {
    if (!quiz || !attemptId) return
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      const studentAnswers = []

      for (const question of quiz.questions) {
        const studentAnswer = answers[question.id] || ""
        const isCorrect = studentAnswer === question.correct_answer

        if (isCorrect) correctAnswers++

        studentAnswers.push({
          attempt_id: attemptId,
          question_id: question.id,
          selected_answer: studentAnswer,
          is_correct: isCorrect,
        })
      }

      // Save student answers
      console.log("Saving student answers:", studentAnswers)
      const { data: savedAnswers, error: answersError } = await supabase.from("student_answers").insert(studentAnswers).select()

      if (answersError) {
        console.error("Error saving answers:", answersError)
        return
      }

      console.log("Successfully saved answers:", savedAnswers)

      // Update attempt with completion
      console.log("Updating attempt with score:", correctAnswers, "out of", quiz.questions.length)
      const { data: updatedAttempt, error: attemptError } = await supabase
        .from("quiz_attempts")
        .update({
          completed_at: new Date().toISOString(),
          score: correctAnswers,
          total_questions: quiz.questions.length,
        })
        .eq("id", attemptId)
        .select()

      if (attemptError) {
        console.error("Error updating attempt:", attemptError)
        return
      }

      console.log("Successfully updated attempt:", updatedAttempt)

      // Mark as completed in localStorage and clean up progress
      localStorage.setItem(`quiz_attempt_${quizId}`, "completed")
      localStorage.removeItem(`quiz_progress_${quizId}`)

      setState("completed")
    } catch (error) {
      console.error("Error submitting quiz:", error)
      setIsSubmitting(false)
    }
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (state === "not-found") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h1>
          <p className="text-gray-600">The quiz you're looking for doesn't exist or is no longer active.</p>
        </div>
      </div>
    )
  }

  if (state === "already-taken") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
    // Check if questions exist and current index is valid
    if (!quiz.questions || quiz.questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Questions Found</h1>
            <p className="text-gray-600">This quiz has no questions available.</p>
          </div>
        </div>
      )
    }

    if (currentQuestionIndex >= quiz.questions.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
      <QuizQuestion
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={quiz.questions.length}
        selectedAnswer={selectedAnswer}
        onAnswerChange={handleAnswerChange}
        onNext={goToNext}
        onSubmit={submitQuiz}
        canGoNext={selectedAnswer !== ""}
        isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
        hasAnswered={hasAnswered}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (state === "completed" && quiz) {
    return (
      <QuizComplete
        quiz={{ title: quiz.title }}
        studentName={studentName}
      />
    )
  }

  return null
}

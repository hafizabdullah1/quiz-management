"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TeacherNav } from "@/components/teacher-nav"
import { QuestionForm } from "@/components/question-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Save, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { QuestionBankModal } from "@/components/question-bank-modal"
import { QuestionBankItem } from "./question-bank/actions"

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
}

export default function CreateQuizPage() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timePerQuestion, setTimePerQuestion] = useState(30)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    }
    setQuestions([...questions, newQuestion])
  }

  const handleImportFromBank = (importedQuestions: QuestionBankItem[]) => {
    const newQuestions: Question[] = importedQuestions.map(q => ({
      id: crypto.randomUUID(),
      question: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
    }))
    
    // If there's only one empty question, replace it. Otherwise, append.
    if (questions.length === 1 && questions[0].question === "" && questions[0].option_a === "") {
      setQuestions(newQuestions)
    } else {
      setQuestions([...questions, ...newQuestions])
    }
  }

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const validateForm = () => {
    if (!title.trim()) {
      setError("Quiz title is required")
      return false
    }

    if (questions.length === 0) {
      setError("At least one question is required")
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`)
        return false
      }
      if (!q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) {
        setError(`All options for Question ${i + 1} are required`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          teacher_id: user.id,
          is_active: true,
          time_per_question: timePerQuestion,
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Create questions
      const questionsToInsert = questions.map((q, index) => ({
        quiz_id: quiz.id,
        question_text: q.question.trim(),
        option_a: q.option_a.trim(),
        option_b: q.option_b.trim(),
        option_c: q.option_c.trim(),
        option_d: q.option_d.trim(),
        correct_answer: q.correct_answer,
        question_order: index + 1,
      }))

      const { error: questionsError } = await supabase.from("questions").insert(questionsToInsert)

      if (questionsError) throw questionsError

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to create quiz")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
              <p className="text-gray-600 mt-1">Build your quiz with multiple choice questions</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title..."
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="timePerQuestion">Time Per Question (seconds) *</Label>
                <Input
                  id="timePerQuestion"
                  type="number"
                  min="5"
                  max="300"
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 30)}
                  className="mt-1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  How long students have to answer each question. Default is 30 seconds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <div className="flex gap-2">
                <Button type="button" onClick={() => setIsBankModalOpen(true)} variant="outline" className="text-primary border-primary/20 hover:bg-primary/5">
                  <Download className="w-4 h-4 mr-2" />
                  Import from Bank
                </Button>
                <Button type="button" onClick={addQuestion} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </div>

            {questions.map((question, index) => (
              <QuestionForm
                key={question.id}
                question={question}
                index={index}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
                canDelete={questions.length > 1}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary-hover">
              {loading ? (
                "Creating Quiz..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Quiz
                </>
              )}
            </Button>
          </div>
        </form>

        <QuestionBankModal 
          isOpen={isBankModalOpen} 
          onClose={() => setIsBankModalOpen(false)} 
          onImport={handleImportFromBank} 
        />
      </div>
    </div>
  )
}

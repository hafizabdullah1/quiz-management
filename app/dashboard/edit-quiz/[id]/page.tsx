"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TeacherNav } from "@/components/teacher-nav"
import { QuestionForm } from "@/components/question-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
}

export default function EditQuizPage() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timePerQuestion, setTimePerQuestion] = useState(30)
  const [questions, setQuestions] = useState<Question[]>([])
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      // 1. Check User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // 2. Fetch Quiz Data
      try {
        const { data: quiz, error: quizError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", params.id)
          .single()

        if (quizError) throw quizError
        if (quiz.teacher_id !== user.id) {
          throw new Error("Unauthorized to edit this quiz")
        }

        setTitle(quiz.title)
        setDescription(quiz.description || "")
        setTimePerQuestion(quiz.time_per_question || 30)

        // 3. Fetch Questions
        const { data: fetchedQuestions, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .eq("quiz_id", params.id)
          .order("question_order", { ascending: true })

        if (questionsError) throw questionsError

        const mappedQuestions = fetchedQuestions.map((q: any) => ({
          id: q.id,
          question: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
        }))

        setQuestions(mappedQuestions)
      } catch (err: any) {
        setError(err.message || "Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router, supabase, params.id])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(), // Temp ID for new questions
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const deleteQuestion = (id: string) => {
    // If it's a UUID from DB (not a temp crypto UUID), mark for deletion
    // Simple check: DB IDs are usually UUIDs too, but we can check if it exists in original questions
    // For now, simpler approach: just add to deleted list. 
    // If it was a new temp question, deleting it from state is enough, 
    // but adding it to deletedQuestionIds won't hurt because DB won't find it anyway.
    
    setDeletedQuestionIds([...deletedQuestionIds, id])
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

    setSaving(true)
    setError("")

    try {
      // 1. Update Quiz Details
      const { error: quizError } = await supabase
        .from("quizzes")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          time_per_question: timePerQuestion,
        })
        .eq("id", params.id)

      if (quizError) throw quizError

      // 2. Handle Deletions
      if (deletedQuestionIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("questions")
          .delete()
          .in("id", deletedQuestionIds)
        
        if (deleteError) {
          console.error("Error deleting questions:", deleteError)
          // Continue anyway, or throw? 
          // If ID was temp, Supabase will just delete 0 rows, which is fine.
        }
      }

      // 3. Upsert Questions
      // We need to differentiate new vs old. 
      // Supabase .upsert() works if we provide the primary key (id).
      // For NEW questions, the 'id' in state is a random UUID generated by crypto.randomUUID().
      // This is perfectly valid to use as the ID for the new row if we want, 
      // OR we can omit ID and let DB generate it.
      // But `upsert` needs to match existing rows. 
      // Safe bet: Use the ID we have. If it matches DB, it updates. If not, it inserts.
      
      const questionsToUpsert = questions.map((q, index) => ({
        id: q.id, // Use the ID from state (either from DB or generated)
        quiz_id: params.id,
        question_text: q.question.trim(),
        option_a: q.option_a.trim(),
        option_b: q.option_b.trim(),
        option_c: q.option_c.trim(),
        option_d: q.option_d.trim(),
        correct_answer: q.correct_answer,
        question_order: index + 1,
      }))

      const { error: questionsError } = await supabase
        .from("questions")
        .upsert(questionsToUpsert)

      if (questionsError) throw questionsError

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update quiz")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )
  }

  if (!user) return null

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
              <h1 className="text-3xl font-bold text-gray-900">Edit Quiz</h1>
              <p className="text-gray-600 mt-1">Update your quiz questions and details</p>
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
              <Button type="button" onClick={addQuestion} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
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
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Quiz
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

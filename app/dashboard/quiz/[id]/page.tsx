import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, BarChart3, Edit, Users } from "lucide-react"
import Link from "next/link"
import { CopyButton } from "@/components/copy-button"

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = await params;
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch quiz details
  const { data: quiz } = await supabase
    .from("quizzes")
    .select(`
      *,
      questions(*),
      quiz_attempts(count)
    `)
    .eq("id", quizId)
    .eq("teacher_id", user.id)
    .single()

  if (!quiz) {
    redirect("/dashboard")
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/quiz/${quiz.id}`
  const attemptCount = quiz.quiz_attempts?.[0]?.count || 0

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
              <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">{quiz.description || "No description provided"}</p>
            </div>
          </div>
          <Badge variant={quiz.is_active ? "default" : "secondary"}>{quiz.is_active ? "Active" : "Draft"}</Badge>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{quiz.questions?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{attemptCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-2xl font-bold text-gray-900">{new Date(quiz.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Quiz
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/quiz/${quiz.id}/results`}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View Results
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/edit-quiz/${quiz.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Quiz
            </Link>
          </Button>
        </div>

        {/* Share URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Share with Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <CopyButton url={shareUrl} />
            </div>
          </CardContent>
        </Card>

        {/* Questions Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quiz.questions?.map((question: any, index: number) => (
                <div key={question.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {index + 1}. {question.question_text}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      className={`p-2 rounded ${question.correct_answer === "A" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                    >
                      A. {question.option_a}
                    </div>
                    <div
                      className={`p-2 rounded ${question.correct_answer === "B" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                    >
                      B. {question.option_b}
                    </div>
                    <div
                      className={`p-2 rounded ${question.correct_answer === "C" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                    >
                      C. {question.option_c}
                    </div>
                    <div
                      className={`p-2 rounded ${question.correct_answer === "D" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                    >
                      D. {question.option_d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

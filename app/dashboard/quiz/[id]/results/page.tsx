import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TeacherNav } from "@/components/teacher-nav"
import { StudentResultCard } from "@/components/student-result-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, TrendingUp, Award } from "lucide-react"
import Link from "next/link"

export default async function QuizResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
    .select("*")
    .eq("id", id)
    .eq("teacher_id", user.id)
    .single()

  if (!quiz) {
    redirect("/dashboard")
  }

  // Fetch all attempts for this quiz with student answers
  const { data: attempts, error: attemptsError } = await supabase
    .from("quiz_attempts")
    .select(`
      *,
      student_answers(*)
    `)
    .eq("quiz_id", id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })

  // Calculate correct scores for each attempt
  if (attempts) {
    attempts.forEach(attempt => {
      const correctAnswers = attempt.student_answers?.filter((answer: any) => answer.is_correct).length || 0
      attempt.score = correctAnswers
    })
  }

  console.log("Attempts data:", attempts)
  console.log("Attempts error:", attemptsError)

  // Calculate statistics
  const totalAttempts = attempts?.length || 0
  const averageScore =
    totalAttempts > 0
      ? Math.round((attempts?.reduce((sum, attempt) => sum + attempt.score, 0) || 0) / totalAttempts)
      : 0
  const highestScore = totalAttempts > 0 ? Math.max(...(attempts?.map((a) => a.score) || [0])) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/quiz/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quiz
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600 mt-1">{quiz.title}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Highest Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {highestScore}/{attempts?.[0]?.total_questions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
          </CardHeader>
          <CardContent>
            {totalAttempts === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-600">Students haven't taken this quiz yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attempts?.map((attempt) => (
                  <StudentResultCard
                    key={attempt.id}
                    attempt={attempt}
                    quizId={id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

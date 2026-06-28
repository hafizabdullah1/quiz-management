import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TeacherNav } from "@/components/teacher-nav"
import { TeacherSidebar } from "@/components/teacher-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuizCard } from "@/components/quiz-card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Users, TrendingUp, Settings, FileText, ClipboardList } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch teacher's quizzes
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(`
      *,
      questions(count),
      quiz_attempts(count)
    `)
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalQuizzes = quizzes?.length || 0
  const totalAttempts = quizzes?.reduce((sum, quiz) => sum + (quiz.quiz_attempts?.[0]?.count || 0), 0) || 0

  // Calculate average score (placeholder for now)
  const averageScore = totalAttempts > 0 ? 75 : 0

  // Transform quizzes data for display
  const quizzesForDisplay =
    quizzes?.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      created_at: quiz.created_at,
      question_count: quiz.questions?.[0]?.count || 0,
      attempt_count: quiz.quiz_attempts?.[0]?.count || 0,
      is_active: quiz.is_active,
    })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/5 flex">
        <TeacherSidebar user={user} />

      <main className="flex-1 min-w-0">
      <TeacherNav user={user} />
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your quizzes and track student progress</p>
            </div>
            <Button asChild className="bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg">
              <Link href="/dashboard/create-quiz">
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <DashboardStats totalQuizzes={totalQuizzes} totalAttempts={totalAttempts} averageScore={averageScore} />

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/create-quiz" className="group">
                <div className="h-24 bg-white border-2 border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Create New Quiz</span>
                  <span className="text-xs text-gray-500">Start building</span>
                </div>
              </Link>

              <Link href="/dashboard/question-bank" className="group">
                <div className="h-24 bg-white border-2 border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Question Bank</span>
                  <span className="text-xs text-gray-500">Manage questions</span>
                </div>
              </Link>

              <div className="h-24 bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-60 cursor-not-allowed">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <span className="font-semibold text-gray-500 text-sm">Student Management</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>

              <div className="h-24 bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center opacity-60 cursor-not-allowed">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                </div>
                <span className="font-semibold text-gray-500 text-sm">Analytics</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Quizzes Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Quizzes</h2>
                <p className="text-gray-600 mt-1">Manage and track your quiz performance</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="opacity-60">
                  <Settings className="w-4 h-4 mr-1" />
                  Bulk Actions (Soon)
                </Button>
              </div>
            </div>

            {quizzesForDisplay.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by creating your first quiz and begin engaging with your students</p>
                <Button asChild className="bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg">
                  <Link href="/dashboard/create-quiz">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Quiz
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzesForDisplay.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

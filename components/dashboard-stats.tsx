import { BookOpen, Users, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  totalQuizzes: number
  totalAttempts: number
  averageScore: number
}

export function DashboardStats({ totalQuizzes, totalAttempts, averageScore }: DashboardStatsProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* First row - 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900">{totalQuizzes}</p>
              <p className="text-xs text-gray-500">Created quizzes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-900">{totalAttempts}</p>
              <p className="text-xs text-gray-500">Student submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second row - 1 card centered */}
      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
              <p className="text-xs text-gray-500">Overall performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Calendar, Mail, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface StudentResultCardProps {
  attempt: {
    id: string
    student_name: string
    student_email: string
    score: number
    total_questions: number
    completed_at: string
    started_at: string
    warnings_count?: number
    tab_switches_count?: number
    window_blurs_count?: number
    fullscreen_leaves_count?: number
    is_terminated?: boolean
  }
  quizId: string
}

export function StudentResultCard({ attempt, quizId }: StudentResultCardProps) {
  const router = useRouter()
  const percentage = Math.round((attempt.score / attempt.total_questions) * 100)
  const completedDate = new Date(attempt.completed_at).toLocaleDateString()
  const completedTime = new Date(attempt.completed_at).toLocaleTimeString()

  const handleViewDetails = () => {
    router.push(`/dashboard/quiz/${quizId}/results/${attempt.id}`)
  }

  const handleDownloadPDF = () => {
    window.open(`/api/quiz/${quizId}/results/${attempt.id}/pdf`, "_blank")
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800"
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>{attempt.student_name}</span>
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{attempt.student_email}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {attempt.is_terminated && (
                <Badge variant="destructive">Terminated</Badge>
            )}
            {((attempt.warnings_count || 0) > 0 || 
              (attempt.tab_switches_count || 0) > 0 || 
              (attempt.window_blurs_count || 0) > 0 || 
              (attempt.fullscreen_leaves_count || 0) > 0) && !attempt.is_terminated && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    Flagged
                </Badge>
            )}
            <Badge className={getScoreColor(percentage)}>{percentage}%</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Score:</span>
            <span className="ml-2 font-medium">
              {attempt.score} / {attempt.total_questions}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">Completed:</span>
            <span className="ml-1 font-medium">{completedDate}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500">Submitted at {completedTime}</div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleViewDetails} className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} className="flex-1 bg-primary hover:bg-primary-hover">
            <Download className="w-4 h-4 mr-1" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

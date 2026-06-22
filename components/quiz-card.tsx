import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Share2, BarChart3, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { ShareButton } from "@/components/share-button"

interface QuizCardProps {
  quiz: {
    id: string
    title: string
    description: string | null
    created_at: string
    question_count: number
    attempt_count: number
    is_active: boolean
  }
}

export function QuizCard({ quiz }: QuizCardProps) {
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/quiz/${quiz.id}`

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              {quiz.title}
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 line-clamp-2">
              {quiz.description || "No description provided"}
            </CardDescription>
          </div>
          <Badge 
            variant={quiz.is_active ? "default" : "secondary"}
            className={`ml-3 ${
              quiz.is_active 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {quiz.is_active ? "Active" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{quiz.question_count}</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{quiz.attempt_count}</div>
            <div className="text-xs text-gray-500">Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Date(quiz.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs text-gray-500">Created</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link href={`/dashboard/quiz/${quiz.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Link>
          </Button>

          <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 bg-amber-500 hover:bg-amber-600 text-white border-none" asChild>
            <Link href={`/dashboard/edit-quiz/${quiz.id}`}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Link>
          </Button>

          <ShareButton url={shareUrl} />

          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
            <Link href={`/dashboard/quiz/${quiz.id}/results`}>
              <BarChart3 className="w-4 h-4 mr-1" />
              Results
            </Link>
          </Button>

          <Button size="sm" variant="outline" disabled className="opacity-60">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete (Soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

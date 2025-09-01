"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Trophy, Clock } from "lucide-react"

interface QuizCompleteProps {
  quiz: {
    title: string
  }
  score: number
  totalQuestions: number
  studentName: string
}

export function QuizComplete({ quiz, score, totalQuestions, studentName }: QuizCompleteProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  
  const getScoreMessage = () => {
    if (percentage >= 90) return "🎉 Outstanding! Excellent work!"
    if (percentage >= 80) return "👏 Great job! Well done!"
    if (percentage >= 70) return "👍 Good work! Keep it up!"
    if (percentage >= 60) return "📚 Not bad! Room for improvement."
    return "💪 Keep studying! You can do better next time."
  }

  const getScoreColor = () => {
    if (percentage >= 80) return "from-green-500 to-emerald-600"
    if (percentage >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Quiz Completed! 🎉
            </CardTitle>
            <p className="text-gray-600 mt-3 text-lg">Thank you for taking the quiz, <span className="font-semibold text-blue-600">{studentName}</span></p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Quiz Info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-lg">Your responses have been submitted successfully</p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-blue-200">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-blue-900">Your Score</span>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {score} / {totalQuestions}
              </div>
              <div className="text-2xl font-semibold text-blue-700 mb-4">{percentage}%</div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className={`bg-gradient-to-r ${getScoreColor()} h-4 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <p className="text-lg font-medium text-gray-700">{getScoreMessage()}</p>
            </div>



            {/* Message */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">ℹ</span>
                </div>
                <div>
                  <p className="text-yellow-800 font-medium mb-1">Important Note</p>
                  <p className="text-yellow-700">
                    Your teacher will review your responses and may provide detailed feedback. You cannot retake this quiz.
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="text-center pt-6">
              <Button 
                onClick={() => window.close()} 
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ✨ Close Window
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

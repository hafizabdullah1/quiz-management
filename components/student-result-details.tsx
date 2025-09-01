"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, User, Mail, Calendar, Clock } from "lucide-react"

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

interface StudentAnswer {
  question_id: string
  selected_answer: string
  is_correct: boolean
  question: Question
}

interface StudentResultDetailsProps {
  attempt: {
    id: string
    student_name: string
    student_email: string
    score: number
    total_questions: number
    completed_at: string
    started_at: string
  }
  answers: StudentAnswer[]
}

export function StudentResultDetails({ attempt, answers }: StudentResultDetailsProps) {
  const percentage = Math.round((attempt.score / attempt.total_questions) * 100)
  const completedDate = new Date(attempt.completed_at).toLocaleDateString()
  const completedTime = new Date(attempt.completed_at).toLocaleTimeString()

  const getOptionLabel = (option: string) => {
    switch (option) {
      case "A":
        return "option_a"
      case "B":
        return "option_b"
      case "C":
        return "option_c"
      case "D":
        return "option_d"
      default:
        return "option_a"
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800"
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      {/* Student Info Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-xl flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>{attempt.student_name}</span>
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{attempt.student_email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{completedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{completedTime}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getScoreColor(percentage)} text-lg px-3 py-1`}>{percentage}%</Badge>
              <div className="text-sm text-gray-600 mt-1">
                {attempt.score} / {attempt.total_questions} correct
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Questions and Answers */}
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <Card key={answer.question_id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                <div className="flex items-center space-x-2">
                  {answer.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <Badge variant={answer.is_correct ? "default" : "destructive"}>
                    {answer.is_correct ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{answer.question?.question_text || "Question not available"}</p>
              {!answer.question && (
                <p className="text-red-500 text-sm mt-1">Debug: Question object is missing</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((option) => {
                  const optionKey = getOptionLabel(option) as keyof Question
                  const optionText = answer.question?.[optionKey] as string || "Option not available"
                  const isSelected = answer.selected_answer === option
                  const isCorrect = answer.question?.correct_answer === option

                  let className = "p-3 rounded-lg border "
                  if (isCorrect && isSelected) {
                    className += "bg-green-100 border-green-300 text-green-800"
                  } else if (isCorrect) {
                    className += "bg-green-50 border-green-200 text-green-700"
                  } else if (isSelected) {
                    className += "bg-red-100 border-red-300 text-red-800"
                  } else {
                    className += "bg-gray-50 border-gray-200 text-gray-700"
                  }

                  return (
                    <div key={option} className={className}>
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>{option}.</strong> {optionText}
                          {!answer.question && (
                            <span className="text-red-500 text-xs ml-2">(No question data)</span>
                          )}
                        </span>
                        <div className="flex space-x-1">
                          {isSelected && (
                            <Badge variant="outline" className="text-xs">
                              Selected
                            </Badge>
                          )}
                          {isCorrect && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                              Correct
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <strong>Score:</strong> {answer.is_correct ? "1/1" : "0/1"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

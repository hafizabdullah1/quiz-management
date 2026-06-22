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
    warnings_count?: number
    tab_switches_count?: number
    window_blurs_count?: number
    fullscreen_leaves_count?: number
    proctoring_logs?: any[]
    is_terminated?: boolean
    terminated_reason?: string
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

      {/* Proctoring Report */}
      {((attempt.warnings_count && attempt.warnings_count > 0) || (attempt.tab_switches_count && attempt.tab_switches_count > 0) || (attempt.window_blurs_count && attempt.window_blurs_count > 0) || (attempt.fullscreen_leaves_count && attempt.fullscreen_leaves_count > 0) || attempt.is_terminated) && (
        <Card className={`border-l-4 ${attempt.is_terminated ? "border-l-red-500" : "border-l-yellow-500"}`}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                    <span className="text-xl">⚠️</span>
                    <span>Proctoring Report</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-gray-500 text-xs font-medium mb-1">Total Warnings (Legacy)</div>
                        <div className="text-2xl font-bold text-gray-800">{attempt.warnings_count || 0}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <div className="text-orange-600 text-xs font-medium mb-1">Tab Switches</div>
                        <div className="text-2xl font-bold text-orange-700">{attempt.tab_switches_count || 0}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <div className="text-red-600 text-xs font-medium mb-1">Window Focus Lost</div>
                        <div className="text-2xl font-bold text-red-700">{attempt.window_blurs_count || 0}</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <div className="text-yellow-600 text-xs font-medium mb-1">Fullscreen Exits</div>
                        <div className="text-2xl font-bold text-yellow-700">{attempt.fullscreen_leaves_count || 0}</div>
                    </div>
                </div>

                <div>
                    <span className="text-gray-600 font-medium mr-2">Status:</span>
                    {attempt.is_terminated ? (
                        <span className="text-red-600 font-bold">Terminated ({attempt.terminated_reason || "Violation"})</span>
                    ) : (
                        <span className="text-yellow-600 font-bold">Flagged for Review</span>
                    )}
                </div>

                {attempt.proctoring_logs && attempt.proctoring_logs.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Violation Timeline</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {attempt.proctoring_logs.map((log: any, i: number) => {
                                let label = log.type;
                                let color = "text-gray-600";
                                if (log.type === "tab_switch") { label = "Switched Tab"; color = "text-orange-600"; }
                                if (log.type === "window_blur") { label = "Lost Window Focus"; color = "text-red-600"; }
                                if (log.type === "fullscreen_exit") { label = "Exited Fullscreen"; color = "text-yellow-600"; }

                                return (
                                    <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded border border-gray-100">
                                        <span className={`font-medium ${color}`}>{label}</span>
                                        <span className="text-gray-500 text-xs font-mono">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      )}


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

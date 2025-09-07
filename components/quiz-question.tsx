"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

interface QuizQuestionProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  selectedAnswer: string
  onAnswerChange: (answer: string) => void
  onNext: () => void
  onSubmit: () => void
  canGoNext: boolean
  isLastQuestion: boolean
  hasAnswered: boolean
  isSubmitting: boolean
}

export function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  onNext,
  onSubmit,
  canGoNext,
  isLastQuestion,
  hasAnswered,
  isSubmitting,
}: QuizQuestionProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentIndex + 1}</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <div className="text-sm text-gray-600">Progress: {Math.round(progress)}% Complete</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Quiz Progress</div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <Progress value={progress} className="mb-6 h-3" />
            <CardTitle className="text-2xl font-bold text-gray-900 leading-relaxed">
              {question.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {!hasAnswered && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">ℹ</span>
                </div>
                <span className="text-blue-800 font-medium">Please select an answer to continue</span>
              </div>
            )}

            {hasAnswered && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-green-800 font-medium">Answer Selected ✓</span>
              </div>
            )}

            <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === "A" 
                    ? "border-blue-500 bg-blue-50" 
                    : hasAnswered 
                      ? "border-gray-200 bg-gray-50 opacity-60" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                }`}>
                  <RadioGroupItem 
                    value="A" 
                    id="option-a" 
                    disabled={hasAnswered}
                    className={hasAnswered ? "cursor-not-allowed" : "cursor-pointer"}
                  />
                  <Label 
                    htmlFor="option-a" 
                    className={`flex-1 cursor-pointer ${hasAnswered ? "cursor-not-allowed text-gray-500" : ""}`}
                  >
                    <span className="font-bold text-lg">A.</span> 
                    <span className="ml-2 text-base">{question.option_a}</span>
                  </Label>
                </div>

                <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === "B" 
                    ? "border-blue-500 bg-blue-50" 
                    : hasAnswered 
                      ? "border-gray-200 bg-gray-50 opacity-60" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                }`}>
                  <RadioGroupItem 
                    value="B" 
                    id="option-b" 
                    disabled={hasAnswered}
                    className={hasAnswered ? "cursor-not-allowed" : "cursor-pointer"}
                  />
                  <Label 
                    htmlFor="option-b" 
                    className={`flex-1 cursor-pointer ${hasAnswered ? "cursor-not-allowed text-gray-500" : ""}`}
                  >
                    <span className="font-bold text-lg">B.</span> 
                    <span className="ml-2 text-base">{question.option_b}</span>
                  </Label>
                </div>

                <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === "C" 
                    ? "border-blue-500 bg-blue-50" 
                    : hasAnswered 
                      ? "border-gray-200 bg-gray-50 opacity-60" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                }`}>
                  <RadioGroupItem 
                    value="C" 
                    id="option-c" 
                    disabled={hasAnswered}
                    className={hasAnswered ? "cursor-not-allowed" : "cursor-pointer"}
                  />
                  <Label 
                    htmlFor="option-c" 
                    className={`flex-1 cursor-pointer ${hasAnswered ? "cursor-not-allowed text-gray-500" : ""}`}
                  >
                    <span className="font-bold text-lg">C.</span> 
                    <span className="ml-2 text-base">{question.option_c}</span>
                  </Label>
                </div>

                <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === "D" 
                    ? "border-blue-500 bg-blue-50" 
                    : hasAnswered 
                      ? "border-gray-200 bg-gray-50 opacity-60" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                }`}>
                  <RadioGroupItem 
                    value="D" 
                    id="option-d" 
                    disabled={hasAnswered}
                    className={hasAnswered ? "cursor-not-allowed" : "cursor-pointer"}
                  />
                  <Label 
                    htmlFor="option-d" 
                    className={`flex-1 cursor-pointer ${hasAnswered ? "cursor-not-allowed text-gray-500" : ""}`}
                  >
                    <span className="font-bold text-lg">D.</span> 
                    <span className="ml-2 text-base">{question.option_d}</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {hasAnswered && (
              <div className="flex justify-center pt-8 border-t border-gray-200">
                {isLastQuestion ? (
                  <Button 
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r cursor-pointer from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "🎯 Submit Quiz"}
                  </Button>
                ) : (
                  <Button 
                    onClick={onNext} 
                    disabled={!canGoNext} 
                    className="bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

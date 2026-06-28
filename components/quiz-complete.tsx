"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface QuizCompleteProps {
  quiz: {
    title: string
  }
  studentName: string
  score?: number
  totalQuestions?: number
  isTerminated?: boolean
}

export function QuizComplete({ quiz, studentName, score, totalQuestions, isTerminated }: QuizCompleteProps) {
  const percentage = score !== undefined && totalQuestions ? Math.round((score / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              {isTerminated ? "Quiz Terminated" : "Quiz Submitted!"}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Thank you, <span className="font-semibold text-gray-900">{studentName}</span>. 
              {isTerminated 
                ? " Your quiz was automatically submitted due to multiple tab switches." 
                : " Your answers have been recorded successfully."}
            </p>

            {isTerminated && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                    <h3 className="text-red-800 font-bold mb-1">Violation Detected</h3>
                    <p className="text-red-600 text-sm">
                        You exceeded the maximum allowed tab switches (3). As a result, your quiz was immediately submitted with the progress you had made.
                    </p>
                </div>
            )}

          </CardHeader>
          <CardContent className="space-y-8">
            {/* Quiz Info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {quiz.title}
              </h3>
              <p className="text-gray-600 text-lg">
                Your responses have been submitted successfully
              </p>
            </div>

            {/* Teacher review notice */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 text-center border-2 border-primary/20">
              <p className="text-primary font-medium">
                Your teacher will review your responses and share your result.
              </p>
            </div>

            {/* Message */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">ℹ</span>
                </div>
                <div>
                  {/* <p className="text-yellow-800 font-medium mb-1">Important Note</p> */}
                  <p className="text-yellow-700">
                    You cannot retake this quiz.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

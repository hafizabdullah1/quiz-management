"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, FileText, Users, AlertCircle } from "lucide-react"
import { useState } from "react"

interface QuizIntroProps {
  quiz: {
    id: string
    title: string
    description: string | null
    question_count: number
  }
  onStart: (studentName: string, studentEmail: string) => void
}

export function QuizIntro({ quiz, onStart }: QuizIntroProps) {
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [error, setError] = useState("")

  const handleStart = () => {
    if (!studentName.trim()) {
      setError("Please enter your name")
      return
    }
    if (!studentEmail.trim()) {
      setError("Please enter your email")
      return
    }
    if (!/\S+@\S+\.\S+/.test(studentEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    onStart(studentName.trim(), studentEmail.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        {/* Quiz Header */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {quiz.title}
            </CardTitle>
            {quiz.description && (
              <p className="text-gray-600 mt-3 text-lg leading-relaxed max-w-2xl mx-auto">
                {quiz.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-lg font-semibold text-blue-900">{quiz.question_count}</span>
                <span className="text-sm text-blue-700">Questions</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-lg font-semibold text-green-900">No Limit</span>
                <span className="text-sm text-green-700">Time Limit</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-lg font-semibold text-purple-900">Multiple</span>
                <span className="text-sm text-purple-700">Choice</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Quiz Rules & Guidelines
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You can only attempt this quiz once</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Each question has 4 options, select the best answer</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You can navigate between questions before submitting</span>
                </li>
              </ul>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Make sure to review all your answers before final submission</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Once submitted, you cannot change your answers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-semibold text-blue-600">Your progress is automatically saved</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Student Information */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Enter Your Information</CardTitle>
            <p className="text-gray-600">Please provide your details to begin the quiz</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentEmail" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="studentEmail"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button 
              onClick={handleStart} 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start Quiz Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

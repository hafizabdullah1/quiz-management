"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface QuizCompleteProps {
  quiz: {
    title: string;
  };
  studentName: string;
}

export function QuizComplete({ quiz, studentName }: QuizCompleteProps) {
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
            <p className="text-gray-600 mt-3 text-lg">
              Thank you for taking the quiz,{" "}
              <span className="font-semibold text-blue-600">{studentName}</span>
            </p>
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
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-blue-200">
              <p className="text-blue-800 font-medium">
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

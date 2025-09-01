"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadButtonProps {
  quizId: string
  attemptId: string
}

export function DownloadButton({ quizId, attemptId }: DownloadButtonProps) {
  const handleDownload = () => {
    window.open(`/api/quiz/${quizId}/results/${attemptId}/pdf`, "_blank")
  }

  return (
    <Button
      onClick={handleDownload}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  )
}

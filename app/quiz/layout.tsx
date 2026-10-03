import React from "react"

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-6 left-8 z-[60] flex items-center pointer-events-none">
        <img src="/visionx-logo.png" alt="VisionX Skills" className="h-10 object-contain drop-shadow-sm" />
      </div>
      {children}
    </div>
  )
}

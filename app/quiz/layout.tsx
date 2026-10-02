import React from "react"

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 left-6 z-[60] flex items-center gap-2 pointer-events-none">
        <img src="/visionx-logo.png" alt="VisionX Skills" className="h-8 object-contain drop-shadow-sm" />
        <span className="font-bold text-xl text-primary drop-shadow-md">VisionX Skills</span>
      </div>
      {children}
    </div>
  )
}

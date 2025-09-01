"use client"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  url: string
}

export function CopyButton({ url }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <Button onClick={handleCopy} variant="outline">
      Copy Link
    </Button>
  )
}

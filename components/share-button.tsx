"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  url: string
}

export function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      toast({
        title: "Link Copied!",
        description: "Quiz link has been copied to clipboard",
        duration: 3000,
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={copyShareLink}
      className="cursor-pointer hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </>
      )}
    </Button>
  )
}

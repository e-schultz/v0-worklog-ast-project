"use client"

import { useState } from "react"
import { X, Pin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface MicrositePreviewProps {
  url: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export function MicrositePreview({ url, title, isOpen, onClose }: MicrositePreviewProps) {
  const [isPinned, setIsPinned] = useState(false)

  const togglePin = () => {
    setIsPinned(!isPinned)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[90%] sm:w-[600px] p-0">
        <SheetHeader className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={togglePin} className={isPinned ? "text-blue-400" : ""}>
                <Pin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)] w-full">
          <iframe src={url} title={title} className="h-full w-full border-0" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

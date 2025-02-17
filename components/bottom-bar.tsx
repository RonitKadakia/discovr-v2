"use client"

import { useState } from "react"
import { Share2, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function BottomBar() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(console.error)
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Share functionality is not available on this device.")
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex items-center h-12 max-w-screen-2xl w-full mx-auto">
        <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex-grow h-full text-xs justify-center items-center gap-1 rounded-none px-2"
            >
              Contact Us
              <Headphones className="h-3 w-3" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Contact Options</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Button
                className="w-full mb-2"
                onClick={() =>
                  window.open(
                    "https://wa.me/918369165022?text=Hi!%20Please%20help%20me%20with%20my%20experience%20on%20Discovr",
                    "_blank",
                  )
                }
              >
                WhatsApp
              </Button>
              <Button className="w-full" onClick={() => window.open("tel:+918369165022", "_blank")}>
                Call
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="h-5 w-px bg-gray-300 flex-shrink-0"></div>
        <Button
          variant="ghost"
          onClick={handleShare}
          className="flex-grow h-full text-xs justify-center items-center gap-1 rounded-none px-2"
        >
          Share with friends
          <Share2 className="h-3 w-3" />
        </Button>
      </div>
      <div className="h-12 max-w-screen-2xl w-full mx-auto" />{" "}
      {/* Spacer to prevent content from being hidden behind the bottom bar */}
    </>
  )
}


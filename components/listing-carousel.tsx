"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSwipeable } from "react-swipeable"

import { cn } from "@/lib/utils"

interface ListingCarouselProps {
  images?: string[]
  title: string
  isHomePage?: boolean
}

export function ListingCarousel({ images, title, isHomePage = false }: ListingCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const previousSlide = () => {
    setCurrentIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: previousSlide,
    trackMouse: true,
  })

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full">
        <Image src="/placeholder.svg" alt={title} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden" {...handlers}>
      {images &&
        images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute w-full h-full transition-opacity duration-300",
              index === currentIndex ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} - Image ${index + 1}`}
              fill
              className={`object-cover w-full h-full ${isHomePage ? "rounded-t-[24px]" : ""}`}
            />
          </div>
        ))}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          previousSlide()
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/70 flex items-center justify-center shadow-md"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          nextSlide()
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/70 flex items-center justify-center shadow-md"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images &&
          images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-1 h-1 rounded-full transition-all",
                index === currentIndex ? "bg-white w-2" : "bg-white/50",
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
      </div>
    </div>
  )
}


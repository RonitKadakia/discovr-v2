"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "./section-heading"

interface PricingOption {
  name: string
  details: string
  validity: string
  price: number
}

interface PricingSectionProps {
  options: PricingOption[]
}

export function PricingSection({ options }: PricingSectionProps) {
  const [lineWidth, setLineWidth] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const updateLineWidth = () => {
      if (headingRef.current) {
        const headingWidth = headingRef.current.offsetWidth
        setLineWidth(window.innerWidth - headingWidth - 32) // 32px for padding
      }
    }

    updateLineWidth()
    window.addEventListener("resize", updateLineWidth)
    return () => window.removeEventListener("resize", updateLineWidth)
  }, [])

  const isSingleFreeOption = options.length === 1 && options[0].price === 0

  return (
    <div className="space-y-4">
      <SectionHeading title="Pricing" />
      <div className={`grid gap-4 ${options.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
        {options.map((option, index) => (
          <Card
            key={index}
            className={`${options.length % 2 !== 0 && index === options.length - 1 ? "col-span-2 max-w-[50%] mx-auto" : ""}`}
          >
            <CardContent className="p-4 flex flex-col h-full justify-between">
              <div>
                <h3 className="font-semibold text-sm mb-1">{option.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">Validity: {option.validity}</p>
              </div>
              <p className="text-lg font-bold">₹{option.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


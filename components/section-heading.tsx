import { useRef } from "react"

interface SectionHeadingProps {
  title: string
}

export function SectionHeading({ title }: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  return (
    <div className="flex items-center">
      <h2 ref={headingRef} className="text-xl font-semibold whitespace-nowrap">
        {title}
      </h2>
    </div>
  )
}


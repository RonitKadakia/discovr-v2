import { SectionHeading } from "./section-heading"

export function AboutSection() {
  return (
    <div className="space-y-2">
      <SectionHeading title="About" />
      <p className="text-xs text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
    </div>
  )
}


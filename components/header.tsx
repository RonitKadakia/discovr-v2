import { Contact, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Header() {
  return (
    <header className="flex flex-col">
      <div className="flex justify-between items-center p-2 border-b">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Contact className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-4">
              <Link
                href="https://wa.me/918369165022?text=Hi!%20Please%20help%20me%20with%20my%20experience%20on%20Discovr"
                className="flex items-center space-x-2"
              >
                <span>WhatsApp</span>
              </Link>
              <Link href="tel:+918369165022" className="flex items-center space-x-2">
                <span>Call</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-2xl font-bold font-sans">
            discovr.
          </Link>
        </div>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}


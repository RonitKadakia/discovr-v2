"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, MapPin, Phone, Instagram, ChevronDown } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const experience = {
  id: 1,
  title: "Pottery Workshop",
  location: "Arts District, Downtown",
  address: "123 Creative Lane, Arts District",
  price: 2500,
  rating: 4.8,
  distance: 1.2,
  image: "/placeholder.svg?height=400&width=400&text=Pottery+Workshop",
  category: "Pottery",
  sector: "Arts & Crafts",
  openingHours: {
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "20:00" },
    saturday: { open: "10:00", close: "22:00" },
    sunday: { open: null, close: null },
  },
  duration: 120, // in minutes
  googleMapsLink: "https://goo.gl/maps/examplePotteryWorkshop",
  instagramLink: "https://www.instagram.com/potteryworkshop",
  contactOptions: [
    { name: "Phone", value: "+1234567890" },
    { name: "Email", value: "book@potteryworkshop.com" },
    { name: "Website", value: "https://www.potteryworkshop.com" },
  ],
}

function getOpeningStatus(openingHours: typeof experience.openingHours) {
  const now = new Date()
  const dayOfWeek = now.toLocaleLowerCase("en-US", { weekday: "long" })
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = openingHours[dayOfWeek as keyof typeof openingHours]

  if (!todayHours.open || !todayHours.close) {
    return { status: "Closed today", nextOpenDay: getNextOpenDay(openingHours, dayOfWeek) }
  }

  const [openHour, openMinute] = todayHours.open.split(":").map(Number)
  const [closeHour, closeMinute] = todayHours.close.split(":").map(Number)
  const openTime = openHour * 60 + openMinute
  const closeTime = closeHour * 60 + closeMinute

  if (currentTime >= openTime && currentTime < closeTime) {
    return { status: "Open", closingTime: todayHours.close }
  } else if (currentTime < openTime) {
    const minutesUntilOpen = openTime - currentTime
    return { status: "Closed", opensIn: minutesUntilOpen }
  } else {
    return { status: "Closed", nextOpenDay: getNextOpenDay(openingHours, dayOfWeek) }
  }
}

function getNextOpenDay(openingHours: typeof experience.openingHours, currentDay: string) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  let nextDay = days[(days.indexOf(currentDay) + 1) % 7]
  let count = 0

  while (!openingHours[nextDay as keyof typeof openingHours].open && count < 7) {
    nextDay = days[(days.indexOf(nextDay) + 1) % 7]
    count++
  }

  return count < 7 ? nextDay : null
}

export default function ListingPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const openingStatus = getOpeningStatus(experience.openingHours)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="relative aspect-square">
          <Image src={experience.image || "/placeholder.svg"} alt={experience.title} fill className="object-cover" />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-black bg-opacity-50 text-white">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-black bg-opacity-50 text-white">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <h1 className="text-2xl font-bold">{experience.title}</h1>
          <p className="text-muted-foreground">{experience.address}</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto font-normal justify-start">
                <span className="flex items-center">
                  {openingStatus.status === "Open" && <>Open today • Till {openingStatus.closingTime}</>}
                  {openingStatus.status === "Closed" && "opensIn" in openingStatus && (
                    <>
                      Closed • Opens in {Math.floor(openingStatus.opensIn / 60)} hours {openingStatus.opensIn % 60}{" "}
                      minutes
                    </>
                  )}
                  {openingStatus.status === "Closed" && "nextOpenDay" in openingStatus && (
                    <>Closed today • Open {openingStatus.nextOpenDay ? openingStatus.nextOpenDay : "soon"}</>
                  )}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Opening Hours</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {Object.entries(experience.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-2">
                    <span className="capitalize">{day}</span>
                    <span>{hours.open ? `${hours.open} - ${hours.close}` : "Closed"}</span>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <p>
            | Duration:{" "}
            {experience.duration >= 60
              ? `${Math.floor(experience.duration / 60)} hours ${experience.duration % 60} minutes`
              : `${experience.duration} minutes`}
          </p>
          <div className="flex space-x-2">
            <Button onClick={() => window.open(experience.googleMapsLink, "_blank")}>
              <MapPin className="mr-2 h-4 w-4" />
              Directions
            </Button>
            <Button onClick={() => setIsContactModalOpen(true)}>
              <Phone className="mr-2 h-4 w-4" />
              Contact / Book
            </Button>
            <Button onClick={() => window.open(experience.instagramLink, "_blank")}>
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Options</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {experience.contactOptions.map((option, index) => (
              <div key={index} className="py-2">
                <h3 className="font-semibold">{option.name}</h3>
                <p className="text-sm text-muted-foreground">{option.value}</p>
                {index < experience.contactOptions.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


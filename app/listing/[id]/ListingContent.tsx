"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Share2, MapPin, Phone, Instagram, ChevronDown, ChevronLeft, Utensils, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ListingCarousel } from "@/components/listing-carousel"
import { PricingSection } from "@/components/pricing-section"
import { ActivitySlider } from "@/components/activity-slider"
import type { Experience } from "@/types/experience"
import { getExperience, getRelatedExperiences, getSimilarExperiences } from "@/lib/experiences"

function getNextDay(day: string): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const currentIndex = days.indexOf(day.toLowerCase())
  return days[(currentIndex + 1) % 7]
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long" })
}

function getOpeningStatus(openingHours: Experience["opening_hours"], tags: string[]) {
  const isEvent = tags.includes("event")

  if (isEvent) {
    const eventInfo = openingHours.find((hour) => hour.event_date)
    if (eventInfo) {
      return {
        status: "Event",
        eventDate: formatEventDate(eventInfo.event_date!),
        eventTime: eventInfo.event_time,
      }
    }
  }

  const now = new Date()
  const today = now.toLocaleString("en-US", { weekday: "long" })
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = openingHours.filter((hour) => hour.day_of_week === today)

  if (todayHours.length === 0) {
    return { status: "Closed today", nextOpenDay: getNextOpenDay(openingHours, today), today }
  }

  for (const slot of todayHours) {
    if (!slot.open_time || !slot.close_time) continue

    const [openHour, openMinute] = slot.open_time.split(":").map(Number)
    const [closeHour, closeMinute] = slot.close_time.split(":").map(Number)
    const openTime = openHour * 60 + openMinute
    const closeTime = closeHour * 60 + closeMinute

    if (currentTime >= openTime && currentTime < closeTime) {
      return { status: "Open", closingTime: slot.close_time, today }
    }

    if (currentTime < openTime) {
      const minutesUntilOpen = openTime - currentTime
      return { status: "Closed", opensIn: minutesUntilOpen, today }
    }
  }

  return { status: "Closed", nextOpenDay: getNextOpenDay(openingHours, today), today }
}

function getNextOpenDay(openingHours: Experience["opening_hours"], currentDay: string) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  let nextDay = days[(days.indexOf(currentDay) + 1) % 7]
  let count = 0

  while (count < 7) {
    if (openingHours.some((hour) => hour.day_of_week === nextDay)) {
      return nextDay
    }
    nextDay = days[(days.indexOf(nextDay) + 1) % 7]
    count++
  }

  return null
}

export default function ListingContent({ experienceId }: { experienceId: number }) {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [relatedExperiences, setRelatedExperiences] = useState<Experience[]>([])
  const [similarExperiences, setSimilarExperiences] = useState<Experience[]>([])
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const exp = await getExperience(experienceId)
      if (exp) {
        setExperience(exp)
        const related = await getRelatedExperiences(exp.id, exp.categories[0])
        setRelatedExperiences(related)
        const similar = await getSimilarExperiences(exp.id, exp.tags)
        setSimilarExperiences(similar)
      }
    }
    fetchData()
  }, [experienceId])

  if (!experience) {
    return <div>Loading...</div>
  }

  const openingStatus = getOpeningStatus(experience.opening_hours, experience.tags)

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 z-10 rounded-full bg-black bg-opacity-50 text-white"
          onClick={() => (window.location.href = "/")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <ListingCarousel images={experience.images.map((img) => img.image_url)} title={experience.name} />
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full bg-black bg-opacity-50 text-white"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: experience.name,
                    text: `Check out ${experience.name} in ${experience.location}`,
                    url: window.location.href,
                  })
                  .catch(console.error)
              } else {
                // Fallback for browsers that don't support Web Share API
                alert(`Share: ${experience.name} in ${experience.location}`)
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 z-10 rounded-full bg-black bg-opacity-50 text-white"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold font-sans break-words mb-1">
          {experience.emoji} {experience.name} @ {experience.location}
        </h1>
        <div className="flex justify-between items-stretch mb-4">
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground break-words mb-2">{experience.address}</p>
            {experience.opening_hours && experience.opening_hours.length > 0 && (
              <>
                {experience.tags.includes("event") ? (
                  <p className="text-sm mb-2">
                    {openingStatus.eventDate} • {openingStatus.eventTime}
                  </p>
                ) : (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="p-0 h-auto font-normal justify-start mb-2">
                        <span className="flex items-center">
                          {openingStatus.status === "Open" ? (
                            <>Open now • Closes at {openingStatus.closingTime}</>
                          ) : openingStatus.status === "Closed" && "opensIn" in openingStatus ? (
                            <>
                              Closed • Opens in {Math.floor(openingStatus.opensIn / 60)} hours{" "}
                              {openingStatus.opensIn % 60} minutes
                            </>
                          ) : (
                            <>
                              Closed today • Opens{" "}
                              {openingStatus.nextOpenDay
                                ? openingStatus.nextOpenDay === getNextDay(openingStatus.today)
                                  ? "tomorrow"
                                  : openingStatus.nextOpenDay
                                : "soon"}
                            </>
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
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const dayHours = experience.opening_hours.filter((hour) => hour.day_of_week === day)
                          return (
                            <div key={day} className="flex justify-between py-2">
                              <span className="capitalize">{day}</span>
                              <span>
                                {dayHours.length > 0
                                  ? dayHours.map((slot, index) => (
                                      <span key={index}>
                                        {slot.open_time} - {slot.close_time}
                                        {index < dayHours.length - 1 ? " & " : ""}
                                      </span>
                                    ))
                                  : "Closed"}
                              </span>
                            </div>
                          )
                        })}
                        {experience.opening_hours
                          .filter((hour) => hour.event_date)
                          .map((event, index) => (
                            <div key={index} className="flex justify-between py-2">
                              <span>{formatEventDate(event.event_date!)}</span>
                              <span>{event.event_time}</span>
                            </div>
                          ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </>
            )}
            <p className="text-xs text-muted-foreground break-words">
              {experience.pricing_text} •{" "}
              {experience.duration &&
                `Duration: ${
                  experience.duration >= 60
                    ? `${Math.floor(experience.duration / 60)}${
                        experience.duration % 60 === 0
                          ? Math.floor(experience.duration / 60) === 1
                            ? " hour"
                            : " hours"
                          : ` hours ${experience.duration % 60} minutes`
                      }`
                    : `${experience.duration} minutes`
                }`}
            </p>
          </div>
          {experience.food_available !== null && (
            <div
              className={`flex flex-col items-center justify-center rounded-lg p-2 text-xs ml-2 ${
                experience.food_available ? "bg-green-100 text-black" : "bg-red-100 text-black"
              }`}
            >
              <Utensils className="h-5 w-5 mb-1 font-bold" />
              <div className="w-3/4 h-px bg-current my-1" />
              {experience.food_available ? (
                <Check className="h-5 w-5 font-bold" />
              ) : (
                <X className="h-5 w-5 font-bold" />
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {experience.google_maps_link && (
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 h-8 px-2"
              onClick={() => window.open(experience.google_maps_link, "_blank")}
            >
              <MapPin className="mr-1 h-3 w-3" />
              <span className="text-xs">Directions</span>
            </Button>
          )}
          {experience.contact_options && experience.contact_options.length > 0 && (
            <Sheet open={isContactSheetOpen} onOpenChange={setIsContactSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0 h-8 px-2">
                  <Phone className="mr-1 h-3 w-3" />
                  <span className="text-xs">Contact</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Contact Options</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {experience.contact_options.map((option, index) => (
                    <div key={index} className="py-2">
                      <h3 className="font-semibold">{option.contact_type}</h3>
                      {option.contact_type.toLowerCase() === "phone" && (
                        <Link href={`tel:${option.contact_value}`} className="text-sm text-blue-600 hover:underline">
                          {option.contact_value}
                        </Link>
                      )}
                      {option.contact_type.toLowerCase() === "email" && (
                        <Link href={`mailto:${option.contact_value}`} className="text-sm text-blue-600 hover:underline">
                          {option.contact_value}
                        </Link>
                      )}
                      {option.contact_type.toLowerCase() === "website" && (
                        <Link
                          href={option.contact_value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {option.contact_value}
                        </Link>
                      )}
                      {option.contact_type.toLowerCase() === "whatsapp" && (
                        <Link
                          href={`https://wa.me/${option.contact_value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          WhatsApp
                        </Link>
                      )}
                      {index < experience.contact_options.length - 1 && <hr className="my-2" />}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
          {experience.instagram_link && (
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 h-8 px-2"
              onClick={() => window.open(experience.instagram_link, "_blank")}
            >
              <Instagram className="mr-1 h-3 w-3" />
              <span className="text-xs">Instagram</span>
            </Button>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-sm text-muted-foreground">{experience.about}</p>
        </div>

        <PricingSection className="mb-8" options={experience.pricing_options} />
        <ActivitySlider
          className="mb-8"
          title={`Other Activities in ${experience.categories[0]}`}
          activities={relatedExperiences}
        />
        <ActivitySlider className="mb-8" title="Similar Activities" activities={similarExperiences} />

        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold whitespace-nowrap">Terms & Conditions</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
      </div>
    </>
  )
}


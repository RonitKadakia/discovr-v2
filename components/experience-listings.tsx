"use client"

import { Search, Filter } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ListingCarousel } from "./listing-carousel"
import { Header } from "./header"
import { FilterModal, type FilterOptions } from "./filter-modal"
import { Badge } from "@/components/ui/badge"
import { ThinHeader } from "./thin-header"
import AnimatedText from "./animated-text"
import type { Experience } from "@/types/experience"

const experiences: Experience[] = [
  {
    id: 1,
    emoji: "🎨",
    name: "Pottery Workshop",
    location: "Arts District, Downtown",
    address: "123 Creative Lane, Arts District",
    about: "Learn the art of pottery in a fun and relaxed environment.",
    pricing_text: "Starting from ₹2500",
    price: 2500,
    duration: 120,
    google_maps_link: "https://goo.gl/maps/examplePotteryWorkshop",
    instagram_link: "https://www.instagram.com/potteryworkshop",
    food_available: true,
    weight: 1.0,
    categories: ["Arts & Crafts"],
    tags: ["Indoor", "Adult", "Beginner", "experience"],
    images: [
      {
        image_name: "Pottery Workshop 1",
        image_url: "https://i.imgur.com/j8w5qv4.png",
      },
      {
        image_name: "Pottery Workshop 2",
        image_url: "https://i.imgur.com/bAVPw7e.png",
      },
      {
        image_name: "Pottery Workshop 3",
        image_url: "https://i.imgur.com/GEGnMT2.png",
      },
    ],
    opening_hours: [
      { day_of_week: "Monday", open_time: "09:00", close_time: "18:00", event_date: null, event_time: null },
      { day_of_week: "Tuesday", open_time: "09:00", close_time: "18:00", event_date: null, event_time: null },
      { day_of_week: "Wednesday", open_time: "09:00", close_time: "18:00", event_date: null, event_time: null },
      { day_of_week: "Thursday", open_time: "09:00", close_time: "18:00", event_date: null, event_time: null },
      { day_of_week: "Friday", open_time: "09:00", close_time: "20:00", event_date: null, event_time: null },
      { day_of_week: "Saturday", open_time: "10:00", close_time: "22:00", event_date: null, event_time: null },
      { day_of_week: "Sunday", open_time: null, close_time: null, event_date: null, event_time: null },
    ],
    pricing_options: [
      { name: "Single Session", validity: "Weekdays", price: 2500 },
      { name: "Weekend Workshop", validity: "Weekends", price: 4000 },
    ],
    contact_options: [
      { contact_type: "Phone", contact_value: "+1234567890" },
      { contact_type: "Email", contact_value: "book@potteryworkshop.com" },
      { contact_type: "Website", contact_value: "https://www.potteryworkshop.com" },
      { contact_type: "WhatsApp", contact_value: "+1234567890" },
    ],
  },
  {
    id: 2,
    emoji: "🎭",
    name: "Theater Night",
    location: "City Playhouse",
    address: "456 Broadway Avenue",
    about: "Experience a night of captivating performances at our local theater.",
    pricing_text: "Tickets from ₹1500",
    price: 1500,
    duration: 180,
    google_maps_link: "https://goo.gl/maps/exampleTheaterNight",
    instagram_link: "https://www.instagram.com/cityplayhouse",
    food_available: false,
    weight: 0.9,
    categories: ["Entertainment"],
    tags: ["Indoor", "Adult", "event"],
    images: [
      { image_name: "Theater Night 1", image_url: "https://i.imgur.com/35uBkJ1.png" },
      { image_name: "Theater Night 2", image_url: "https://i.imgur.com/UR28u0Q.png" },
      { image_name: "Theater Night 3", image_url: "https://i.imgur.com/1pV3pFG.png" },
    ],
    opening_hours: [
      { day_of_week: null, open_time: null, close_time: null, event_date: "2023-07-15", event_time: "19:30" },
    ],
    pricing_options: [
      { name: "Standard Ticket", validity: "Event Date", price: 1500 },
      { name: "VIP Ticket", validity: "Event Date", price: 2500 },
    ],
    contact_options: [
      { contact_type: "Phone", contact_value: "+1234567891" },
      { contact_type: "Email", contact_value: "tickets@cityplayhouse.com" },
    ],
  },
  {
    id: 3,
    emoji: "🍳",
    name: "Cooking Class",
    location: "Gourmet Kitchen, Downtown",
    address: "789 Culinary Ave, Downtown",
    about: "Learn to cook delicious meals with our expert chefs.",
    pricing_text: "Classes from ₹3000",
    price: 3000,
    duration: 180,
    google_maps_link: "https://goo.gl/maps/exampleCookingClass",
    instagram_link: "https://www.instagram.com/gourmetkitchen",
    food_available: true,
    weight: 0.8,
    categories: ["Culinary"],
    tags: ["Indoor", "Adult", "Beginner", "experience"],
    images: [
      { image_name: "Cooking Class 1", image_url: "https://i.imgur.com/D4NwNgy.png" },
      { image_name: "Cooking Class 2", image_url: "https://i.imgur.com/cG9YZUU.png" },
      { image_name: "Cooking Class 3", image_url: "https://i.imgur.com/lyMGEzA.png" },
      { image_name: "Cooking Class 4", image_url: "https://i.imgur.com/dPuQ2RI.png" },
    ],
    opening_hours: [
      { day_of_week: "Monday", open_time: "10:00", close_time: "20:00", event_date: null, event_time: null },
      { day_of_week: "Wednesday", open_time: "10:00", close_time: "20:00", event_date: null, event_time: null },
      { day_of_week: "Friday", open_time: "10:00", close_time: "22:00", event_date: null, event_time: null },
      { day_of_week: "Saturday", open_time: "09:00", close_time: "22:00", event_date: null, event_time: null },
    ],
    pricing_options: [
      { name: "Single Class", validity: "Any day", price: 3000 },
      { name: "5 Class Package", validity: "1 Month", price: 13000 },
    ],
    contact_options: [
      { contact_type: "Phone", contact_value: "+1234567892" },
      { contact_type: "Email", contact_value: "info@gourmetkitchen.com" },
    ],
  },
  {
    id: 4,
    emoji: "🎸",
    name: "Guitar Lessons",
    location: "Music Studio, Uptown",
    address: "101 Melody Lane, Uptown",
    about: "Learn to play guitar from beginner to advanced levels.",
    pricing_text: "Lessons from ₹1000",
    price: 1000,
    duration: 60,
    google_maps_link: "https://goo.gl/maps/exampleGuitarLessons",
    instagram_link: "https://www.instagram.com/uptownguitar",
    food_available: false,
    weight: 0.7,
    categories: ["Music"],
    tags: ["Indoor", "All Ages", "Beginner", "Intermediate", "Advanced", "experience"],
    images: [
      { image_name: "Guitar Lesson 1", image_url: "https://i.imgur.com/ckuuvy8.png" },
      { image_name: "Guitar Lesson 2", image_url: "https://i.imgur.com/Y6Ztutp.png" },
      { image_name: "Guitar Lesson 3", image_url: "https://i.imgur.com/lyMGEzA.png" },
    ],
    opening_hours: [
      { day_of_week: "Tuesday", open_time: "14:00", close_time: "20:00", event_date: null, event_time: null },
      { day_of_week: "Thursday", open_time: "14:00", close_time: "20:00", event_date: null, event_time: null },
      { day_of_week: "Saturday", open_time: "10:00", close_time: "18:00", event_date: null, event_time: null },
    ],
    pricing_options: [
      { name: "Single Lesson", validity: "Any day", price: 1000 },
      { name: "10 Lesson Package", validity: "2 Months", price: 9000 },
    ],
    contact_options: [
      { contact_type: "Phone", contact_value: "+1234567893" },
      { contact_type: "Email", contact_value: "lessons@uptownguitar.com" },
    ],
  },
]

function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long" })
}

export default function ExperienceListings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: "alphabetically",
    costRange: [0, "5000+"],
    categories: [],
    tags: [],
  })

  const applyFilters = (options: FilterOptions) => {
    setFilterOptions(options)
    const newActiveFilters = [
      options.sortBy,
      `₹${options.costRange[0]} - ₹${options.costRange[1]}`,
      ...options.categories,
      ...options.tags,
    ]
    setActiveFilters(newActiveFilters)
  }

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter))
    if (["alphabetically", "cost-low-to-high", "cost-high-to-low", "by-sector"].includes(filter)) {
      setFilterOptions((prev) => ({ ...prev, sortBy: "alphabetically" }))
    } else if (filter.startsWith("₹")) {
      setFilterOptions((prev) => ({ ...prev, costRange: [0, "5000+"] }))
    } else {
      if (availableTags.includes(filter)) {
        setFilterOptions((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== filter) }))
      } else {
        setFilterOptions((prev) => ({ ...prev, categories: prev.categories.filter((c) => c !== filter) }))
      }
    }
  }

  const availableTags = [
    "Outdoor",
    "Indoor",
    "Family-friendly",
    "Adult",
    "Beginner",
    "Advanced",
    "Weekend",
    "Weekday",
    "event",
    "experience",
    "All Ages",
    "Intermediate",
  ]

  const filteredExperiences = experiences
    .filter((experience) => {
      const isOpenToday = experience.opening_hours.some((hours) => {
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
        return hours.day_of_week?.toLowerCase() === today && hours.open_time !== null && hours.close_time !== null
      })

      const hasEventToday = experience.opening_hours.some((hours) => {
        const today = new Date().toISOString().split("T")[0]
        return hours.event_date === today
      })

      const lowestPrice = Math.min(...experience.pricing_options.map((option) => option.price))

      const matchesSearch =
        searchQuery === "" ||
        experience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experience.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experience.address.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilters =
        activeFilters.length === 0 ||
        ((!activeFilters.includes("open today") || isOpenToday || hasEventToday) &&
          (filterOptions.categories.length === 0 ||
            filterOptions.categories.some((cat) => experience.categories.includes(cat))) &&
          lowestPrice >= filterOptions.costRange[0] &&
          (filterOptions.costRange[1] === "5000+" || lowestPrice <= Number(filterOptions.costRange[1])) &&
          (filterOptions.tags.length === 0 || filterOptions.tags.every((tag) => experience.tags.includes(tag))))

      return matchesSearch && matchesFilters
    })
    .sort((a, b) => {
      switch (filterOptions.sortBy) {
        case "alphabetically":
          return a.name.localeCompare(b.name)
        case "cost-low-to-high":
          return (
            Math.min(...a.pricing_options.map((option) => option.price)) -
            Math.min(...b.pricing_options.map((option) => option.price))
          )
        case "cost-high-to-low":
          return (
            Math.max(...b.pricing_options.map((option) => option.price)) -
            Math.max(...a.pricing_options.map((option) => option.price))
          )
        case "by-sector":
          return a.categories[0].localeCompare(b.categories[0])
        default:
          return 0
      }
    })

  useEffect(() => {
    const metaViewport = document.querySelector("meta[name=viewport]")
    if (metaViewport) {
      metaViewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <ThinHeader />
      <Header />
      <section className="py-4 px-4">
        <AnimatedText />
      </section>
      <main className="flex-grow w-full overflow-x-hidden">
        <section className="bg-background sticky top-0 z-10 p-2 shadow-md">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search experiences, activities or events"
              className="pl-10 bg-background rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full whitespace-nowrap"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button
              variant={activeFilters.includes("open today") ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() =>
                setActiveFilters((prev) =>
                  prev.includes("open today") ? prev.filter((f) => f !== "open today") : [...prev, "open today"],
                )
              }
            >
              Open Today
            </Button>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="rounded-full">
                  {filter}
                  <button className="ml-1" onClick={() => removeFilter(filter)}>
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </section>

        <section className="px-4 sm:px-6 py-4 space-y-6 w-full">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden">
              <Link href={`/listing/${experience.id}`} className="block">
                <ListingCarousel
                  images={experience.images.map((img) => img.image_url)}
                  title={experience.name}
                  className="aspect-[4/3]"
                />
                <CardContent className="p-2 sm:p-3 flex items-stretch rounded-b-[32px]">
                  <div className="text-5xl mr-3 flex items-center">{experience.emoji}</div>
                  <div className="flex-1 flex flex-col justify-between min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm font-sans truncate">
                      {experience.name} @ {experience.location}
                    </h3>
                    <p className="text-muted-foreground text-xs truncate">{experience.address}</p>
                    <div className="pt-1 flex justify-between items-end w-full">
                      <p className="font-semibold text-xs">{experience.pricing_text}</p>
                      {experience.tags.includes("event") &&
                        experience.opening_hours.find((hour) => hour.event_date) && (
                          <p className="text-xs text-muted-foreground text-right">
                            {formatEventDate(experience.opening_hours.find((hour) => hour.event_date)!.event_date!)} •{" "}
                            {experience.opening_hours.find((hour) => hour.event_date)!.event_time}
                          </p>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
          {filteredExperiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No experiences found matching your search.</div>
          )}
        </section>
      </main>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={applyFilters}
        availableTags={availableTags}
      />
    </div>
  )
}


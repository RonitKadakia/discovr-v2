import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "./section-heading"

interface Activity {
  id: number
  title: string
  location: string
  price: number
  rating: number
  image: string
}

interface ActivitySliderProps {
  title: string
  activities: Activity[]
}

export function ActivitySlider({ title, activities }: ActivitySliderProps) {
  return (
    <div className="space-y-4">
      <SectionHeading title={title} />
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {activities.map((activity) => (
          <Link href={`/listing/${activity.id}`} key={activity.id}>
            <Card className="flex-none w-48">
              <div className="relative h-32">
                <Image
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-2">
                <h3 className="font-semibold text-xs">{activity.title}</h3>
                <p className="text-xs text-muted-foreground">{activity.location}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs font-semibold">₹{activity.price}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


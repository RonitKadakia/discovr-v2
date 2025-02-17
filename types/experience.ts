export type Experience = {
  id: number
  emoji: string
  name: string
  location: string
  address: string
  about: string
  pricing_text: string
  price: number
  duration: number
  google_maps_link: string
  instagram_link: string
  food_available: boolean | null
  weight: number
  categories: string[]
  tags: string[]
  images: { image_name: string; image_url: string }[]
  opening_hours: {
    day_of_week: string | null
    open_time: string | null
    close_time: string | null
    event_date: string | null
    event_time: string | null
  }[]
  pricing_options: {
    name: string
    validity: string
    price: number
  }[]
  contact_options: {
    contact_type: string
    contact_value: string
  }[]
}


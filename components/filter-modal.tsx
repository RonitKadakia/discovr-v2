"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  availableTags: string[] // New prop for available tags
}

export interface FilterOptions {
  sortBy: string
  costRange: [number, number | "5000+"]
  categories: string[]
  tags: string[] // New field for selected tags
}

const categories = ["Pickleball", "Puppy Yoga", "Pottery", "Cooking", "Wine Tasting", "Padel"]

export function FilterModal({ isOpen, onClose, onApplyFilters, availableTags }: FilterModalProps) {
  const [sortBy, setSortBy] = useState("alphabetically")
  const [costRange, setCostRange] = useState<[number, number | "5000+"]>([0, "5000+"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // New state for selected tags

  const handleCostRangeChange = (value: number[]) => {
    const [min, max] = value
    setCostRange([min, max === 5000 ? "5000+" : max])
  }

  const handleMinCostChange = (value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue)) return
    const maxValue = costRange[1] === "5000+" ? 5000 : (costRange[1] as number)
    setCostRange([Math.min(numValue, maxValue), costRange[1]])
  }

  const handleMaxCostChange = (value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue)) return
    if (numValue > 5000) {
      setCostRange([costRange[0], "5000+"])
    } else {
      setCostRange([Math.min(costRange[0], numValue), numValue])
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleApply = () => {
    onApplyFilters({ sortBy, costRange, categories: selectedCategories, tags: selectedTags })
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setCostRange([0, "5000+"])
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] w-full bg-background p-4 sm:p-6 overflow-y-auto rounded-t-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Filter by</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Sort by</h3>
            <RadioGroup value={sortBy} onValueChange={setSortBy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alphabetically" id="alphabetically" />
                <Label htmlFor="alphabetically">Alphabetically</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cost-low-to-high" id="cost-low-to-high" />
                <Label htmlFor="cost-low-to-high">Cost: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cost-high-to-low" id="cost-high-to-low" />
                <Label htmlFor="cost-high-to-low">Cost: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="by-sector" id="by-sector" />
                <Label htmlFor="by-sector">By Sector</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cost</h3>
            <div className="space-y-4">
              <Slider
                min={0}
                max={5000}
                step={100}
                value={[costRange[0], costRange[1] === "5000+" ? 5000 : (costRange[1] as number)]}
                onValueChange={handleCostRangeChange}
              />
              <div className="flex justify-between">
                <Input
                  type="number"
                  value={costRange[0]}
                  onChange={(e) => handleMinCostChange(e.target.value)}
                  className="w-20 sm:w-24"
                  min={0}
                  max={5000}
                />
                <Input
                  type="text"
                  value={costRange[1]}
                  onChange={(e) => handleMaxCostChange(e.target.value)}
                  className="w-20 sm:w-24"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* New Tags filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagChange(tag)}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}


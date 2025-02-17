"use client"

import { useState, useEffect } from "react"

const AnimatedText = ({ className = "" }: { className?: string }) => {
  const baseActivities = ["Pickleball", "Yoga", "Pottery", "Tennis", "Swimming", "Dance", "Chess"]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [items, setItems] = useState([...baseActivities, ...baseActivities])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === baseActivities.length - 1) {
          setItems((current) => [...current, ...baseActivities])
        }
        return prev + 1
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`text-center ${className}`}>
      <div className="h-8 overflow-hidden">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * 32}px)`,
          }}
        >
          {items.map((activity, index) => (
            <div key={`${activity}-${index}`} className="h-8 flex items-center justify-center">
              <span className="text-2xl font-extrabold">{activity}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-lg font-semibold mt-1">in Chandigarh Tricity</p>
    </div>
  )
}

export default AnimatedText


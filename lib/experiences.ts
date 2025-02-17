import type { Experience } from "@/types/experience"

// Your experiences data here
const experiences: Experience[] = [
  // ... (keep your existing experiences data)
]

export async function getExperience(id: number): Promise<Experience | undefined> {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(experiences.find((exp) => exp.id === id))
    }, 100)
  })
}

export async function getExperienceIds(): Promise<number[]> {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(experiences.map((exp) => exp.id))
    }, 100)
  })
}

export async function getRelatedExperiences(currentId: number, category: string): Promise<Experience[]> {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(experiences.filter((exp) => exp.id !== currentId && exp.categories.includes(category)))
    }, 100)
  })
}

export async function getSimilarExperiences(currentId: number, tags: string[]): Promise<Experience[]> {
  // Simulating an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(experiences.filter((exp) => exp.id !== currentId && exp.tags.some((tag) => tags.includes(tag))))
    }, 100)
  })
}


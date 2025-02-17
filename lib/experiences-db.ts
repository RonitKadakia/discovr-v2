import type { Experience } from "@/types/experience"
import { experiences } from "./experiences"

export function getExperience(id: number): Experience | undefined {
  return experiences.find((exp) => exp.id === id)
}

export function getRelatedExperiences(currentId: number, category: string): Experience[] {
  return experiences.filter((exp) => exp.id !== currentId && exp.categories.includes(category))
}

export function getSimilarExperiences(currentId: number, tags: string[]): Experience[] {
  return experiences.filter((exp) => exp.id !== currentId && exp.tags.some((tag) => tags.includes(tag)))
}


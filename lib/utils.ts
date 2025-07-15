import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseMarkdownToAST(markdown: string) {
  // Simple parsing logic
  const lines = markdown.split("\n")
  const context = lines.filter((line) => !line.startsWith("[") && !line.startsWith("#")).join("\n")
  const tags = lines.filter((line) => line.includes("#")).flatMap((line) => line.match(/#[\w-]+/g) || [])
  const linkedResources = lines.filter((line) => line.includes("[")).map((line) => line.match(/\[(.*?)\]/)?.[1] || "")

  return { context, tags, linkedResources }
}

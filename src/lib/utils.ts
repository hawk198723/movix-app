import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// TMDb API配置
export const TMDB_API_KEY = "37e0dc3de98921ebe8e848805eb1e492"
export const TMDB_BASE_URL = "https://api.themoviedb.org/3"
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// 图片尺寸
export const TMDB_POSTER_SIZES = {
  small: "w185",
  medium: "w342", 
  large: "w500",
  xlarge: "w780",
  original: "original"
}

export const TMDB_BACKDROP_SIZES = {
  small: "w300",
  medium: "w780", 
  large: "w1280",
  original: "original"
}

// 获取完整图片URL
export function getImageUrl(path: string, size: string = TMDB_POSTER_SIZES.medium) {
  if (!path) return "/placeholder-movie.jpg"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// 格式化年份
export function formatYear(dateString: string) {
  return new Date(dateString).getFullYear()
}

// 格式化评分
export function formatRating(rating: number) {
  return Math.round(rating * 10) / 10
}

// 截断文本
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

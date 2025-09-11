// TMDb API 类型定义
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface TMDbResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// 用户相关类型
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface UserProfile extends User {
  favorites: number[]
  watchLater: number[]
  createdAt: Date
  updatedAt: Date
}

// 评论类型
export interface Comment {
  id: string
  movieId: number
  userId: string
  userEmail: string
  userDisplayName?: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCommentData {
  movieId: number
  content: string
}

// 应用状态类型
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface MovieState {
  trending: Movie[]
  topRated: Movie[]
  upcoming: Movie[]
  popular: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  loading: boolean
  error: string | null
}

// 路由类型
export type RoutePath = 
  | "/" 
  | "/login" 
  | "/register" 
  | "/movie/:id" 
  | "/search" 
  | "/my-list" 
  | "/profile"

// 搜索相关类型
export interface SearchParams {
  query: string
  page?: number
}

export interface SearchResult {
  movies: Movie[]
  totalPages: number
  totalResults: number
  currentPage: number
}

import axios from 'axios'
import { TMDB_API_KEY, TMDB_BASE_URL } from '../lib/utils'
import type { Movie, MovieDetails, TMDbResponse, SearchParams, SearchResult } from '../types'

// 创建axios实例
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzN2UwZGMzZGU5ODkyMWViZThlODQ4ODA1ZWIxZTQ5MiIsIm5iZiI6MTY4MTc2NzY2MC42MDksInN1YiI6IjY0M2RiY2VjODVjMGEyMDQ3YzI5YjNjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YLlTLIuTzzj06pEXVtBRexanh74goh1U9BmCWe9ogL4`,
    'Accept': 'application/json'
  }
})

export class TMDbService {
  // 获取热门电影
  static async getTrending(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/trending/movie/week?page=${page}`)
    return response.data
  }

  // 获取热门电影（流行）
  static async getPopular(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/popular?page=${page}`)
    return response.data
  }

  // 获取评分最高的电影
  static async getTopRated(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/top_rated?page=${page}`)
    return response.data
  }

  // 获取即将上映的电影
  static async getUpcoming(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/upcoming?page=${page}`)
    return response.data
  }

  // 根据类型获取电影
  static async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/discover/movie?with_genres=${genreId}&page=${page}`)
    return response.data
  }

  // 获取动作电影
  static async getActionMovies(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getMoviesByGenre(28, page) // 28 = Action
  }

  // 获取喜剧电影
  static async getComedyMovies(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getMoviesByGenre(35, page) // 35 = Comedy
  }

  // 获取恐怖电影
  static async getHorrorMovies(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getMoviesByGenre(27, page) // 27 = Horror
  }

  // 获取电影详情
  static async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await tmdbApi.get(`/movie/${movieId}`)
    return response.data
  }

  // 搜索电影
  static async searchMovies({ query, page = 1 }: SearchParams): Promise<SearchResult> {
    const response = await tmdbApi.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
    const data: TMDbResponse<Movie> = response.data
    
    return {
      movies: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      currentPage: data.page
    }
  }

  // 获取相似电影
  static async getSimilarMovies(movieId: number): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`)
    return response.data
  }

  // 获取电影推荐
  static async getRecommendations(movieId: number): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`)
    return response.data
  }

  // 获取类型列表
  static async getGenres() {
    const response = await tmdbApi.get('/genre/movie/list')
    return response.data.genres
  }

  // 获取电影视频（预告片等）
  static async getMovieVideos(movieId: number) {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`)
    return response.data.results
  }
}

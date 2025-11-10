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

  // ===== TV Series API =====
  
  // 获取热门电视剧
  static async getTrendingTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/trending/tv/week?page=${page}`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 获取流行电视剧
  static async getPopularTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/tv/popular?page=${page}`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 获取高分电视剧
  static async getTopRatedTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/tv/top_rated?page=${page}`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 获取今日热播电视剧
  static async getAiringTodayTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/tv/airing_today?page=${page}`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 获取最新上映电视剧
  static async getOnTheAirTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/tv/on_the_air?page=${page}`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 根据类型获取电视剧
  static async getTVSeriesByGenre(genreId: number, page: number = 1): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/discover/tv?with_genres=${genreId}&page=${page}`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 获取动作冒险电视剧
  static async getActionAdventureTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getTVSeriesByGenre(10759, page) // 10759 = Action & Adventure
  }

  // 获取喜剧电视剧
  static async getComedyTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getTVSeriesByGenre(35, page) // 35 = Comedy
  }

  // 获取犯罪电视剧
  static async getCrimeTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getTVSeriesByGenre(80, page) // 80 = Crime
  }

  // 获取纪录片
  static async getDocumentaryTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getTVSeriesByGenre(99, page) // 99 = Documentary
  }

  // 获取剧情电视剧
  static async getDramaTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getTVSeriesByGenre(18, page) // 18 = Drama
  }

  // 获取科幻电视剧
  static async getSciFiTV(page: number = 1): Promise<TMDbResponse<Movie>> {
    return this.getTVSeriesByGenre(10765, page) // 10765 = Sci-Fi & Fantasy
  }

  // 将电视剧字段转换为电影字段格式（统一接口）
  private static mapTVToMovie(tv: any): any {
    return {
      ...tv,
      title: tv.name || tv.title,
      original_title: tv.original_name || tv.original_title,
      release_date: tv.first_air_date || tv.release_date
    }
  }

  // 获取电视剧详情
  static async getTVSeriesDetails(seriesId: number): Promise<MovieDetails> {
    const response = await tmdbApi.get(`/tv/${seriesId}`)
    return this.mapTVToMovie(response.data)
  }

  // 获取相似电视剧
  static async getSimilarTVSeries(seriesId: number): Promise<TMDbResponse<Movie>> {
    const response = await tmdbApi.get(`/tv/${seriesId}/similar`)
    const data = response.data
    return {
      ...data,
      results: data.results.map((tv: any) => this.mapTVToMovie(tv))
    }
  }

  // 获取电视剧视频（预告片等）
  static async getTVSeriesVideos(seriesId: number) {
    const response = await tmdbApi.get(`/tv/${seriesId}/videos`)
    return response.data.results
  }
}

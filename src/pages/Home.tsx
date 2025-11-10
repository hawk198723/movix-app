import React, { useState, useEffect } from 'react'
import { HeroBanner } from '../components/HeroBanner'
import { MovieCarousel } from '../components/MovieCarousel'
import { LoadingBar } from '../components/ui/LoadingBar'
import { TMDbService } from '../services/tmdb'
import type { Movie } from '../types'

export function Home() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null)
  const [trending, setTrending] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [actionMovies, setActionMovies] = useState<Movie[]>([])
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([])
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      // 并行加载所有数据
      const [
        trendingData,
        topRatedData,
        popularData,
        actionData,
        comedyData,
        horrorData
      ] = await Promise.all([
        TMDbService.getTrending(),
        TMDbService.getTopRated(),
        TMDbService.getPopular(),
        TMDbService.getActionMovies(),
        TMDbService.getComedyMovies(),
        TMDbService.getHorrorMovies()
      ])

      setTrending(trendingData.results)
      setTopRated(topRatedData.results)
      setPopular(popularData.results)
      setActionMovies(actionData.results)
      setComedyMovies(comedyData.results)
      setHorrorMovies(horrorData.results)

      // 从热门电影中随机选择一个作为横幅
      if (trendingData.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.results.length))
        setHeroMovie(trendingData.results[randomIndex])
      }
    } catch (err) {
      console.error('Failed to load movies:', err)
      setError('Failed to load movies. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    // 可以在这里添加刷新逻辑，比如更新用户的收藏列表
    console.log('Favorite changed')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black transition-colors duration-200">
        <div className="pt-16">
          <LoadingBar />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={loadMovies}
            className="px-4 py-2 bg-netflix-red text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-netflix-black transition-colors duration-200">
      {/* 顶部间距（为固定导航栏留空间） */}
      <div className="pt-16">
        {/* 横幅 */}
        <HeroBanner movie={heroMovie} />

        {/* 电影分类 - 轮播布局 */}
        <div className="space-y-8 py-8">
          {trending.length > 0 && (
            <MovieCarousel
              title="Trending Now"
              movies={trending}
              onFavoriteChange={handleFavoriteChange}
            />
          )}

          {popular.length > 0 && (
            <MovieCarousel
              title="Popular Movies"
              movies={popular}
              onFavoriteChange={handleFavoriteChange}
            />
          )}

          {topRated.length > 0 && (
            <MovieCarousel
              title="Top Rated"
              movies={topRated}
              onFavoriteChange={handleFavoriteChange}
            />
          )}

          {actionMovies.length > 0 && (
            <MovieCarousel
              title="Action Movies"
              movies={actionMovies}
              onFavoriteChange={handleFavoriteChange}
            />
          )}

          {comedyMovies.length > 0 && (
            <MovieCarousel
              title="Comedy Movies"
              movies={comedyMovies}
              onFavoriteChange={handleFavoriteChange}
            />
          )}

          {horrorMovies.length > 0 && (
            <MovieCarousel
              title="Horror Movies"
              movies={horrorMovies}
              onFavoriteChange={handleFavoriteChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

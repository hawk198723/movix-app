import { useState, useEffect } from 'react'
import { TMDbService } from '../services/tmdb'
import { HeroBanner } from '../components/HeroBanner'
import { MovieCarousel } from '../components/MovieCarousel'
import { LoadingBar } from '../components/ui/LoadingBar'
import type { Movie } from '../types'

export function TVSeries() {
  const [heroSeries, setHeroSeries] = useState<Movie | null>(null)
  const [popularSeries, setPopularSeries] = useState<Movie[]>([])
  const [topRatedSeries, setTopRatedSeries] = useState<Movie[]>([])
  const [trendingSeries, setTrendingSeries] = useState<Movie[]>([])
  const [actionSeries, setActionSeries] = useState<Movie[]>([])
  const [dramaSeries, setDramaSeries] = useState<Movie[]>([])
  const [comedySeries, setComedySeries] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTVSeries()
  }, [])

  const loadTVSeries = async () => {
    try {
      setLoading(true)
      setError(null)

      // 使用真正的电视剧 API
      const [
        trendingData,
        popularData, 
        topRatedData,
        actionData,
        dramaData,
        comedyData
      ] = await Promise.all([
        TMDbService.getTrendingTV(1),      // 热门电视剧
        TMDbService.getPopularTV(1),       // 流行电视剧
        TMDbService.getTopRatedTV(1),      // 高分电视剧
        TMDbService.getActionAdventureTV(1), // 动作冒险剧
        TMDbService.getDramaTV(1),         // 剧情剧
        TMDbService.getComedyTV(1)         // 喜剧
      ])

      console.log('TV Series - Trending:', trendingData)
      console.log('TV Series - Popular:', popularData)
      
      setTrendingSeries(trendingData.results || [])
      setPopularSeries(popularData.results || [])
      setTopRatedSeries(topRatedData.results || [])
      setActionSeries(actionData.results || [])
      setDramaSeries(dramaData.results || [])
      setComedySeries(comedyData.results || [])

      // 从热门电视剧中随机选择一个作为 Hero Banner
      if (trendingData.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.results.length))
        setHeroSeries(trendingData.results[randomIndex])
      }
    } catch (err) {
      console.error('Failed to load TV series:', err)
      setError('Failed to load TV series. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    console.log('Favorite changed')
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
        </div>
      </div>
    )
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
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center pt-20 transition-colors duration-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={loadTVSeries}
            className="px-6 py-2 bg-netflix-red text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-netflix-black transition-colors duration-200">
      {/* Hero Banner with Video Background */}
      {heroSeries && (
        <HeroBanner movie={heroSeries} />
      )}

      {/* TV Series Content */}
      <div className="space-y-8 py-8">
          {trendingSeries.length > 0 && (
            <MovieCarousel
              title="🔥 Trending TV Shows"
              movies={trendingSeries}
              onFavoriteChange={handleFavoriteChange}
              mediaType="tv"
            />
          )}

          {popularSeries.length > 0 && (
            <MovieCarousel
              title="📺 Popular TV Series"
              movies={popularSeries}
              onFavoriteChange={handleFavoriteChange}
              mediaType="tv"
            />
          )}

          {topRatedSeries.length > 0 && (
            <MovieCarousel
              title="⭐ Top Rated Series"
              movies={topRatedSeries}
              onFavoriteChange={handleFavoriteChange}
              mediaType="tv"
            />
          )}

          {actionSeries.length > 0 && (
            <MovieCarousel
              title="💥 Action & Adventure"
              movies={actionSeries}
              onFavoriteChange={handleFavoriteChange}
              mediaType="tv"
            />
          )}

          {dramaSeries.length > 0 && (
            <MovieCarousel
              title="🎭 Drama Series"
              movies={dramaSeries}
              onFavoriteChange={handleFavoriteChange}
              mediaType="tv"
            />
          )}

          {comedySeries.length > 0 && (
            <MovieCarousel
              title="😂 Comedy Series"
              movies={comedySeries}
              onFavoriteChange={handleFavoriteChange}
              mediaType="tv"
            />
          )}

        {/* No Content State */}
        {trendingSeries.length === 0 && popularSeries.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-xl">
              No TV series available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Play, X } from 'lucide-react'
import { TMDbService } from '../services/tmdb'
import { FirebaseService } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { getImageUrl, formatRating } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { MovieCarousel } from '../components/MovieCarousel'
import { CommentSection } from '../components/CommentSection'
import type { Movie, MovieDetails } from '../types'

export function TVSeriesDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [series, setSeries] = useState<MovieDetails | null>(null)
  const [similarSeries, setSimilarSeries] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailerError, setTrailerError] = useState(false)

  useEffect(() => {
    if (id) {
      loadSeriesDetails(parseInt(id))
    }
  }, [id])

  useEffect(() => {
    if (user && id) {
      FirebaseService.isFavorite(user.uid, parseInt(id)).then(setIsFavorite)
    }
  }, [user, id])

  const loadSeriesDetails = async (seriesId: number) => {
    try {
      setLoading(true)
      setError(null)

      // 使用专门的 TV Series API
      const [seriesData, similarData] = await Promise.all([
        TMDbService.getTVSeriesDetails(seriesId),
        TMDbService.getSimilarTVSeries(seriesId)
      ])

      // 尝试获取预告片
      try {
        const videosData = await TMDbService.getTVSeriesVideos(seriesId)
        const trailer = videosData.find(
          (video: any) => 
            video.type === 'Trailer' && 
            video.site === 'YouTube' &&
            (video.official === true || video.name.toLowerCase().includes('official'))
        ) || videosData.find(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videosData.find(
          (video: any) => video.type === 'Teaser' && video.site === 'YouTube'
        )
        
        if (trailer) {
          setTrailerKey(trailer.key)
        }
      } catch (err) {
        console.log('No trailer available')
      }

      setSeries(seriesData)
      setSimilarSeries(similarData.results.slice(0, 12))
    } catch (err) {
      console.error('Failed to load TV series details:', err)
      setError('Failed to load TV series details')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!user || !id) return

    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await FirebaseService.removeFromFavorites(user.uid, parseInt(id))
      } else {
        await FirebaseService.addToFavorites(user.uid, parseInt(id))
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true)
      setTrailerError(false)
    } else {
      setTrailerError(true)
      setTimeout(() => setTrailerError(false), 3000)
    }
  }

  const closeTrailer = () => {
    setShowTrailer(false)
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center pt-20 transition-colors duration-200">
        <Loading size="lg" text="Loading TV series details..." />
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center pt-20 transition-colors duration-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-netflix-black transition-colors duration-200">
      {/* 返回按钮 */}
      <div className="fixed top-20 left-4 z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* 背景图片 */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl(series.backdrop_path, 'original')}
            alt={series.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-netflix-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 dark:from-netflix-black/90 via-white/50 dark:via-netflix-black/50 to-transparent" />
        </div>

        {/* 内容 */}
        <div className="relative h-full flex items-end pb-16 px-4 md:px-16 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-lg">
              {series.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-yellow-500 font-bold">{formatRating(series.vote_average)}</span>
                <span className="text-sm">Rating</span>
              </div>
              <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                {new Date(series.release_date).getFullYear()}
              </span>
              {series.runtime && (
                <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  {formatRuntime(series.runtime)}
                </span>
              )}
            </div>

            <p className="text-lg mb-6 text-gray-800 dark:text-gray-200 line-clamp-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
              {series.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* 播放预告片按钮 */}
              <Button
                onClick={handlePlayTrailer}
                variant="primary"
                size="lg"
                className="bg-red-600 hover:bg-red-700"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Play Trailer
              </Button>
              
              {user && (
                <Button
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  variant={isFavorite ? "secondary" : "primary"}
                  size="lg"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              )}
            </div>
            
            {/* 预告片错误提示 */}
            {trailerError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg backdrop-blur-sm">
                <p className="text-red-700 dark:text-red-200 text-sm">
                  Sorry, no trailer is available for this TV series.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 预告片模态框 */}
      {showTrailer && trailerKey && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeTrailer}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={closeTrailer}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* YouTube 播放器 */}
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="TV Series Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 详细信息 */}
      <div className="px-4 md:px-16 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左侧：海报 */}
          <div className="md:col-span-1">
            <img
              src={getImageUrl(series.poster_path, 'w500')}
              alt={series.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* 右侧：信息 */}
          <div className="md:col-span-2 space-y-6">
            {/* 类型 */}
            {series.genres && series.genres.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {series.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 简介 */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {series.overview}
              </p>
            </div>

            {/* 上映日期 */}
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">First Air Date</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDate(series.release_date)}
              </p>
            </div>

            {/* 制作公司 */}
            {series.production_companies && series.production_companies.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Production Companies</h3>
                <div className="flex flex-wrap gap-4">
                  {series.production_companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      {company.logo_path && (
                        <img
                          src={getImageUrl(company.logo_path, 'w92')}
                          alt={company.name}
                          className="h-6 object-contain"
                        />
                      )}
                      <span className="text-sm text-gray-900 dark:text-white">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 相似电视剧 */}
        {similarSeries.length > 0 && (
          <div className="mt-16">
            <MovieCarousel
              title="Similar TV Series"
              movies={similarSeries}
              mediaType="tv"
            />
          </div>
        )}

        {/* 评论区 */}
        {id && (
          <div className="mt-16">
            <CommentSection movieId={parseInt(id)} />
          </div>
        )}
      </div>
    </div>
  )
}


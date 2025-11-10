import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Star, Clock, Calendar, Globe, Play, X } from 'lucide-react'
import { TMDbService } from '../services/tmdb'
import { FirebaseService } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { getImageUrl, formatRating } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { MovieCarousel } from '../components/MovieCarousel'
import { CommentSection } from '../components/CommentSection'
import type { MovieDetails, Movie } from '../types'

export function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailerError, setTrailerError] = useState(false)

  useEffect(() => {
    if (id) {
      loadMovieDetails(parseInt(id))
    }
  }, [id])

  useEffect(() => {
    if (user && movie) {
      FirebaseService.isFavorite(user.uid, movie.id).then(setIsFavorite)
    }
  }, [user, movie])

  const loadMovieDetails = async (movieId: number) => {
    try {
      setLoading(true)
      setError(null)

      const [movieData, similarData, videosData] = await Promise.all([
        TMDbService.getMovieDetails(movieId),
        TMDbService.getSimilarMovies(movieId),
        TMDbService.getMovieVideos(movieId)
      ])

      setMovie(movieData)
      setSimilarMovies(similarData.results.slice(0, 12))
      
      // 查找预告片
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
      console.error('Failed to load movie details:', err)
      setError('Failed to load movie details')
    } finally {
      setLoading(false)
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

  const handleFavoriteToggle = async () => {
    if (!user || !movie) return

    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await FirebaseService.removeFromFavorites(user.uid, movie.id)
      } else {
        await FirebaseService.addToFavorites(user.uid, movie.id)
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center transition-colors duration-200">
        <Loading size="lg" text="Loading movie details..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error || 'Movie not found'}</p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-netflix-black transition-colors duration-200">
      {/* 返回按钮 */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="bg-gray-800/70 dark:bg-black/50 hover:bg-gray-900/80 dark:hover:bg-black/70"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      {/* 英雄区域 */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(movie.backdrop_path, 'w1280')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent dark:from-black dark:via-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* 海报 */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-64 md:w-80 rounded-lg shadow-2xl"
              />
            </div>

            {/* 电影信息 */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4 drop-shadow-lg">{movie.tagline}</p>
              )}

              {/* 评分和基本信息 */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-6 text-white drop-shadow-lg">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{formatRating(movie.vote_average)}</span>
                  <span className="text-gray-300">({movie.vote_count} votes)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-300" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-300" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 text-gray-300" />
                  <span>{movie.original_language.toUpperCase()}</span>
                </div>
              </div>

              {/* 类型 */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-800/80 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-white"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* 简介 */}
              <p className="text-gray-200 text-lg leading-relaxed mb-8 drop-shadow-lg">
                {movie.overview}
              </p>

              {/* 操作按钮 */}
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
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-200 text-sm">
                    Sorry, no trailer is available for this movie.
                  </p>
                </div>
              )}
            </div>
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
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 详细信息 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* 制作信息 */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 transition-colors duration-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Production Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{movie.status}</span>
              </div>
              {movie.budget > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{formatBudget(movie.budget)}</span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{formatBudget(movie.revenue)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600 dark:text-gray-400">Original Title:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{movie.original_title}</span>
              </div>
            </div>
          </div>

          {/* 制作公司 */}
          {movie.production_companies.length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Production Companies</h3>
              <div className="space-y-2">
                {movie.production_companies.slice(0, 5).map((company) => (
                  <div key={company.id} className="text-sm text-gray-900 dark:text-white">
                    {company.name}
                    {company.origin_country && (
                      <span className="text-gray-600 dark:text-gray-400 ml-2">({company.origin_country})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 制作国家 */}
          {movie.production_countries.length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Countries</h3>
              <div className="space-y-2">
                {movie.production_countries.map((country) => (
                  <div key={country.iso_3166_1} className="text-sm text-gray-900 dark:text-white">
                    {country.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 评论区 */}
        <CommentSection movieId={movie.id} />

        {/* 相似电影 */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <MovieCarousel
              title="Similar Movies"
              movies={similarMovies}
            />
          </div>
        )}
      </div>
    </div>
  )
}

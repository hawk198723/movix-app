import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Star, Clock, Calendar, Globe } from 'lucide-react'
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

      const [movieData, similarData] = await Promise.all([
        TMDbService.getMovieDetails(movieId),
        TMDbService.getSimilarMovies(movieId)
      ])

      setMovie(movieData)
      setSimilarMovies(similarData.results.slice(0, 12))
    } catch (err) {
      console.error('Failed to load movie details:', err)
      setError('Failed to load movie details')
    } finally {
      setLoading(false)
    }
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
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <Loading size="lg" text="Loading movie details..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error || 'Movie not found'}</p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* 返回按钮 */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="bg-black/50 hover:bg-black/70"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
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
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
              )}

              {/* 评分和基本信息 */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{formatRating(movie.vote_average)}</span>
                  <span className="text-gray-400">({movie.vote_count} votes)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>{movie.original_language.toUpperCase()}</span>
                </div>
              </div>

              {/* 类型 */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* 简介 */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {movie.overview}
              </p>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* 制作信息 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Production Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2">{movie.status}</span>
              </div>
              {movie.budget > 0 && (
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <span className="ml-2">{formatBudget(movie.budget)}</span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <span className="text-gray-400">Revenue:</span>
                  <span className="ml-2">{formatBudget(movie.revenue)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Original Title:</span>
                <span className="ml-2">{movie.original_title}</span>
              </div>
            </div>
          </div>

          {/* 制作公司 */}
          {movie.production_companies.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Production Companies</h3>
              <div className="space-y-2">
                {movie.production_companies.slice(0, 5).map((company) => (
                  <div key={company.id} className="text-sm">
                    {company.name}
                    {company.origin_country && (
                      <span className="text-gray-400 ml-2">({company.origin_country})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 制作国家 */}
          {movie.production_countries.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Countries</h3>
              <div className="space-y-2">
                {movie.production_countries.map((country) => (
                  <div key={country.iso_3166_1} className="text-sm">
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

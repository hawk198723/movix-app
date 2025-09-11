import React, { useState, useEffect } from 'react'
import { Play, Plus, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl, truncateText, formatRating } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { FirebaseService } from '../services/firebase'
import { Button } from './ui/Button'
import type { Movie } from '../types'

interface HeroBannerProps {
  movie?: Movie
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && movie) {
      FirebaseService.isFavorite(user.uid, movie.id).then(setIsFavorite)
    }
  }, [user, movie])

  const handleFavoriteToggle = async () => {
    if (!user || !movie) return

    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  if (!movie) {
    return (
      <div className="relative h-[50vh] md:h-[70vh] bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Movix</h1>
          <p className="text-gray-300 text-lg">Discover amazing movies and TV shows</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'w1280')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* 渐变覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      {/* 内容 */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg md:max-w-2xl">
            {/* 标题 */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* 评分和年份 */}
            <div className="flex items-center space-x-4 mb-4 text-sm md:text-base">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span>{formatRating(movie.vote_average)}</span>
              </div>
              <span className="text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                {movie.adult ? '18+' : 'PG-13'}
              </span>
            </div>

            {/* 简介 */}
            <p className="text-gray-300 text-sm md:text-lg mb-6 leading-relaxed">
              {truncateText(movie.overview, 200)}
            </p>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/movie/${movie.id}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Now
                </Button>
              </Link>

              <Link to={`/movie/${movie.id}`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </Link>

              {user && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <Plus className={`w-5 h-5 mr-2 ${isFavorite ? 'rotate-45' : ''}`} />
                  {isFavorite ? 'Remove from List' : 'Add to List'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

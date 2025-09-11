import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Play, Star } from 'lucide-react'
import { getImageUrl, formatRating } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { FirebaseService } from '../services/firebase'
import type { Movie } from '../types'

interface MovieCardProps {
  movie: Movie
  onFavoriteChange?: () => void
}

export function MovieCard({ movie, onFavoriteChange }: MovieCardProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 检查是否收藏
  React.useEffect(() => {
    if (user) {
      FirebaseService.isFavorite(user.uid, movie.id).then(setIsFavorite)
    }
  }, [user, movie.id])

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) return

    setIsLoading(true)
    try {
      if (isFavorite) {
        await FirebaseService.removeFromFavorites(user.uid, movie.id)
      } else {
        await FirebaseService.addToFavorites(user.uid, movie.id)
      }
      setIsFavorite(!isFavorite)
      onFavoriteChange?.()
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="movie-card relative group overflow-hidden rounded-lg bg-gray-900 shadow-lg">
        {/* 海报图片 */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path, 'w342')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* 悬停覆盖层 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          {/* 顶部操作按钮 */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{formatRating(movie.vote_average)}</span>
            </div>
            
            {user && (
              <button
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    isFavorite ? 'text-red-500 fill-current' : 'text-white'
                  }`} 
                />
              </button>
            )}
          </div>

          {/* 底部信息 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2">
              {movie.overview}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <div className="flex items-center space-x-1 text-sm">
                <Play className="w-4 h-4" />
                <span>Watch</span>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端信息（始终显示） */}
        <div className="sm:hidden p-3 bg-gray-900">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1 mb-1">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs">{formatRating(movie.vote_average)}</span>
            </div>
            <span className="text-gray-400 text-xs">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

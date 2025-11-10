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

  // 根据评分决定颜色（用于 conic-gradient）
  const getRatingGradient = (rating: number) => {
    // 将 0-10 映射到 0-360 度
    const percentage = (rating / 10) * 100
    const degrees = (rating / 10) * 360
    
    let color = '#ef4444' // 红色 (< 3)
    if (rating >= 7.0) {
      color = '#22c55e' // 绿色 (>= 7)
    } else if (rating >= 3.0) {
      color = '#eab308' // 黄色 (3-7)
    }
    
    return {
      background: `conic-gradient(${color} ${degrees}deg, rgba(255, 255, 255, 0.2) ${degrees}deg)`
    }
  }

  return (
    <Link to={`/movie/${movie.id}`} className="block isolate focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-lg">
      <div className="movie-card relative group overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-2xl focus-within:shadow-2xl">
        {/* 海报图片 */}
        <div className="aspect-[2/3] overflow-hidden relative bg-gray-200 dark:bg-gray-800">
          <img
            src={getImageUrl(movie.poster_path, 'w342')}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* 悬停信息层 - 仅在当前卡片 hover/focus 时显示 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 pointer-events-none md:block hidden">
            {/* 半透明渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            {/* 红色播放按钮 - 居中显示 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center hover:bg-red-700/90 transition-colors cursor-pointer shadow-xl scale-100 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white fill-current ml-1" />
              </div>
            </div>
            
            {/* 底部信息栏 - 评分、标题、年份 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-2">
                {/* 评分圆环 - conic-gradient 显示进度 */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={getRatingGradient(movie.vote_average)}
                >
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{formatRating(movie.vote_average)}</span>
                  </div>
                </div>
                
                {/* 电影信息 - 标题和年份 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base line-clamp-2 mb-0.5 drop-shadow-lg">
                    {movie.title}
                  </h3>
                  <span className="text-gray-300 text-sm drop-shadow-md">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
                
                {/* 收藏按钮 */}
                {user && (
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={isLoading}
                    className="pointer-events-auto p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        isFavorite ? 'text-red-500 fill-current' : 'text-white'
                      }`} 
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

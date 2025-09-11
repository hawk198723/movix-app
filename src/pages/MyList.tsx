import React, { useState, useEffect } from 'react'
import { Heart, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { FirebaseService } from '../services/firebase'
import { TMDbService } from '../services/tmdb'
import { MovieCard } from '../components/MovieCard'
import { Loading } from '../components/ui/Loading'
import { Button } from '../components/ui/Button'
import type { Movie } from '../types'

export function MyList() {
  const { user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadFavoriteMovies()
    }
  }, [user])

  const loadFavoriteMovies = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const favoriteIds = await FirebaseService.getFavorites(user.uid)
      
      if (favoriteIds.length === 0) {
        setMovies([])
        return
      }

      // 获取电影详情 (TMDb API 不支持批量获取，所以我们逐个获取)
      const moviePromises = favoriteIds.map(id => 
        TMDbService.getMovieDetails(id).catch(error => {
          console.error(`Failed to fetch movie ${id}:`, error)
          return null
        })
      )

      const movieResults = await Promise.all(moviePromises)
      const validMovies = movieResults.filter(movie => movie !== null) as Movie[]
      
      setMovies(validMovies)
    } catch (err) {
      console.error('Failed to load favorite movies:', err)
      setError('Failed to load your favorite movies')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteChange = () => {
    // 重新加载收藏列表
    loadFavoriteMovies()
  }

  const clearAllFavorites = async () => {
    if (!user) return
    
    const confirmed = window.confirm(
      'Are you sure you want to remove all movies from your list? This action cannot be undone.'
    )
    
    if (!confirmed) return

    try {
      setLoading(true)
      const favoriteIds = await FirebaseService.getFavorites(user.uid)
      
      // 逐个移除收藏
      await Promise.all(
        favoriteIds.map(id => FirebaseService.removeFromFavorites(user.uid, id))
      )
      
      setMovies([])
    } catch (err) {
      console.error('Failed to clear favorites:', err)
      setError('Failed to clear your list')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-400 mb-6">
            Please sign in to view your favorite movies
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <Loading size="lg" text="Loading your favorite movies..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My List</h1>
            <p className="text-gray-400">
              {movies.length === 0 
                ? "You haven't added any movies to your list yet"
                : `${movies.length} movie${movies.length === 1 ? '' : 's'} in your list`
              }
            </p>
          </div>

          {movies.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFavorites}
              className="hidden sm:flex"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-md p-4 mb-8">
            <p className="text-red-400">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadFavoriteMovies}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* 电影列表 */}
        {movies.length > 0 ? (
          <>
            {/* 移动端清除按钮 */}
            <div className="sm:hidden mb-6">
              <Button
                variant="outline"
                onClick={clearAllFavorites}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Favorites
              </Button>
            </div>

            {/* 电影网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          </>
        ) : (
          /* 空状态 */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">Your list is empty</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Browse movies and add them to your list by clicking the heart icon. 
              Your favorite movies will appear here.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Browse Movies
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

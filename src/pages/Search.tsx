import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { TMDbService } from '../services/tmdb'
import { MovieCard } from '../components/MovieCard'
import { Loading } from '../components/ui/Loading'
import { Button } from '../components/ui/Button'
import type { Movie } from '../types'

export function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  // 从URL参数获取搜索查询
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      searchMovies(q, 1)
    }
  }, [location.search])

  const searchMovies = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await TMDbService.searchMovies({
        query: searchQuery.trim(),
        page
      })

      if (page === 1) {
        setMovies(result.movies)
      } else {
        setMovies(prev => [...prev, ...result.movies])
      }

      setCurrentPage(result.currentPage)
      setTotalPages(result.totalPages)
      setTotalResults(result.totalResults)
    } catch (err) {
      console.error('Search failed:', err)
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(query.trim())}`
      navigate(newUrl)
    }
  }

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      searchMovies(query, currentPage + 1)
    }
  }

  const handleFavoriteChange = () => {
    // 处理收藏变化
    console.log('Favorite changed')
  }

  return (
    <div className="pt-16 min-h-screen bg-netflix-black">
      <div className="container mx-auto px-4 py-8">
        {/* 搜索表单 */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-6 py-4 pl-14 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent text-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              disabled={!query.trim() || loading}
            >
              Search
            </Button>
          </form>
        </div>

        {/* 搜索结果 */}
        {loading && movies.length === 0 && (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Searching movies..." />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => searchMovies(query, 1)}>
              Try Again
            </Button>
          </div>
        )}

        {movies.length > 0 && (
          <>
            {/* 结果统计 */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Search Results for "{query}"
              </h2>
              <p className="text-gray-400">
                Found {totalResults.toLocaleString()} movies
              </p>
            </div>

            {/* 电影网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>

            {/* 加载更多按钮 */}
            {currentPage < totalPages && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  size="lg"
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}

        {/* 无结果 */}
        {!loading && movies.length === 0 && query && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-gray-400 mb-4">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* 默认状态 */}
        {!query && movies.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Search Movies</h3>
            <p className="text-gray-400">
              Enter a movie title to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

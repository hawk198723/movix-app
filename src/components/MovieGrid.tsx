import React from 'react'
import { MovieCard } from './MovieCard'
import type { Movie } from '../types'

interface MovieGridProps {
  title: string
  movies: Movie[]
  onFavoriteChange?: () => void
}

export function MovieGrid({ title, movies, onFavoriteChange }: MovieGridProps) {
  if (!movies.length) return null

  return (
    <div className="mb-12">
      {/* 标题 */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-6 text-gray-900 dark:text-white transition-colors duration-200">
        {title}
      </h2>
      
      {/* 电影网格 - 每行5个 */}
      <div className="px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.slice(0, 15).map((movie) => (
            <MovieCard 
              key={movie.id}
              movie={movie} 
              onFavoriteChange={onFavoriteChange}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


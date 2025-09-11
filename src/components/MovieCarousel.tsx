import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MovieCard } from './MovieCard'
import type { Movie } from '../types'

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  onFavoriteChange?: () => void
}

export function MovieCarousel({ title, movies, onFavoriteChange }: MovieCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.8
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!movies.length) return null

  return (
    <div className="relative group">
      {/* 标题 */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-6">{title}</h2>
      
      {/* 轮播容器 */}
      <div className="relative">
        {/* 左箭头 */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* 右箭头 */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* 电影列表 */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 md:px-6 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-32 sm:w-40 md:w-48 lg:w-56"
            >
              <MovieCard 
                movie={movie} 
                onFavoriteChange={onFavoriteChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

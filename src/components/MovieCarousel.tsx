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
  const [isScrolling, setIsScrolling] = React.useState(false)
  const [scrollDirection, setScrollDirection] = React.useState<'left' | 'right' | null>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // 无限循环：复制电影数组
  const infiniteMovies = React.useMemo(() => {
    if (movies.length === 0) return []
    // 创建三份拷贝：[...movies, ...movies, ...movies]
    return [...movies, ...movies, ...movies]
  }, [movies])

  // 开始滑动
  const startScroll = (direction: 'left' | 'right') => {
    setIsScrolling(true)
    setScrollDirection(direction)
  }

  // 停止滑动
  const stopScroll = () => {
    setIsScrolling(false)
    setScrollDirection(null)
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  // 持续滑动效果
  React.useEffect(() => {
    if (isScrolling && scrollDirection && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollSpeed = 3 // 像素/帧
      
      scrollIntervalRef.current = setInterval(() => {
        if (scrollDirection === 'right') {
          container.scrollLeft += scrollSpeed
        } else {
          container.scrollLeft -= scrollSpeed
        }
        
        // 无限循环检测
        const maxScroll = container.scrollWidth - container.clientWidth
        const oneThirdWidth = container.scrollWidth / 3
        
        if (container.scrollLeft >= oneThirdWidth * 2) {
          // 滑到最右边，跳回中间段
          container.scrollLeft = oneThirdWidth
        } else if (container.scrollLeft <= 0) {
          // 滑到最左边，跳回中间段
          container.scrollLeft = oneThirdWidth
        }
      }, 16) // ~60fps
    }
    
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [isScrolling, scrollDirection])

  // 初始化：滚动到中间段
  React.useEffect(() => {
    if (scrollContainerRef.current && infiniteMovies.length > 0) {
      const container = scrollContainerRef.current
      const oneThirdWidth = container.scrollWidth / 3
      container.scrollLeft = oneThirdWidth
    }
  }, [infiniteMovies])

  if (!movies.length) return null

  return (
    <div className="relative py-6">
      {/* 内容容器 - 统一最大宽度和居中 */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-16">
        {/* 标题 - 所有断点完全统一 */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-200">{title}</h2>
        
        {/* 轮播容器 */}
        <div className="relative carousel-wrapper">
          {/* 左箭头 - 按住连续滑动 */}
          <button
            onMouseDown={() => startScroll('left')}
            onMouseUp={stopScroll}
            onMouseLeave={stopScroll}
            onTouchStart={() => startScroll('left')}
            onTouchEnd={stopScroll}
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all duration-200 hidden md:flex items-center justify-center shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* 右箭头 - 按住连续滑动 */}
          <button
            onMouseDown={() => startScroll('right')}
            onMouseUp={stopScroll}
            onMouseLeave={stopScroll}
            onTouchStart={() => startScroll('right')}
            onTouchEnd={stopScroll}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-all duration-200 hidden md:flex items-center justify-center shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* 电影列表容器 - 平滑滚动，无限循环 */}
          <div className="overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 pb-4 overflow-x-scroll scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollBehavior: 'auto' // 使用 JS 控制，不用 CSS smooth
              }}
            >
              {infiniteMovies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className="flex-none w-48 md:w-56 lg:w-64"
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
      </div>
    </div>
  )
}

import React from 'react'

export function LoadingBar() {
  return (
    <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-netflix-red via-red-500 to-netflix-red animate-loading-slide relative">
        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  )
}


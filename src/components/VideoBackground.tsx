import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface VideoBackgroundProps {
  videoKey: string // YouTube video ID
  onLoadError?: () => void
}

export function VideoBackground({ videoKey, onLoadError }: VideoBackgroundProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 加载 YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      // YouTube API 加载完成回调
      window.onYouTubeIframeAPIReady = () => {
        initPlayer()
      }
    } else {
      initPlayer()
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.error('Error destroying player:', e)
        }
      }
    }
  }, [videoKey])

  const initPlayer = () => {
    if (!containerRef.current || !window.YT) return

    try {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoKey,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          mute: 1,
          loop: 1,
          playlist: videoKey, // 循环播放需要设置 playlist
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true)
            setIsLoading(false)
            event.target.playVideo()
          },
          onError: () => {
            setIsLoading(false)
            onLoadError?.()
          },
          onStateChange: (event: any) => {
            // 视频结束时重新播放
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo()
            }
          }
        }
      })
    } catch (error) {
      console.error('Error initializing YouTube player:', error)
      setIsLoading(false)
      onLoadError?.()
    }
  }

  const toggleMute = () => {
    if (playerRef.current && isPlayerReady) {
      if (isMuted) {
        playerRef.current.unMute()
        setIsMuted(false)
      } else {
        playerRef.current.mute()
        setIsMuted(true)
      }
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* YouTube 播放器容器 */}
      <div
        id="youtube-player"
        className="absolute pointer-events-none"
        style={{
          width: '100vw',
          height: '56.25vw', // 16:9 aspect ratio
          minHeight: '100vh',
          minWidth: '177.77vh', // 16:9 aspect ratio
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 渐变覆盖层 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-black/80 dark:via-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-netflix-black via-transparent to-transparent pointer-events-none" />

      {/* 音量控制按钮 */}
      {isPlayerReady && (
        <button
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      )}
    </div>
  )
}

// 扩展 Window 接口以支持 YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}


import React, { useRef, useEffect, useState, useMemo, useCallback, useImperativeHandle, CSSProperties } from 'react'
import { VideoPlayer } from '@mobile-canvas-video-player/core'
import { PlayIcon, PauseIcon, VolumeOnIcon, VolumeOffIcon, FullscreenIcon, ExitFullscreenIcon } from '../icons/index'

export interface ControlsConfig {
  playPause?: boolean
  mute?: boolean
  fullscreen?: boolean
  progressBar?: boolean
  timeDisplay?: boolean
}

export interface MobileVideoPlayerProps {
  src: string
  width?: number
  height?: number
  loop?: boolean
  controls?: ControlsConfig
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (time: number) => void
  onEnded?: () => void
  onError?: (error: any) => void
  onCanPlay?: () => void
}

export interface MobileVideoPlayerRef {
  play: () => Promise<void> | undefined
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  setMuted: (val: boolean) => void
  toggleMute: () => void
  togglePlayPause: () => void
  toggleFullscreen: () => void
}

interface PlayerState {
  isPlaying: boolean
  isMuted: boolean
  isFullscreen: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  buffered: number
  showControls: boolean
  showProgressOverlay: boolean
  showStatus: boolean
  statusText: string
  isDragging: boolean
}

interface CanvasSize {
  width: number
  height: number
}

export const MobileVideoPlayer = React.forwardRef<MobileVideoPlayerRef, MobileVideoPlayerProps>((props, ref) => {
  const {
    src,
    width = 375,
    height = 375,
    loop = false,
    controls = {
      playPause: true,
      mute: true,
      fullscreen: true,
      progressBar: true,
      timeDisplay: true
    },
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onError,
    onCanPlay
  } = props

  const playerContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressHandleRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<VideoPlayer | null>(null)
  const controlsTimerRef = useRef<number | null>(null)
  const statusTimerRef = useRef<number | null>(null)
  const callbacksRef = useRef({ onPlay, onPause, onTimeUpdate, onEnded, onError, onCanPlay })

  // 更新回调引用
  useEffect(() => {
    callbacksRef.current = { onPlay, onPause, onTimeUpdate, onEnded, onError, onCanPlay }
  }, [onPlay, onPause, onTimeUpdate, onEnded, onError, onCanPlay])

  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    isMuted: true,
    isFullscreen: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    showControls: true,
    showProgressOverlay: false,
    showStatus: false,
    statusText: '',
    isDragging: false
  })

  const [containerFullscreenStyle, setContainerFullscreenStyle] = useState<CSSProperties>({})
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width, height })

  const playedPercent = useMemo(() => 
    state.duration ? (state.currentTime / state.duration) * 100 : 0,
    [state.currentTime, state.duration]
  )

  const bufferedPercent = useMemo(() => 
    state.duration ? (state.buffered / state.duration) * 100 : 0,
    [state.buffered, state.duration]
  )

  const hasAnyControl = useMemo(() => 
    controls.playPause || controls.mute || controls.fullscreen || controls.progressBar || controls.timeDisplay,
    [controls]
  )

  const updateState = useCallback((updates: Partial<PlayerState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const showControlsTemporarily = useCallback(() => {
    updateState({ showControls: true })
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current)
    }
    controlsTimerRef.current = window.setTimeout(() => {
      if (!state.isDragging) {
        updateState({ showControls: false })
      }
    }, 3000)
  }, [state.isDragging, updateState])

  const showStatusTemporarily = useCallback((text: string) => {
    updateState({ statusText: text, showStatus: true })
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current)
    }
    statusTimerRef.current = window.setTimeout(() => {
      updateState({ showStatus: false })
    }, 1000)
  }, [updateState])

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return
    if (state.isPlaying) {
      playerRef.current.pause()
      updateState({ showControls: true })
      showStatusTemporarily('暂停')
    } else {
      if (state.isMuted && !state.isPlaying) {
        playerRef.current.unmute()
      }
      playerRef.current.play()
      showStatusTemporarily('播放')
    }
  }, [state.isPlaying, state.isMuted, updateState, showStatusTemporarily])

  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.toggleMute()
    }
  }, [])

  const setMuted = useCallback((val: boolean) => {
    if (playerRef.current) {
      playerRef.current.setMuted(val)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (state.isFullscreen) {
      updateState({ isFullscreen: false })
      setContainerFullscreenStyle({})
      return
    }

    const w = window.innerWidth
    const h = window.innerHeight
    const centerPoint = `${w / 2}px ${w / 2}px`

    setContainerFullscreenStyle({
      width: `${h}px`,
      height: `${w}px`,
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '999',
      transform: 'rotate(90deg)',
      transformOrigin: centerPoint,
      backgroundColor: 'black'
    })
    updateState({ isFullscreen: true })
  }, [state.isFullscreen, updateState])

  const handleCanvasClick = useCallback(() => {
    showControlsTemporarily()
  }, [showControlsTemporarily])

  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !playerRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    const newTime = percent * state.duration
    playerRef.current.seek(newTime)
  }, [state.duration])

  const startProgressDrag = useCallback((event: React.MouseEvent<HTMLDivElement> | TouchEvent) => {
    event.preventDefault()
    updateState({ isDragging: true })

    const handleDrag = (e: MouseEvent | TouchEvent) => {
      if (!progressBarRef.current || !playerRef.current) return
      const rect = progressBarRef.current.getBoundingClientRect()
      const clientX = 'clientX' in e ? e.clientX : (e.touches && e.touches[0].clientX)
      if (clientX === undefined) return
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const newTime = percent * state.duration
      playerRef.current.seek(newTime)
    }

    const stopDrag = () => {
      updateState({ isDragging: false })
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', stopDrag)
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchmove', handleDrag, { passive: false })
    document.addEventListener('touchend', stopDrag)
  }, [state.duration, updateState])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    seek: (time: number) => playerRef.current?.seek(time),
    setVolume: (volume: number) => playerRef.current?.setVolume(volume),
    mute: () => playerRef.current?.mute(),
    unmute: () => playerRef.current?.unmute(),
    setMuted: (val: boolean) => setMuted(val),
    toggleMute: () => toggleMute(),
    togglePlayPause: () => togglePlayPause(),
    toggleFullscreen: () => toggleFullscreen()
  }), [setMuted, toggleMute, togglePlayPause, toggleFullscreen])

  useEffect(() => {
    if (!canvasRef.current) return

    const player = new VideoPlayer({
      loop
    })
    playerRef.current = player

    player.init(canvasRef.current, src)

    player.on('play', () => {
      updateState({ isPlaying: true })
      callbacksRef.current.onPlay?.()
    })

    player.on('pause', () => {
      updateState({ isPlaying: false, showControls: true })
      callbacksRef.current.onPause?.()
    })

    player.on('timeupdate', () => {
      updateState({ currentTime: player.state.currentTime })
      callbacksRef.current.onTimeUpdate?.(player.state.currentTime)
    })

    player.on('loadedmetadata', () => {
      updateState({ 
        duration: player.state.duration,
        isMuted: player.state.isMuted
      })
      const videoSize = player.getVideoSize()
      if (videoSize) {
        setCanvasSize({
          width: videoSize.width,
          height: videoSize.height
        })
      }
    })

    player.on('canplay', () => {
      callbacksRef.current.onCanPlay?.()
    })

    player.on('progress', () => {
      updateState({ buffered: player.state.buffered })
    })

    player.on('volumechange', () => {
      updateState({ isMuted: player.state.isMuted })
    })

    player.on('ended', () => {
      callbacksRef.current.onEnded?.()
    })

    player.on('error', (error: any) => {
      callbacksRef.current.onError?.(error)
    })

    const handleFullscreenChange = () => {
      const doc = document as any
      updateState({ 
        isFullscreen: !!(doc.fullscreenElement || doc.webkitFullscreenElement) 
      })
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      player.destroy()
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current)
      }
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current)
      }
    }
  }, [src, loop, updateState])

  // 为进度条手柄添加触摸事件监听器（非被动模式）
  useEffect(() => {
    const handleElement = progressHandleRef.current
    if (handleElement) {
      handleElement.addEventListener('touchstart', startProgressDrag as any, { passive: false })
    }

    return () => {
      if (handleElement) {
        handleElement.removeEventListener('touchstart', startProgressDrag as any)
      }
    }
  }, [startProgressDrag])

  return (
    <div 
      className="video-player" 
      ref={playerContainerRef} 
      style={containerFullscreenStyle}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
      />

      {state.showProgressOverlay && (
        <div className="progress-overlay">
          <div className="time-display">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>
        </div>
      )}

      {state.showStatus && (
        <div className="status">{state.statusText}</div>
      )}

      {state.isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {state.showControls && hasAnyControl && (
        <div className="controls-container" onClick={(e) => e.stopPropagation()}>
          {controls.progressBar && (
            <div 
              className="progress-bar" 
              onClick={handleProgressClick} 
              ref={progressBarRef}
            >
              <div 
                className="progress-buffered" 
                style={{ width: `${bufferedPercent}%` }}
              ></div>
              <div 
                className="progress-played" 
                style={{ width: `${playedPercent}%` }}
              ></div>
              <div
                className="progress-handle"
                style={{ left: `${playedPercent}%` }}
                ref={progressHandleRef}
                onMouseDown={startProgressDrag}
              ></div>
            </div>
          )}

          <div className="controls">
            {controls.playPause && (
              <div onClick={togglePlayPause} className="control-btn">
                {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
              </div>
            )}

            {controls.timeDisplay && (
              <span className="time">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </span>
            )}

            {controls.mute && (
              <div onClick={toggleMute} className="control-btn">
                {state.isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
              </div>
            )}

            {controls.fullscreen && (
              <div onClick={toggleFullscreen} className="control-btn fullscreen-btn">
                {state.isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

MobileVideoPlayer.displayName = 'MobileVideoPlayer'

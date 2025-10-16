import Hls from 'hls.js'

export interface VideoPlayerOptions {
  loop?: boolean
  preload?: 'auto' | 'metadata' | 'none'
}

export interface VideoPlayerState {
  isPlaying: boolean
  isMuted: boolean
  isFullscreen: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  buffered: number
  volume: number
}

export type VideoPlayerEvent = 
  | 'loadstart'
  | 'loadedmetadata'
  | 'canplay'
  | 'play'
  | 'pause'
  | 'timeupdate'
  | 'progress'
  | 'volumechange'
  | 'ended'
  | 'error'

export type EventCallback<T = any> = (data?: T) => void

export class VideoPlayer {
  public options: Required<VideoPlayerOptions>
  public state: VideoPlayerState
  private callbacks: Record<string, EventCallback[]>
  private hls: Hls | null
  private video: HTMLVideoElement | null
  private canvas: HTMLCanvasElement | null
  private ctx: CanvasRenderingContext2D | null

  constructor(options: VideoPlayerOptions = {}) {
    this.options = {
      loop: false,
      preload: 'auto',
      ...options
    }
    
    this.state = {
      isPlaying: false,
      isMuted: true,
      isFullscreen: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      buffered: 0,
      volume: 1
    }
    
    this.callbacks = {}
    this.hls = null
    this.video = null
    this.canvas = null
    this.ctx = null
  }

  public init(canvasElement: HTMLCanvasElement, src: string): void {
    this.video = document.createElement("video")
    this.canvas = canvasElement
    this.ctx = canvasElement.getContext('2d')
    
    this.loadSource(src)
    this.setupVideoElement()
    this.setupEventListeners()
    this.startRenderLoop()
  }

  private setupVideoElement(): void {
    if (!this.video) return
    
    this.video.muted = true
    this.video.loop = this.options.loop
    this.video.preload = this.options.preload
    this.video.setAttribute('playsinline', '')
    this.video.setAttribute('webkit-playsinline', '')
  }

  private setupEventListeners(): void {
    if (!this.video) return
    
    this.video.addEventListener('loadstart', () => this.emit('loadstart'))
    this.video.addEventListener('loadedmetadata', () => {
      if (this.video) {
        this.state.duration = this.video.duration
      }
      this.emit('loadedmetadata')
    })
    this.video.addEventListener('canplay', () => this.emit('canplay'))
    this.video.addEventListener('play', () => {
      this.state.isPlaying = true
      this.emit('play')
    })
    this.video.addEventListener('pause', () => {
      this.state.isPlaying = false
      this.emit('pause')
    })
    this.video.addEventListener('timeupdate', () => {
      if (this.video) {
        this.state.currentTime = this.video.currentTime
      }
      this.emit('timeupdate')
    })
    this.video.addEventListener('progress', () => {
      if (this.video && this.video.buffered.length > 0) {
        this.state.buffered = this.video.buffered.end(this.video.buffered.length - 1)
      }
      this.emit('progress')
    })
    this.video.addEventListener('volumechange', () => {
      if (this.video) {
        this.state.volume = this.video.volume
        this.state.isMuted = this.video.muted
      }
      this.emit('volumechange')
    })
    this.video.addEventListener('ended', () => this.emit('ended'))
    this.video.addEventListener('error', (e) => this.emit('error', e))
  }

  private startRenderLoop(): void {
    const render = (): void => {
      if (this.video && this.canvas && this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
      }
      requestAnimationFrame(render)
    }
    render()
  }

  public loadSource(src: string): void {
    if (!this.video) return
    
    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      this.hls = new Hls()
      this.hls.loadSource(src)
      this.hls.attachMedia(this.video)
    } else {
      this.video.src = src
    }
  }

  public play(): Promise<void> | undefined {
    return this.video?.play()
  }

  public pause(): void {
    this.video?.pause()
  }

  public seek(time: number): void {
    if (this.video) {
      this.video.currentTime = time
    }
  }

  public setVolume(volume: number): void {
    if (this.video) {
      this.video.volume = Math.max(0, Math.min(1, volume))
    }
  }

  public mute(): void {
    if (this.video) {
      this.video.muted = true
    }
  }

  public unmute(): void {
    if (this.video) {
      this.video.muted = false
    }
  }

  public toggleMute(): void {
    if (this.video) {
      this.video.muted = !this.video.muted
    }
  }

  public setMuted(muted: boolean): void {
    if (!this.video) return
    const val = !!muted
    this.video.muted = val
    if (val) {
      this.video.setAttribute('muted', '')
    } else {
      this.video.removeAttribute('muted')
    }
  }

  public enterFullscreen(): void {
    if (!this.canvas) return
    
    const canvas = this.canvas as any
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  }

  public exitFullscreen(): void {
    const doc = document as any
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen()
    }
  }

  public on(event: VideoPlayerEvent, callback: EventCallback): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  public emit(event: VideoPlayerEvent, data?: any): void {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data))
    }
  }

  public destroy(): void {
    if (this.hls) {
      this.hls.destroy()
    }
    this.callbacks = {}
  }

  public formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

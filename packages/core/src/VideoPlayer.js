import Hls from 'hls.js'

export class VideoPlayer {
  constructor(options = {}) {
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

  init(canvasElement, src) {
    this.video = document.createElement("video")
    this.canvas = canvasElement
    this.ctx = canvasElement.getContext('2d')
    
    this.loadSource(src)
    this.setupVideoElement()
    this.setupEventListeners()
    this.startRenderLoop()
  }

  setupVideoElement() {
    this.video.muted = true
    this.video.loop = this.options.loop
    this.video.preload = this.options.preload
    this.video.setAttribute('playsinline', '')
    this.video.setAttribute('webkit-playsinline', '')
  }

  setupEventListeners() {
    this.video.addEventListener('loadstart', () => this.emit('loadstart'))
    this.video.addEventListener('loadedmetadata', () => {
      this.state.duration = this.video.duration
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
      this.state.currentTime = this.video.currentTime
      this.emit('timeupdate')
    })
    this.video.addEventListener('progress', () => {
      if (this.video.buffered.length > 0) {
        this.state.buffered = this.video.buffered.end(this.video.buffered.length - 1)
      }
      this.emit('progress')
    })
    this.video.addEventListener('volumechange', () => {
      this.state.volume = this.video.volume
      this.state.isMuted = this.video.muted
      this.emit('volumechange')
    })
    this.video.addEventListener('ended', () => this.emit('ended'))
    this.video.addEventListener('error', (e) => this.emit('error', e))
  }

  startRenderLoop() {
    const render = () => {
      if (this.video && this.canvas && this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
      }
      requestAnimationFrame(render)
    }
    render()
  }

  loadSource(src) {
    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      this.hls = new Hls()
      this.hls.loadSource(src)
      this.hls.attachMedia(this.video)
    } else {
      this.video.src = src
    }
  }

  play() {
    return this.video.play()
  }

  pause() {
    this.video.pause()
  }

  seek(time) {
    this.video.currentTime = time
  }

  setVolume(volume) {
    this.video.volume = Math.max(0, Math.min(1, volume))
  }

  mute() {
    this.video.muted = true
  }

  unmute() {
    this.video.muted = false
  }

  toggleMute() {
    this.video.muted = !this.video.muted
  }

  setMuted(muted) {
    if (!this.video) return
    const val = !!muted
    this.video.muted = val
    if (val) {
      this.video.setAttribute('muted', '')
    } else {
      this.video.removeAttribute('muted')
    }
  }

  enterFullscreen() {
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen()
    } else if (this.canvas.webkitRequestFullscreen) {
      this.canvas.webkitRequestFullscreen()
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data))
    }
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy()
    }
    this.callbacks = {}
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

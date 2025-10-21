<template>
  <div class="video-player" ref="playerContainer" :style="containerFullscreenStyle">
    <canvas 
      ref="canvasElement"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleCanvasClick"
    />

    <!-- 进度覆盖层 -->
    <div class="progress-overlay" v-show="showProgressOverlay">
      <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
    </div>

    <!-- 状态显示 -->
    <div class="status" v-show="showStatus">{{ statusText }}</div>

    <!-- 加载指示器 -->
    <div class="loading" v-show="isLoading">
      <div class="loading-spinner"></div>
    </div>

    <!-- 控制栏 -->
    <div class="controls-container" v-show="showControls && hasAnyControl" @click.stop>
      <!-- 进度条 -->
      <div v-if="controls.progressBar" class="progress-bar" @click="handleProgressClick" ref="progressBar">
        <div class="progress-buffered" :style="{ width: bufferedPercent + '%' }"></div>
        <div class="progress-played" :style="{ width: playedPercent + '%' }"></div>
        <div 
          class="progress-handle" 
          :style="{ left: playedPercent + '%' }"
          @mousedown="startProgressDrag"
          ref="progressHandle"
        ></div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <div v-if="controls.playPause" @click="togglePlayPause" class="control-btn">
          <PlayIcon v-if="!isPlaying" />
          <PauseIcon v-else />
        </div>
        
        <span v-if="controls.timeDisplay" class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        
        <div v-if="controls.mute" @click="toggleMute" class="control-btn">
          <VolumeOnIcon v-if="!isMuted" />
          <VolumeOffIcon v-else />
        </div>
        
        <div v-if="controls.fullscreen" @click="toggleFullscreen" class="control-btn fullscreen-btn">
          <FullscreenIcon v-if="!isFullscreen" />
          <ExitFullscreenIcon v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, watch, toRefs } from 'vue'
import { VideoPlayer } from '@mobile-canvas-video-player/core'
import { PlayIcon, PauseIcon, VolumeOnIcon, VolumeOffIcon, FullscreenIcon, ExitFullscreenIcon } from '../icons/index.js'

export default {
  name: 'MobileVideoPlayer',
  components: {
    PlayIcon,
    PauseIcon,
    VolumeOnIcon,
    VolumeOffIcon,
    FullscreenIcon,
    ExitFullscreenIcon
  },
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 375
    },
    height: {
      type: Number,
      default: 375
    },
    loop: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Object,
      default: () => ({
        playPause: true,
        mute: true,
        fullscreen: true,
        progressBar: true,
        timeDisplay: true
      })
    }
  },
  emits: ['play', 'pause', 'timeupdate', 'ended', 'error', 'canplay'],
  setup(props, { emit, expose }) {
    const playerContainer = ref(null)
    const videoElement = ref(null)
    const canvasElement = ref(null)
    const progressBar = ref(null)
    const progressHandle = ref(null)

    const player = new VideoPlayer({
      loop: props.loop
    })

    const state = reactive({
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

    const containerFullscreenStyle = ref({})
    const canvasWidth = ref(props.width)
    const canvasHeight = ref(props.height)
    const playedPercent = computed(() => state.duration ? (state.currentTime / state.duration) * 100 : 0)
    const bufferedPercent = computed(() => state.duration ? (state.buffered / state.duration) * 100 : 0)
    const hasAnyControl = computed(() => {
      return props.controls.playPause || props.controls.mute || 
             props.controls.fullscreen || props.controls.progressBar || 
             props.controls.timeDisplay
    })

    let controlsTimer = null
    let statusTimer = null

    const showControlsTemporarily = () => {
      state.showControls = true
      clearTimeout(controlsTimer)
      controlsTimer = setTimeout(() => {
        if (!state.isDragging) {
          state.showControls = false
        }
      }, 3000)
    }

    const showStatusTemporarily = (text) => {
      state.statusText = text
      state.showStatus = true
      clearTimeout(statusTimer)
      statusTimer = setTimeout(() => {
        state.showStatus = false
      }, 1000)
    }

    const togglePlayPause = () => {
      if (state.isPlaying) {
        player.pause()
        state.showControls = true
        showStatusTemporarily('暂停')
      } else {
        player.play()
        showStatusTemporarily('播放')
      }
    }

    const toggleMute = () => {
      player.toggleMute()
    }

    const setMuted = (val) => {
      player.setMuted(val)
    }

    const toggleFullscreen = () => {
      const container = playerContainer.value
      if (!container) return

      if (state.isFullscreen) {
        state.isFullscreen = false
        containerFullscreenStyle.value = {}
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      const centerPoint = `${width / 2}px ${width / 2}px`

      containerFullscreenStyle.value = {
        width: `${height}px`,
        height: `${width}px`,
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '999',
        transform: 'rotate(90deg)',
        transformOrigin: centerPoint,
        backgroundColor: 'black'
      }
      state.isFullscreen = true
    }

    const handleCanvasClick = () => {
      showControlsTemporarily()
    }

    const handleProgressClick = (event) => {
      const rect = progressBar.value.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width
      const newTime = percent * state.duration
      player.seek(newTime)
    }

    const startProgressDrag = (event) => {
      event.preventDefault()
      state.isDragging = true
      const handleDrag = (e) => {
        const rect = progressBar.value.getBoundingClientRect()
        const clientX = e.clientX || (e.touches && e.touches[0].clientX)
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const newTime = percent * state.duration
        player.seek(newTime)
      }
      
      const stopDrag = () => {
        state.isDragging = false
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', stopDrag)
        document.removeEventListener('touchmove', handleDrag)
        document.removeEventListener('touchend', stopDrag)
      }
      
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', stopDrag)
      document.addEventListener('touchmove', handleDrag, { passive: false })
      document.addEventListener('touchend', stopDrag)
    }

    const formatTime = (seconds) => {
      return player.formatTime(seconds)
    }

    const play = () => {
      return player.play()
    }

    const pause = () => {
      player.pause()
    }

    const seek = (time) => {
      player.seek(time)
    }

    const setVolume = (volume) => {
      player.setVolume(volume)
    }

    const handleFullscreenChange = () => {
      state.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement)
    }

    onMounted(() => {
      player.init(canvasElement.value, props.src)
      
      player.on('play', () => {
        state.isPlaying = true
        emit('play')
      })
      
      player.on('pause', () => {
        state.isPlaying = false
        state.showControls = true
        emit('pause')
      })
      
      player.on('timeupdate', () => {
        state.currentTime = player.state.currentTime
        emit('timeupdate', state.currentTime)
      })
      
      player.on('loadedmetadata', () => {
        state.duration = player.state.duration
        console.log('loadedmetadata', player.state)
        state.isMuted = player.state.isMuted
        const videoSize = player.getVideoSize()
        if (videoSize) {
          canvasWidth.value = videoSize.width
          canvasHeight.value = videoSize.height
        }
      })

      player.on('canplay', () => {
        emit('canplay')
      })
      
      player.on('progress', () => {
        state.buffered = player.state.buffered
      })
      
      player.on('volumechange', () => {
        state.isMuted = player.state.isMuted
      })
      
      player.on('ended', () => {
        emit('ended')
      })
      
      player.on('error', (error) => {
        emit('error', error)
      })

      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      
      // 为进度条手柄添加触摸事件监听器（非被动模式）
      if (progressHandle.value) {
        progressHandle.value.addEventListener('touchstart', startProgressDrag, { passive: false })
      }
      
      if (props.src) {
        player.loadSource(props.src)
      }
    })

    onUnmounted(() => {
      player.destroy()
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      
      // 移除进度条手柄的触摸事件监听器
      if (progressHandle.value) {
        progressHandle.value.removeEventListener('touchstart', startProgressDrag)
      }
      
      clearTimeout(controlsTimer)
      clearTimeout(statusTimer)
    })

    watch(() => props.src, (newSrc) => {
      if (newSrc) {
        player.loadSource(newSrc)
      }
    })

    expose({ 
      setMuted,
      play,
      pause,
      seek,
      setVolume,
      toggleMute,
      togglePlayPause,
      toggleFullscreen
    })

    return {
      playerContainer,
      videoElement,
      canvasElement,
      progressBar,
      progressHandle,
      ...toRefs(state),
      containerFullscreenStyle,
      canvasWidth,
      canvasHeight,
      playedPercent,
      bufferedPercent,
      hasAnyControl,
      togglePlayPause,
      toggleMute,
      setMuted,
      toggleFullscreen,
      handleCanvasClick,
      handleProgressClick,
      startProgressDrag,
      formatTime
    }
  }
}
</script>

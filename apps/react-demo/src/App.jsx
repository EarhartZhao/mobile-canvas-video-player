import React, { useState, useRef } from 'react'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'
import './App.css'

function App() {
  const playerRef = useRef(null)
  const [videoSrc] = useState('https://test-streams.mux.dev/x36xhzz/url_6/193039199_mp4_h264_aac_hq_7.m3u8')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const onPlay = () => {
    setIsPlaying(true)
    console.log('视频开始播放')
  }

  const onPause = () => {
    setIsPlaying(false)
    console.log('视频暂停')
  }

  const onTimeUpdate = (time) => {
    setCurrentTime(time)
  }

  const onEnded = () => {
    console.log('视频播放结束')
  }

  const onError = (error) => {
    console.error('视频播放错误:', error)
  }

  const onCanPlay = () => {
    console.log('视频可以播放')
    playerRef.current?.play()
  }

  const testPlay = () => {
    playerRef.current?.play()
  }

  const testPause = () => {
    playerRef.current?.pause()
  }

  const testSeek = () => {
    playerRef.current?.seek(10)
  }

  const testMute = () => {
    playerRef.current?.mute()
  }

  const testUnmute = () => {
    playerRef.current?.unmute()
  }

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>Mobile Video Player</h1>
        <p>React + Vite + Canvas</p>
      </div>

      <div className="demo-player">
        <MobileVideoPlayer
          ref={playerRef}
          src={videoSrc}
          width={375}
          height={375}
          controls={{
            mute: true,
            fullscreen: true,
          }}
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onError={onError}
          onCanPlay={onCanPlay}
        />
      </div>

      <div className="demo-info">
        <h3>功能特性：</h3>
        <ul>
          <li>✅ Canvas 渲染视频</li>
          <li>✅ 支持 HLS 流媒体</li>
          <li>✅ 移动端手势控制</li>
          <li>✅ 全屏播放</li>
          <li>✅ 进度条拖拽</li>
          <li>✅ 音量控制</li>
          <li>✅ 响应式设计</li>
        </ul>

        <h3 style={{ marginTop: '20px' }}>当前状态：</h3>
        <p>播放状态: {isPlaying ? '播放中' : '暂停'}</p>
        <p>当前时间: {formatTime(currentTime)}</p>

        <h3 style={{ marginTop: '20px' }}>控制方法测试：</h3>
        <button onClick={testPlay}>播放</button>
        <button onClick={testPause}>暂停</button>
        <button onClick={testSeek}>跳转到10秒</button>
        <button onClick={testMute}>静音</button>
        <button onClick={testUnmute}>取消静音</button>
      </div>
    </div>
  )
}

export default App

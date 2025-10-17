# @mobile-canvas-video-player/react

基于 Canvas 的移动端视频播放器 React 组件。用于解决移动端浏览器视频播放厂商自定义控制器的问题。

## 安装

```bash
npm install @mobile-canvas-video-player/react
# 或
pnpm add @mobile-canvas-video-player/react
# 或
yarn add @mobile-canvas-video-player/react
```

## 基础用法

```jsx
import { useRef } from 'react'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'

function App() {
  const playerRef = useRef(null)

  return (
    <MobileVideoPlayer
      ref={playerRef}
      src="https://example.com/video.m3u8"
      width={375}
      height={375}
      loop={false}
      controls={{
        playPause: true,
        mute: true,
        fullscreen: true,
        progressBar: true,
        timeDisplay: true
      }}
      onPlay={() => console.log('播放')}
      onPause={() => console.log('暂停')}
      onCanPlay={() => playerRef.current?.play()}
    />
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 视频源（支持 HLS） |
| width | number | 375 | Canvas 宽度 |
| height | number | 375 | Canvas 高度 |
| loop | boolean | false | 循环播放 |
| controls | object | 全部启用 | 控制条配置 |

### Controls 配置

```js
{
  playPause: true,    // 播放/暂停按钮
  mute: true,         // 静音按钮
  fullscreen: true,   // 全屏按钮
  progressBar: true,  // 进度条
  timeDisplay: true   // 时间显示
}
```

## 事件

- `onPlay` - 开始播放
- `onPause` - 暂停
- `onTimeUpdate` - 时间更新
- `onEnded` - 播放结束
- `onCanPlay` - 可以播放
- `onError` - 播放错误

## Ref 方法

```jsx
playerRef.current.play()
playerRef.current.pause()
playerRef.current.seek(10)
playerRef.current.mute()
playerRef.current.unmute()
```

## 源码仓库

[GitHub - mobile-canvas-video-player](https://github.com/EarhartZhao/mobile-canvas-video-player)

## License

MIT

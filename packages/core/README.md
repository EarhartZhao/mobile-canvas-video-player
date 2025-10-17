# @mobile-canvas-video-player/core

基于 Canvas 的移动端视频播放器核心库，支持 HLS 流媒体播放。用于解决移动端浏览器视频播放厂商自定义控制器的问题。

## 安装

```bash
npm install @mobile-canvas-video-player/core
# 或
pnpm add @mobile-canvas-video-player/core
# 或
yarn add @mobile-canvas-video-player/core
```

## 基础用法

```typescript
import { VideoPlayer } from '@mobile-canvas-video-player/core'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const player = new VideoPlayer({
  loop: false,
  preload: 'auto'
})

player.init(canvas, 'https://example.com/video.m3u8')

// 播放控制
player.play()
player.pause()
player.seek(10) // 跳转到 10 秒

// 音量控制
player.mute()
player.unmute()
player.setVolume(0.5)

// 事件监听
player.on('play', () => console.log('播放'))
player.on('pause', () => console.log('暂停'))
player.on('timeupdate', () => {
  console.log('当前时间:', player.state.currentTime)
})
```

## API

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| loop | boolean | false | 循环播放 |
| preload | string | 'auto' | 预加载策略 |

### 方法

- `init(canvas, src)` - 初始化播放器
- `play()` - 播放
- `pause()` - 暂停
- `seek(time)` - 跳转到指定时间
- `mute()` - 静音
- `unmute()` - 取消静音
- `setVolume(volume)` - 设置音量 (0-1)

### 事件

- `play` - 开始播放
- `pause` - 暂停
- `timeupdate` - 时间更新
- `ended` - 播放结束
- `canplay` - 可以播放
- `error` - 播放错误

## 源码仓库

[GitHub - mobile-canvas-video-player](https://github.com/EarhartZhao/mobile-canvas-video-player)

## License

MIT

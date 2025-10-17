# @mobile-canvas-video-player/vue

基于 Canvas 的移动端视频播放器 Vue 3 组件。用于解决移动端浏览器视频播放厂商自定义控制器的问题。

## 安装

```bash
npm install @mobile-canvas-video-player/vue
# 或
pnpm add @mobile-canvas-video-player/vue
# 或
yarn add @mobile-canvas-video-player/vue
```

## 基础用法

```vue
<template>
  <MobileVideoPlayer
    ref="playerRef"
    :src="videoSrc"
    :width="375"
    :height="375"
    :loop="false"
    :controls="{
      playPause: true,
      mute: true,
      fullscreen: true,
      progressBar: true,
      timeDisplay: true
    }"
    @play="onPlay"
    @pause="onPause"
    @canplay="onCanPlay"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
import '@mobile-canvas-video-player/vue/style.css'

const playerRef = ref(null)
const videoSrc = 'https://example.com/video.m3u8'

const onPlay = () => console.log('播放')
const onPause = () => console.log('暂停')
const onCanPlay = () => playerRef.value?.play()
</script>
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

- `@play` - 开始播放
- `@pause` - 暂停
- `@timeupdate` - 时间更新
- `@ended` - 播放结束
- `@canplay` - 可以播放
- `@error` - 播放错误

## Ref 方法

```js
playerRef.value.play()
playerRef.value.pause()
playerRef.value.seek(10)
playerRef.value.mute()
playerRef.value.unmute()
```

## 源码仓库

[GitHub - mobile-canvas-video-player](https://github.com/EarhartZhao/mobile-canvas-video-player)

## License

MIT

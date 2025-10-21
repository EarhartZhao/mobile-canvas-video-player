# Mobile Canvas Video Player

一个基于 Canvas 的移动端视频播放器组件库，支持 Vue 和 React。用于解决移动端浏览器视频播放控制条。

## 📦 包结构

项目采用 monorepo 架构，包含以下包：

> 💡 **详细的安装和使用指南请查看 [INSTALLATION.md](./INSTALLATION.md)**
> 🔷 **TypeScript 迁移文档请查看 [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md)**

### Packages

- **@mobile-canvas-video-player/core** - 核心播放器逻辑
  - 基于 Canvas 的视频渲染
  - 支持 HLS 流媒体播放
  - 提供完整的播放器 API

- **@mobile-canvas-video-player/vue** - Vue 组件
  - 基于 Vue 3 的组件封装
  - 响应式状态管理
  - 完整的组件 API

- **@mobile-canvas-video-player/react** - React 组件
  - 基于 React 18 的组件封装
  - Hooks 实现状态管理
  - 完整的组件 API

### Apps

- **vue-demo** - Vue 示例应用
- **react-demo** - React 示例应用

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行示例

#### Vue Demo
```bash
cd apps/vue-demo
pnpm dev
```

#### React Demo
```bash
cd apps/react-demo
pnpm dev
```

## 📖 使用方法

### Vue

```bash
pnpm add @mobile-canvas-video-player/vue
```

```vue
<template>
  <MobileVideoPlayer
    ref="playerRef"
    :src="videoSrc"
    :width="375"
    :height="375"
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
    @timeupdate="onTimeUpdate"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
import '@mobile-canvas-video-player/vue/style.css'

const playerRef = ref(null)
const videoSrc = 'https://example.com/video.m3u8'

const onCanPlay = () => {
  // 视频准备好后自动播放
  playerRef.value?.play()
}
</script>
```

### React

```bash
pnpm add @mobile-canvas-video-player/react
```

```jsx
import { useRef } from 'react'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'

function App() {
  const playerRef = useRef(null)

  const onCanPlay = () => {
    // 视频准备好后自动播放
    playerRef.current?.play()
  }

  return (
    <MobileVideoPlayer
      ref={playerRef}
      src="https://example.com/video.m3u8"
      width={375}
      height={375}
      controls={{
        playPause: true,
        mute: true,
        fullscreen: true,
        progressBar: true,
        timeDisplay: true
      }}
      onPlay={() => console.log('播放')}
      onPause={() => console.log('暂停')}
      onCanPlay={onCanPlay}
      onTimeUpdate={(time) => console.log('时间更新', time)}
    />
  )
}
```

## 🎛️ 组件 API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 视频源地址（支持 HLS） |
| width | number | 375 | Canvas 宽度 |
| height | number | 375 | Canvas 高度 |
| loop | boolean | false | 循环播放 |
| controls | object | 见下方 | 控制条配置 |

### Controls 配置

```js
{
  playPause: true,    // 显示播放/暂停按钮
  mute: true,         // 显示静音按钮
  fullscreen: true,   // 显示全屏按钮
  progressBar: true,  // 显示进度条
  timeDisplay: true   // 显示时间显示
}
```

### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| play | - | 开始播放 |
| pause | - | 暂停播放 |
| timeupdate | time: number | 播放时间更新 |
| ended | - | 播放结束 |
| error | error: Error | 播放错误 |
| canplay | - | 可以播放 |

### 方法（通过 ref 调用）

```js
// Vue
const playerRef = ref(null)
playerRef.value.play()
playerRef.value.pause()
playerRef.value.seek(10) // 跳转到 10 秒
playerRef.value.mute()
playerRef.value.unmute()

// React
const playerRef = useRef(null)
playerRef.current.play()
playerRef.current.pause()
playerRef.current.seek(10)
playerRef.current.mute()
playerRef.current.unmute()
```

## ✨ 功能特性

- ✅ Canvas 渲染视频
- ✅ 支持 HLS 流媒体
- ✅ 移动端手势控制
- ✅ 全屏播放（旋转屏幕）
- ✅ 进度条拖拽
- ✅ 音量控制
- ✅ 响应式设计
- ✅ 自定义控制条
- ✅ Vue 3 & React 19 支持
- ✅ 支持手动控制播放（通过 canplay 事件）
- ✅ **样式隔离** - 使用命名空间前缀，避免与 Tailwind CSS 等框架冲突

## 🎨 样式隔离

组件使用 `mcvp-` 前缀作为命名空间，完全避免样式冲突：

- ✅ 不会被 Tailwind CSS 覆盖
- ✅ 不会与项目中的样式冲突
- ✅ 支持自定义样式覆盖

详细说明请查看 [CSS_ISOLATION.md](./CSS_ISOLATION.md)

## 📝 开发

### 构建所有包

```bash
pnpm -r build
```

### 构建特定包

```bash
cd packages/core && pnpm build
cd packages/vue && pnpm build
cd packages/react && pnpm build
```

## 📄 License

MIT

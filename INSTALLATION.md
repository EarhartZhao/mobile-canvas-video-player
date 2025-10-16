# 安装和使用指南

## 📦 包依赖关系

本项目采用 monorepo 架构，包含三个 npm 包：

```
@mobile-canvas-video-player/core    (核心库)
         ↑                ↑
         |                |
    vue 包            react 包
```

- **@mobile-canvas-video-player/core**: 核心视频播放器逻辑（框架无关）
- **@mobile-canvas-video-player/vue**: Vue 3 组件封装
- **@mobile-canvas-video-player/react**: React 18/19 组件封装

## 🎯 用户使用方式

### 方案：依赖自动安装（推荐）

用户只需安装一个包，core 包和 hls.js 会作为依赖自动安装。

#### React 项目

```bash
# 安装 React 包（会自动安装 core 和 hls.js）
npm install @mobile-canvas-video-player/react
# 或
pnpm add @mobile-canvas-video-player/react
```

**使用示例：**

```jsx
import React, { useRef } from 'react'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'

function App() {
  const playerRef = useRef(null)

  const handleCanPlay = () => {
    console.log('视频可以播放')
    playerRef.current?.play()
  }

  return (
    <MobileVideoPlayer
      ref={playerRef}
      src="https://example.com/video.m3u8"
      width={375}
      height={667}
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
      onCanPlay={handleCanPlay}
      onEnded={() => console.log('播放结束')}
      onError={(error) => console.error('错误', error)}
    />
  )
}
```

#### Vue 项目

```bash
# 安装 Vue 包（会自动安装 core 和 hls.js）
npm install @mobile-canvas-video-player/vue
# 或
pnpm add @mobile-canvas-video-player/vue
```

**使用示例：**

```vue
<template>
  <MobileVideoPlayer
    ref="playerRef"
    src="https://example.com/video.m3u8"
    :width="375"
    :height="667"
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
    @ended="onEnded"
    @error="onError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
import '@mobile-canvas-video-player/vue/style.css'

const playerRef = ref(null)

const onPlay = () => console.log('播放')
const onPause = () => console.log('暂停')
const onCanPlay = () => {
  console.log('视频可以播放')
  playerRef.value?.play()
}
const onEnded = () => console.log('播放结束')
const onError = (error) => console.error('错误', error)
</script>
```

## 📋 依赖说明

### 自动安装的依赖

当你安装 `@mobile-canvas-video-player/react` 或 `@mobile-canvas-video-player/vue` 时，npm/pnpm 会自动安装以下依赖：

- **@mobile-canvas-video-player/core**: 核心播放器库
- **hls.js**: HLS 流媒体支持库

### Peer Dependencies

你需要在项目中已经安装对应的框架：

**React 项目需要：**
- `react` >= 18.0.0
- `react-dom` >= 18.0.0

**Vue 项目需要：**
- `vue` >= 3.0.0

## 🔧 构建产物

每个包构建后会生成两种格式：

- **index.es.js**: ES Module 格式（推荐用于现代打包工具）
- **index.umd.js**: UMD 格式（兼容 CommonJS 和浏览器全局变量）

## 📦 发布到 npm

### 1. 构建所有包

```bash
pnpm -r build
```

### 2. 发布顺序

**必须按顺序发布**（因为 vue 和 react 包依赖 core 包）：

```bash
# 1. 先发布 core 包
cd packages/core
npm publish --access public

# 2. 发布 vue 包
cd ../vue
npm publish --access public

# 3. 发布 react 包
cd ../react
npm publish --access public
```

### 3. 版本管理

建议三个包保持版本同步，更新时一起更新版本号。

## ⚠️ 注意事项

1. **开发环境 vs 生产环境**
   - 开发环境（本地）：使用 `workspace:*` 协议链接本地包
   - 生产环境（npm）：使用具体版本号如 `^1.0.0`

2. **包导入路径**
   - ✅ 正确：`import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'`
   - ❌ 错误：`import { MobileVideoPlayer } from '@mobile-canvas-video-player/core'`

3. **样式文件导入**
   - 必须手动导入样式文件：
   ```javascript
   import '@mobile-canvas-video-player/react/style.css'
   // 或
   import '@mobile-canvas-video-player/vue/style.css'
   ```

4. **外部依赖**
   - core、vue、react 包都将 `hls.js` 标记为 external
   - 这意味着 `hls.js` 不会被打包到各个包中，而是作为单独的依赖安装
   - 避免了重复打包，减小包体积

5. **不支持自动播放**
   - 因浏览器自动播放策略限制，已移除 `autoplay` 属性
   - 请在 `canplay` 事件中手动调用 `play()` 方法

## 🔍 包大小

构建后的包大小参考：

- **@mobile-canvas-video-player/core**: ~3.8 KB (gzipped: ~1.1 KB)
- **@mobile-canvas-video-player/vue**: ~11.8 KB (gzipped: ~3.6 KB)
- **@mobile-canvas-video-player/react**: ~11.2 KB (gzipped: ~3.1 KB)

*注：以上大小不包括外部依赖 (hls.js)*

## 📖 完整文档

更多详细信息请查看：
- [README.md](./README.md) - 项目总览和 API 文档
- [STRUCTURE.md](./STRUCTURE.md) - 项目架构说明

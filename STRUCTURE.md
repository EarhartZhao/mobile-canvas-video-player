# 项目结构说明

## 目录结构

```
mobile-canvas-video-player/
├── packages/                    # 包目录
│   ├── core/                   # 核心播放器包
│   │   ├── src/
│   │   │   ├── VideoPlayer.js  # 核心播放器类
│   │   │   └── index.js       # 导出文件
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   ├── vue/                    # Vue 组件包
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── MobileVideoPlayer.vue
│   │   │   ├── icons/         # Vue 图标组件
│   │   │   ├── style.css      # 样式文件
│   │   │   └── index.js       # 导出文件
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   ├── react/                  # React 组件包
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── MobileVideoPlayer.jsx
│   │   │   ├── icons/         # React 图标组件
│   │   │   ├── style.css      # 样式文件
│   │   │   └── index.js       # 导出文件
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── player/                 # 原始包（已废弃）
│
├── apps/                       # 示例应用
│   ├── vue-demo/              # Vue 示例
│   │   ├── src/
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── react-demo/            # React 示例
│       ├── src/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── pnpm-workspace.yaml        # pnpm 工作空间配置
├── pnpm-lock.yaml
├── package.json
└── README.md
```

## 包说明

### @mobile-canvas-video-player/core

**职责**: 提供核心的视频播放器功能

**主要功能**:
- Canvas 视频渲染
- HLS 流媒体支持
- 播放控制（播放、暂停、跳转）
- 音量控制
- 事件系统
- 全屏功能

**依赖**:
- hls.js

**导出**:
```js
import { VideoPlayer } from '@mobile-canvas-video-player/core'
```

### @mobile-canvas-video-player/vue

**职责**: 提供 Vue 3 组件封装

**主要功能**:
- MobileVideoPlayer 组件
- 响应式状态管理
- Vue 生命周期集成
- 组件 props 和 events
- Composition API

**依赖**:
- @mobile-canvas-video-player/core
- vue (peer dependency)

**导出**:
```js
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
import '@mobile-canvas-video-player/vue/style.css'
```

### @mobile-canvas-video-player/react

**职责**: 提供 React 组件封装

**主要功能**:
- MobileVideoPlayer 组件
- Hooks 状态管理
- React 生命周期集成
- 组件 props 和 callbacks
- forwardRef 支持

**依赖**:
- @mobile-canvas-video-player/core
- react (peer dependency)

**导出**:
```js
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'
```

**注意**:
- 不再支持 autoplay 属性，请使用 canplay 事件手动调用 play() 方法
- React 19.2 兼容

## 开发流程

### 1. 修改核心功能

如果需要修改播放器核心逻辑：

```bash
cd packages/core
# 修改 src/VideoPlayer.js
pnpm build
```

### 2. 修改 Vue 组件

```bash
cd packages/vue
# 修改 src/components/MobileVideoPlayer.vue
pnpm dev  # 开发模式
```

### 3. 修改 React 组件

```bash
cd packages/react
# 修改 src/components/MobileVideoPlayer.jsx
pnpm dev  # 开发模式
```

### 4. 测试示例应用

Vue 示例:
```bash
cd apps/vue-demo
pnpm dev
```

React 示例:
```bash
cd apps/react-demo
pnpm dev
```

## 依赖关系

```
┌─────────────────┐
│  apps/vue-demo  │
└────────┬────────┘
         │
         ↓
┌─────────────────────┐      ┌─────────────────────┐
│ @mobile-canvas-     │ ---> │ @mobile-canvas-     │
│  video-player/vue   │      │  video-player/core  │
└─────────────────────┘      └─────────────────────┘
                                     ↑
┌─────────────────────┐              │
│ @mobile-canvas-     │ -------------┘
│  video-player/react │
└────────┬────────────┘
         │
         ↓
┌─────────────────┐
│ apps/react-demo │
└─────────────────┘
```

## 发布流程

### 1. 构建所有包

```bash
pnpm -r build
```

### 2. 发布到 npm

```bash
# 发布 core
cd packages/core
npm publish

# 发布 vue
cd packages/vue
npm publish

# 发布 react
cd packages/react
npm publish
```

## 注意事项

1. **版本管理**: 三个包应该保持版本同步
2. **依赖更新**: core 包更新后，vue 和 react 包也需要更新
3. **样式隔离**: 每个框架包都有自己的样式文件
4. **构建顺序**: 先构建 core，再构建 vue 和 react
5. **workspace 协议**: 使用 `workspace:*` 引用本地包
6. **自动播放**: 不再支持 autoplay 属性，请在 canplay 事件中手动调用 play() 方法
7. **事件监听**: touchstart/touchmove 事件已添加 passive 配置，提升性能

## 迁移指南

如果你之前使用 `@mobile-canvas-video-player/player`：

### Vue 项目

```diff
- import { MobileVideoPlayer } from '@mobile-canvas-video-player/player'
+ import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
+ import '@mobile-canvas-video-player/vue/style.css'
```

### 包依赖

```diff
{
  "dependencies": {
-   "@mobile-canvas-video-player/player": "^1.0.0"
+   "@mobile-canvas-video-player/vue": "^1.0.0"
  }
}
```

### 自动播放

```diff
- <MobileVideoPlayer :autoplay="true" />
+ <MobileVideoPlayer
+   ref="playerRef"
+   @canplay="() => playerRef.play()"
+ />
```

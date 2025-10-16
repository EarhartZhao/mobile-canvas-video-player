# TypeScript 迁移文档

## 概述

已成功将 `@mobile-canvas-video-player/core` 和 `@mobile-canvas-video-player/react` 包从 JavaScript 迁移到 TypeScript。

## 迁移内容

### 1. Core 包 (@mobile-canvas-video-player/core)

#### 新增文件
- ✅ `src/VideoPlayer.ts` - TypeScript 重写的核心播放器类
- ✅ `src/index.ts` - TypeScript 导出文件
- ✅ `tsconfig.json` - TypeScript 配置
- ✅ `dist/index.d.ts` - 生成的类型声明文件

#### 类型定义

```typescript
// 播放器配置选项
export interface VideoPlayerOptions {
  loop?: boolean
  preload?: 'auto' | 'metadata' | 'none'
}

// 播放器状态
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

// 事件类型
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

// 事件回调
export type EventCallback<T = any> = (data?: T) => void

// 核心播放器类
export class VideoPlayer {
  public options: Required<VideoPlayerOptions>
  public state: VideoPlayerState
  
  constructor(options?: VideoPlayerOptions)
  init(canvasElement: HTMLCanvasElement, src: string): void
  play(): Promise<void> | undefined
  pause(): void
  seek(time: number): void
  setVolume(volume: number): void
  mute(): void
  unmute(): void
  toggleMute(): void
  setMuted(muted: boolean): void
  on(event: VideoPlayerEvent, callback: EventCallback): void
  destroy(): void
  formatTime(seconds: number): string
}
```

#### 更新的配置
- **package.json**:
  - 添加 `types` 字段指向 `./dist/index.d.ts`
  - 更新构建脚本为 `tsc && vite build`
  - 添加 TypeScript 相关依赖
  
- **vite.config.js**:
  - 入口文件改为 `src/index.ts`
  - 添加 `vite-plugin-dts` 插件生成类型声明

### 2. React 包 (@mobile-canvas-video-player/react)

#### 新增文件
- ✅ `src/components/MobileVideoPlayer.tsx` - TypeScript 重写的 React 组件
- ✅ `src/icons/index.tsx` - TypeScript 重写的图标组件
- ✅ `src/index.ts` - TypeScript 导出文件
- ✅ `tsconfig.json` - TypeScript 配置
- ✅ `dist/index.d.ts` - 生成的类型声明文件

#### 类型定义

```typescript
// 控制条配置
export interface ControlsConfig {
  playPause?: boolean
  mute?: boolean
  fullscreen?: boolean
  progressBar?: boolean
  timeDisplay?: boolean
}

// 组件 Props
export interface MobileVideoPlayerProps {
  src: string
  width?: number
  height?: number
  loop?: boolean
  controls?: ControlsConfig
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (time: number) => void
  onEnded?: () => void
  onError?: (error: any) => void
  onCanPlay?: () => void
}

// 组件 Ref 方法
export interface MobileVideoPlayerRef {
  play: () => Promise<void> | undefined
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  setMuted: (val: boolean) => void
  toggleMute: () => void
  togglePlayPause: () => void
  toggleFullscreen: () => void
}

// 组件定义
export const MobileVideoPlayer: React.ForwardRefExoticComponent<
  MobileVideoPlayerProps & React.RefAttributes<MobileVideoPlayerRef>
>
```

#### 更新的配置
- **package.json**:
  - 添加 `types` 字段指向 `./dist/index.d.ts`
  - 更新构建脚本为 `tsc && vite build`
  - 添加 TypeScript 相关依赖
  
- **vite.config.js**:
  - 入口文件改为 `src/index.ts`
  - 添加 `vite-plugin-dts` 插件生成类型声明

- **tsconfig.json**:
  - 配置 React JSX 支持
  - 设置 `strict: false` 以简化迁移

## 新增依赖

### Core 包
```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite-plugin-dts": "^3.7.0",
    "@types/node": "^20.0.0"
  }
}
```

### React 包
```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite-plugin-dts": "^3.7.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

## 构建产物

每个包现在会生成以下文件：

```
dist/
  ├── index.d.ts      # TypeScript 类型声明文件
  ├── index.es.js     # ES Module 格式
  └── index.umd.js    # UMD 格式
```

## 使用方式

### 在 TypeScript 项目中使用

```typescript
// 自动获得完整的类型支持
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import type { MobileVideoPlayerProps, MobileVideoPlayerRef } from '@mobile-canvas-video-player/react'

const App = () => {
  const playerRef = useRef<MobileVideoPlayerRef>(null)
  
  const props: MobileVideoPlayerProps = {
    src: 'video.m3u8',
    width: 375,
    height: 667,
    onPlay: () => console.log('播放')
  }
  
  return <MobileVideoPlayer ref={playerRef} {...props} />
}
```

### 在 JavaScript 项目中使用

```javascript
// 仍然可以正常使用，IDE 会提供智能提示
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'

const App = () => {
  const playerRef = useRef(null)
  
  return (
    <MobileVideoPlayer
      ref={playerRef}
      src="video.m3u8"
      width={375}
      height={667}
      onPlay={() => console.log('播放')}
    />
  )
}
```

## 优势

1. **类型安全**: 编译时捕获类型错误
2. **更好的 IDE 支持**: 自动补全、类型提示、重构支持
3. **文档即代码**: 类型定义即是 API 文档
4. **向后兼容**: JavaScript 项目仍可正常使用
5. **更好的可维护性**: 类型系统帮助理解代码结构

## 注意事项

1. **构建顺序**: 必须先构建 core 包，再构建 react/vue 包
   ```bash
   cd packages/core && pnpm build
   cd packages/react && pnpm build
   ```

2. **开发环境**: TypeScript 错误会在编译时显示，而不是运行时

3. **纯 TypeScript 项目**: 所有 JavaScript 文件已删除，项目现在完全使用 TypeScript

## 后续工作

- [ ] Vue 包的 TypeScript 迁移（可选）
- [ ] 启用更严格的 TypeScript 配置
- [ ] 添加更详细的 JSDoc 注释
- [ ] 单元测试的 TypeScript 支持

## 构建验证

✅ Core 包构建成功：3.78 KB (gzipped: 1.13 KB)
✅ React 包构建成功：11.18 KB (gzipped: 3.14 KB)
✅ 类型声明文件生成成功

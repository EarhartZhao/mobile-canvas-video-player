# 版本更新日志 v1.1.0

## 📦 包版本更新

所有 `@mobile-canvas-video-player` 包已从 **v1.0.0** 升级到 **v1.1.0**

### 更新的包

| 包名 | 旧版本 | 新版本 |
|------|--------|--------|
| @mobile-canvas-video-player/core | 1.0.0 | **1.1.0** |
| @mobile-canvas-video-player/react | 1.0.0 | **1.1.0** |
| @mobile-canvas-video-player/vue | 1.0.0 | **1.1.0** |

### 依赖关系更新

**React 包:**
```json
{
  "version": "1.1.0",
  "dependencies": {
    "@mobile-canvas-video-player/core": "^1.1.0"
  }
}
```

**Vue 包:**
```json
{
  "version": "1.1.0",
  "dependencies": {
    "@mobile-canvas-video-player/core": "^1.1.0"
  }
}
```

## 🎯 v1.1.0 新特性

### TypeScript 完整支持 ✅
- ✅ 所有包已完全迁移到 TypeScript
- ✅ 所有源码使用 TS/TSX 文件
- ✅ 完整的类型声明文件 (.d.ts)
- ✅ 严格模式类型检查

### 包结构优化 ✅
- ✅ Core 包: TypeScript 核心类
- ✅ React 包: TypeScript React 组件
- ✅ Vue 包: TypeScript + Vue 3 组件
- ✅ 所有包支持 Tree-shaking

### 类型定义导出 ✅

**Core 包:**
- `VideoPlayerOptions`
- `VideoPlayerState`
- `VideoPlayerEvent`
- `EventCallback`
- `VideoPlayer` 类

**React 包:**
- `ControlsConfig`
- `MobileVideoPlayerProps`
- `MobileVideoPlayerRef`
- `MobileVideoPlayer` 组件

**Vue 包:**
- `MobileVideoPlayer` 组件
- 完整的 Vue 3 类型支持

### 开发体验提升 ✅
- ✅ 完整的 IDE 智能提示
- ✅ 类型安全的 API
- ✅ 更好的重构支持
- ✅ 编译时错误检查

## 📝 升级指南

### 从 v1.0.0 升级到 v1.1.0

#### NPM/PNPM
```bash
# 升级所有包
npm update @mobile-canvas-video-player/core
npm update @mobile-canvas-video-player/react
npm update @mobile-canvas-video-player/vue

# 或使用 pnpm
pnpm update @mobile-canvas-video-player/core
pnpm update @mobile-canvas-video-player/react
pnpm update @mobile-canvas-video-player/vue
```

#### 手动更新 package.json
```json
{
  "dependencies": {
    "@mobile-canvas-video-player/react": "^1.1.0",
    "@mobile-canvas-video-player/vue": "^1.1.0"
  }
}
```

### 破坏性变更

**无破坏性变更** - v1.1.0 与 v1.0.0 完全向后兼容

- ✅ API 保持不变
- ✅ 行为保持一致
- ✅ 支持 JavaScript 项目
- ✅ 无需修改现有代码

### TypeScript 项目优势

如果你使用 TypeScript，现在可以获得完整的类型支持：

```typescript
// React
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import type { MobileVideoPlayerRef } from '@mobile-canvas-video-player/react'

const playerRef = useRef<MobileVideoPlayerRef>(null)

// Vue
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'

const playerRef = ref<InstanceType<typeof MobileVideoPlayer> | null>(null)
```

## 🔧 技术栈

### 运行时依赖
- Vue: ^3.0.0 (peer dependency)
- React: ^18.0.0 || ^19.0.0 (peer dependency)
- hls.js: ^1.4.0

### 开发依赖
- TypeScript: ^5.3.0
- Vite: ^5.0.0+
- vite-plugin-dts: ^3.7.0
- vue-tsc: ^2.0.0 (Vue 包)

## 📦 构建产物

每个包都生成以下文件：

```
dist/
├── index.d.ts      # TypeScript 类型声明
├── index.es.js     # ES Module
└── index.umd.js    # UMD
```

### 包大小
- Core: 4.05 KB (gzipped: 1.18 KB)
- React: 11.31 KB (gzipped: 3.16 KB)
- Vue: 11.81 KB (gzipped: 3.63 KB)

## 🚀 发布步骤

### 1. 确认构建
```bash
pnpm -r build
```

### 2. 发布包（按顺序）
```bash
# 1. 发布 core
cd packages/core
npm publish --access public

# 2. 发布 vue
cd ../vue
npm publish --access public

# 3. 发布 react
cd ../react
npm publish --access public
```

## 📚 相关文档

- [INSTALLATION.md](./INSTALLATION.md) - 安装使用指南
- [README.md](./README.md) - 项目总览

## ✅ 验证清单

- ✅ Core 包版本: 1.1.0
- ✅ React 包版本: 1.1.0
- ✅ Vue 包版本: 1.1.0
- ✅ Core 依赖版本一致: ^1.1.0
- ✅ 所有包配置 publishConfig.access: public
- ✅ TypeScript 编译成功
- ✅ 类型声明文件生成

---

**发布日期**: 2025-10-16
**版本**: v1.1.0
**类型**: Minor Release (新功能，向后兼容)

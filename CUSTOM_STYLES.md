# 自定义样式指南

本文档展示如何在项目中自定义 Mobile Canvas Video Player 的样式。

## 基础使用

首先，确保已引入组件的默认样式：

### React

```tsx
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'
```

### Vue

```vue
<script setup>
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
import '@mobile-canvas-video-player/vue/style.css'
</script>
```

## 样式覆盖方式

由于所有样式类名都有 `mcvp-` 前缀，您可以安全地覆盖任何样式而不会影响其他组件。

### 方式一：全局样式覆盖

在您的全局 CSS 文件中：

```css
/* 覆盖播放按钮样式 */
.mcvp-control-btn {
  padding: 12px !important;
  background: rgba(255, 255, 255, 0.2) !important;
}

/* 覆盖进度条颜色 */
.mcvp-progress-played {
  background: #ff0000 !important;
}

/* 覆盖进度条手柄 */
.mcvp-progress-handle {
  background: #ff0000 !important;
  width: 20px !important;
  height: 20px !important;
}
```

### 方式二：作用域样式覆盖（推荐）

使用父容器选择器提高优先级，避免使用 `!important`：

```css
/* 为播放器容器添加自定义类 */
.my-custom-player .mcvp-control-btn {
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.my-custom-player .mcvp-progress-played {
  background: #ff0000;
}

.my-custom-player .mcvp-control-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
```

使用时：

```tsx
// React
<div className="my-custom-player">
  <MobileVideoPlayer src="..." />
</div>
```

```vue
<!-- Vue -->
<div class="my-custom-player">
  <MobileVideoPlayer src="..." />
</div>
```

### 方式三：CSS Modules (React)

```tsx
// VideoPlayer.module.css
.customPlayer :global(.mcvp-control-btn) {
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.customPlayer :global(.mcvp-progress-played) {
  background: #ff0000;
}

// Component.tsx
import styles from './VideoPlayer.module.css'

function MyVideoPlayer() {
  return (
    <div className={styles.customPlayer}>
      <MobileVideoPlayer src="..." />
    </div>
  )
}
```

### 方式四：Scoped Styles (Vue)

```vue
<template>
  <div class="custom-player">
    <MobileVideoPlayer src="..." />
  </div>
</template>

<style scoped>
.custom-player :deep(.mcvp-control-btn) {
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.custom-player :deep(.mcvp-progress-played) {
  background: #ff0000;
}

.custom-player :deep(.mcvp-control-btn:hover) {
  background: rgba(255, 255, 255, 0.4);
}
</style>
```

## 常用自定义示例

### 示例 1: 更改主题色

```css
.my-player .mcvp-progress-played,
.my-player .mcvp-progress-handle {
  background: #00ff00; /* 绿色主题 */
}

.my-player .mcvp-control-btn:hover {
  background: rgba(0, 255, 0, 0.1);
}
```

### 示例 2: 调整控制条大小

```css
.my-player .mcvp-control-btn {
  padding: 10px;
}

.my-player .mcvp-time {
  font-size: 16px;
}

.my-player .mcvp-progress-bar {
  height: 6px;
}

.my-player .mcvp-progress-handle {
  width: 20px;
  height: 20px;
}
```

### 示例 3: 自定义加载动画

```css
.my-player .mcvp-loading-spinner {
  width: 60px;
  height: 60px;
  border-width: 6px;
  border-top-color: #ff0000;
}
```

### 示例 4: 更改控制条背景

```css
.my-player .mcvp-controls-container {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: 25px 20px 20px;
}
```

### 示例 5: 圆角按钮

```css
.my-player .mcvp-control-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
}
```

## 完整的自定义主题示例

### 深色主题 + 红色强调色

```css
.dark-red-theme .mcvp-video-player {
  background: #1a1a1a;
}

.dark-red-theme .mcvp-controls-container {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.95));
}

.dark-red-theme .mcvp-progress-played,
.dark-red-theme .mcvp-progress-handle {
  background: #dc2626;
}

.dark-red-theme .mcvp-progress-handle {
  border-color: #fca5a5;
}

.dark-red-theme .mcvp-control-btn:hover {
  background: rgba(220, 38, 38, 0.2);
}

.dark-red-theme .mcvp-time {
  color: #fca5a5;
}
```

### 浅色主题 + 蓝色强调色

```css
.light-blue-theme .mcvp-video-player {
  background: #f3f4f6;
}

.light-blue-theme .mcvp-controls-container {
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.95));
}

.light-blue-theme .mcvp-progress-bar {
  background: rgba(0, 0, 0, 0.1);
}

.light-blue-theme .mcvp-progress-played,
.light-blue-theme .mcvp-progress-handle {
  background: #2563eb;
}

.light-blue-theme .mcvp-progress-handle {
  border-color: #93c5fd;
}

.light-blue-theme .mcvp-control-btn {
  color: #1f2937;
}

.light-blue-theme .mcvp-control-btn:hover {
  background: rgba(37, 99, 235, 0.1);
}

.light-blue-theme .mcvp-time {
  color: #1f2937;
}
```

## Tailwind CSS 集成

您可以使用 Tailwind 的 `@apply` 指令：

```css
@layer components {
  .tailwind-player .mcvp-control-btn {
    @apply p-3 rounded-lg transition-all duration-200;
  }

  .tailwind-player .mcvp-control-btn:hover {
    @apply bg-blue-500/20;
  }

  .tailwind-player .mcvp-progress-played {
    @apply bg-gradient-to-r from-blue-500 to-purple-500;
  }

  .tailwind-player .mcvp-time {
    @apply text-sm font-medium text-gray-100;
  }
}
```

## 可覆盖的所有类名

```css
/* 容器 */
.mcvp-video-player { }

/* 加载状态 */
.mcvp-loading { }
.mcvp-loading-spinner { }

/* 状态显示 */
.mcvp-status { }

/* 进度覆盖层 */
.mcvp-progress-overlay { }
.mcvp-time-display { }

/* 控制条容器 */
.mcvp-controls-container { }

/* 进度条 */
.mcvp-progress-bar { }
.mcvp-progress-buffered { }
.mcvp-progress-played { }
.mcvp-progress-handle { }

/* 控制按钮 */
.mcvp-controls { }
.mcvp-control-btn { }
.mcvp-fullscreen-btn { }

/* 时间显示 */
.mcvp-time { }
```

## 注意事项

1. **使用父选择器提高优先级** - 避免过度使用 `!important`
2. **测试响应式** - 确保自定义样式在不同屏幕尺寸下正常
3. **保持可访问性** - 确保足够的对比度和可点击区域
4. **测试移动端** - 移动端的触摸热区需要足够大

## 动态主题切换示例

### React

```tsx
import { useState } from 'react'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'

function ThemeablePlayer() {
  const [theme, setTheme] = useState('dark')

  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        切换主题
      </button>
      <div className={`${theme}-theme`}>
        <MobileVideoPlayer src="..." />
      </div>
    </div>
  )
}
```

### Vue

```vue
<script setup>
import { ref } from 'vue'
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'

const theme = ref('dark')
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div>
    <button @click="toggleTheme">切换主题</button>
    <div :class="`${theme}-theme`">
      <MobileVideoPlayer src="..." />
    </div>
  </div>
</template>

<style>
.dark-theme .mcvp-progress-played { background: #3b82f6; }
.light-theme .mcvp-progress-played { background: #ef4444; }
</style>
```

## 获取帮助

如果您在自定义样式时遇到问题，请：

1. 检查浏览器开发者工具中的样式优先级
2. 确保您的自定义样式在组件样式之后加载
3. 参考 [CSS_ISOLATION.md](./CSS_ISOLATION.md) 了解样式隔离机制
4. 在 GitHub Issues 中提问

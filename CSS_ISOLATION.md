# CSS 样式隔离方案

## 问题描述

在使用 Tailwind CSS 或其他 CSS 框架的项目中，组件库的样式可能会被覆盖，导致显示异常。

## 解决方案

我们采用了**命名空间前缀**的方式来避免样式冲突和类名污染。

### 实施细节

所有 CSS 类名都添加了 `mcvp-` (mobile-canvas-video-player) 前缀：

#### 旧类名 → 新类名映射

```
.video-player         → .mcvp-video-player
.controls-container   → .mcvp-controls-container
.progress-bar         → .mcvp-progress-bar
.progress-buffered    → .mcvp-progress-buffered
.progress-played      → .mcvp-progress-played
.progress-handle      → .mcvp-progress-handle
.controls             → .mcvp-controls
.control-btn          → .mcvp-control-btn
.time                 → .mcvp-time
.fullscreen-btn       → .mcvp-fullscreen-btn
.loading              → .mcvp-loading
.loading-spinner      → .mcvp-loading-spinner
.status               → .mcvp-status
.progress-overlay     → .mcvp-progress-overlay
```

### 使用方式

使用方式**完全不变**，只需引入样式文件即可：

#### Vue

```vue
<script setup>
import { MobileVideoPlayer } from '@mobile-canvas-video-player/vue'
import '@mobile-canvas-video-player/vue/style.css'
</script>

<template>
  <MobileVideoPlayer
    src="video.m3u8"
    :width="375"
    :height="275"
  />
</template>
```

#### React

```jsx
import { MobileVideoPlayer } from '@mobile-canvas-video-player/react'
import '@mobile-canvas-video-player/react/style.css'

function App() {
  return (
    <MobileVideoPlayer
      src="video.m3u8"
      width={375}
      height={275}
    />
  )
}
```

## 样式优先级保证

通过唯一的命名空间前缀，组件样式具有足够的特异性，不会被 Tailwind CSS 等框架的通用样式覆盖。

### 优势

1. ✅ **完全隔离** - 避免与项目中的样式冲突
2. ✅ **零侵入** - 使用方式不变，无需额外配置
3. ✅ **简洁高效** - 不增加代码复杂度
4. ✅ **兼容性好** - 适用于任何 CSS 框架（Tailwind、Bootstrap、Ant Design 等）

## 自定义样式

如果需要覆盖组件样式，使用更高优先级的选择器即可：

```css
/* 覆盖播放按钮样式 */
.my-custom-wrapper .mcvp-control-btn {
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
}

/* 覆盖进度条颜色 */
.my-custom-wrapper .mcvp-progress-played {
  background: #ff0000;
}
```

## 注意事项

- 所有类名都有 `mcvp-` 前缀，不会与您的项目样式冲突
- 即使使用 Tailwind 的 `reset` 或 `base` 样式，组件也能正常显示
- 动画名称也添加了前缀（如 `@keyframes mcvp-spin`）

## 更多示例

详细的自定义样式示例请查看 [CUSTOM_STYLES.md](./CUSTOM_STYLES.md)

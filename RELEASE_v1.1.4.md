# Release v1.1.4

## 📅 发布日期
2025-10-21

## 🎯 更新内容

### 添加 repository 字段

为所有包添加了 `repository` 配置，提升包的可维护性和可信度。

#### 配置内容

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/mobile-canvas-video-player.git",
    "directory": "packages/core"  // 各包对应目录
  }
}
```

#### 影响的包

- ✅ `@mobile-canvas-video-player/core`
- ✅ `@mobile-canvas-video-player/react`
- ✅ `@mobile-canvas-video-player/vue`
- ✅ 根 `package.json`

#### 用户体验提升

1. **npm 包页面优化**
   - 显示 "Repository" 链接
   - 用户可直接跳转到 GitHub

2. **开发者友好**
   - 方便查看源码
   - 便于提交 issue
   - 支持 PR 贡献

3. **Monorepo 支持**
   - `directory` 字段精确指向子包位置
   - 用户可直接定位到具体代码

## 📦 版本更新

| 包名 | 旧版本 | 新版本 |
|------|--------|--------|
| @mobile-canvas-video-player/core | 1.1.3 | **1.1.4** |
| @mobile-canvas-video-player/react | 1.1.3 | **1.1.4** |
| @mobile-canvas-video-player/vue | 1.1.3 | **1.1.4** |

## 🔄 兼容性

### 无破坏性变更 ✅

- ✅ 纯元数据更新
- ✅ 代码逻辑完全不变
- ✅ API 完全兼容
- ✅ 无需修改现有代码

### 升级步骤

```bash
# 使用 npm
npm update @mobile-canvas-video-player/core
npm update @mobile-canvas-video-player/react
npm update @mobile-canvas-video-player/vue

# 使用 pnpm
pnpm update @mobile-canvas-video-player/core
pnpm update @mobile-canvas-video-player/react
pnpm update @mobile-canvas-video-player/vue
```

或手动更新 `package.json`:

```json
{
  "dependencies": {
    "@mobile-canvas-video-player/react": "^1.1.4",
    "@mobile-canvas-video-player/vue": "^1.1.4"
  }
}
```

## 🚀 发布步骤

### 1. 构建所有包

```bash
cd d:\code\canvas-video\mobile-canvas-video-player
pnpm -r build
```

### 2. 发布包（按顺序）

```bash
# 发布 core
cd packages/core
npm publish --access public

# 发布 vue
cd ../vue
npm publish --access public

# 发布 react
cd ../react
npm publish --access public
```

### 3. 验证发布

访问 npm 包页面确认：
- https://www.npmjs.com/package/@mobile-canvas-video-player/core
- https://www.npmjs.com/package/@mobile-canvas-video-player/vue
- https://www.npmjs.com/package/@mobile-canvas-video-player/react

检查是否显示 "Repository" 链接。

## 📊 包大小

| 包 | 大小 | Gzipped |
|----|------|---------|
| Core | 4.47 KB | 1.33 KB |
| React | 11.36 KB | 3.17 KB |
| Vue | 11.86 KB | 3.64 KB |

*大小未变化，仅添加元数据*

## 🔗 相关链接

- [CHANGELOG.md](./CHANGELOG.md) - 完整变更日志
- [README.md](./README.md) - 项目总览
- [CSS_ISOLATION.md](./CSS_ISOLATION.md) - 样式隔离方案

## ⚠️ 重要提示

**发布前请务必：**

1. 将所有 `package.json` 中的 `your-username` 替换为实际 GitHub 用户名
2. 确保已登录 npm: `npm whoami`
3. 确保已构建所有包: `pnpm -r build`
4. 按 core → vue → react 顺序发布

---

**发布类型**: Patch Release (元数据更新)  
**版本**: v1.1.4  
**变更类型**: 非功能性更新

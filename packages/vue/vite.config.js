import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MobileVideoVue',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@mobile-canvas-video-player/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@mobile-canvas-video-player/core': 'MobileVideoCore'
        }
      }
    }
  }
})

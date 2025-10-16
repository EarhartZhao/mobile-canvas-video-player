import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MobileVideoReact',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', '@mobile-canvas-video-player/core', 'hls.js'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mobile-canvas-video-player/core': 'MobileVideoCore',
          'hls.js': 'Hls'
        }
      }
    }
  }
})

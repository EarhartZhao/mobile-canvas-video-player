import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MobileVideoCore',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['hls.js'],
      output: {
        globals: {
          'hls.js': 'Hls'
        }
      }
    }
  }
})

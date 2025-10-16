import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
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

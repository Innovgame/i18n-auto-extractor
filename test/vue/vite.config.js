import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
        imports: [{
          'i18n-auto-extractor': ['$at']
        }],
        vueTemplate: true,
    })
  ],
})

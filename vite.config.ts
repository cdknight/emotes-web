import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import sveltePreprocess from 'svelte-preprocess'

// https://www.reddit.com/r/sveltejs/comments/pmham1/sveltekit_how_to_set_up_global_scss_accessible_to/
const filePath = dirname(fileURLToPath(import.meta.url))
const sassPath = `${filePath}/src/lib/scss`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
	  preprocess: sveltePreprocess({
      scss: {
        prependData: `@import '${sassPath}/global.scss';`
      }
    }),
  })],
  optimizeDeps: {
	  exclude: ['@urql/svelte']
  }
})

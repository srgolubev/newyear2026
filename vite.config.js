import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                404: 'public/404.html',
                403: 'public/403.html',
                500: 'public/500.html',
                '50x': 'public/50x.html'
            }
        }
    }
})

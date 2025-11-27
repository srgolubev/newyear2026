import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                404: '404.html',
                403: '403.html',
                500: '500.html',
                '50x': '50x.html'
            }
        }
    }
})

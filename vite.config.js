import { defineConfig } from 'vite';

export default defineConfig({
    base: (process.env.NODE_ENV === 'production' ? '/weather_app/' : '/'),
});
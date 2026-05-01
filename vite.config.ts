import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	// custom domain via public/CNAME
	base: '/',
	plugins: [react()],
});

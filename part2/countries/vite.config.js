import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This allows Vite to properly detect file changes and hot-reload when run in WSL
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
    },
});

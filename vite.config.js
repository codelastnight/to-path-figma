import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";
import postcss from "./postcss.config.cjs";
import sveltePreprocess from 'svelte-preprocess';


const production = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
    root: "./src",
    plugins: [svelte({
        emitCss: production,
        preprocess: sveltePreprocess(),
        compilerOptions: {
            dev: !production,
        },

        // @ts-ignore This is temporary until the type definitions are fixed!
        hot: !production
    }),
        , viteSingleFile()],
    css: {
        postcss
    },
    build: {
        target: "esnext",
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        outDir: "./public",
        rollupOptions: {
            inlineDynamicImports: true,
            output: {
                manualChunks: () => "everything.js",
            },
        },
    },
});
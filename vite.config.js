
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";
import sveltePreprocess from 'svelte-preprocess';
import svgLoader from 'vite-svg-loader'

const production = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
    root: "./src",
    plugins: [svelte({
        configFile: '../svelte.config.cjs',
        emitCss: production,

        compilerOptions: {
            dev: !production,
        },

        //@ts-ignore This is temporary until the type definitions are fixed!
        hot: !production,
    }), svgLoader({
        defaultImport: 'raw',
        svgoConfig: {
            multipass: true,
            plugins: [
                // set of built-in plugins enabled by default
                'preset-default',
                'removeDimensions',
                // enable built-in plugins by name
                'prefixIds',
                {
                    name: 'convertColors',
                    params: {
                        currentColor: true
                    }
                }]
        }
    })

        , viteSingleFile()],
    test: {
        // ...
    },
    build: {
        sourcemap: true,
        target: "esnext",
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        outDir: "../public",
        rollupOptions: {
            inlineDynamicImports: true,

        },
    },
});
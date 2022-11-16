import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import svg from 'rollup-plugin-svg';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy'
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import pkg from './package.json';
import sveltePreprocess from 'svelte-preprocess';
/* Post CSS */
import postcss from 'rollup-plugin-postcss';
import svgo from 'rollup-plugin-svgo';
import css from 'rollup-plugin-css-only'


/* Inline to single html */
import htmlBundle from 'rollup-plugin-html-bundle';

const production = !process.env.ROLLUP_WATCH;

export default [{
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'ui',
		file: 'src/build/bundle.js'
	},
	plugins: [
		svelte({

			preprocess: sveltePreprocess({
				sourceMap: !production,
				typescript: {
					tsconfigFile: './tsconfig.json',
				},
				postcss: {
					plugins: [require('tailwindcss'), require('autoprefixer')]
				}
			}),
			compilerOptions: {
				dev: !production

			}

		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:¡
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
			extensions: ['.svelte', '.mjs', '.js', '.json', '.node']
		}),
		commonjs(),
		svg(),
		svgo({
			plugins: [{
				removeViewBox: false
			}, {
				removeDimensions: true
			}, {
				convertColors: {
					currentColors: true
				}
			}]
		}),
		// postcss({
		// 	config: {
		// 		path: './postcss.config.js'
		// 	}
		// }),
		// css({
		// 	output: 'bundle.css',
		// 	mangle: production,
		// 	compress: production,
		// }),
		htmlBundle({
			template: 'src/template.html',
			target: 'public/index.html',
			inline: true
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `dist` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
},
{
	input: 'src/code.ts',
	output: {
		sourcemap: true,
		file: 'public/code.js',
		format: 'cjs',
		name: 'code'
	},
	plugins: [
		copy({
			targets: [
				{ src: 'manifest.json', dest: 'public' },
			],
			copyOnce: true
		}),
		resolve(),
		typescript(),
		commonjs(),
		injectProcessEnv({
			'process.env.PKG_VERSION': JSON.stringify(pkg.version),
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		production && terser()

	]
}
];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
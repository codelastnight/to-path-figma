import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindConfig from './tailwind.config.cjs';
module.exports = {

    plugins: [
        tailwind(tailwindConfig),
        autoprefixer(),
        cssnano()
    ],
};
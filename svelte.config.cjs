const preprocess = require("svelte-preprocess");

const config = {

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

module.exports = config;

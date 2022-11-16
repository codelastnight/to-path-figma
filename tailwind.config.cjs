module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],

  theme: {
    colors: {
      "bg-inverse": "var(--figma-color-bg-inverse)",
      "text-oninverse": "var(--figma-color-text-oninverse)",
      "bg-hover": "var(--figma-color-bg-hover)",
      "bg-selected-pressed": "var(--figma-color-bg-selected-pressed)",
      secondary: "var(--figma-color-secondary)",
      "bg-secondary": "var(--figma-color-bg-secondary)",
      border: "var(--figma-color-border)",
      'transparent': 'transparent'
    },
    fontSize: {
      xs: "var(--font-size-xsmall)",
      sm: "var(--font-size-small)",
      md: "var(--font-size-large)",
      lg: "var(--font-size-xlarge)",
    },
    fontWeight: {
      normal: "var(--font-weight-normal)",
      medium: "var(--font-weight-medium)",
      bold: "var(--font-weight-bold)",
    },
    spacing: {
      0: "0px",
      1: "1px",
      2: "2px",
      xxxs: "var(--size-xxxsmall)",
      xxs: "var(--size-xxsmall)",
      xs: "var(--size-xsmall)",
      s: "var(--size-small)",
      m: "var(--size-medium)",
      l: "var(--size-large)",
      xl: "var(--size-xlarge)",
      xxl: "var(--size-xxlarge)",
      huge: "var(--size-huge)",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};

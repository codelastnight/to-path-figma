module.exports = {
    content: ['./index.html', './src/**/*.{svelte,js,ts}'],

    theme: {
        fontSize: {
            xs: 'var(--font-size-xsmall)',
            sm: 'var(--font-size-small)',
            md: 'var(--font-size-large)',
            lg: 'var(--font-size-xlarge)',
        },
        fontWeight: {
            normal: 'var(--font-weight-normal: 400)',
            medium: 'var(---font-weight-medium: 500',
            bold: 'var(---font-weight-bold: 600'
        },
        spacing: {
            0: '0px',
            1: '1px',
            2: '2px',
            xxxs: 'var(--size-xxxsmall)',
            xxs: 'var(--size-xxsmall)',
            xs: 'var(--size-xsmall)',
            s: 'var(--size-small)',
            m: 'var(--size-medium)',
            l: 'var(--size-large)',
            xl: 'var(--size-xlarge)',
            xxl: 'var(--size-xxlarge)',
            huge: 'var(--size-huge)'



        },
        extend: {

        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}

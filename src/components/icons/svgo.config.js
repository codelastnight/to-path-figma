module.exports = {
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
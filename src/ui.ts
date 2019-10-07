import './figma-plugin-ds.min.css'

document.getElementById('create').onclick = () => {
    const textbox = document.getElementById('count')
//    const count = parseInt(textbox.value, 10)
    parent.postMessage({ pluginMessage: { type: 'do-the-thing'} }, '*')
}

document.getElementById('cancel').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
//take the data sent from main code to calculate svg path length, then send it back
//data from the
onmessage = event => {
    // LMAO i cant believe this works this is some 300 iq going on rn

    if (event.data.pluginMessage.type === 'svg') {
        var vectors = event.data.pluginMessage.vectors
        let vectorLengths = []
        for (var curve in vectors) {
            let back2svg = vectors[curve].slice(0)
            back2svg.splice(0, 0, 'M')

            if (back2svg.length == 3) {
                back2svg.splice(2, 0, 'L')
            } else {
                back2svg.splice(2, 0, 'C')
            }
            var a = back2svg.join(' ')
            let path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            )
            path.setAttribute('d', a.replace(/,/g, ' '))
            // use the builtin function getTotalLength() to calculate length
            var svglength = path.getTotalLength()
            vectorLengths.push(svglength)
        }
        var x = event.data.pluginMessage.x
        var y = event.data.pluginMessage.y
        parent.postMessage(
            { pluginMessage: { type: 'svg', vectorLengths, vectors, x, y } },
            '*'
        )
    }
}
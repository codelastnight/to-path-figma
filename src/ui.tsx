import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState } from 'react'
import './figma-plugin-ds.min.css'
import './scss/main.scss'
import { SelectOptions, SelectVisual } from './ui/selectVisual'
import Create from './ui/Create'

declare function require(path: string): any
function UI() {
	const [selection, showselection] = useState('nothing')

	const onCreate = () => {
		parent.postMessage({ pluginMessage: { type: 'do-the-thing' } }, '*')
	}
	const onCancel = () => {
		parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
	}
	onmessage = event => {
		// idk how to put this in react and im too lazy to find out
		// LMAO i cant believe this works this is some 300 iq going on rn

		switch (event.data.pluginMessage.type) {
			case 'svg':
				const vectors = event.data.pluginMessage.vectors
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
				break
			case 'selection':
				showselection(event.data.pluginMessage.value)
		}
	}

	return (
		<div>
			<div className="main">
				<SelectVisual value={selection} />
				<SelectOptions value={selection} />
			</div>

			<div className="footer">
				<div className="divider"></div>
				<div className="flex">
					<Create value={selection} onClick={onCreate} />

					<div className="help">
						<button className="button button--secondary link">About</button>
					</div>
				</div>
			</div>
		</div>
	)
}

ReactDOM.render(<UI />, document.getElementById('react-page'))

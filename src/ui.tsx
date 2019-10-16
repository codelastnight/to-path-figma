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
	const [about, showabout] = useState(false)

	const settingsDefault: Formb = {
		verticalAlign: 0.5,
		horizontalAlign: 0.5,
		spacing: 20,
		count: 5,
		autoWidth: true,
		totalLength: 0,
		isLoop: false,
		objWidth: 0
	}
	const [setting, setSetting] = useState(settingsDefault)

	let rotCheck = true
	const onCreate = () => {
		parent.postMessage(
			{
				pluginMessage: {
					type: 'do-the-thing',
					options: setting,
					rotCheck: rotCheck
				}
			},
			'*'
		)
		console.log(setting)
	}

	onmessage = event => {
		// idk how to put this in react and im too lazy to find out
		// LMAO i cant believe this works this is some 300 iq going on rn

		switch (event.data.pluginMessage.type) {
			case 'svg':
				break
			case 'selection':
				showselection(event.data.pluginMessage.value)
				const svgdata = event.data.pluginMessage.selection

				if (svgdata != null && svgdata != undefined) {
					if (svgdata.data != null && svgdata.data != '') {
						const width = event.data.pluginMessage.width
						console.log(width)
						let path = document.createElementNS(
							'http://www.w3.org/2000/svg',
							'path'
						)
						path.setAttribute('d', svgdata.data)

						const isLoop: boolean = svgdata.data.toUpperCase().includes('Z')
							? true
							: false
						// use the builtin function getTotalLength() to calculate length
						const svglength = path.getTotalLength()
						if (svglength != 0 && setting.autoWidth) {
							const space = isLoop
								? svglength / (setting.count - 1) - width
								: svglength / setting.count - width
							setSetting({ ...setting, spacing: space })
						}
						setSetting({
							...setting,
							totalLength: svglength,
							isLoop: isLoop,
							objWidth: width
						})
					}
				}

				break
		}
	}

	return (
		<div>
			<div className={about === true ? 'about' : 'about hidden'}>
				<h2>To Path</h2>
				<p> version 0.1</p>
			</div>

			<div className="main">
				<SelectVisual value={selection} />
				<SelectOptions
					value={selection}
					rotCheck={rotCheck}
					form={setting}
					setForm={setSetting}
				/>
			</div>

			<div className="footer">
				<div className="divider"></div>
				<div className="flex">
					<div className="help">
						<button
							className="button button--secondary link"
							onClick={() => showabout(!about)}>
							{about === true ? 'back ' : 'about'}
						</button>
					</div>
					<Create value={selection} onClick={onCreate} />
				</div>
			</div>
		</div>
	)
}

ReactDOM.render(<UI />, document.getElementById('react-page'))

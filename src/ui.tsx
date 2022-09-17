import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState, useEffect } from 'react'
import './figma-plugin-ds.min.css'
import './main.css'
import { SelectVisual } from './ui/selectVisual'
import {SelectOptions} from './ui/selectOptions'
import Create from './ui/Create'
import { InputIcon } from './ui/Form'
import About from './ui/about';
import Tutorial from './ui/tutorial'

let settingsDefault: SettingData = {
	verticalAlign: 0.5,
	horizontalAlign: 0.5,
	spacing: 20,
	count: 5,
	autoWidth: true,
	totalLength: 0,
	isLoop: false,
	objWidth: 0,
	offset: 0,
	rotCheck: true,
	precision: 420,
	reverse: false
}


// main ui component
function UI() {
	
	// lol if it works it works
	const [selection, showselection] = useState('nothing')
	const [setting, setSetting] = useState(settingsDefault)

	const [about, showabout] = useState(false)
	const [link, setLink] = useState(false)
	const [tutorial, showTutorial] = useState(false)


	useEffect(() => {
		// Update the object every time setting is changed
		if (link) {
			parent.postMessage(
				{
					pluginMessage: {
						type: 'do-the-thing',
						options: setting
					}
				},
				'*'
			)
		}
	  }, [setting]);
	
	const onCreate = () => {
		parent.postMessage(
			{
				pluginMessage: {
					type: 'initial-link',
					options: setting
				}
			},
			'*'
		)
	
	}

	onmessage = event => {
		let eventData = event.data.pluginMessage
		switch (eventData.type) {
			case 'svg':
			case 'selection':
				
				const svgdata = event.data.pluginMessage.svgdata

				let copy: SettingData
				if (eventData.data.setting != null) {
					copy = { ...eventData.data.setting }
				} else {
					copy = {...setting}
				}

				if (svgdata != null && svgdata != undefined && svgdata != '') {

					const width = event.data.pluginMessage.width
					let path = document.createElementNS('http://www.w3.org/2000/svg','path')
					path.setAttribute('d', svgdata)
					const isLoop: boolean = svgdata.toUpperCase().includes('Z')

					// use the builtin function getTotalLength() to calculate length
					const svglength = path.getTotalLength()

					// change the spacing number on "auto width" setting (space evenly thru whole thing)
					if (svglength != 0 && setting.autoWidth) {
						
						const space = isLoop
							? svglength / setting.count - width
							: svglength / (setting.count - 1) - width

						copy = { ...copy, spacing: space }
					}
					copy = {
						...copy,
						totalLength: svglength,
						isLoop: isLoop,
						objWidth: width
					}
					
				}

				//if it works it works
				
				if (eventData.data.setting != null) {
					setLink(true)
				}
				if (eventData.value === 'text') {
					copy = { ...copy, autoWidth: false }
				}
				setSetting({...copy})

				if (eventData.data.type === "text" ) {
					showselection("text")
		
				} else {
					showselection("clone")
				}
				break

			default :
				showselection(eventData.value)
				setLink(false)

				break
		}
		
	}

	return (
		<div>
			<div className={about === true ? 'about' : 'about hidden'}>
				<About form={setting} setForm={setSetting}></About>
			</div>
			<div className={tutorial === true ? 'about' : 'about hidden'}>
				<Tutorial showTutorial={showTutorial} ></Tutorial>
			</div>
			<div className="main">
				<div className="section-custom ">
					<SelectVisual value={selection} />
				</div>
				<SelectOptions value={selection} form={setting} setForm={setSetting} showTutorial={showTutorial} />
			</div>

			<div className="footer">
				<div className="divider"></div>
				<div className="section-custom flex">
					<div className="help">
						<button
							className="button button--secondary link"
							onClick={() => showabout(!about)}>
							{about ? 'back ' : 'about'}
						</button>
					</div>
					<Create value={selection} isLink={link} onClick={onCreate} />
				</div>
			</div>
		</div>
	)
}

ReactDOM.render(<UI />, document.getElementById('react-page'))

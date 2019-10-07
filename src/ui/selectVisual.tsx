import * as React from 'react'

const selectCase = {
	one: 'please select two things',
	nothing: 'nothing selected',
	nocurve: 'please select a curve',
	toomany: 'please select only two things',
	text: 'curve and text selected',
	clone: 'curve and object selected'
}

function SelectVisual(props) {
	switch (props.value) {
		case 'nothing':
			return (
				<div className="visual-bell nothing">
					<h1 className="type type--neg-large-bold">
						{selectCase[props.value]}
					</h1>
				</div>
			)
			break
		case 'text':
		case 'clone':
			return (
				<div className="visual-bell">
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
			break
		default:
			return (
				<div className="visual-bell visual-bell--error">
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
	}
}

export default SelectVisual

export function SelectOptions(props) {
	switch (props.value) {
		case 'nothing':
			return (
				<div className="visual-bell nothing">
					<h1 className="type type--neg-large-bold">
						{selectCase[props.value]}
					</h1>
				</div>
			)
			break
		case 'text':
		case 'clone':
			return (
				<div className="visual-bell">
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
			break
		default:
			return <div className=""></div>
	}
}

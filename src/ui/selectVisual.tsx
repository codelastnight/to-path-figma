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
					<div className="icon icon--minus"></div>
					<span className="visual-bell__msg grey">
						{selectCase[props.value]}
					</span>
				</div>
			)
			break
		case 'text':
		case 'clone':
			return (
				<div className="visual-bell">
					<div className="icon icon--resolve icon--white"></div>
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
			break
		default:
			return (
				<div className="visual-bell visual-bell--error">
					<div className="icon icon--warning icon--white"></div>
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
	}
}

function SelectOptions(props) {
	switch (props.value) {
		case 'nothing':
			return (
				<div className="onboarding-tip">
					<div className="onboarding-tip__icon">
						<div className="icon icon--visible"></div>
					</div>
					<div className="onboarding-tip__msg">
						Select a curve and an object to start. 
						<ul>
							<li>select an object to have it repeat along a curve</li>
							<li>select text to have the character follow the curve</li>
						</ul>
					</div>
				</div>
			)
			break
		case 'text':
			return (
				<div className="">
					<div className="section-title mt">Text to Path Options</div>
					<div className="checkbox">
						<input
							className="checkbox__box"
							type="checkbox"
							id="uniqueId"
							checked={props.rotCheck}
						/>
						<label className="checkbox__label">follow curve angle</label>
					</div>
				</div>
			)
			break
		case 'clone':
			return (
				<div className="">
					<div className="section-title mt">Object To Path Options</div>
					<div className="checkbox">
						<input
							className="checkbox__box"
							type="checkbox"
							id="unique2"
							checked
						/>
						<label className="checkbox__label">follow curve angle</label>
					</div>
				</div>
			)
			break
		default:
			return <div className=""></div>
	}
}
export { SelectOptions, SelectVisual }

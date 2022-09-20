import * as React from 'react'



//save spacing infromation from autowidth (need to store this data later)

// information that appears in the panel
const selectCase = {
	one: 'please select two things',
	nothing: 'nothing selected',
	vectornetwork: 'multiple curves not supported',
	nocurve: 'please select a curve',
	toomany: 'please select only two things',
	text: 'curve and text selected',
	clone: 'curve and object selected',
	linklost: 'unable to find linked object(s)'
}
// the info notification thingy
interface SelectVisualProps{
	value: string
}
function SelectVisual(props:SelectVisualProps) {
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
				<div className="section-custom visual-bell">
					<div className="icon icon--resolve icon--white"></div>
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
			break
		default:
			return (
				<div className="section-custom visual-bell visual-bell--error">
					<div className="icon icon--warning icon--white"></div>
					<span className="visual-bell__msg">{selectCase[props.value]}</span>
				</div>
			)
	}
}

export { SelectVisual }

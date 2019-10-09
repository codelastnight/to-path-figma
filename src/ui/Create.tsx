import * as React from 'react'

let disabled = true
function Create(props) {
	switch (props.value) {
		case 'text':
		case 'clone':
			disabled = false
			break
		default:
			disabled = true
	}
	return (
		<button
			className="button button--primary mr"
			id="create"
			onClick={props.onClick}
			disabled={disabled}>
			Create
		</button>
	)
}

export default Create

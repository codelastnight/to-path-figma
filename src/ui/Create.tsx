import * as React from 'react'

// enable create button only on valid types
let disabled = true
let isLink = false
let text = "Link"
function Create(props) {
	switch (props.value) {
		case 'text':
		case 'clone':
			if (!props.isLink)
			disabled = false
			break
		default:
			disabled = true
	}
	if (props.isLink == true ){
		text = "Linked!"
		disabled = true
	} else {
		text = "Link"

	}
	return (
		<button
			className="button button--primary mr"
			id="create"
			onClick={props.onClick}
			disabled={disabled}>
			{text}
		</button>
	)
}

export default Create

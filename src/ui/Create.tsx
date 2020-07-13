import * as React from 'react'

// enable create button only on valid types
let disabled = true
let text = "Link"
interface CreateProps {
value: string
isLink: boolean
onClick: () => void
}
function Create(props: CreateProps) {
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
		disabled = props.isLink
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

import * as React from 'react'
import { checkPropTypes } from 'prop-types'

function Checkbox(props) {
    return (
    <input
		className="checkbox__box"
				type="checkbox"
				id={props.id}
				checked={props.checked}
		/>)
}
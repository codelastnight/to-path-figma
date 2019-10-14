import * as React from 'react'
import { checkPropTypes } from 'prop-types'

function Checkbox(props) {
    return (
        <div className="checkbox" onClick={props.change}>
        <input
		className="checkbox__box"
				type="checkbox"
				id={props.id}
                checked={props.checked}
                
		/>
        <label className="checkbox__label">{props.children}</label>
        </div>
    )
}
function InputIcon(props) {
    return (
    <div className="input-icon">
        <div className="input-icon__icon">
            <div className={props.icon}>            
        </div>
        </div>
        <input type="number" className="input-icon__input" value={props.value} onInput={props.change} onBlur={props.blur} required/>
    </div>
    )
}

export { Checkbox,InputIcon }
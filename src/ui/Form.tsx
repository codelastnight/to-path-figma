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
    const handleChange= (e) => {
        const { target: { name, value } } = e
        let _test = {...props.values, [name]: value}
        switch(name) {

            case 'verticalAlign' :
                if (value < 0) _test = {...props.values, [name]: 0}
                if (value > 1) _test = {...props.values, [name]: 1}
                break
            default:
              break
          }
        props.setValues(_test)

    }
    return (
    <div className="input-icon">
        <div className="input-icon__icon">
            <div className={props.icon}>            
        </div>
        </div>
        <input type="number" className="input-icon__input" name={props.name} value={props.values[props.name]} onChange={handleChange} onBlur={props.blur} {...props} required/>
    </div>
    )
}

export { Checkbox,InputIcon }
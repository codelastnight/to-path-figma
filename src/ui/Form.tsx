import * as React from 'react'

//checkbox component
function Checkbox(props) {
	function thecheck() {
		props.setvalues({...props.values, [props.id]: !props.values[props.id]})
	}
	return (
		
		<div className="checkbox" onClick={thecheck}>
			<input
				className="checkbox__box"
				type="checkbox"
				id={props.id}
				checked={props.values[props.id]}
				onChange={thecheck}
				
			/>
			<label className="checkbox__label">{props.children}</label>
		</div>
	)
}
// input component
function InputIcon(props) {
	const handleChange = e => {
		const {
			target: { name, value }
		} = e
		let _test = { ...props.values, [name]: Number(value) }
		switch (name) {
			case 'offset':
				if (value < 0) _test = { ...props.values, [name]: 0 }
				break
			case 'horizontalAlign':
			case 'verticalAlign':
				// limit input to min 0 and max 1
				if (value < 0) _test = { ...props.values, [name]: 0 }
				if (value > 1) _test = { ...props.values, [name]: 1 }
				break
			case 'count':
				// limit input to positive integers only
				if (value < 0) _test = { ...props.values, [name]: 0 }
				else _test = { ...props.values, [name]: Math.round(value) }

				if (props.values.totalLength != 0 && props.values.autoWidth) {
					const space = _test.isLoop
						? _test.totalLength / _test.count - _test.objWidth
						: _test.totalLength / (_test.count -1) - _test.objWidth
					_test = { ..._test, spacing: space }
				}
				//console.log(props.values)
				break
			default:
				break
		}
		props.setvalues(_test)
	}
	return (
		<div className="input-icon">
			<div className="input-icon__icon">
				<div className={props.icon}></div>
			</div>
			<input
				type="number"
				className="input-icon__input"
				name={props.name}
				// not that great but its good enough.
				value={Math.round(props.values[props.name]*100)/100}
				onChange={handleChange}
				onBlur={props.blur}
				{...props}
				required
			/>
		</div>
	)
}

export { Checkbox, InputIcon }

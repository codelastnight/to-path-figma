import * as React from 'react'
import { Checkbox, InputIcon } from './Form'
import { useState, useEffect } from 'react'
import { isNullOrUndefined } from 'util'

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

// show different options depending on what is selected.
// currently two: text to path and curve to path
function SelectOptions(props) {
	const [check, setCheck] = useState(props.rotCheck)

	function onOffFocus(e) {
		let copy = { ...props.form }

		if (e.target.value == '') {
			copy = { ...props.form, [e.target.name]: props.form[e.target.name] }
		} else {
			copy = { ...props.form, [e.target.name]: Number(e.target.value) }
		}
		props.setForm(copy)
	}

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
				<div className="text">
					<div className="section-title mt">Text to Path Options</div>
					<div className="label">Vertical Alignment:</div>
					<InputIcon
						icon="icon icon--layout-align-vert-cent icon--black-3"
						values={props.form}
						name="verticalAlign"
						blur={e => onOffFocus(e)}
						min={0}
						max={1}
						step={0.1}
						setvalues={props.setForm}></InputIcon>
					<div className="label">Rotation:</div>

					<Checkbox
						id="rotCheck"
						checked={check}
						change={() => {
							setCheck(!check)
							props.rotCheck = check
						}}>
						characters follow curve rotation
					</Checkbox>
				</div>
			)
			break
		case 'clone':
			return (
				<div className="clone">
					<div className="section-title mt">Object To Path Options</div>
					<div className="flex">
						<div className="col">
							<div className="label">Count:</div>
							<InputIcon
								icon="icon icon--layout-grid-uniform icon--black-3"
								values={props.form}
								name="count"
								blur={e => onOffFocus(e)}
								setvalues={props.setForm}></InputIcon>
						</div>
						<div className="col">
							<div className="label">Spacing(px):</div>
							<div className="flex">
								<InputIcon
									icon="icon icon--layout-align-vert-cent icon--black-3"
									values={props.form}
									name="spacing"
									blur={e => onOffFocus(e)}
									setvalues={props.setForm}
									disabled={props.form.autowidth}></InputIcon>
								<div
									className={
										props.form.autowidth
											? 'icon icon--link-connected icon--button icon--selected a'
											: 'icon icon--link-broken icon--button a'
									}
									onClick={() => {
										props.setForm({
											...props.form,
											autoWidth: !props.form.autoWidth
										})
									}}></div>
							</div>
						</div>
					</div>
					<div className="flex">
						<div className="col">
							<div className="label">Vertical Align:</div>
							<InputIcon
								icon="icon icon--layout-align-vert-cent icon--black-3"
								values={props.form}
								name="verticalAlign"
								blur={e => onOffFocus(e)}
								min={0}
								max={1}
								step={0.1}
								setvalues={props.setForm}></InputIcon>
						</div>
						<div className="col">
							<div className="label">Horozontal Align:</div>
							<InputIcon
								icon="icon icon--layout-align-vert-cent icon--black-3"
								values={props.form}
								name="horizontalAlign"
								blur={e => onOffFocus(e)}
								min={0}
								max={1}
								step={0.1}
								setvalues={props.setForm}></InputIcon>
						</div>
					</div>

					<div className="label">Rotation:</div>

					<Checkbox
						id="rotCheck"
						checked={check}
						change={() => {
							setCheck(!check)
							props.rotCheck = check
						}}>
						object follows curve rotation
					</Checkbox>
					<div className="onboarding-tip">
						<div className="onboarding-tip__icon">
							<div className="icon icon--warning"></div>
						</div>
						<div className="onboarding-tip__msg">
							<span className="type type--neg-medium-bold">Warning:</span> if
							two curves/ellipses are selected, the plugin will try to pick the
							one that is bigger in either height or width.
						</div>
					</div>
				</div>
			)
			break
		default:
			return <div className=""></div>
	}
}
export { SelectOptions, SelectVisual }

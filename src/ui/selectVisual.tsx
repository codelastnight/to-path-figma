import * as React from 'react'
import { Checkbox, InputIcon } from './Form'
import { useState, useEffect } from 'react'
import { checkPropTypes } from 'prop-types'


//save spacing infromation from autowidth (need to store this data later)
let lastspacing=10;

// information that appears in the panel
const selectCase = {
	one: 'please select two things',
	nothing: 'nothing selected',
	vectornetwork: 'multiple curves not supported',
	nocurve: 'please select a curve',
	toomany: 'please select only two things',
	text: 'curve and text selected',
	clone: 'curve and object selected'
}
// the info notification thingy

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
	// check for invalid values when input loses focus

	function onOffFocus(e) {
		let copy

		if (e.target.value == '') {
			copy = { ...props.form, [e.target.name]: props.form[e.target.name] }
		} else {
			copy = { ...props.form, [e.target.name]: Number(e.target.value) }
		}
		props.setForm(copy)
	}
	// update offset values 
	function onOffset(align = 'right') {
		if (!props.form.autoWidth) {
			let copy: Formb = { ...props.form }
			const count = copy.isLoop ? copy.count - 1 : copy.count
			let length = 0

			if (props.value == 'text') {
				length = props.form.objWidth
			} else {
				length = count * copy.objWidth + copy.spacing * (count - 1)
			}
			switch (align) {
				case 'left':
					copy.offset = 0
					break
				case 'center':
					copy.offset =
						copy.totalLength / 2 -
						length / 2 +
						(props.value == 'clone' ? copy.objWidth / 2 : 0)
					break
				case 'right':
					copy.offset =
						copy.totalLength -
						length +
						(props.value == 'clone' ? copy.objWidth / 2 : 0)
					break
			}
			props.setForm(copy)
		}
	}

	// show things based on what is selected
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
						<span className="type type--neg-medium-bold">Note:</span> if two
						curves/ellipses are selected, the plugin will try to pick the one
						that is bigger in either height or width.
					</div>
				</div>
			)
			break
		case 'text':
			return (
				<div className="text">
					<div className="section-title mt">Text to Path Options</div>
					<div className="flex" >
						<div className="col">
						<div className="label">Vertical Alignment:</div>
						<InputIcon
							icon="icon icon--arrow-up-down icon--black-3"
							values={props.form}
							name="verticalAlign"
							blur={e => onOffFocus(e)}
							min={0}
							max={1}
							step={0.1}
							setvalues={props.setForm}></InputIcon>
						</div>
						<div className="col">
						<div className="label">Horizontal Alignment:</div>
						<InputIcon
							icon="icon icon--arrow-left-right icon--black-3"
							values={props.form}
							name="horizontalAlign"
							blur={e => onOffFocus(e)}
							min={0}
							max={1}
							step={0.1}
							setvalues={props.setForm}></InputIcon>
						</div>
					</div>
					
					<div className="label">Offset(px):</div>
					<div className="flex">
						<InputIcon
							icon="icon icon--layout-grid-columns icon--black-3"
							values={props.form}
							name="offset"
							blur={e => onOffFocus(e)}
							setvalues={props.setForm}
							disabled={props.form.autoWidth}></InputIcon>
						<div className="flex">
							<div
								className={
									props.form.autoWidth
										? 'icon icon--layout-align-left icon--black-3'
										: 'icon icon--layout-align-left icon--button'
								}
								onClick={() => onOffset('left')}></div>
							<div
								className={
									props.form.autoWidth
										? 'icon icon--layout-align-horiz-cent icon--black-3'
										: 'icon icon--layout-align-horiz-cent icon--button'
								}
								onClick={() => onOffset('center')}></div>
							<div
								className={
									props.form.autoWidth
										? 'icon icon--layout-align-right icon--black-3'
										: 'icon icon--layout-align-right icon--button'
								}
								onClick={() => onOffset('right')}></div>
						</div>
					</div>
					<div className="label">Rotation:</div>
					<Checkbox id="rotCheck" values={props.form} setvalues={props.setForm}>
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
									icon="icon icon--dist-horiz-spacing icon--black-3"
									values={props.form}
									name="spacing"
									blur={e => onOffFocus(e)}
									setvalues={props.setForm}
									disabled={props.form.autoWidth}></InputIcon>
								<div
									className={
										props.form.autoWidth
											? 'icon icon--link-connected icon--button icon--selected a'
											: 'icon icon--link-broken icon--button a'
									}
									onClick={() => {
										// clean up later. now it just needs to work lmao
										let copy: Formb = { ...props.form }
										copy = { ...copy, autoWidth: !copy.autoWidth }

										if (copy.autoWidth) {
											lastspacing = copy.spacing
											const space = copy.isLoop
												? copy.totalLength / copy.count - copy.objWidth
												: copy.totalLength / (copy.count - 1) - copy.objWidth
											copy = { ...copy, spacing: space, offset: 0 }
										} else {
											copy = { ...copy, spacing: lastspacing}
										}
										props.setForm(copy)
									}}></div>
							</div>
						</div>
					</div>
					<div className="flex">
						<div className="col">
							<div className="label">Vertical Align:</div>
							<InputIcon
								icon="icon icon--arrow-up-down icon--black-3"
								values={props.form}
								name="verticalAlign"
								blur={e => onOffFocus(e)}
								min={0}
								max={1}
								step={0.1}
								setvalues={props.setForm}></InputIcon>
						</div>
						<div className="col">
							<div className="label">Horizontal Align:</div>
							<InputIcon
								icon="icon icon--arrow-left-right icon--black-3"
								values={props.form}
								name="horizontalAlign"
								blur={e => onOffFocus(e)}
								min={0}
								max={1}
								step={0.1}
								setvalues={props.setForm}></InputIcon>
						</div>
					</div>
					<div className="label">Offset(px):</div>
					<div className="flex">
						<InputIcon
							icon="icon icon--layout-grid-columns icon--black-3"
							values={props.form}
							name="offset"
							blur={e => onOffFocus(e)}
							setvalues={props.setForm}
							disabled={props.form.autoWidth}></InputIcon>
						<div className="flex">
							<div
								className={
									props.form.autoWidth
										? 'icon icon--layout-align-left icon--black-3'
										: 'icon icon--layout-align-left icon--button'
								}
								onClick={() => onOffset('left')}></div>
							<div
								className={
									props.form.autoWidth
										? 'icon icon--layout-align-horiz-cent icon--black-3'
										: 'icon icon--layout-align-horiz-cent icon--button'
								}
								onClick={() => onOffset('center')}></div>
							<div
								className={
									props.form.autoWidth
										? 'icon icon--layout-align-right icon--black-3'
										: 'icon icon--layout-align-right icon--button'
								}
								onClick={() => onOffset('right')}></div>
						</div>
					</div>
					<div className="label">Rotation:</div>

					<Checkbox id="rotCheck" values={props.form} setvalues={props.setForm}>
						objects follow curve rotation
					</Checkbox>
				</div>
			)
			break
		default:
			return <div className=""></div>
	}
}
export { SelectOptions, SelectVisual }

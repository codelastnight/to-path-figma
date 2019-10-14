import * as React from 'react'
import {Checkbox, InputIcon } from './Form'
import { useState,useEffect } from 'react'
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

interface Formb {
	
    verticalAlign: number
    spacing: number

}

function SelectOptions(props) {
	const settings: Formb = {
		verticalAlign: 0, 
		spacing: 20,
	}
	const [check, setCheck] = useState(props.rotCheck)
	const [values, setValues] = useState<Formb | null>(settings);

	function handleInput(e,key) {
		const copy = {...values}
		
			setValues(copy[key] = e.target.value)

		
		
	}
	function onOffFocus(e) {
		
		
			const copy = {...values}
			if( e.target.value == "" ) {
				setValues(copy[e.target.name] = settings[e.target.name])
				console.log("d")
			} else {
				setValues(copy[e.target.name] = e.target.value)
	
			}
		
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
				<div className="">
					<div className="section-title mt">Text to Path Options</div>
					<div className="label">Vertical Alignment:</div>
					<InputIcon icon="icon icon--layout-align-vert-cent icon--black-3"  value={values.verticalAlign} name="verticalAlign" blur={e => onOffFocus(e)} change={e => handleInput(e,'verticalAlign')}></InputIcon>
					<div className="label">Rotation:</div>

					<Checkbox id="rotCheck" checked={check} change={() => setCheck(!check)}>follow curve rotation</Checkbox>
	
				</div>
			)
			break
		case 'clone':
			return (
				<div className="">
					<div className="section-title mt">Object To Path Options</div>
					<div className="label">Vertical Alignment:</div>
					<InputIcon icon="icon icon--layout-align-vert-cent icon--black-3" value={values.verticalAlign} blur={e => onOffFocus(e)} name="verticalAlign" change={e => handleInput(e,'verticalAlign')}></InputIcon>
					<div className="label">Spacing</div>
					<InputIcon icon="icon icon--layout-align-vert-cent icon--black-3" value={values.spacing} blur={e => onOffFocus(e)} name="spacing" change={e => handleInput(e,'spacing')}></InputIcon>

					<div className="label">Rotation:</div>

					<Checkbox id="rotCheck" checked={check} change={() => setCheck(!check)}>follow curve rotation</Checkbox>
	
				</div>
			)
			break
		default:
			return <div className=""></div>
	}
}
export { SelectOptions, SelectVisual }

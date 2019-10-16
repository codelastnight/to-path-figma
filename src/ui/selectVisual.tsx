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


function SelectOptions(props) {
	
	const [check, setCheck] = useState(props.rotCheck)
	const [values, setValues] = useState(props.form);
	function onOffFocus(e) {
		
			let copy = {}
			
			if( e.target.value == "" ) {
				 copy = {...values, [e.target.name]: props.form[e.target.name]}
				
				console.log("d")
			} else {
				 copy = {...values, [e.target.name]: e.target.value}
	
			}
			setValues(copy)
			props.form = copy
			console.log(props.form)
		
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
					<InputIcon icon="icon icon--layout-align-vert-cent icon--black-3"  values={values} name="verticalAlign" blur={e => onOffFocus(e)} min={0} max={1} step={0.1} setValues={setValues}></InputIcon>
					<div className="label">Rotation:</div>

					<Checkbox id="rotCheck" checked={check} change={() => {setCheck(!check); props.rotCheck = check}}>characters follow curve rotation</Checkbox>
	
				</div>
			)
			break
		case 'clone':
			return (
				<div className="clone">
					
					<div className="section-title mt">Object To Path Options</div>
					<div className="label">Vertical Alignment:</div>	
					<InputIcon icon="icon icon--layout-align-vert-cent icon--black-3"  values={values} name="verticalAlign" blur={e => onOffFocus(e)} min={0} max={1} step={0.1} setValues={setValues}></InputIcon>
					<div className="label">Spacing(px):</div>
					<InputIcon icon="icon icon--layout-align-vert-cent icon--black-3"  values={values} name="spacing" blur={e => onOffFocus(e)} setValues={setValues}></InputIcon>

					<div className="label">Rotation:</div>

					<Checkbox id="rotCheck" checked={check} change={() => {setCheck(!check); props.rotCheck = check}}>object follows curve rotation</Checkbox>
					<div className="onboarding-tip">
					<div className="onboarding-tip__icon">
						<div className="icon icon--warning"></div>
					</div>
					<div className="onboarding-tip__msg">
						<span className="type type--neg-medium-bold">Warning:</span> if two curves are selected, the plugin will ALWAYS take the curve that is on a lower layer. this will be fixed in a later version
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

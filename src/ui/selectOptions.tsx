import * as React from 'react'
import { Checkbox, InputIcon } from './Form'



let lastspacing=10;

// show different options depending on what is selected.
// currently two: text to path and curve to path

interface SelectOptionsProps{
    value: string
    form: SettingData
    setForm: React.Dispatch<React.SetStateAction<SettingData>>
    showTutorial: React.Dispatch<React.SetStateAction<boolean>>
}

function SelectOptions(props: SelectOptionsProps) {
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
			let copy: SettingData = { ...props.form }
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
			// no negative offset
			if (copy.offset < 0 ) copy.offset=0
			props.setForm(copy)
		}
	}

	// show things based on what is selected
	switch (props.value) {
        case 'one':
		case 'toomany':
		case 'nocurve':
		case 'nothing':
			return (
				<div>
					 
					<div className="onboarding-center">
					
						<p>⭐<span className="type type--neg-medium-bold"> Lets Get Started </span>⭐</p>
                        <p className="type type--neg-small-normal"> 
                            Select both a curve and any object to have it repeat along the curve. 
                        </p>
                        <p className="type type--neg-small-normal">
                            If text is selected, the text will follow the curve instead.
                        </p>
						<button
							className="button button--secondary"
							onClick={() => props.showTutorial(true)}>
							Tutorial
						</button>
						<p className="">
						°.✩—∘*-✨-*—∘✩.°
						</p>
					</div>
				</div>
				
			)
			break
		case 'linklost':
		return (
			<div className="onboarding-tip">
				<div className="onboarding-tip__icon">
					<div className="icon icon--visible"></div>
				</div>
				<div className="onboarding-tip__msg">
					Error trying to find linked object. try selecting a different group or re-linking
					
				</div>
			</div>
		)
		break
		case 'text':
			return (
				<div className="text">
                    <div className="divider"></div>
                    
                    <div className="section-custom flex" >
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
					
                    <div className="divider"></div>
                    <div className="section-custom ">
                        <div className=" label">Offset(px):</div>
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
                    </div>
                    <div className="divider"></div>
                    <div className="section-custom ">
                        <div className="section-custom label">Rotation:</div>

                        <Checkbox id="rotCheck" values={props.form} setvalues={props.setForm}>
                            characters follow curve rotation
                        </Checkbox>
                        
                        <Checkbox id="reverse" values={props.form} setvalues={props.setForm}>
                            reverse direction of text
                        </Checkbox>
                    </div>
				</div>
			)
			break
		case 'clone':
			return (
				<div className="clone">
                    <div className="divider"></div>
					<div className="section-custom flex">
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
										let copy: SettingData = { ...props.form }
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
                    <div className="section-custom ">
                        <div className=" label">Offset (px):</div>
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
                    </div>
                    <div className="divider"></div>
                    <div className="section-custom flex">
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
                    
                    <div className="divider"></div>

                    <div className="section-custom ">
                        <div className="label">Rotation:</div>
                        <Checkbox id="rotCheck" values={props.form} setvalues={props.setForm}>
                            objects follow curve rotation
                        </Checkbox>
                        <Checkbox id="reverse" values={props.form} setvalues={props.setForm}>
                            reverse direction 
                        </Checkbox>
                    </div>
				</div>
			)
			break
		default:
			return <div className=""></div>
	}
}

export { SelectOptions }

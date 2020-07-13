/* 
	code for handling selection logic
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import {isLinked} from './helper'

/**
 * decide which one in the selected is the curve and which is the object
 * @param selection 
 * @param setting 
 */
export const Decide = (selection: readonly SceneNode[], setting: SettingData ): LinkedData => {
	let curve: VectorNode
	let n: any
	let other: SceneNode
	let type: DataType = "clone"

	const filterselect = selection.filter(
		n => n.type === 'VECTOR' || n.type === 'ELLIPSE'
	)

	const object1 = filterselect[0]
	const object2 = filterselect[1]
	// if two curves are selected, select one with bigger x or y
	// im sure theres a way to make this code smaller but idk how
	if (filterselect.length == 2) {
	
		if (object1.width > object2.width || object1.height > object2.height ) {
			n = object1
			other = object2
		} else {
			n = object2
			other = object1
		}
	} else {
		// this case, only one in filterselect so select default.
		n = object1
		// select the other one.
		other = selection.filter(
			a => a.type !== 'VECTOR' && a.type !== 'ELLIPSE'
		)[0]
	}
	
	if (other.type === 'TEXT') type = "text"


	// if eclipse, flatten the ellipse so it is registered as a curve.
	// this isn't ideal at all, but it reduces code.
	if (n.type == 'ELLIPSE') {
		curve = figma.flatten([n])
		figma.currentPage.selection = [other, curve]
	} else {
		curve = n
	}
	 
	return {
		namespace: "topathfigma", 
		curve: curve, 
		other:  other,
		setting: setting,
		type: type
	} 
}

//do things on a selection change
export const OnChange = () => {
	const selection = figma.currentPage.selection
	// case handling is torture
	// check if theres anything selected
	switch (selection.length) {
		case 2:
			//check if a curve is selected
			if (selection.filter(node => node.type === 'VECTOR' || node.type === 'ELLIPSE').length > 0) {
				// if its a text or somethin else
				if (selection.filter(node => node.type === 'TEXT').length == 1) {
					send('text', selection)
				} else {
					send('clone', selection)
				}
			} else {
				send('nocurve')
			}
			break
		case 1:
			// if selecting a linked group
			const selected = selection[0]
			if (selected.type === 'GROUP') {
				var groupData: LinkedData = isLinked(selected)

				if (groupData == null) {
					send('one')
				} else {
					// get the data from that.
					send('linkedGroup',selected, groupData)
				}
			} 

			else {
				send('one')
			}
			break

		case 0:
			send('nothing')
			break

		default:
			send('toomany')
	}
}

/**
 * update ui only when selection is changed
 * @param value 
 * @param selection 
 * @param data 
 */
export const send = (value: string, selection = null, data:LinkedData = null) => {
	if (selection != null ) {
		if(data == null) {
			data = Decide(selection, null)
		}
		var svgdata = data.curve.vectorPaths[0].data 
		if (data.curve.vectorPaths[0].data.match(/M/g).length > 1) value = 'vectornetwork'
		const width = data.other.width
		figma.ui.postMessage({ type: 'svg', width, value,  data, svgdata})
	} else {
		figma.ui.postMessage({ type: 'rest', value })
	}
}

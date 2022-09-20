/* 
	code for handling selection logic
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/
import * as helper from './helper'

/**
 * bool of whether or not currently selected is already a linked object
 */
export let isLinkedObject = false 

/**
 * 
 */
export let prevData: string = "";

/**
 * i forgot what this does. fix later
 * @param setData 
 */
export const prevDataChange = (setData):string => {
	return prevData = setData
}

/**
 * bool state of whether or not plugin is closed
 */
let pluginClose: boolean = false

export const setPluginClose = (state: boolean) => {
	pluginClose = state
}

/**
 * decide which one in the selected is the curve and which is the object
 * @param selection 
 * @param setting 
 */
export const decide = (selection: readonly SceneNode[], setting: SettingData ): LinkedData => {
	let curve: VectorNode
	let n: any
	let other: SceneNode
	let type: DataType = "clone"

	const filterselect = selection.filter(
		n => n.type === 'VECTOR' || n.type === 'ELLIPSE'
	)

	// if two curves are selected, select one with bigger x or y
	// im sure theres a way to make this code smaller but idk how
	if (filterselect.length == 2) {
		const object1 = filterselect[0]
		const object2 = filterselect[1]
	
		if (object1.width + object1.height > object2.width + object2.height ) {
			n = object1
			other = object2
		} else {
			n = object2
			other = object1
		}
	} else {
		const object1 = filterselect[0]
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

/**
 * do things on a selection change
 */
export const onChange = () => {
	const selection = figma.currentPage.selection
	isLinkedObject = false;
	prevDataChange("") 	
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
			const groupId = selected.getPluginData("linkedID")
			
			if ( groupId) {
				isLinkedObject = true;	
				
			} else if (selected.type === 'GROUP') {
				const groupData: LinkedData = helper.isLinked(selected)

				if (groupData) {
					send('linkedGroup',selected, groupData)
				} else {
					send('one')
					// get the data from that.
				}
			} else {
				send('one')
			}
			break

		case 0:
			send('nothing')
			break

		default:
			send('toomany')
	}
	return selection
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
			data = decide(selection, null)
		}
        var svgdata = data.curve.vectorPaths[0].data 
        
		if (data.curve.vectorPaths[0].data.match(/M/g).length > 1) value = 'vectornetwork'
        const width = data.other.width
        
		figma.ui.postMessage({ type: 'svg', width, value,  data, svgdata})
	} else {
		figma.ui.postMessage({ type: 'rest', value })
	}
}

 
/**
 * watch every set 300 milliseconds, if certain objects are selected, watch for changes
 */
export const timerWatch = () => {
	setTimeout(function () {
	if (!pluginClose) {
		if (isLinkedObject) { 
			let localselection = figma.currentPage.selection
			const groupId = localselection[0].getPluginData("linkedID")
			// deepcopy to get unlinked copy
			const data = JSON.stringify(helper.deepCopy(localselection[0]))
			// compare current object with prevData (previously rendered data)
			if (prevData != data) {
				const groupNode: GroupNode = figma.getNodeById(groupId) as GroupNode
				const groupData: LinkedData = helper.isLinked(groupNode, localselection[0].id)
				send('linkedGroup',groupNode, groupData)
				prevDataChange(data)

			}
			
		}

		timerWatch();
	} 
	return
	}, 300);
	
}



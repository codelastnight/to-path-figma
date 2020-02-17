/* 
	source code for to path for figma
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma

	disclaimer:
	i dont know how to code
*/
import * as Curve from './ts/curve'
import * as Place from './ts/place'
import * as Helper from './ts/helper'

let firstRender: boolean = true;

/**
 * select which one is the curve and which is the object
 * @param selection 
 * @param setting 
 */
const selectCurve = (selection: readonly SceneNode[],setting: SettingData ): LinkedData => {
	let curve: VectorNode
	let n
	let other: SceneNode
	const filterselect = selection.filter(
		n => n.type === 'VECTOR' || n.type === 'ELLIPSE'
	)
	let type: DataType = "clone"

	// if two curves are selected, select one with bigger x or y
	// im sure theres a way to make this code smaller but idk how
	if (filterselect.length == 2) {
		if (
			filterselect[0].width > filterselect[1].width ||
			filterselect[0].height > filterselect[1].height
		) {
			n = filterselect[0]
			other = filterselect[1]
		} else {
			n = filterselect[1]
			other = filterselect[0]
		}
	} else {
		// this case, only one in filterselect so select default.
		n = filterselect[0]
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
 * main code
 * * async required because figma api requires you to load fonts into the plugin to use them... 
 * honestly im really tempted to just hardcode a dumb font like swanky and moo moo instead
 * @param group 
 * @param data 
 */
const main = async (group: GroupNode, data: LinkedData): Promise<string | undefined> => {

	// select the curve
	// take the svg data of the curve and turn it into an array of points
	//idk if i should store this or not. its pretty fast to calculate so....
	const pointArr: Array<Point> = Curve.allPoints(data.curve.vectorPaths[0].data, data.setting.precision)
	//console.log(pointArr)

	if (data.other.type === 'TEXT') {
		//the font loading part
		if (firstRender) {
			for (let i = 0; i < data.other.characters.length; i++) {
				await figma.loadFontAsync(data.other.getRangeFontName(i,i + 1) as FontName)
			}
			if (
				data.other.width > pointArr[pointArr.length - 1].totalDist ||
				figma.hasMissingFont == true
			) {
				figma.closePlugin(
					'either the text path is too long or the font has failed to load'
				)
			}
		}

			// remove old stuff
		//place it on the thing
		Place.deleteNodeinGroup(group,data.curveCloneID)
		Place.text2Curve(data.other, pointArr, data, group)
	} else {

		// load fonts if selected object is a group or frame
		if (data.other.type === 'FRAME' || data.other.type === 'GROUP') {
			if (firstRender) {
				const textnode = data.other.findAll(e => e.type === 'TEXT') as TextNode[]
				for (const find of textnode) {
					for (let i = 0; i < find.characters.length; i++) {
						await figma.loadFontAsync(find.getRangeFontName(i, i + 1) as FontName)
					}
				}
			}
		}
		Place.deleteNodeinGroup(group,data.curveCloneID)
		Place.object2Curve(data.other, pointArr, data, group)
	}
	Helper.setLink(group,data)
	return
}



/**
 * update ui only when selection is changed
 * @param value 
 * @param selection 
 * @param data 
 */
const sendSelection = (value: string, selection = null, data:LinkedData = null) => {
	if (selection != null ) {
		if(data == null) {
			data = selectCurve(selection, null)
		}
		var svgdata = data.curve.vectorPaths[0].data 
		if (data.curve.vectorPaths[0].data.match(/M/g).length > 1) value = 'vectornetwork'
		const width = data.other.width
		figma.ui.postMessage({ type: 'svg', width, value,  data, svgdata})
	} else {
		figma.ui.postMessage({ type: 'rest', value })
	}
}

//do things on a selection change
const watchSelection = () => {
	const selection = figma.currentPage.selection
	// case handling is torture
	// check if theres anything selected
	switch (selection.length) {
		case 2:
			//check if a curve is selected
			if (selection.filter(node => node.type === 'VECTOR' || node.type === 'ELLIPSE').length > 0) {
				// if its a text or somethin else
				if (selection.filter(node => node.type === 'TEXT').length == 1) {
					sendSelection('text', selection)
				} else {
					sendSelection('clone', selection)
				}
			} else {
				sendSelection('nocurve')
			}
			break
		case 1:
			// if selecting a linked group
			const selected = selection[0]
			if (selected.type === 'GROUP') {
				var groupData: LinkedData = Helper.isLinked(selected)

				if (groupData == null) {
					sendSelection('one')
				} else {
					// get the data from that.
					sendSelection('linkedGroup',selected, groupData)
				}
			} 
			// if the child of a linked group is selected and is the friken curve
			// else if (selected.parent.type === 'GROUP') {
			// 	var groupData: LinkedData = Helper.isLinked(selected.parent)
			// 	if (groupData == null) {
			// 		sendSelection('one')
			// 	} else {
			// 		sendSelection('linkedGroup',selected.parent, groupData)
			// 	}
			// }
			else {
				sendSelection('one')
			}
			break

		case 0:
			sendSelection('nothing')
			break

		default:
			sendSelection('toomany')
	}
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 300, height: 450 })

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.on('message', async msg => {
	
	if (msg.type === 'do-the-thing') {
		var selected = figma.currentPage.selection
		var data: LinkedData 
		let group1 = selected.find(i => i.type === "GROUP") as GroupNode

		data= Helper.isLinked(group1)
		if (data == null) { 
				sendSelection('linklost')
		}
		else {
			data.setting = msg.options
			await main(group1, data)
			firstRender = false;
		}
	
	}
	 
	// run when "link" button is hit
	if (msg.type === 'initial-link') {
		const selection: readonly SceneNode[] = figma.currentPage.selection
		const data: LinkedData = selectCurve(selection, msg.options)

		//rename paths
		data.other.name = "[Linked] " + data.other.name.replace("[Linked] ", '')
		data.curve.name = "[Linked] " + data.curve.name.replace('[Linked] ', '')
		//clone curve selection to retain curve shape
		const clone2: SceneNode = data.curve
		//clone2.visible = false
		data.curveCloneID = clone2.id
		data.curve.parent.appendChild(clone2)

		// make a new group 
		let group2: GroupNode = figma.group([clone2], data.curve.parent)
		group2.name = "Linked Path Group"
		figma.currentPage.selection = [group2]

		// link custom data
		Helper.setLink(group2,data)

		await main(group2, data)
		firstRender = false;

	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.

	// what if i dont wanna lmao. default generated tutorial headass
})

//checks for initial selection
watchSelection()

//watches for selecition change and notifies UI
figma.on('selectionchange', () => {
	watchSelection()
	if (!firstRender) firstRender = true;
})
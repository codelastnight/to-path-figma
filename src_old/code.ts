/* 
	source code for "to path", a plugin for figma
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma

	disclaimer:
	i dont know how to code
*/
import * as curve from './ts/curve';
import * as place from './ts/place';
import * as helper from './ts/helper';
import * as selection from './ts/selection';

/**
 * checks if the code is initially run after an object is selected.
 */
let firstRender: boolean = true;

/**
 * current selection stored so its accessible later
 */
let SelectionNodes: readonly SceneNode[] = [];



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
	const pointArr: Array<Point> = curve.allPoints(data.curve.vectorPaths[0].data, data.setting)	

	// load all fonts in selected object if group or frame or text  
	if (data.other.type === 'TEXT' || data.other.type === 'FRAME' || data.other.type === 'GROUP') {
		if (firstRender) {
			let textnode: TextNode[] = data.other.type === 'TEXT' ? [data.other] : data.other.findAll(e => e.type === 'TEXT') as TextNode[]
			
			for (const find of textnode) {
				for (let i = 0; i < find.characters.length; i++) {
					await figma.loadFontAsync(find.getRangeFontName(i, i + 1) as FontName)
					if (find.hasMissingFont) {
						figma.closePlugin('Text contains a missing font, please install the font first!')
					}
				}
			}
		}
	}
	place.deleteNodeinGroup(group,data.curveCloneID)
	data.other.type === 'TEXT' ? place.text2Curve(data.other, pointArr, data, group) : place.object2Curve(data.other, pointArr, data, group)
	helper.setLink(group,data)

		
	return
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.on('message', async msg => {
	
	if (msg.type === 'do-the-thing') {
		let group:GroupNode

		const groupId = SelectionNodes[0].getPluginData("linkedID")
		if (groupId) {
			group = figma.getNodeById(groupId) as GroupNode
		} else {
			group = SelectionNodes.find(i => i.type === "GROUP") as GroupNode
		}
		 
		var data: LinkedData = helper.isLinked(group)
		if (data) {
			data.setting = msg.options
			await main(group, data)
			group.setRelaunchData({ relaunch: 'Edit with To Path' })
			firstRender = false 
		}
		else {
			selection.send('linklost')
		}
	
	}
	
	// initial run when "link" button is hit
	if (msg.type === 'initial-link') {
		const data: LinkedData = selection.decide(SelectionNodes, msg.options)

		//rename paths
		data.other.name = "[Linked] " + data.other.name.replace("[Linked] ", '')
		data.curve.name = "[Linked] " + data.curve.name.replace('[Linked] ', '')
		//clone curve Selection to retain curve shape
		const clone2: SceneNode = data.curve
		data.curveCloneID = clone2.id
		data.curve.parent.appendChild(clone2)

		// make a new group 
		let group: GroupNode = figma.group([clone2], data.curve.parent)
		group.name = "Linked Path Group"
		figma.currentPage.selection = [group]

		// link custom data
		helper.setLink(group,data)
		data.curve.setPluginData("linkedID",group.id)
		data.other.setPluginData("linkedID",group.id)

		await main(group, data)
		group.setRelaunchData({ relaunch: 'Edit with To Path' })
		firstRender = false

	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.

	// what if i dont wanna lmao
})


//watches for selecition change and notifies UI
figma.on('selectionchange', () => {
	SelectionNodes = selection.onChange()
	if (!firstRender) firstRender = true;
})

figma.on('close', () => {
	selection.setPluginClose(true);
})


// run things initially

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 280, height: 480 })

//checks for initial Selection
SelectionNodes = selection.onChange()

// run timerwatch when plugin starts
selection.timerWatch();








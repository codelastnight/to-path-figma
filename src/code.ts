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
import * as Select from './ts/selection'
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';

let firstRender: boolean = true;

let selection: readonly SceneNode[] = [];

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
	let vectors = data.curve.vectorPaths[0].data
	const pointArr: Array<Point> = Curve.allPoints(data.curve.vectorPaths[0].data, data.setting)	

	if (data.other.type === 'TEXT') {
		//the font loading part
		if (firstRender) {
			for (let i = 0; i < data.other.characters.length; i++) {
				await figma.loadFontAsync(data.other.getRangeFontName(i,i + 1) as FontName)
			}
			if (data.other.hasMissingFont) {
				figma.closePlugin('Text contains a missing font, please install the font first!')
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
						if (textnode[i].hasMissingFont) {
							figma.closePlugin('Text contains a missing font, please install the font first!')
						}
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

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 280, height: 480 })

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.on('message', async msg => {
	
	if (msg.type === 'do-the-thing') {
		let group:GroupNode

		const groupId = selection[0].getPluginData("linkedID")
		console.log(groupId)
		if (groupId != "") {
			group = figma.getNodeById(groupId) as GroupNode
		} else {
			group = selection.find(i => i.type === "GROUP") as GroupNode
		}
		 
		var data: LinkedData = Helper.isLinked(group)
		if (data != null) {
			data.setting = msg.options
			await main(group, data)
			group.setRelaunchData({ relaunch: 'Edit with To Path' })
			firstRender = false 
		}
		else {
			Select.send('linklost')
		}
	
	}
	 
	// run when "link" button is hit
	if (msg.type === 'initial-link') {
		const data: LinkedData = Select.decide(selection, msg.options)

		//rename paths
		data.other.name = "[Linked] " + data.other.name.replace("[Linked] ", '')
		data.curve.name = "[Linked] " + data.curve.name.replace('[Linked] ', '')
		//clone curve selection to retain curve shape
		const clone2: SceneNode = data.curve
		data.curveCloneID = clone2.id
		data.curve.parent.appendChild(clone2)

		// make a new group 
		let group: GroupNode = figma.group([clone2], data.curve.parent)
		group.name = "Linked Path Group"
		figma.currentPage.selection = [group]

		// link custom data
		Helper.setLink(group,data)
		data.other.setPluginData("linkedID",group.id)

		await main(group, data)
		group.setRelaunchData({ relaunch: 'Edit with To Path' })
		firstRender = false

	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.

	// what if i dont wanna lmao. default generated tutorial headass
})



//checks for initial selection
selection = Select.onChange()

//watches for selecition change and notifies UI
figma.on('selectionchange', () => {
	selection = Select.onChange()
	if (!firstRender) firstRender = true;
})
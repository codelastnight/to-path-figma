/* 
	source code for text 2 curve for figma
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma

	disclaimer:
    i dont know how to code
*/
import * as Curve from './ts/curve'
import * as Place from './ts/place'
import { isNullOrUndefined } from 'util'

// main code
//async required because figma api requires you to load fonts into the plugin to use them... honestly im really tempted to just hardcode a dumb font like swanky and moo moo instead
async function main(options): Promise<string | undefined> {
	const selection = figma.currentPage.selection
	let curve: VectorNode
	let clone: EllipseNode
	// select the curve
	selection.filter(n => {
		
		if (n.type === 'VECTOR' || n.type === 'ELLIPSE') {
			if (n.type == 'ELLIPSE') {
			    clone = n.clone()
				
				curve = figma.flatten([clone])
			} else {
				curve = n
			}
			
		}
	})
	// take the svg data of the curve and turn it into an array of points
	curve.rotation = 0
	const pointArr: Array<Point> = Curve.allPoints(curve.vectorPaths[0].data, 300)
	if (!isNullOrUndefined(clone)) clone.remove()
	//clearInterval(watch)
	for (const node of figma.currentPage.selection) {
		// if (node.type == 'VECTOR' || node.type == 'ELLIPSE') {
		// 	let node2: VectorNode


			
		// }
		if (node.type === 'TEXT') {
			//the font loading part

			let len = node.characters.length

			for (let i = 0; i < len; i++) {
				await figma.loadFontAsync(node.getRangeFontName(i, i + 1) as FontName)
			}

			if (
				node.width > pointArr[pointArr.length - 1].totalDist ||
				figma.hasMissingFont == true
			) {
				figma.closePlugin(
					'text path is too long!  please make it shorter than the curve!'
				)
			}
			//place it on the thing
			Place.text2Curve(node, pointArr, curve, options)
			
			
		} else {

			if (node.type === 'FRAME' || node.type === 'GROUP') figma.closePlugin(" frame and group cloning not supported yet")

			if (node != curve && node != clone) Place.object2Curve(node, pointArr, curve, options)

		}
		// group and scroll intoview

		const group: FrameNode = figma.group(figma.currentPage.selection, node.parent)
		figma.currentPage.selection = [group]
		figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
	}
	figma.closePlugin()
	return
}	

function calcCurves(
	vectors: Array<Array<Point>>,
	vectorLengths = null,
	x = null,
	y = null
) {
	// let pointArr: Array<Point> = []
	// for (var curve in vectors) {
	// 	pointArr.push(...Curve.pointOnCurve(vectors[curve], 100, true))
	// }
	// const newNodes: SceneNode[] = []
	// for (var b = 0; b < pointArr.length; b++) {
	// 	if (isNaN(pointArr[b].x)) {
	// 	} else {
	// 		const test = figma.createRectangle()
	// 		test.resizeWithoutConstraints(0.1, 0.4)
	// 		test.y = pointArr[b].y
	// 		test.x = pointArr[b].x
	// 		test.rotation = pointArr[b].angle
	// 		figma.currentPage.appendChild(test)
	// 		newNodes.push(test)
	// 	}
	// }
	// figma.flatten(newNodes)
	// console.log(pointArr)
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 300, height: 450 })

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async msg => {
	if (msg.type === 'do-the-thing') {
		let options: Formb  = {...msg.options, rotCheck: msg.rotCheck}
		main(options)

	}
	if (msg.type === 'cancel') {
		figma.closePlugin('k')
	}
	if (msg.type === 'svg') {
		console.log(msg.vectorLengths)
		calcCurves(msg.vectors, msg.vectorLengths, msg.x, msg.y)
		figma.closePlugin()
	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.

	// what if i dont wanna lmao. default generated tutorial headass
}

//watches for updates on selection
// uses polling cuz i couldnt figure out another way
let selected = ''
//update ui only when selection is updated
var sendSelection = function(value: string) {
	if (selected != value) {
		figma.ui.postMessage({ type: 'selection', value })
		selected = value
	}
}
const watchSelection = function() {
	const selection = figma.currentPage.selection
	// oh my fuckin god case handling is torture
	// check if theres anything selected
	switch (selection.length) {
		case 2:
			//check if a curve is selected
			if (
				selection.filter(node => node.type === 'VECTOR').length > 0 ||
				selection.filter(node => node.type === 'ELLIPSE').length > 0
			) {
				// if its a text or somethin else
				if (selection.filter(node => node.type === 'TEXT').length == 1) {
					sendSelection('text')
				} else {
					sendSelection('clone')
				}
			} else {
				sendSelection('nocurve')
			}
			break
		case 1:
			sendSelection('one')
			break

		case 0:
			sendSelection('nothing')
			break

		default:
			sendSelection('toomany')
	}
}

var watch = setInterval(watchSelection, 600)

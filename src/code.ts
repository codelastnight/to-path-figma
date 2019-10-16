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

var selectCurve = function(selection) {
	let curve: VectorNode
	let n
	let other
	let svgdata = null
	const filterselect = selection.filter(
		n => n.type === 'VECTOR' || n.type === 'ELLIPSE'
	)

	// if two curves are selected, select one with bigger x or y

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
		n = filterselect[0]
		other = selection.filter(
			n => n.type !== 'VECTOR' || n.type !== 'ELLIPSE'
		)[0]
	}

	if (n.type == 'ELLIPSE') {
		const clone = n.clone()

		curve = figma.flatten([clone])
		const curve2 = { ...curve }

		svgdata = curve2.vectorPaths[0].data

		clone.remove()
	} else {
		curve = n
		svgdata = curve.vectorPaths[0].data
	}
	console.log(curve, other)
	return { data: svgdata, curve: curve, other: other }
}
// main code
//async required because figma api requires you to load fonts into the plugin to use them... honestly im really tempted to just hardcode a dumb font like swanky and moo moo instead
async function main(options): Promise<string | undefined> {
	const selection = figma.currentPage.selection

	// select the curve
	let curve = selectCurve(selection)

	// take the svg data of the curve and turn it into an array of points
	const pointArr: Array<Point> = Curve.allPoints(curve.data, 300)
	//clearInterval(watch)

	// if (node.type == 'VECTOR' || node.type == 'ELLIPSE') {
	// 	let node2: VectorNode

	// }
	if (curve.other.type === 'TEXT') {
		//the font loading part

		let len = curve.other.characters.length

		for (let i = 0; i < len; i++) {
			await figma.loadFontAsync(curve.other.getRangeFontName(
				i,
				i + 1
			) as FontName)
		}

		if (
			curve.other.width > pointArr[pointArr.length - 1].totalDist ||
			figma.hasMissingFont == true
		) {
			figma.closePlugin(
				'text path is too long!  please make it shorter than the curve!'
			)
		}
		//place it on the thing
		Place.text2Curve(curve.other, pointArr, curve.curve, options)
	} else {
		if (curve.other.type === 'FRAME' || curve.other.type === 'GROUP') {
			const textnode = curve.other.findAll(e => e.type === 'TEXT') as TextNode[]

			for (const find of textnode) {
				for (let i = 0; i < find.characters.length; i++) {
					await figma.loadFontAsync(find.getRangeFontName(i, i + 1) as FontName)
				}
			}
		}
		Place.object2Curve(curve.other, pointArr, curve.curve, options)
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
		let options: Formb = { ...msg.options, rotCheck: msg.rotCheck }
		console.log(options)
		main(options)
	}
	if (msg.type === 'cancel') {
		figma.closePlugin('k')
	}
	if (msg.type === 'svg') {
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
var sendSelection = function(value: string, selection = null, width = 0) {
	if (selected != value) {
		if (!isNullOrUndefined(selection)) {
			const curve = selectCurve(selection)
			const width = curve.other.width
		}

		figma.ui.postMessage({ type: 'selection', value, selection, width })
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
					sendSelection('clone', selection)
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

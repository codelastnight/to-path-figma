//turn svg code junk in to 2 dimentional array of 2, 3, 4 points
var svg2Arr = function(svgData: string) {
	return
}

//distance between points a and b
var distBtwn = function(a: Array<number>, b: Array<number>) {
	/*
  a: [x1,y1]
  b: [x2,y2]
  */
	return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)
}

//find point between two points a and b over time
// in this case time is pixels
var pointBtwn = function(a: Array<number>, b: Array<number>, t: number) {
	/*
  a: [x1,y1]
  b: [x2,y2]
  time: number
  rotation: also return rotation if true
  */

	//find distance between
	const dist = distBtwn(a, b)
	//find the unit vector between points a and b
	const unitVector = [(a[0] - b[0]) / dist, (a[1] - b[1]) / dist]

	return [unitVector[0] * t, unitVector[1] * t]
}

//calculate De Casteljau’s algorithm from 2-4 points
// basically turns 4 points on a beizer into a curve

function pointOnCurve(curve) {
	/*
  curve [point1, point2, point3, point4]
     - each point: [x,y]
  */

	var casteljau = function(
		curve,
		t: number,
		time: number,
		rotation: boolean = false
	) {
		let arr = []

		for (var c = 0; c < curve.length - 1; c++) {
			const dist = distBtwn(curve[c], curve[c + 1])

			let point = pointBtwn(curve[c], curve[c + 1], (t * dist) / time)

			if (rotation) {
				const angle = Math.cos(distBtwn(curve[c], curve[c + 1]) / t)
				point.push(angle)
			}
			arr.push(point)
		}
		return arr
	}

	const time = 100
	for (var t = 0; t < time; t++) {
		let arr1 = casteljau(curve, t, time)
		let arr2 = casteljau(arr1, t, time)
		let arr3 = casteljau(arr2, t, time, true)
	}

	return
}

//convert text into indivisual characters
function text2Curve(node) {
	//convert text into each letter indivusally
	const newNodes: SceneNode[] = []
	const charArr = [...node.characters]

	let spacing = 0

	for (let i = 0; i < node.characters.length; i++) {
		const letter = figma.createText()
		letter.characters = charArr[i]

		// center the letters
		letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'

		//copy settings
		letter.fontSize = node.fontSize
		letter.fontName = node.fontName

		//set locations
		letter.x = node.x + spacing
		letter.y = node.y + node.height + 3

		//spaceing them
		spacing = spacing + letter.width
		//rotate

		//append that shit
		figma.currentPage.appendChild(letter)
		newNodes.push(letter)
	}
	figma.currentPage.selection = newNodes
	figma.viewport.scrollAndZoomIntoView(newNodes)
	return
}

// main code
//async required because figma api requires you to load fonts into the plugin to use them
async function main(): Promise<string | undefined> {
	let selection = figma.currentPage.selection
	if (selection.length == 0) {
		figma.closePlugin('nothings selected dumbass')
		return
	}
	// if ( selection.length > 2 || selection.length < 2) {
	//   figma.closePlugin("you need TWO things selected can you read?");
	//   //return;
	// }
	else {
	}
	for (const node of figma.currentPage.selection) {
		if (node.type == 'VECTOR') {
			console.log(node.vectorNetwork)
			console.log(node.vectorPaths)
		}
		if (node.type == 'TEXT') {
			//the font loading part
			await figma.loadFontAsync({
				family: node.fontName['family'],
				style: node.fontName['style']
			})
			text2Curve(node)
		}
	}
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__)

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
	if (msg.type === 'do-the-thing') {
		main()
	}

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	figma.closePlugin()
}

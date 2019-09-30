/* 
	source code for text 2 curve for figma
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/text2path-figma
*/

//splits array into chunks
// got this code from https://medium.com/@Dragonza/four-ways-to-chunk-an-array-e19c889eac4
// author: Ngoc Vuong https://dragonza.io
var arrChunk = function(array, size) {
	const chunked = []
	for (let i = 0; i < array.length; i++) {
		const last = chunked[chunked.length - 1]
		if (!last || last.length === size) {
			chunked.push([array[i]])
		} else {
			last.push(array[i])
		}
	}
	return chunked
}

//turn whatever the fuck svg code is into array of points grouped into 4 or 2 ( this is dependant on what type of bezier curve it is. look it up)
// figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.

var svg2Arr = function(svgData: string) {
	/*
	svgData: the fucking shitty svg path data fuck 
	i want it to end up like: [[point1,2,3,4],[4,5],[5,6,7,8]....]
	i fucking hate this shit
	*/

	let test = svgData.split('M') //split if more then 1 section and gets rid of the extra array value at front
	test.shift()
	if (test.length > 1) {
		// throw error if theres too many lines becasue im lazy
		throw 'TOO MANY LINES!!!1111 this only supports one continous vector'
		return
	}

	let cleanType = []
	var poo = test[0].trim().split(/ L|C /) // splits string into the chunks of different lines
	var splicein = []

	for (var e in poo) {
		//magic
		var sad = arrChunk(poo[e].trim().split(' '), 2)

		//this adds the last point from the previous array into the next one.
		sad.unshift(splicein)
		splicein = sad[sad.length - 1]
		cleanType.push(sad)
	}
	cleanType.shift() // get rid of the extra array value

	return cleanType
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
	// not really unit vector in the math sense tho
	const unitVector = [(b[0] - a[0]) / dist, (b[1] - a[1]) / dist]

	return [a[0] + unitVector[0] * t, a[1] + unitVector[1] * t]
}
// use the builtin function getTotalLength() to calculate this
var curveDist = function(curve) {
	//create an html svg element becasue the builtin function only works on svg files
	//logic from this dude: http://xahlee.info/js/js_scritping_svg_basics.html

	const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
}
//calculate De Casteljau’s algorithm from 2-4 points  https://javascript.info/bezier-curve
// basically turns 4 points on a beizer into a curve
function pointOnCurve(curve, time: number = 100, rotation: boolean = false) {
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
				//figma wants this number to be in degrees becasue fuck you i guess
				const angle = Math.acos(t / dist) * (180 / Math.PI)
				point.push(angle)
			}

			arr.push(point)
		}
		return arr
	}

	let finalarr = []

	for (var t = 0; t < time; t++) {
		// the unreadable code below is just this:
		//could i use recursive for this? yea. am i gonna? no that sounds like work
		// let arr1 = casteljau(curve, t, time)
		// let arr2 = casteljau(arr1, t, time)
		// let arr3 = casteljau(arr2, t, time, rotation)

		let arr3 = casteljau(
			casteljau(casteljau(curve, t, time), t, time),
			t,
			time,
			rotation
		)
		finalarr.push(arr3)
	}

	return finalarr
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
//honestly im really tempted to just hardcode roboto instead
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

			for (var curve in svg2Arr(node.vectorPaths[0].data)) {
			}
			//testdatas
			const testdata = [
				[1.388586401939392, 21.729154586791992],
				[-4.074989438056946, 2.2291507720947266],
				[6.92498779296875, -3.775749444961548],
				[28.388591766357422, 2.2291524410247803]
			]
			var a = pointOnCurve(testdata)
			console.log(a)
			console.log(a.length)
			const newNodes: SceneNode[] = []
			// for (var b =0;b < a.length;b++) {

			// 	if (isNaN(a[b][0][0])) {

			// 	} else {

			// 	const test = figma.createRectangle();
			// 	test.resize(1,1);
			// 	test.y=a[b][0][0]
			// 	test.x=a[b][0][1]
			// 	test.rotation=a[b][0][2]
			// 	figma.currentPage.appendChild(test)
			// 	newNodes.push(test)

			// 	}

			// }
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
	figma.closePlugin()
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
	if (msg.type === 'cancel') {
		figma.closePlugin('k')
	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.

	// what if i dont wanna lmao. default generated tutorial headass
}

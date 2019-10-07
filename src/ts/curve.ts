/* 
	code for all the curve handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

//turn whatever the fuck svg code is into array of points grouped into 4 or 2 ( this is dependant on what type of bezier curve it is. look it up)
// figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
import * as Extra from './extra'
export var svg2Arr = function(svgData: string) {
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
		var sad = Extra.arrChunk(poo[e].trim().split(' '), 2)

		//this adds the last point from the previous array into the next one.
		sad.unshift(splicein)
		splicein = sad[sad.length - 1]
		cleanType.push(sad)
	}
	cleanType.shift() // get rid of the extra empty array value

	return cleanType
}

//distance between points a and b
var distBtwn = function(a: Array<number>, b: Array<number>) {
	/*
  a: [x1,y1]
  b: [x2,y2]
  */
	for (var c in a) {
		a[c] = Number(a[c])
		b[c] = Number(b[c])
	}
	return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)
}

//find point between two points a and b over time
// in this case time is pixels
var pointBtwn = function(
	a: Array<number>,
	b: Array<number>,
	t: number,
	time: number
) {
	/*
  a: [x1,y1]
  b: [x2,y2]
  time: number
  rotation: also return rotation if true
  */
	for (var c in a) {
		a[c] = Number(a[c])
		b[c] = Number(b[c])
	}

	//find the unit  vector between points a and b
	// not really unit vector in the math sense tho
	const unitVector = [(b[0] - a[0]) / time, (b[1] - a[1]) / time]

	return [a[0] + unitVector[0] * t, a[1] + unitVector[1] * t]
}
var casteljau = function(
	curve,
	t: number,
	time: number,
	rotation: boolean = false,
	lastrot = 0
) {
	let arr = []

	for (var c = 0; c < curve.length - 1; c++) {
		const dist = distBtwn(curve[c], curve[c + 1])

		let point = pointBtwn(curve[c], curve[c + 1], t, time)

		arr.push(point)

		if (rotation) {
			//figma wants this number to be in degrees becasue fuck you i guess

			let angle =
				Math.atan(
					(curve[c + 1][0] - curve[c][0]) / (curve[c + 1][1] - curve[c][1])
				) *
				(180 / Math.PI)

			angle = 90 + angle
			if (curve[c + 1][1] - curve[c][1] < 0) {
				angle = 180 + angle
			}
			point.push(angle)
		}
	}
	return arr
}

//calculate De Casteljau’s algorithm from 2-4 points  https://javascript.info/bezier-curve
// basically turns 4 points on a beizer into a curve
export var pointOnCurve = function(
	curve,
	time: number = 100,
	rotation: boolean = false
) {
	/*
  curve [point1, point2, point3, point4]
     - each point: [x,y]
  */

	let finalarr = []

	if (curve.length == 2) {
		for (var t = 1; t < time; t++) {
			if (finalarr.length != 0) {
				var lastrot = finalarr[finalarr.length - 1][2]
			}
			let arr1 = casteljau(curve, t, time, rotation, lastrot)
			finalarr.push(arr1)
		}
	} else {
		for (var t = 1; t <= time; t++) {
			if (finalarr.length != 0) {
				var lastrot = finalarr[finalarr.length - 1][2]
			}
			let arr1 = casteljau(curve, t, time)
			let arr2 = casteljau(arr1, t, time)
			let arr3 = casteljau(arr2, t, time, rotation, lastrot)
			//could i use recursive? yea. am i gonna? no that sounds like work

			// let arr1 = casteljau(
			// 	casteljau(casteljau(curve, t, time), t, time),
			// 	t,
			// 	time,
			// 	rotation
			// )
			finalarr.push(arr3)
		}
	}

	return finalarr
}

/* 
	helper functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

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
	cleanType.shift() // get rid of the extra empty array value

	return cleanType
}
//cleans and typeifies the point data
export var svg2Point = function(svgData: string) {
	const cleanArray = svg2Arr(svgData)
	for (var each in cleanArray) {
		for (var i in cleanArray[each]) {
			const newpoint: Point = {
				x: cleanArray[each][i][0],
				y: cleanArray[each][i][1]
			}
			cleanArray[each][i] = newpoint
		}
	}
	return cleanArray
}

//distance between points a and b
export var distBtwn = function(a: Point, b: Point) {
	/*
  a: [x1,y1]
  b: [x2,y2]
  */
	// for (var c in a) {
	// 	a[c] = Number(a[c])
	// 	b[c] = Number(b[c])
	// }
	return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}

//find point between two points a and b over time
// in this case time is pixels
export var pointBtwn = function(a: Point, b: Point, t: number, time: number) {
	/*
  a: [x1,y1]
  b: [x2,y2]
  time: number
  rotation: also return rotation if true
  */

	a.x = Number(a.x)
	a.y = Number(a.y)
	b.x = Number(b.x)
	b.y = Number(b.y)
	//find the unit  vector between points a and b
	// not really unit vector in the math sense tho
	const unitVector: Point = { x: (b.x - a.x) / time, y: (b.y - a.y) / time }
	const pointbtwn: Point = {
		x: a.x + unitVector.x * t,
		y: a.y + unitVector.y * t
	}

	return pointbtwn
}

//find point between two points a and b over distance
export var pointBtwnByLength = function(
	a: Point,
	b: Point,
	dist: number,
	totalDist: number, // length between the two known points
	angle: number
) {
	// finds the x value of a point between two points given the magnitude of that point
	const t: number = Math.cos((angle * Math.PI) / 180) * dist
	const bruh = pointBtwn(a, b, t, totalDist)
	bruh.angle = angle;
	return bruh
}

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

//matrix manipulation code taken from https://github.com/figma/plugin-samples/blob/master/circletext/code.ts
//author: Jonathan Chan https://github.com/jyc http://jyc.eqv.io
// the biggest thanks I am mathmatically challenged

//multiply matrixes together
export var multiply = function(a, b) {
	return [
		[
			a[0][0] * b[0][0] + a[0][1] * b[1][0],
			a[0][0] * b[0][1] + a[0][1] * b[1][1],
			a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]
		],
		[
			a[1][0] * b[0][0] + a[1][1] * b[1][0],
			a[1][0] * b[0][1] + a[1][1] * b[1][1] + 0,
			a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]
		]
	] as [[number, number, number], [number, number, number]]
}

// Creates a "move" transform.
export var move = function(x, y) {
	return [[1, 0, x], [0, 1, y]] as [
		[number, number, number],
		[number, number, number]
	]
}

// Creates a "rotate" transform.
export var rotate = function(theta) {
	return [
		[Math.cos(theta), Math.sin(theta), 0],
		[-Math.sin(theta), Math.cos(theta), 0]
	] as [[number, number, number], [number, number, number]]
}

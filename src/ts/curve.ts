/* 
	code for all the curve handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/
import * as Extra from './extra'

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
		var sad = Extra.arrChunk(poo[e].trim().split(' '), 2)

		//this adds the last point from the previous array into the next one.
		sad.unshift(splicein)
		splicein = sad[sad.length - 1]
		cleanType.push(sad)
	}
	cleanType.shift() // get rid of the extra empty array value

	return cleanType
}
//cleans and typeifies the point data
var svg2Point = function(svgData: string) {
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
var distBtwn = function(a: Point, b: Point) {
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
var pointBtwn = function(a: Point, b: Point, t: number, time: number) {
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
export var pointBtwnByLength = function(
	a: Point,
	b: Point,
	dist: number,
	totalDist: number, // length between the two known poiints
	angle: number
) {
	// finds the x value of a point between two points given the magnitude of that point
	const t: number = Math.cos((angle * Math.PI) / 180) * dist
	const bruh = pointBtwn(a, b, t, totalDist)

	return bruh
}
var casteljau = function(
	curve: Array<Point>,
	t: number,
	time: number,
	rotation: boolean = false
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
					(curve[c + 1].x - curve[c].x) / (curve[c + 1].y - curve[c].y)
				) *
				(180 / Math.PI)

			angle = 90 + angle
			if (curve[c + 1].y - curve[c].y < 0) {
				angle = 180 + angle
			}
			point.angle = angle
		}
	}
	return arr
}

//calculate De Casteljau’s algorithm from 2-4 points  https://javascript.info/bezier-curve
// basically turns 4 points on a beizer into a curve
var pointOnCurve = function(
	curve: Array<Point>,
	time: number = 100,
	rotation: boolean = false,
	totalDist: number
) {
	/*
  curve [point1, point2, point3, point4]
     - each point: [x,y]
  */

	let finalarr = []

	if (curve.length == 2) {
		for (var t = 1; t < time; t++) {
			let arr1 = casteljau(curve, t, time, rotation)
			finalarr.push(arr1)
		}
	} else {
		for (var t = 1; t <= time; t++) {
			// let arr1 = casteljau(curve, t, time)
			// let arr2 = casteljau(arr1, t, time)
			// let arr3 = casteljau(arr2, t, time, rotation, )
			//could i use recursive? yea. am i gonna? no that sounds like work

			let arr1 = casteljau(
				casteljau(casteljau(curve, t, time), t, time),
				t,
				time,
				rotation
			)
			// get rid of the extra bracket
			let pointdata = arr1[0]
			// calculate the distance between entirepoints to estimate the distance at that specific point
			if (finalarr.length > 0) {
				const addDist = distBtwn(finalarr[finalarr.length - 1], pointdata)

				pointdata.dist = addDist
				pointdata.totalDist = addDist + finalarr[finalarr.length - 1].totalDist
				totalDist = pointdata.totalDist
			} else {
				pointdata.dist = 0
				pointdata.totalDist = totalDist
			}

			finalarr.push(pointdata)
		}
	}

	return finalarr
}

// calculate point data for all curves
export var allPoints = function(
	svgData: string,
	resolution: number = 100,
	rotation: boolean = true
) {
	let pointArr: Array<Point> = []
	let vectors = svg2Point(svgData)
	let totalDist = 0

	for (var curve in vectors) {
		pointArr.push(
			...pointOnCurve(vectors[curve], resolution, rotation, totalDist)
		)
		totalDist = pointArr[pointArr.length - 1].totalDist
	}
	return pointArr
}

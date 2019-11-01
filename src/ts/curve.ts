/* 
	code for all the curve handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/
import { distBtwn, pointBtwn, svg2Point } from './helper'



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

//calculate De Casteljau’s algorithm from 2 or 4 points  https://javascript.info/bezier-curve
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
		for (var t = 0; t < time; t++) {
			let arr1 = casteljau(curve, t, time, rotation)
			let pointdata = arr1[0]

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
	} else {
		for (var t = 0; t < time; t++) {
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

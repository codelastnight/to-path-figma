/* 
	helper functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

//plugin data key name
const keyName: string = "pathData";


/**
 * get data from an object
 * @param group the group object to look into
 */
const getLink = (group: GroupNode ) => {
	// get data from plugin
	var getData: string =  group.getSharedPluginData("topathfigma",keyName)
	var outData: LinkedData = JSON.parse(getData)

	// only id's are stored, becasue its a shallow copy. 
	// get data from linked objects
	outData.curve = figma.getNodeById(outData.curve.id) as VectorNode
	outData.other  = figma.getNodeById(outData.other.id) as SceneNode
	if (outData.curve == null || outData.other == null) return null
	return outData
}

/**
 * check if a group object is in linked state
 * @param group the group object to check
 */
export const isLinked =  (group: GroupNode) => {
	var data: LinkedData
	try {
		data =  getLink(group)
	} catch {
		return null
	}
	return data;
	
}

/**
 * set the link data into the group object
 * @param group target group object
 * @param data data to set into object
 */
export var setLink = (group: GroupNode, data: LinkedData) => {
	group.setSharedPluginData(data.namespace,keyName,JSON.stringify(data))
}

/**
 * turn whatever the fuck svg code is into array of points grouped into 4 or 2 ( this is dependant on what type of bezier curve it is. look it up)
 *  * note: figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
 * @param svgData svg path data bruh moment
 * @returns array of array of points, eg [[point1,2,3,4],[4,5],[5,6,7,8]....]
 */
export const parseSVG = (svgData: string): Point[][] => {
	/*
		i fucking hate this shit
	*/
	const test = svgData.split('M') //split if more then 1 section and gets rid of the extra array value at front
	test.shift()

	if (test.length > 1) {
		// throw error if theres too many lines becasue im lazy
		throw 'TOO MANY LINES! this plugin only supports one continous vector'
	}
	//let cleanType: Point[][] = []
	const bezierChunks = test[0].trim().split(/ L|C /) // splits string into the chunks of different lines
	let splicein: string[] = []
	let cleanType: Point[][] = bezierChunks.map(e => {
		//split each string in the chunk into points
		const splitPoints = arrChunk(e.trim().split(' '), 2)

		//this adds the last point from the previous array into the next one.
		splitPoints.unshift(splicein)
		splicein = splitPoints[splitPoints.length - 1]
		const typedPoints: Point[] = splitPoints.map((point: string[]) => {
			return {
				x: Number(point[0]),
				y: Number(point[1])
			}
		})
		return typedPoints
	})
	cleanType.shift() // get rid of the extra empty array value

	return cleanType
}

/**
 * cleans and typifies data, probably should depreciate this into the above function
 * @param svgData svg path string
 */
// export const parseSVG_old = (svgData: string): Point[][] => {
// 	const cleanArray = svg2Arr(svgData)
// 	for (var each in cleanArray) {
// 		for (var i in cleanArray[each]) {
// 			const newpoint: Point = {
// 				x: cleanArray[each][i][0],
// 				y: cleanArray[each][i][1]
// 			}
// 			cleanArray[each][i] = newpoint
// 		}
// 	}
// 	return cleanArray
// }

/**
 * distance between points a and b
 * @param a first point
 * @param b second point
 */
export const distBtwn = (a: Point, b: Point): number => { 
	return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) 
}


/**
 * find point between two points a and b over time
 * *in this case time is pixels
 * @param a point a
 * @param b point b
 * @param t current time
 * @param time total time
 */
export const pointBtwn = (a: Point, b: Point, t: number, time: number) => {

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

//
/**
 * find point between two points a and b over distance
 * @param a 
 * @param b 
 * @param dist 
 * @param totalDist 
 * @param angle 
 */
export var pointBtwnByLength = (
	a: Point,
	b: Point,
	dist: number,
	totalDist: number, // length between the two known points
	angle: number
) =>
 	{
	// finds the x value of a point between two points given the magnitude of that point
	const t: number = Math.cos((angle * Math.PI) / 180) * dist
	const newPoint = pointBtwn(a, b, t, totalDist)
	newPoint.angle = angle;
	return newPoint
}

// 
/**
 * splits array into chunks.
 *  I got this code from https://medium.com/@Dragonza/four-ways-to-chunk-an-array-e19c889eac4
 *  author: Ngoc Vuong https://dragonza.io
 * 
 * @param array input array
 * @param size  size of each chunk
 */
const arrChunk = (array, size) => {
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

/**
 * multiply matrixes together
 * @param a 
 * @param b 
 */
export const multiply = (a, b) => {
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

/**
 * create a move transform
 * @param x 
 * @param y 
 */
export const move = (x, y) => {
	return [[1, 0, x], [0, 1, y]] as [
		[number, number, number],
		[number, number, number]
	]
}

/**
 * Creates a "rotate" transform.
 * @param theta 
 */
export const rotate = (theta) => {
	return [
		[Math.cos(theta), Math.sin(theta), 0],
		[-Math.sin(theta), Math.cos(theta), 0]
	] as [[number, number, number], [number, number, number]]
}

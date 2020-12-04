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
const getLink = (group: GroupNode, updateOtherId  = "", key = keyName) => {
	// get data from plugin
	var getData: string =  group.getSharedPluginData("topathfigma",key)
	let outData: LinkedData = JSON.parse(getData)

	// handle edge case where object changes type, in which case id updates
	// why figma why
	let otherId  = outData.other.id
	if (updateOtherId && updateOtherId != outData.other.id) {
		otherId = updateOtherId
	}
	// only id's are stored, becasue its a shallow copy. 
	// get data from linked objects
	
	outData.curve = figma.getNodeById(outData.curve.id) as VectorNode
	outData.other  = figma.getNodeById(otherId) as SceneNode
	setLink(group,outData)

	if (outData.curve == null || outData.other == null) return null
	return outData
}

/**
 * check if a group object is in linked state
 * @param group the group object to check
 */
export const isLinked =  (group: GroupNode,  updateOtherId  = "") => {
	try {
		var data: LinkedData =  getLink(group, updateOtherId)

		return data

	} catch  {
		return null
	}
	
}

/**
 * set the link data into the group object
 * @param group target group object
 * @param data data to set into object
 */
export var setLink = ( group: GroupNode, data: LinkedData, key = keyName) => {
	group.setSharedPluginData(data.namespace,key,JSON.stringify(data))
}

/**
 * turn whatever svg code is into array of points grouped into 4 or 2 ( this is dependant on what type of bezier curve it is. look it up)
 *  * note: figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
 * @param svgData svg path data bruh moment
 * @returns array of array of points, eg [[point1,2,3,4],[4,5],[5,6,7,8]....]
 */
export const parseSVG = (svgData: string): Point[][] => {

	const test = svgData.replace('Z', '').split('M') //split if more then 1 section and gets rid of the extra array value at front
	test.shift()
	// throw error if theres too many lines becasue im lazy
	if (test.length > 1) throw 'TOO MANY LINES! this plugin only supports one continous vector'
	
	const bezierChunks = test[0].trim().split(/ L|C /) // splits string into the chunks of different lines
	// the point to splice into the next curve
	let splicein: string[] = []

	// the output group of curves (which is a group of points)
	// imma be honest i dont know how i made this work its magic 
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
export const pointBtwn = (a: Point, b: Point, t: number, time: number): Point => {

	//find the unit  vector between points a and b
	// not really unit vector in the math sense tho
	//const unitVector: Point = { x: , y: (} 
	return  {
		x: a.x + ((b.x - a.x) / time) * t,
		y: a.y + ((b.y - a.y) / time ) * t
	}
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

/**
 * deep copy but exclude children
 * @param theta 
 */
export const deepCopy = (inObject) => {
	let outObject, value, key

	if (typeof inObject == 'function') {
		return ""
	}
  
	if (typeof inObject !== "object" || inObject === null) {
	  return inObject // Return the value if inObject is not an object
	}
  
	// Create an array or object to hold the values
	outObject = Array.isArray(inObject) ? [] : {}
  
	for (key in inObject) {

	  if (key != "children" && key != "parent") {
		value = inObject[key]
  
		// Recursively (deep) copy for nested objects, including arrays
		outObject[key] = deepCopy(value)
	  } else {
		  value = "" 
	  }

	}
  
	return outObject
}

/**
 * returns the string in title case
 * @param str input text string
 */
export const titleCase = (str): string => {
	
	return str.toLowerCase().split(' ').map(function(word) {
		return word.replace(word[0], word[0].toUpperCase());
	}).join(' ');
}
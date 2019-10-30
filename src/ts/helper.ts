/* 
	misc functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

//splits array into chunks
// got this code from https://medium.com/@Dragonza/four-ways-to-chunk-an-array-e19c889eac4
// author: Ngoc Vuong https://dragonza.io

export var arrChunk = function(array, size) {
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

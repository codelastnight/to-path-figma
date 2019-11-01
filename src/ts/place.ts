/* 
	code for all the text handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import { pointBtwnByLength } from './curve'
import { multiply, move, rotate } from './helper'
// case for handling spaces, becasue figma will auto them as 0 width; character 8197 isnt the best but you kno what... its good enough
// this didn't need to be a function but like i already wrote so
var safeSpace = function(c: string) {
	return c.replace(' ', String.fromCharCode(8197))
}

//groups and puts things into view
var groupView = function(curve: VectorNode, nodes, node) {
	// copy the curve, and select everything

	let clone2: SceneNode = curve.clone()
	nodes.unshift(clone2)
	curve.parent.appendChild(clone2)
	clone2.visible = false
	//figma.currentPage.selection = nodes
	// group and scroll intoview

	const group = [figma.group(nodes, node.parent)]
	//figma.currentPage.selection = group
}
// place the objects on a point, based on user settings.
var place = function(
	object: SceneNode,
	point: Point,
	options: Formb,
	curve: VectorNode
) {
	//set locations

	// find center of object
	const center = {
		x: 0 - (object.type == 'TEXT' ? 0 : object.width * options.horizontalAlign), // no horozonatal align on text, kerning gets fucked up
		y: 0 - object.height * options.verticalAlign
	}
	//angle of object converted to degrees
	let angle = ((point.angle - 180) * Math.PI) / 180

	// zero it
	//spaceing them
	object.relativeTransform = move(center.x, center.y)

	// more code taken from jyc, the god himself https://github.com/jyc http://jyc.eqv.io
	// Rotate the object.
	object.rotation = 0
	if (options.rotCheck) {
		object.relativeTransform = multiply(rotate(angle), object.relativeTransform)
	}
	//move the object

	object.relativeTransform = multiply(
		move(
			point.x + curve.relativeTransform[0][2],
			point.y + curve.relativeTransform[1][2]
		),
		object.relativeTransform
	)
	console.log(object.relativeTransform)
}
//  estimates and returns the point closest to where the object should be, based on horizontal length
var object2Point = function(pointArr: Array<Point>, pass: Pass) {
	//
	let rotation

	let estPoint: Point
	for (pass.pointIndex; pass.pointIndex < pointArr.length; pass.pointIndex++) {
		// find nearest point to the length of the word
		if (pass.spacing <= pointArr[pass.pointIndex + 1].totalDist) {
			let nextpoint = pointArr[pass.pointIndex + 1]

			const localDist = pass.spacing - pointArr[pass.pointIndex].totalDist
			rotation =pointArr[pass.pointIndex].angle

			estPoint = pointBtwnByLength(
				pointArr[pass.pointIndex],
				nextpoint,
				localDist,
				nextpoint.dist,
				rotation
			)

			if (estPoint.x === Infinity) {
			} else {
				break
			}
		} else {
		}
	}
	
	return estPoint
}
//convert text into indivisual characters

export var text2Curve = function(
	node: TextNode,
	pointArr: Array<Point>,
	curve,
	options: Formb
) {
	const newNodes: SceneNode[] = []
	//convert text into each letter indivusally
	node.textAutoResize = 'WIDTH_AND_HEIGHT'

	const charArr = [...node.characters]

	// values needed to pass between each objects
	let pass: Pass = {
		spacing: 0 + options.offset,
		pointIndex: 0
	}

	// disable spacing option in text mode
	options.spacing = 0

	for (let i = 0; i < charArr.length; i++) {
		let letter = node.clone()
		//copy settings

		letter.fontName = node.getRangeFontName(i, i + 1)
		letter.fontSize = node.getRangeFontSize(i, i + 1)
		letter.characters = safeSpace(charArr[i]) + ' '

		letter.letterSpacing = node.getRangeLetterSpacing(i, i + 1)

		// center the letters
		//letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'

		// put the object in the right place
		let point = object2Point(pointArr, pass)

		pass.spacing = pass.spacing + letter.width + options.spacing

		// place the thing
		place(letter, point, options, curve)
		//append that shit
		letter.characters = safeSpace(charArr[i])
		newNodes.push(letter)
		curve.parent.appendChild(letter)
		// kill loop early if the objects are longer then the curve
		// replace later with a better thing
		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			break
		}
	}
	// group things and scroll into view
	groupView(curve, newNodes, node)

	return
}

export var object2Curve = function(
	node: SceneNode,
	pointArr: Array<Point>,
	curve,
	options: Formb
) {
	const newNodes: SceneNode[] = []
	// values needed to pass between each objects
	let pass: Pass = {
		spacing: 0 + options.offset,
		pointIndex: 0
	}
	for (let i = 0; i < options.count; i++) {
		//copy object
		let object
		if (node.type === 'COMPONENT') object = node.createInstance()
		else object = node.clone()

		// find the position where object should go
		let point = object2Point(pointArr, pass)

		pass.spacing = pass.spacing + object.width + options.spacing
		// place the thing
		place(object, point, options, curve)
		//append that shit
		newNodes.push(object)
		curve.parent.appendChild(object)
		// kill loop early if the objects are longer then the curve
		// replace later with a better thing

		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			break
		}
	}

	// if autowidth put object at very last point
	if (!options.isLoop && options.autoWidth) {
		let object
		if (node.type === 'COMPONENT') object = node.createInstance()
		else object = node.clone()

		const point = pointArr[pointArr.length - 1]
		place(object, point, options, curve)
		newNodes.push(object)
		curve.parent.appendChild(object)
	}
	// group things and scroll into view
	groupView(curve, newNodes, node)
	return
}

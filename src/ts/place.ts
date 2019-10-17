/* 
	code for all the text handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import { pointBtwnByLength } from './curve'
import { multiply, move, rotate } from './extra'
import { object } from 'prop-types'
// case for handling spaces, becasue figma will auto them as 0 width; character 8197 isnt the best but you kno what... its good enough
// this didn't need to be a function but like i already wrote so
var safeSpace = function(c: string) {
	return c.replace(' ', String.fromCharCode(8197))
}

//convert text into indivisual characters
var object2Point = function(
	object,
	pointArr: Array<Point>,
	curve,
	options: Formb,
	pass: Pass
) {
	//
	let rotation

	let estPoint: Point
	for (pass.pointIndex; pass.pointIndex < pointArr.length; pass.pointIndex++) {
		// find nearest point to the length of the word

		if (pass.spacing <= pointArr[pass.pointIndex].totalDist) {
			let nextpoint = pointArr[pass.pointIndex + 1]

			const localDist = pass.spacing - pointArr[pass.pointIndex].totalDist
			rotation = nextpoint.angle
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

	const centerX = object.width * options.horizontalAlign
	const centerY = object.height * options.verticalAlign

	//set locations
	//spaceing them
	let angle = ((rotation - 180) * Math.PI) / 180

	object.x = 0
	object.y = 0 - centerY

	if (object.type != 'TEXT') {
		object.x = 0 - centerX
	} // kerning gets fucked up

	pass.spacing = pass.spacing + object.width + options.spacing

	// object.relativeTransform = multiply(
	// 	move(-object.width / 2, -0.5 * object.height),
	// 	object.relativeTransform
	// )

	// more code taken from jyc, the god himself https://github.com/jyc http://jyc.eqv.io
	// Rotate the object.
	object.rotation = 0
	if (options.rotCheck) {
		object.relativeTransform = multiply(rotate(angle), object.relativeTransform)
	}
	//move the object

	object.relativeTransform = multiply(
		move(estPoint.x + curve.x, estPoint.y + curve.y),
		object.relativeTransform
	)
}

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
		spacing: 0,
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
		object2Point(letter, pointArr, curve, options, pass)

		//append that shit
		letter.characters = safeSpace(charArr[i])
		newNodes.push(letter)
		figma.currentPage.appendChild(letter)
		// kill loop early if the objects are longer then the curve
		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			break
		}
	}
	// copy the curve, and select everything

	let clone2: SceneNode = curve.clone()
	newNodes.unshift(clone2)
	clone2.visible = false
	figma.currentPage.selection = newNodes
	// group and scroll intoview

	const group = [figma.group(figma.currentPage.selection, node.parent)]

	figma.currentPage.selection = group

	figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
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
		spacing: node.width / 2,
		pointIndex: 0
	}
	for (let i = 0; i < options.count; i++) {
		let object = node.clone()
		//copy settings
		// put the object in the right place
		object2Point(object, pointArr, curve, options, pass)

		//append that shit
		newNodes.push(object)
		figma.currentPage.appendChild(object)
		// kill loop early if the objects are longer then the curve

		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			break
		}
	}
	// copy the curve, and select everything
	let clone: SceneNode = curve.clone()
	clone.visible = false

	newNodes.unshift(clone)

	figma.currentPage.selection = newNodes
	// group and scroll intoview

	const group = [figma.group(figma.currentPage.selection, node.parent)]

	figma.currentPage.selection = group

	figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)
	// some repeated code that could be shrunken
	return
}

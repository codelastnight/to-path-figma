/* 
	code for all the placing in the figma page
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import { multiply, move, rotate,pointBtwnByLength, titleCase  } from './helper'


/**
 * place the objects on a point, based on user settings.
 * @param object 
 * @param point 
 * @param options 
 * @param curve 
 */
const place = (
	object: SceneNode,
	point: Point,
	options: SettingData,
	curve: VectorNode
) => {
	// if point returns null, just delete
	if (!point) {

		object.remove()
		return
	}
	//set names
	object.name = object.name.replace("[Linked] ", '[Copy] ')
	// find center of object
	const center = {
		x: 0 -  object.width * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
		y: 0 - object.height * options.verticalAlign
	}
	//angle of object converted to degrees
	let angle = ((point.angle - 180) * Math.PI) / 180

	
	// zero it
	//spaceing them
	object.relativeTransform = move(center.x, center.y)

	// more code taken from jyc, the god himself https://github.com/jyc http://jyc.eqv.io
	// Rotate the object.
	//object.rotation = 0
	
	object.relativeTransform = multiply(rotate(angle), object.relativeTransform)
	
	//move the object

	object.relativeTransform = multiply(
		move(
			point.x + curve.relativeTransform[0][2],
			point.y + curve.relativeTransform[1][2]
		),
		object.relativeTransform
	)
}

/**
 * estimates and returns the point closest to where the object should be, based on horizontal length
 * @param pointArr 
 * @param pass 
 */
const object2Point = (pointArr: Array<Point>, pass: Pass): Point => {
	//
	//let rotation

	let estPoint: Point
	for (pass.pointIndex; pass.pointIndex + 1 < pointArr.length; pass.pointIndex++) {
		// find nearest point to the length of the word
		if (pass.spacing <= pointArr[pass.pointIndex + 1].totalDist) {
			let nextpoint = pointArr[pass.pointIndex + 1]
			let angle = pointArr[pass.pointIndex].angle ? pointArr[pass.pointIndex].angle : pass.defaultRot


			estPoint = pointBtwnByLength(
				pointArr[pass.pointIndex],
				nextpoint,
				(pass.spacing - pointArr[pass.pointIndex].totalDist), // the length between the current point and the next point
				nextpoint.dist,
				angle //rotation
			)

			// skip over points with inifinity or NaN
			if (estPoint.x === Infinity || isNaN(estPoint.x)) {
			}
			// stop calculating and return the current point 
			else {
				break
			}
		} 
	}
	
	return estPoint
}

/**
 * convert text into indivisual characters, then put those on a curve
 * @param node 
 * @param pointArr 
 * @param data 
 * @param group 
 */
export const text2Curve = (
	node: TextNode,
	pointArr: Array<Point>,
	data: LinkedData,
	group: GroupNode

) => {
	const newNodes: SceneNode[] = []
	var options: SettingData = data.setting
	//convert text into each letter indivusally
	node.textAutoResize = 'WIDTH_AND_HEIGHT'

	// if title case, then fix the text to fit title case
	const charArr = [...(node.textCase == "TITLE" ? titleCase(node.characters) : node.characters)]
	// values needed to pass between each objects
	let pass: Pass = {
		spacing: 0 + options.offset,
		pointIndex: 0,
		defaultRot: node.rotation + 180
	}
	// disable spacing option in text mode
	options.spacing = 0;
	let prevletter = 0;


	for (let i = 0; i < charArr.length; i++) {
		let letter = node.clone()
		//copy settings
		letter.setPluginData("linkedID", "" )

		letter.fontName = node.getRangeFontName(i, i + 1)
		letter.fontSize = node.getRangeFontSize(i, i + 1)
		letter.characters = safeSpace(charArr[i]) + ' '
		if (node.textCase === "TITLE") letter.textCase = "ORIGINAL";
		letter.letterSpacing = node.getRangeLetterSpacing(i, i + 1)

		// center the letters
		//letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'

		// put the object in the right place

		pass.spacing = pass.spacing + letter.width*options.horizontalAlign + (prevletter*(1-options.horizontalAlign)) + options.spacing
		prevletter = letter.width
		let point = object2Point(pointArr, pass)


		// place the thing
		place(letter, point, options, data.curve)
		//append that shit
		letter.characters = safeSpace(charArr[i])
		newNodes.push(letter)
		group.appendChild(letter)
		// kill loop early if the objects are longer then the curve
		// replace later with a better thing
		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			letter.remove()
			break
		}
	}
	return
}

/**
 * clones the objects x amount of times to curve
 * @param node 
 * @param pointArr 
 * @param data 
 * @param group 
 */
export const object2Curve = (
	node: SceneNode,
	pointArr: Array<Point>,
	data: LinkedData,
	group: GroupNode
) => {
	const newNodes: SceneNode[] = []
	var options: SettingData = data.setting

	// values needed to pass between each objects
	let pass: Pass = {
		spacing: 0 + options.offset,
		pointIndex: 0,
		defaultRot: node.rotation + 180

	}

	for (let i = 0; i < options.count; i++) {
		//copy object
		let object: SceneNode

		node.type === 'COMPONENT' ? object = node.createInstance() :  object = node.clone()

		// find the position where object should go
		let point = object2Point(pointArr, pass)
		pass.spacing = pass.spacing + object.width + options.spacing
		object.setPluginData("linkedID", "" )

		
		// place the thing
		place(object, point, options, data.curve)
		//append that shit
		newNodes.push(object)
		group.appendChild(object)
		// kill loop early if the objects are longer then the curve
		// replace later with a better thing
		if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
			//object.remove()
			break
		}
	}

	// if autowidth put object at very last point
	if (!options.isLoop && options.autoWidth) {
		let object: SceneNode
		node.type === 'COMPONENT' ? object = node.createInstance() :  object = node.clone()
		object.setPluginData("linkedID", "" )


		const point = pointArr[pointArr.length - 1]
		if (!options.rotCheck) {
			point.angle = node.rotation - 180
		}
		place(object, point, options, data.curve)
		newNodes.push(object)
		group.appendChild(object)
	}
	// group things and scroll into view
	return
}

/**
 * remove all nodes in a group besides the curve node
 * @param group group object to look through
 * @param curveID the object id to NOT delete
 */
export const deleteNodeinGroup = (group:GroupNode, curveID: string) => {
	group.children.forEach(i => {if(i.id !== curveID) i.remove()})
}

// this didn't need to be a function but like i already wrote so
/**
 * case for handling spaces, becasue figma will auto them as 0 width; character 8197 isnt the best but you kno what... its good enough
 * @param c input string
 */
const safeSpace = (c: string): string => {
	return c.replace(' ', String.fromCharCode(8197))
}
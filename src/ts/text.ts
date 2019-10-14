/* 
	code for all the text handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import { pointBtwnByLength } from './curve'
import { multiply, move, rotate } from './extra'
// case for handling spaces, becasue figma will auto them as 0 width; character 8197 isnt the best but you kno what... its good enough
// this didn't need to be a function but like i already wrote so
var safeSpace = function(c: string) {
	return c.replace(' ', String.fromCharCode(8197))
}

//convert text into indivisual characters

export function text2Curve(node: TextNode, pointArr: Array<Point>, curve) {
	//convert text into each letter indivusally
	const newNodes: SceneNode[] = []
	const charArr = [...node.characters]
	let spacing = 0
	let pointIndex: number = 0
	let rotation
	for (let i = 0; i < charArr.length; i++) {
		let letter = figma.createText()
		//copy settings

		letter.fontName = node.getRangeFontName(i, i + 1)
		letter.fontSize = node.getRangeFontSize(i, i + 1)
		letter.characters = safeSpace(charArr[i] + ' ')

		letter.letterSpacing = node.getRangeLetterSpacing(i, i + 1)

		// center the letters
		//letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'
		console.log('letter', letter.characters)
		console.log('spacing', spacing)
		let estPoint: Point
		for (pointIndex; pointIndex < pointArr.length; pointIndex++) {
			// find nearest point to the length of the word
			if (spacing <= pointArr[pointIndex].totalDist) {
				let nextpoint = pointArr[pointIndex + 1]

				const localDist = spacing - pointArr[pointIndex].totalDist
				rotation = nextpoint.angle
				estPoint = pointBtwnByLength(
					pointArr[pointIndex],
					nextpoint,
					localDist,
					nextpoint.dist,
					rotation
				)

				break
			} else {
			}
		}

		spacing += letter.width

		//set locations
		//letter.x = estPoint.x + curve.x
		//letter.y = estPoint.y + curve.y
		const centerX = letter.width / 2
		const centerY = letter.height * 0.8 // change this to change height
		//spaceing them
		let angle = ((rotation - 180) * Math.PI) / 180
		letter.x = 0
		letter.y = 0 - centerY
		// letter.relativeTransform = multiply(
		// 	move(-letter.width / 2, -0.5 * letter.height),
		// 	letter.relativeTransform
		// )

		// more code taken from jyc, the god himself https://github.com/jyc http://jyc.eqv.io
		// Rotate the letter.
		letter.rotation = 0

		letter.relativeTransform = multiply(rotate(angle), letter.relativeTransform)
		letter.relativeTransform = multiply(
			move(estPoint.x + curve.x, estPoint.y + curve.y),
			letter.relativeTransform
		)
		//append that shit
		letter.characters = safeSpace(charArr[i])
		newNodes.push(letter)
		figma.currentPage.appendChild(letter)
	}
	let clone = curve.clone()
	newNodes.push(clone)
	figma.currentPage.selection = newNodes

	figma.viewport.scrollAndZoomIntoView(newNodes)
	return
}

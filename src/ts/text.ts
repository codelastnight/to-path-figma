/* 
	code for all the text handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

import { pointBtwnByLength } from './curve'

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

		console.log(spacing)
		let estPoint: Point
		for (pointIndex; pointIndex < pointArr.length; pointIndex++) {
			// find nearest point to the length of the word
			if (spacing < pointArr[pointIndex].totalDist) {
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
		letter.x = estPoint.x + curve.x
		letter.y = estPoint.y + curve.y

		//spaceing them
		//rotate
		letter.rotation = rotation - 180
		//append that shit
		newNodes.push(letter)
		figma.currentPage.appendChild(letter)
	}
	newNodes.push(curve.clone())
	figma.currentPage.selection = newNodes

	figma.viewport.scrollAndZoomIntoView(newNodes)
	return
}

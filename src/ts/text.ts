/* 
	code for all the text handling functions
	creater: last night
	website: notsimon.space
	version: im baby
	github: https://github.com/codelastnight/to-path-figma
*/

// case for handling spaces, becasue figma will auto them as 0 width
// character 8197 isnt the best but you kno what... its good enough
// this didn't need to be a function but like i already wrote so
var safeSpace = function(c: string) {
	return c.replace(" ",String.fromCharCode(8197));
}


//convert text into indivisual characters

export function text2Curve(node) {
	//convert text into each letter indivusally
	const newNodes: SceneNode[] = []
	const charArr = [...node.characters]

	let spacing = 0

	for (let i = 0; i < node.characters.length; i++) {
		const letter = figma.createText()
		letter.characters = safeSpace(charArr[i])

		// center the letters
		letter.textAlignHorizontal = 'CENTER'
		letter.textAlignVertical = 'CENTER'
		letter.textAutoResize = 'WIDTH_AND_HEIGHT'

		//copy settings
		letter.fontSize = node.fontSize
		letter.fontName = node.fontName

		//set locations
		letter.x = node.x + spacing
		letter.y = node.y + node.height + 3

		//spaceing them
		spacing = spacing + letter.width
		//rotate

		//append that shit
		figma.currentPage.appendChild(letter)
		newNodes.push(letter)
	}
	figma.currentPage.selection = newNodes
	figma.viewport.scrollAndZoomIntoView(newNodes)
	return
}
import {svgToBezier} from './curve';
// This shows the HTML page in "ui.html".
figma.showUI(__html__, {themeColors: true, width: 232, height: 208});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.
	// if (msg.type === 'create-shapes') {


	// }

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	//figma.closePlugin();
};

//watches for selecition change and notifies UI
figma.on('selectionchange', () => {
	const selection = figma.currentPage.selection
	if (selection.length == 0) return;

	const vector = selection[0];
	if (vector.type === 'VECTOR') {
		const curve = svgToBezier(vector.vectorPaths[0].data)
		console.log(curve) 
		console.log(figma.getNodeById(vector.parent.id))
		let totalLength = curve.reduce((accumulator, curValue) => {
			return accumulator + curValue.length;
		  }, 0);
		console.log(totalLength)
	} else if (vector.type==='TEXT') {
		console.log(vector.fills)
	}
})
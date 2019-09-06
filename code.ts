// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
async function main(): Promise<string | undefined> {
  
    let selection = figma.currentPage.selection;
    if ( selection.length == 0) {
      figma.closePlugin("nothings selected dumbass");
      return;
      
    }
    // if ( selection.length > 2 || selection.length < 2) {
    //   figma.closePlugin("you need TWO things selected can you read?");
    //   //return;
    // } 
    else {
      

    }
  for (const node of figma.currentPage.selection) {
    if (node.type == 'TEXT') {
      const fonts = node.fontName["family"];

      await figma.loadFontAsync({ family: node.fontName["family"], style: node.fontName["style"] });
      
      
      //console.log(node.getRangeLetterSpacing(0,100));
      //convert text into each letter indivusally
      const newNodes: SceneNode[] = [];
      const charArr = [...node.characters];
      let spacing = 0;
      
      for (let i = 0; i < node.characters.length; i++) {
            const letter = figma.createText();
            letter.characters = charArr[i];
            // center the letters
            letter.textAlignHorizontal = "CENTER";
            letter.textAlignVertical = "CENTER";
            letter.textAutoResize = "WIDTH_AND_HEIGHT";
            //copy settings
            letter.fontSize = node.fontSize;
            letter.fontName = node.fontName;

            //set locations
            letter.x = node.x + spacing;
            letter.y = node.y + node.height + 3;

            //spaceing them
            spacing = spacing + letter.width;
            //rotate

            
            //append that shit
            figma.currentPage.appendChild(letter);
            newNodes.push(letter);
          }
          figma.currentPage.selection = newNodes;
          figma.viewport.scrollAndZoomIntoView(newNodes);

    }

  
  }


//   const nodes: SceneNode[] = [];
//   for (let i = 0; i < msg.count; i++) {
//     const rect = figma.createRectangle();
//     rect.x = i * 150;
//     rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//     figma.currentPage.appendChild(rect);
//     nodes.push(rect);
//   }
//   figma.currentPage.selection = nodes;
//   figma.viewport.scrollAndZoomIntoView(nodes);
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  if (msg.type === 'do-the-thing') {
    main();
  }
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  
    
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

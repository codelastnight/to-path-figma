import { svgToBezier } from "./lib/curve";
import { textToPoints } from "./lib/text";
import * as Things from "./lib/things";

const defaultSettings = {
  verticalAlign: 0.5,
  horizontalAlign: 0.5,
  spacing: 20,
  count: 1000,
  autoWidth: true,
  totalLength: 0,
  isLoop: false,
  objWidth: 0,
  offset: 0,
  rotCheck: true,
  precision: 420,
  reverse: false,
};
type settingsData = typeof defaultSettings
let currentPreview: VectorNode[] = [];
let isCalculating = false;
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { themeColors: true, width: 250, height: 480 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === 'create-shapes') {
  // }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};

//watches for selecition change and notifies UI
figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length == 0) {
    if (currentPreview.length === 0) return;
    currentPreview.forEach((previewNode) => {
      if (previewNode.removed) return;
      previewNode.remove();
      return;
    });
    currentPreview = [];
    isCalculating = false;
    return;
  }

  const vector = selection[0];
  if (vector.type === "VECTOR") {
    isCalculating = true;
    const curve = svgToBezier(vector.vectorPaths[0].data);
    const square = figma.createRectangle();
    vector.parent.appendChild(square);
    async function test(square, vector, curve, defaultSettings, isCalculating) {
      const preview = Things.place(
        square,
        vector,
        curve,
        defaultSettings,
        isCalculating
      );
      currentPreview = [preview, ...currentPreview];
      //figma.currentPage.selection = selection;
      square.remove();
    }

    test(square, vector, curve, defaultSettings, isCalculating);
  } else if (vector.type === "TEXT") {
    textToPoints(vector.fillGeometry[0].data);
  }
});

figma.on("close", () => {
  if (currentPreview.length === 0) return;
  currentPreview.forEach((previewNode) => {
    if (previewNode.removed) return;
    previewNode.remove();
    return;
  });

  isCalculating = false;
  return;
});

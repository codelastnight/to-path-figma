import { svgToBezier } from "./lib/curve";
import { textToPoints } from "./lib/text";
import * as Things from "./lib/things";

import { defaultOptions, optionsType } from "../config";

let selectedItems = {
  path: "",
  shape: "",
};
type selectionType = "shape" | "path" | "none";

let currentPreview: VectorNode[] = [];
let isCalculating = false;
let selectionMode: selectionType = "shape";
let currentOptions: optionsType | null = null;

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  console.log(msg);
  if (msg.type === "selection:set-active") {
    selectionMode = msg.selectionMode;
    figma.ui.postMessage({
      type: "selection:set-active",
      selectionMode: selectionMode,
    });
  }
  if (msg.type === "selection:clear-active") {
    selectedItems[msg.selectionMode] = "";
    selectionMode = msg.selectionMode;
    currentPreview = clearPreview(currentPreview);
    figma.currentPage.selection = [];
    figma.ui.postMessage({
      type: "selection:set-active",
      selectionMode: selectionMode,
    });
  }

  if (msg.type === "selection:generate") {
    selectionMode = msg.selectionMode;
    generate();
  }

  if (msg.type === "options:set") {
    currentOptions = msg.options;
    currentPreview = clearPreview(currentPreview);
    generate();
  }
};

//watches for selecition change and notifies UI
figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length == 0) {
    return;
  }
  const node = selection[0];

  if (selectionMode === "shape" && node !== null) {
    selectedItems.shape = node.id;
    figma.ui.postMessage({
      type: "selection:set-active",
      name: node.name,
      selectionMode: selectionMode,
    });
  }
  if (selectionMode === "path" && node !== null) {
    if (node.type !== "VECTOR") {
      throw "please select a path vector!";
    }
    selectedItems.path = node.id;
    figma.currentPage.selection = [node];

    figma.ui.postMessage({
      type: "selection:set-active",
      name: node.name,
      selectionMode: selectionMode,
    });
  } else if (selectionMode === "shape" && node.type === "TEXT") {
    textToPoints(node.fillGeometry[0].data);
  }
});
function clearPreview(selection) {
  if (selection === undefined || selection === null || selection.length === 0)
    return selection;
  selection.forEach((previewNode) => {
    if (previewNode.removed) return;
    previewNode.remove();
    return;
  });
  return [];
}
function generate() {
  if (selectedItems.path === "" || selectedItems.shape === "") return;
  const path = figma.getNodeById(selectedItems.path) as VectorNode;
  const curve = svgToBezier(path.vectorPaths[0].data);
  const shape = figma.getNodeById(selectedItems.shape) as SceneNode;
  const preview = Things.place(shape, path, curve, currentOptions);
  console.log(currentPreview);
  currentPreview = [preview, ...currentPreview];
}

function init() {
  figma.skipInvisibleInstanceChildren = true;
  currentOptions = defaultOptions;
  if (!!currentOptions)
    figma.ui.postMessage({
      type: "options:get",
      options: defaultOptions,
    });
}
figma.once("run", () => {
  init();
});
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { themeColors: true, width: 250, height: 480 });

figma.on("close", () => {
  currentPreview = clearPreview(currentPreview);
  return;
});

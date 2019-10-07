/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _extra_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extra.ts */ "./src/extra.ts");
/* harmony import */ var _extra_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_extra_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _curve_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./curve.ts */ "./src/curve.ts");
/* harmony import */ var _curve_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_curve_ts__WEBPACK_IMPORTED_MODULE_1__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
    source code for text 2 curve for figma
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/


//convert text into indivisual characters
function text2Curve(node) {
    //convert text into each letter indivusally
    const newNodes = [];
    const charArr = [...node.characters];
    let spacing = 0;
    for (let i = 0; i < node.characters.length; i++) {
        const letter = figma.createText();
        letter.characters = charArr[i];
        // center the letters
        letter.textAlignHorizontal = 'CENTER';
        letter.textAlignVertical = 'CENTER';
        letter.textAutoResize = 'WIDTH_AND_HEIGHT';
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
    return;
}
// main code
//async required because figma api requires you to load fonts into the plugin to use them
//honestly im really tempted to just hardcode roboto instead
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let selection = figma.currentPage.selection;
        if (selection.length == 0) {
            figma.closePlugin('nothings selected dumbass');
            return;
        }
        // if ( selection.length > 2 || selection.length < 2) {
        //   figma.closePlugin("you need TWO things selected can you read?");
        //   //return;
        // }
        else {
        }
        for (const node of figma.currentPage.selection) {
            if (node.type == 'VECTOR') {
                const vectors = svg2Arr(node.vectorPaths[0].data);
                // create an html svg element becasue the builtin function only works on svg files
                // so apparently you cant even init a svg path here so i have to send it to the UI HTML
                //MASSIV BrUH
                var x = node.x;
                var y = node.y;
                figma.ui.postMessage({ type: 'svg', vectors, x, y });
                //testdatas
                const testdata = [
                    [1.388586401939392, 21.729154586791992],
                    [-4.074989438056946, 2.2291507720947266],
                    [6.92498779296875, -3.775749444961548],
                    [28.388591766357422, 2.2291524410247803]
                ];
                //var a = pointOnCurve(testdata)
                const newNodes = [];
                // for (var b =0;b < a.length;b++) {
                // 	if (isNaN(a[b][0][0])) {
                // 	} else {
                // 	const test = figma.createRectangle();
                // 	test.resize(1,1);
                // 	test.y=a[b][0][0]
                // 	test.x=a[b][0][1]
                // 	test.rotation=a[b][0][2]
                // 	figma.currentPage.appendChild(test)
                // 	newNodes.push(test)
                // 	}
                // }
            }
            if (node.type == 'TEXT') {
                //the font loading part
                yield figma.loadFontAsync({
                    family: node.fontName['family'],
                    style: node.fontName['style']
                });
                text2Curve(node);
            }
        }
    });
}
function calcCurves(vectors, vectorLengths, x, y) {
    let pointArr = [];
    for (var curve in vectors) {
        pointArr.push(...pointOnCurve(vectors[curve], 100, true));
    }
    let a = pointArr;
    const newNodes = [];
    for (var b = 0; b < a.length; b++) {
        if (isNaN(a[b][0][0])) {
        }
        else {
            const test = figma.createRectangle();
            test.resizeWithoutConstraints(0.1, 0.4);
            test.y = a[b][0][1];
            test.x = a[b][0][0];
            test.rotation = a[b][0][2];
            figma.currentPage.appendChild(test);
            newNodes.push(test);
        }
    }
    figma.flatten(newNodes);
    console.log(pointArr);
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
    if (msg.type === 'cancel') {
        figma.closePlugin('k');
    }
    if (msg.type === 'svg') {
        //turns out u dont need this oops
        //var relvect = abs2rel(msg.vectors[0], msg.x, msg.y)
        //console.log(relvect)
        calcCurves(msg.vectors, msg.vectorLengths, msg.x, msg.y);
        figma.closePlugin();
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // what if i dont wanna lmao. default generated tutorial headass
};


/***/ }),

/***/ "./src/curve.ts":
/*!**********************!*\
  !*** ./src/curve.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
    code for all the curve handling functions
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/
//turn whatever the fuck svg code is into array of points grouped into 4 or 2 ( this is dependant on what type of bezier curve it is. look it up)
// figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
var svg2Arr = function (svgData) {
    /*
    svgData: the fucking shitty svg path data fuck
    i want it to end up like: [[point1,2,3,4],[4,5],[5,6,7,8]....]
    i fucking hate this shit
    */
    let test = svgData.split('M'); //split if more then 1 section and gets rid of the extra array value at front
    test.shift();
    if (test.length > 1) {
        // throw error if theres too many lines becasue im lazy
        throw 'TOO MANY LINES!!!1111 this only supports one continous vector';
        return;
    }
    let cleanType = [];
    var poo = test[0].trim().split(/ L|C /); // splits string into the chunks of different lines
    var splicein = [];
    for (var e in poo) {
        //magic
        var sad = arrChunk(poo[e].trim().split(' '), 2);
        //this adds the last point from the previous array into the next one.
        sad.unshift(splicein);
        splicein = sad[sad.length - 1];
        cleanType.push(sad);
    }
    cleanType.shift(); // get rid of the extra empty array value
    return cleanType;
};
// turns the absolute values of points in to relative
var abs2rel = function (PointArr, x, y) {
    var relcurve = [];
    for (var e in PointArr) {
        var relpoint = [Number(PointArr[e][0]) - x, Number(PointArr[e][1]) - y];
        relcurve.push(relpoint);
        console.log(PointArr[e]);
    }
    return relcurve;
};
//distance between points a and b
var distBtwn = function (a, b) {
    /*
  a: [x1,y1]
  b: [x2,y2]
  */
    for (var c in a) {
        a[c] = Number(a[c]);
        b[c] = Number(b[c]);
    }
    return Math.sqrt(Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2));
};
//find point between two points a and b over time
// in this case time is pixels
var pointBtwn = function (a, b, t, time) {
    /*
  a: [x1,y1]
  b: [x2,y2]
  time: number
  rotation: also return rotation if true
  */
    for (var c in a) {
        a[c] = Number(a[c]);
        b[c] = Number(b[c]);
    }
    //find the unit  vector between points a and b
    // not really unit vector in the math sense tho
    const unitVector = [(b[0] - a[0]) / time, (b[1] - a[1]) / time];
    return [a[0] + unitVector[0] * t, a[1] + unitVector[1] * t];
};
//calculate De Casteljau’s algorithm from 2-4 points  https://javascript.info/bezier-curve
// basically turns 4 points on a beizer into a curve
function pointOnCurve(curve, time = 100, rotation = false) {
    /*
  curve [point1, point2, point3, point4]
     - each point: [x,y]
  */
    var casteljau = function (curve, t, time, rotation = false, lastrot = 0) {
        let arr = [];
        for (var c = 0; c < curve.length - 1; c++) {
            const dist = distBtwn(curve[c], curve[c + 1]);
            let point = pointBtwn(curve[c], curve[c + 1], t, time);
            arr.push(point);
            if (rotation) {
                //figma wants this number to be in degrees becasue fuck you i guess
                let angle = Math.atan((curve[c + 1][0] - curve[c][0]) / (curve[c + 1][1] - curve[c][1])) *
                    (180 / Math.PI);
                angle = 90 + angle;
                if (curve[c + 1][1] - curve[c][1] < 0) {
                    angle = 180 + angle;
                }
                point.push(angle);
            }
        }
        return arr;
    };
    let finalarr = [];
    if (curve.length == 2) {
        for (var t = 1; t < time; t++) {
            if (finalarr.length != 0) {
                var lastrot = finalarr[finalarr.length - 1][2];
            }
            let arr1 = casteljau(curve, t, time, rotation, lastrot);
            finalarr.push(arr1);
        }
    }
    else {
        for (var t = 1; t <= time; t++) {
            if (finalarr.length != 0) {
                var lastrot = finalarr[finalarr.length - 1][2];
            }
            let arr1 = casteljau(curve, t, time);
            let arr2 = casteljau(arr1, t, time);
            let arr3 = casteljau(arr2, t, time, rotation, lastrot);
            //could i use recursive? yea. am i gonna? no that sounds like work
            // let arr1 = casteljau(
            // 	casteljau(casteljau(curve, t, time), t, time),
            // 	t,
            // 	time,
            // 	rotation
            // )
            finalarr.push(arr3);
        }
    }
    return finalarr;
}


/***/ }),

/***/ "./src/extra.ts":
/*!**********************!*\
  !*** ./src/extra.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
    misc functions
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/
//splits array into chunks
// got this code from https://medium.com/@Dragonza/four-ways-to-chunk-an-array-e19c889eac4
// author: Ngoc Vuong https://dragonza.io
var arrChunk = function (array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i++) {
        const last = chunked[chunked.length - 1];
        if (!last || last.length === size) {
            chunked.push([array[i]]);
        }
        else {
            last.push(array[i]);
        }
    }
    return chunked;
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N1cnZlLnRzIiwid2VicGFjazovLy8uL3NyYy9leHRyYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ29CO0FBQ0E7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDRCQUE0QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLDZCQUE2QjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsYUFBYTtBQUM5QztBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixVQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG4vKlxyXG4gICAgc291cmNlIGNvZGUgZm9yIHRleHQgMiBjdXJ2ZSBmb3IgZmlnbWFcclxuICAgIGNyZWF0ZXI6IGxhc3QgbmlnaHRcclxuICAgIHdlYnNpdGU6IG5vdHNpbW9uLnNwYWNlXHJcbiAgICB2ZXJzaW9uOiBpbSBiYWJ5XHJcbiAgICBnaXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9jb2RlbGFzdG5pZ2h0L3RvLXBhdGgtZmlnbWFcclxuKi9cclxuaW1wb3J0ICcuL2V4dHJhLnRzJztcclxuaW1wb3J0ICcuL2N1cnZlLnRzJztcclxuLy9jb252ZXJ0IHRleHQgaW50byBpbmRpdmlzdWFsIGNoYXJhY3RlcnNcclxuZnVuY3Rpb24gdGV4dDJDdXJ2ZShub2RlKSB7XHJcbiAgICAvL2NvbnZlcnQgdGV4dCBpbnRvIGVhY2ggbGV0dGVyIGluZGl2dXNhbGx5XHJcbiAgICBjb25zdCBuZXdOb2RlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhckFyciA9IFsuLi5ub2RlLmNoYXJhY3RlcnNdO1xyXG4gICAgbGV0IHNwYWNpbmcgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoYXJhY3RlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsZXR0ZXIgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XHJcbiAgICAgICAgbGV0dGVyLmNoYXJhY3RlcnMgPSBjaGFyQXJyW2ldO1xyXG4gICAgICAgIC8vIGNlbnRlciB0aGUgbGV0dGVyc1xyXG4gICAgICAgIGxldHRlci50ZXh0QWxpZ25Ib3Jpem9udGFsID0gJ0NFTlRFUic7XHJcbiAgICAgICAgbGV0dGVyLnRleHRBbGlnblZlcnRpY2FsID0gJ0NFTlRFUic7XHJcbiAgICAgICAgbGV0dGVyLnRleHRBdXRvUmVzaXplID0gJ1dJRFRIX0FORF9IRUlHSFQnO1xyXG4gICAgICAgIC8vY29weSBzZXR0aW5nc1xyXG4gICAgICAgIGxldHRlci5mb250U2l6ZSA9IG5vZGUuZm9udFNpemU7XHJcbiAgICAgICAgbGV0dGVyLmZvbnROYW1lID0gbm9kZS5mb250TmFtZTtcclxuICAgICAgICAvL3NldCBsb2NhdGlvbnNcclxuICAgICAgICBsZXR0ZXIueCA9IG5vZGUueCArIHNwYWNpbmc7XHJcbiAgICAgICAgbGV0dGVyLnkgPSBub2RlLnkgKyBub2RlLmhlaWdodCArIDM7XHJcbiAgICAgICAgLy9zcGFjZWluZyB0aGVtXHJcbiAgICAgICAgc3BhY2luZyA9IHNwYWNpbmcgKyBsZXR0ZXIud2lkdGg7XHJcbiAgICAgICAgLy9yb3RhdGVcclxuICAgICAgICAvL2FwcGVuZCB0aGF0IHNoaXRcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChsZXR0ZXIpO1xyXG4gICAgICAgIG5ld05vZGVzLnB1c2gobGV0dGVyKTtcclxuICAgIH1cclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5ld05vZGVzO1xyXG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5ld05vZGVzKTtcclxuICAgIHJldHVybjtcclxufVxyXG4vLyBtYWluIGNvZGVcclxuLy9hc3luYyByZXF1aXJlZCBiZWNhdXNlIGZpZ21hIGFwaSByZXF1aXJlcyB5b3UgdG8gbG9hZCBmb250cyBpbnRvIHRoZSBwbHVnaW4gdG8gdXNlIHRoZW1cclxuLy9ob25lc3RseSBpbSByZWFsbHkgdGVtcHRlZCB0byBqdXN0IGhhcmRjb2RlIHJvYm90byBpbnN0ZWFkXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbignbm90aGluZ3Mgc2VsZWN0ZWQgZHVtYmFzcycpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmICggc2VsZWN0aW9uLmxlbmd0aCA+IDIgfHwgc2VsZWN0aW9uLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAvLyAgIGZpZ21hLmNsb3NlUGx1Z2luKFwieW91IG5lZWQgVFdPIHRoaW5ncyBzZWxlY3RlZCBjYW4geW91IHJlYWQ/XCIpO1xyXG4gICAgICAgIC8vICAgLy9yZXR1cm47XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1ZFQ1RPUicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlY3RvcnMgPSBzdmcyQXJyKG5vZGUudmVjdG9yUGF0aHNbMF0uZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYW4gaHRtbCBzdmcgZWxlbWVudCBiZWNhc3VlIHRoZSBidWlsdGluIGZ1bmN0aW9uIG9ubHkgd29ya3Mgb24gc3ZnIGZpbGVzXHJcbiAgICAgICAgICAgICAgICAvLyBzbyBhcHBhcmVudGx5IHlvdSBjYW50IGV2ZW4gaW5pdCBhIHN2ZyBwYXRoIGhlcmUgc28gaSBoYXZlIHRvIHNlbmQgaXQgdG8gdGhlIFVJIEhUTUxcclxuICAgICAgICAgICAgICAgIC8vTUFTU0lWIEJyVUhcclxuICAgICAgICAgICAgICAgIHZhciB4ID0gbm9kZS54O1xyXG4gICAgICAgICAgICAgICAgdmFyIHkgPSBub2RlLnk7XHJcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdzdmcnLCB2ZWN0b3JzLCB4LCB5IH0pO1xyXG4gICAgICAgICAgICAgICAgLy90ZXN0ZGF0YXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RkYXRhID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFsxLjM4ODU4NjQwMTkzOTM5MiwgMjEuNzI5MTU0NTg2NzkxOTkyXSxcclxuICAgICAgICAgICAgICAgICAgICBbLTQuMDc0OTg5NDM4MDU2OTQ2LCAyLjIyOTE1MDc3MjA5NDcyNjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFs2LjkyNDk4Nzc5Mjk2ODc1LCAtMy43NzU3NDk0NDQ5NjE1NDhdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsyOC4zODg1OTE3NjYzNTc0MjIsIDIuMjI5MTUyNDQxMDI0NzgwM11cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBhID0gcG9pbnRPbkN1cnZlKHRlc3RkYXRhKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Tm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciAodmFyIGIgPTA7YiA8IGEubGVuZ3RoO2IrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRpZiAoaXNOYU4oYVtiXVswXVswXSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0fSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0Y29uc3QgdGVzdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0LnJlc2l6ZSgxLDEpO1xyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0Lnk9YVtiXVswXVswXVxyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0Lng9YVtiXVswXVsxXVxyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0LnJvdGF0aW9uPWFbYl1bMF1bMl1cclxuICAgICAgICAgICAgICAgIC8vIFx0ZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQodGVzdClcclxuICAgICAgICAgICAgICAgIC8vIFx0bmV3Tm9kZXMucHVzaCh0ZXN0KVxyXG4gICAgICAgICAgICAgICAgLy8gXHR9XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PSAnVEVYVCcpIHtcclxuICAgICAgICAgICAgICAgIC8vdGhlIGZvbnQgbG9hZGluZyBwYXJ0XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKHtcclxuICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IG5vZGUuZm9udE5hbWVbJ2ZhbWlseSddLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBub2RlLmZvbnROYW1lWydzdHlsZSddXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRleHQyQ3VydmUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjYWxjQ3VydmVzKHZlY3RvcnMsIHZlY3Rvckxlbmd0aHMsIHgsIHkpIHtcclxuICAgIGxldCBwb2ludEFyciA9IFtdO1xyXG4gICAgZm9yICh2YXIgY3VydmUgaW4gdmVjdG9ycykge1xyXG4gICAgICAgIHBvaW50QXJyLnB1c2goLi4ucG9pbnRPbkN1cnZlKHZlY3RvcnNbY3VydmVdLCAxMDAsIHRydWUpKTtcclxuICAgIH1cclxuICAgIGxldCBhID0gcG9pbnRBcnI7XHJcbiAgICBjb25zdCBuZXdOb2RlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgYiA9IDA7IGIgPCBhLmxlbmd0aDsgYisrKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGFbYl1bMF1bMF0pKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0ZXN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgIHRlc3QucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKDAuMSwgMC40KTtcclxuICAgICAgICAgICAgdGVzdC55ID0gYVtiXVswXVsxXTtcclxuICAgICAgICAgICAgdGVzdC54ID0gYVtiXVswXVswXTtcclxuICAgICAgICAgICAgdGVzdC5yb3RhdGlvbiA9IGFbYl1bMF1bMl07XHJcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHRlc3QpO1xyXG4gICAgICAgICAgICBuZXdOb2Rlcy5wdXNoKHRlc3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZpZ21hLmZsYXR0ZW4obmV3Tm9kZXMpO1xyXG4gICAgY29uc29sZS5sb2cocG9pbnRBcnIpO1xyXG59XHJcbi8vIFRoaXMgc2hvd3MgdGhlIEhUTUwgcGFnZSBpbiBcInVpLmh0bWxcIi5cclxuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcclxuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXHJcbi8vIGNhbGxiYWNrLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBwYXNzZWQgdGhlIFwicGx1Z2luTWVzc2FnZVwiIHByb3BlcnR5IG9mIHRoZVxyXG4vLyBwb3N0ZWQgbWVzc2FnZS5cclxuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2RvLXRoZS10aGluZycpIHtcclxuICAgICAgICBtYWluKCk7XHJcbiAgICB9XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdjYW5jZWwnKSB7XHJcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oJ2snKTtcclxuICAgIH1cclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3N2ZycpIHtcclxuICAgICAgICAvL3R1cm5zIG91dCB1IGRvbnQgbmVlZCB0aGlzIG9vcHNcclxuICAgICAgICAvL3ZhciByZWx2ZWN0ID0gYWJzMnJlbChtc2cudmVjdG9yc1swXSwgbXNnLngsIG1zZy55KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVsdmVjdClcclxuICAgICAgICBjYWxjQ3VydmVzKG1zZy52ZWN0b3JzLCBtc2cudmVjdG9yTGVuZ3RocywgbXNnLngsIG1zZy55KTtcclxuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xyXG4gICAgfVxyXG4gICAgLy8gTWFrZSBzdXJlIHRvIGNsb3NlIHRoZSBwbHVnaW4gd2hlbiB5b3UncmUgZG9uZS4gT3RoZXJ3aXNlIHRoZSBwbHVnaW4gd2lsbFxyXG4gICAgLy8ga2VlcCBydW5uaW5nLCB3aGljaCBzaG93cyB0aGUgY2FuY2VsIGJ1dHRvbiBhdCB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAvLyB3aGF0IGlmIGkgZG9udCB3YW5uYSBsbWFvLiBkZWZhdWx0IGdlbmVyYXRlZCB0dXRvcmlhbCBoZWFkYXNzXHJcbn07XHJcbiIsIi8qXHJcbiAgICBjb2RlIGZvciBhbGwgdGhlIGN1cnZlIGhhbmRsaW5nIGZ1bmN0aW9uc1xyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG4vL3R1cm4gd2hhdGV2ZXIgdGhlIGZ1Y2sgc3ZnIGNvZGUgaXMgaW50byBhcnJheSBvZiBwb2ludHMgZ3JvdXBlZCBpbnRvIDQgb3IgMiAoIHRoaXMgaXMgZGVwZW5kYW50IG9uIHdoYXQgdHlwZSBvZiBiZXppZXIgY3VydmUgaXQgaXMuIGxvb2sgaXQgdXApXHJcbi8vIGZpZ21hIGRvZXNudCBoYXZlIHRoZSAzIHBvaW50IGJlemllciBjdXJ2ZSBpbiB2ZWN0b3IgbW9kZSwgb25seSA0IG9yIDIuXHJcbnZhciBzdmcyQXJyID0gZnVuY3Rpb24gKHN2Z0RhdGEpIHtcclxuICAgIC8qXHJcbiAgICBzdmdEYXRhOiB0aGUgZnVja2luZyBzaGl0dHkgc3ZnIHBhdGggZGF0YSBmdWNrXHJcbiAgICBpIHdhbnQgaXQgdG8gZW5kIHVwIGxpa2U6IFtbcG9pbnQxLDIsMyw0XSxbNCw1XSxbNSw2LDcsOF0uLi4uXVxyXG4gICAgaSBmdWNraW5nIGhhdGUgdGhpcyBzaGl0XHJcbiAgICAqL1xyXG4gICAgbGV0IHRlc3QgPSBzdmdEYXRhLnNwbGl0KCdNJyk7IC8vc3BsaXQgaWYgbW9yZSB0aGVuIDEgc2VjdGlvbiBhbmQgZ2V0cyByaWQgb2YgdGhlIGV4dHJhIGFycmF5IHZhbHVlIGF0IGZyb250XHJcbiAgICB0ZXN0LnNoaWZ0KCk7XHJcbiAgICBpZiAodGVzdC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgLy8gdGhyb3cgZXJyb3IgaWYgdGhlcmVzIHRvbyBtYW55IGxpbmVzIGJlY2FzdWUgaW0gbGF6eVxyXG4gICAgICAgIHRocm93ICdUT08gTUFOWSBMSU5FUyEhITExMTEgdGhpcyBvbmx5IHN1cHBvcnRzIG9uZSBjb250aW5vdXMgdmVjdG9yJztcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgY2xlYW5UeXBlID0gW107XHJcbiAgICB2YXIgcG9vID0gdGVzdFswXS50cmltKCkuc3BsaXQoLyBMfEMgLyk7IC8vIHNwbGl0cyBzdHJpbmcgaW50byB0aGUgY2h1bmtzIG9mIGRpZmZlcmVudCBsaW5lc1xyXG4gICAgdmFyIHNwbGljZWluID0gW107XHJcbiAgICBmb3IgKHZhciBlIGluIHBvbykge1xyXG4gICAgICAgIC8vbWFnaWNcclxuICAgICAgICB2YXIgc2FkID0gYXJyQ2h1bmsocG9vW2VdLnRyaW0oKS5zcGxpdCgnICcpLCAyKTtcclxuICAgICAgICAvL3RoaXMgYWRkcyB0aGUgbGFzdCBwb2ludCBmcm9tIHRoZSBwcmV2aW91cyBhcnJheSBpbnRvIHRoZSBuZXh0IG9uZS5cclxuICAgICAgICBzYWQudW5zaGlmdChzcGxpY2Vpbik7XHJcbiAgICAgICAgc3BsaWNlaW4gPSBzYWRbc2FkLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGNsZWFuVHlwZS5wdXNoKHNhZCk7XHJcbiAgICB9XHJcbiAgICBjbGVhblR5cGUuc2hpZnQoKTsgLy8gZ2V0IHJpZCBvZiB0aGUgZXh0cmEgZW1wdHkgYXJyYXkgdmFsdWVcclxuICAgIHJldHVybiBjbGVhblR5cGU7XHJcbn07XHJcbi8vIHR1cm5zIHRoZSBhYnNvbHV0ZSB2YWx1ZXMgb2YgcG9pbnRzIGluIHRvIHJlbGF0aXZlXHJcbnZhciBhYnMycmVsID0gZnVuY3Rpb24gKFBvaW50QXJyLCB4LCB5KSB7XHJcbiAgICB2YXIgcmVsY3VydmUgPSBbXTtcclxuICAgIGZvciAodmFyIGUgaW4gUG9pbnRBcnIpIHtcclxuICAgICAgICB2YXIgcmVscG9pbnQgPSBbTnVtYmVyKFBvaW50QXJyW2VdWzBdKSAtIHgsIE51bWJlcihQb2ludEFycltlXVsxXSkgLSB5XTtcclxuICAgICAgICByZWxjdXJ2ZS5wdXNoKHJlbHBvaW50KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhQb2ludEFycltlXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVsY3VydmU7XHJcbn07XHJcbi8vZGlzdGFuY2UgYmV0d2VlbiBwb2ludHMgYSBhbmQgYlxyXG52YXIgZGlzdEJ0d24gPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgLypcclxuICBhOiBbeDEseTFdXHJcbiAgYjogW3gyLHkyXVxyXG4gICovXHJcbiAgICBmb3IgKHZhciBjIGluIGEpIHtcclxuICAgICAgICBhW2NdID0gTnVtYmVyKGFbY10pO1xyXG4gICAgICAgIGJbY10gPSBOdW1iZXIoYltjXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KChiWzBdIC0gYVswXSksIDIpICsgTWF0aC5wb3coKGJbMV0gLSBhWzFdKSwgMikpO1xyXG59O1xyXG4vL2ZpbmQgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzIGEgYW5kIGIgb3ZlciB0aW1lXHJcbi8vIGluIHRoaXMgY2FzZSB0aW1lIGlzIHBpeGVsc1xyXG52YXIgcG9pbnRCdHduID0gZnVuY3Rpb24gKGEsIGIsIHQsIHRpbWUpIHtcclxuICAgIC8qXHJcbiAgYTogW3gxLHkxXVxyXG4gIGI6IFt4Mix5Ml1cclxuICB0aW1lOiBudW1iZXJcclxuICByb3RhdGlvbjogYWxzbyByZXR1cm4gcm90YXRpb24gaWYgdHJ1ZVxyXG4gICovXHJcbiAgICBmb3IgKHZhciBjIGluIGEpIHtcclxuICAgICAgICBhW2NdID0gTnVtYmVyKGFbY10pO1xyXG4gICAgICAgIGJbY10gPSBOdW1iZXIoYltjXSk7XHJcbiAgICB9XHJcbiAgICAvL2ZpbmQgdGhlIHVuaXQgIHZlY3RvciBiZXR3ZWVuIHBvaW50cyBhIGFuZCBiXHJcbiAgICAvLyBub3QgcmVhbGx5IHVuaXQgdmVjdG9yIGluIHRoZSBtYXRoIHNlbnNlIHRob1xyXG4gICAgY29uc3QgdW5pdFZlY3RvciA9IFsoYlswXSAtIGFbMF0pIC8gdGltZSwgKGJbMV0gLSBhWzFdKSAvIHRpbWVdO1xyXG4gICAgcmV0dXJuIFthWzBdICsgdW5pdFZlY3RvclswXSAqIHQsIGFbMV0gKyB1bml0VmVjdG9yWzFdICogdF07XHJcbn07XHJcbi8vY2FsY3VsYXRlIERlIENhc3RlbGphdeKAmXMgYWxnb3JpdGhtIGZyb20gMi00IHBvaW50cyAgaHR0cHM6Ly9qYXZhc2NyaXB0LmluZm8vYmV6aWVyLWN1cnZlXHJcbi8vIGJhc2ljYWxseSB0dXJucyA0IHBvaW50cyBvbiBhIGJlaXplciBpbnRvIGEgY3VydmVcclxuZnVuY3Rpb24gcG9pbnRPbkN1cnZlKGN1cnZlLCB0aW1lID0gMTAwLCByb3RhdGlvbiA9IGZhbHNlKSB7XHJcbiAgICAvKlxyXG4gIGN1cnZlIFtwb2ludDEsIHBvaW50MiwgcG9pbnQzLCBwb2ludDRdXHJcbiAgICAgLSBlYWNoIHBvaW50OiBbeCx5XVxyXG4gICovXHJcbiAgICB2YXIgY2FzdGVsamF1ID0gZnVuY3Rpb24gKGN1cnZlLCB0LCB0aW1lLCByb3RhdGlvbiA9IGZhbHNlLCBsYXN0cm90ID0gMCkge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGN1cnZlLmxlbmd0aCAtIDE7IGMrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gZGlzdEJ0d24oY3VydmVbY10sIGN1cnZlW2MgKyAxXSk7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBvaW50QnR3bihjdXJ2ZVtjXSwgY3VydmVbYyArIDFdLCB0LCB0aW1lKTtcclxuICAgICAgICAgICAgYXJyLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBpZiAocm90YXRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vZmlnbWEgd2FudHMgdGhpcyBudW1iZXIgdG8gYmUgaW4gZGVncmVlcyBiZWNhc3VlIGZ1Y2sgeW91IGkgZ3Vlc3NcclxuICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbigoY3VydmVbYyArIDFdWzBdIC0gY3VydmVbY11bMF0pIC8gKGN1cnZlW2MgKyAxXVsxXSAtIGN1cnZlW2NdWzFdKSkgKlxyXG4gICAgICAgICAgICAgICAgICAgICgxODAgLyBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlID0gOTAgKyBhbmdsZTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJ2ZVtjICsgMV1bMV0gLSBjdXJ2ZVtjXVsxXSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDE4MCArIGFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcG9pbnQucHVzaChhbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICBsZXQgZmluYWxhcnIgPSBbXTtcclxuICAgIGlmIChjdXJ2ZS5sZW5ndGggPT0gMikge1xyXG4gICAgICAgIGZvciAodmFyIHQgPSAxOyB0IDwgdGltZTsgdCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmaW5hbGFyci5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3Ryb3QgPSBmaW5hbGFycltmaW5hbGFyci5sZW5ndGggLSAxXVsyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgYXJyMSA9IGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSwgcm90YXRpb24sIGxhc3Ryb3QpO1xyXG4gICAgICAgICAgICBmaW5hbGFyci5wdXNoKGFycjEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIHQgPSAxOyB0IDw9IHRpbWU7IHQrKykge1xyXG4gICAgICAgICAgICBpZiAoZmluYWxhcnIubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cm90ID0gZmluYWxhcnJbZmluYWxhcnIubGVuZ3RoIC0gMV1bMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGFycjEgPSBjYXN0ZWxqYXUoY3VydmUsIHQsIHRpbWUpO1xyXG4gICAgICAgICAgICBsZXQgYXJyMiA9IGNhc3RlbGphdShhcnIxLCB0LCB0aW1lKTtcclxuICAgICAgICAgICAgbGV0IGFycjMgPSBjYXN0ZWxqYXUoYXJyMiwgdCwgdGltZSwgcm90YXRpb24sIGxhc3Ryb3QpO1xyXG4gICAgICAgICAgICAvL2NvdWxkIGkgdXNlIHJlY3Vyc2l2ZT8geWVhLiBhbSBpIGdvbm5hPyBubyB0aGF0IHNvdW5kcyBsaWtlIHdvcmtcclxuICAgICAgICAgICAgLy8gbGV0IGFycjEgPSBjYXN0ZWxqYXUoXHJcbiAgICAgICAgICAgIC8vIFx0Y2FzdGVsamF1KGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSksIHQsIHRpbWUpLFxyXG4gICAgICAgICAgICAvLyBcdHQsXHJcbiAgICAgICAgICAgIC8vIFx0dGltZSxcclxuICAgICAgICAgICAgLy8gXHRyb3RhdGlvblxyXG4gICAgICAgICAgICAvLyApXHJcbiAgICAgICAgICAgIGZpbmFsYXJyLnB1c2goYXJyMyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbmFsYXJyO1xyXG59XHJcbiIsIi8qXHJcbiAgICBtaXNjIGZ1bmN0aW9uc1xyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG4vL3NwbGl0cyBhcnJheSBpbnRvIGNodW5rc1xyXG4vLyBnb3QgdGhpcyBjb2RlIGZyb20gaHR0cHM6Ly9tZWRpdW0uY29tL0BEcmFnb256YS9mb3VyLXdheXMtdG8tY2h1bmstYW4tYXJyYXktZTE5Yzg4OWVhYzRcclxuLy8gYXV0aG9yOiBOZ29jIFZ1b25nIGh0dHBzOi8vZHJhZ29uemEuaW9cclxudmFyIGFyckNodW5rID0gZnVuY3Rpb24gKGFycmF5LCBzaXplKSB7XHJcbiAgICBjb25zdCBjaHVua2VkID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IGNodW5rZWRbY2h1bmtlZC5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAoIWxhc3QgfHwgbGFzdC5sZW5ndGggPT09IHNpemUpIHtcclxuICAgICAgICAgICAgY2h1bmtlZC5wdXNoKFthcnJheVtpXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGFzdC5wdXNoKGFycmF5W2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2h1bmtlZDtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==
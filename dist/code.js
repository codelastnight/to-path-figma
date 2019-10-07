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
/* harmony import */ var _ts_curve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ts/curve */ "./src/ts/curve.ts");
/* harmony import */ var _ts_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ts/text */ "./src/ts/text.ts");
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
                console.log("bruh");
                const vectors = _ts_curve__WEBPACK_IMPORTED_MODULE_0__["svg2Arr"](node.vectorPaths[0].data);
                console.log("bruh");
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
                _ts_text__WEBPACK_IMPORTED_MODULE_1__["text2Curve"](node);
            }
        }
    });
}
function calcCurves(vectors, vectorLengths, x, y) {
    let pointArr = [];
    for (var curve in vectors) {
        pointArr.push(..._ts_curve__WEBPACK_IMPORTED_MODULE_0__["pointOnCurve"](vectors[curve], 100, true));
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
document.addEventListener("mouseup", function () {
    let selection = figma.currentPage.selection;
    let selecttype = "nothing";
    if (selection.length == 0) {
        selecttype = "nothing";
        console.log("nothing selected");
    }
    figma.ui.postMessage({ type: 'selection', selecttype });
});
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

/***/ "./src/ts/curve.ts":
/*!*************************!*\
  !*** ./src/ts/curve.ts ***!
  \*************************/
/*! exports provided: svg2Arr, abs2rel, distBtwn, pointBtwn, pointOnCurve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "svg2Arr", function() { return svg2Arr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "abs2rel", function() { return abs2rel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distBtwn", function() { return distBtwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pointBtwn", function() { return pointBtwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pointOnCurve", function() { return pointOnCurve; });
/* harmony import */ var _extra__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extra */ "./src/ts/extra.ts");
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
    console.log("bruh2");
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
        var sad = _extra__WEBPACK_IMPORTED_MODULE_0__["arrChunk"](poo[e].trim().split(' '), 2);
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
var pointOnCurve = function (curve, time = 100, rotation = false) {
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
};


/***/ }),

/***/ "./src/ts/extra.ts":
/*!*************************!*\
  !*** ./src/ts/extra.ts ***!
  \*************************/
/*! exports provided: arrChunk */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrChunk", function() { return arrChunk; });
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


/***/ }),

/***/ "./src/ts/text.ts":
/*!************************!*\
  !*** ./src/ts/text.ts ***!
  \************************/
/*! exports provided: text2Curve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "text2Curve", function() { return text2Curve; });
/*
    code for all the text handling functions
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RzL2N1cnZlLnRzIiwid2VicGFjazovLy8uL3NyYy90cy9leHRyYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHMvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3QiwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztB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bUIsNEJBQTRCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbi8qXHJcbiAgICBzb3VyY2UgY29kZSBmb3IgdGV4dCAyIGN1cnZlIGZvciBmaWdtYVxyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG5pbXBvcnQgKiBhcyBDdXJ2ZSBmcm9tICcuL3RzL2N1cnZlJztcclxuaW1wb3J0ICogYXMgVGV4dCBmcm9tICcuL3RzL3RleHQnO1xyXG4vLyBtYWluIGNvZGVcclxuLy9hc3luYyByZXF1aXJlZCBiZWNhdXNlIGZpZ21hIGFwaSByZXF1aXJlcyB5b3UgdG8gbG9hZCBmb250cyBpbnRvIHRoZSBwbHVnaW4gdG8gdXNlIHRoZW1cclxuLy9ob25lc3RseSBpbSByZWFsbHkgdGVtcHRlZCB0byBqdXN0IGhhcmRjb2RlIHJvYm90byBpbnN0ZWFkXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbignbm90aGluZ3Mgc2VsZWN0ZWQgZHVtYmFzcycpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmICggc2VsZWN0aW9uLmxlbmd0aCA+IDIgfHwgc2VsZWN0aW9uLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAvLyAgIGZpZ21hLmNsb3NlUGx1Z2luKFwieW91IG5lZWQgVFdPIHRoaW5ncyBzZWxlY3RlZCBjYW4geW91IHJlYWQ/XCIpO1xyXG4gICAgICAgIC8vICAgLy9yZXR1cm47XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1ZFQ1RPUicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnJ1aFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlY3RvcnMgPSBDdXJ2ZS5zdmcyQXJyKG5vZGUudmVjdG9yUGF0aHNbMF0uZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImJydWhcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYW4gaHRtbCBzdmcgZWxlbWVudCBiZWNhc3VlIHRoZSBidWlsdGluIGZ1bmN0aW9uIG9ubHkgd29ya3Mgb24gc3ZnIGZpbGVzXHJcbiAgICAgICAgICAgICAgICAvLyBzbyBhcHBhcmVudGx5IHlvdSBjYW50IGV2ZW4gaW5pdCBhIHN2ZyBwYXRoIGhlcmUgc28gaSBoYXZlIHRvIHNlbmQgaXQgdG8gdGhlIFVJIEhUTUxcclxuICAgICAgICAgICAgICAgIC8vTUFTU0lWIEJyVUhcclxuICAgICAgICAgICAgICAgIHZhciB4ID0gbm9kZS54O1xyXG4gICAgICAgICAgICAgICAgdmFyIHkgPSBub2RlLnk7XHJcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdzdmcnLCB2ZWN0b3JzLCB4LCB5IH0pO1xyXG4gICAgICAgICAgICAgICAgLy90ZXN0ZGF0YXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RkYXRhID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFsxLjM4ODU4NjQwMTkzOTM5MiwgMjEuNzI5MTU0NTg2NzkxOTkyXSxcclxuICAgICAgICAgICAgICAgICAgICBbLTQuMDc0OTg5NDM4MDU2OTQ2LCAyLjIyOTE1MDc3MjA5NDcyNjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFs2LjkyNDk4Nzc5Mjk2ODc1LCAtMy43NzU3NDk0NDQ5NjE1NDhdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsyOC4zODg1OTE3NjYzNTc0MjIsIDIuMjI5MTUyNDQxMDI0NzgwM11cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBhID0gcG9pbnRPbkN1cnZlKHRlc3RkYXRhKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Tm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciAodmFyIGIgPTA7YiA8IGEubGVuZ3RoO2IrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRpZiAoaXNOYU4oYVtiXVswXVswXSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0fSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0Y29uc3QgdGVzdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0LnJlc2l6ZSgxLDEpO1xyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0Lnk9YVtiXVswXVswXVxyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0Lng9YVtiXVswXVsxXVxyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0LnJvdGF0aW9uPWFbYl1bMF1bMl1cclxuICAgICAgICAgICAgICAgIC8vIFx0ZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQodGVzdClcclxuICAgICAgICAgICAgICAgIC8vIFx0bmV3Tm9kZXMucHVzaCh0ZXN0KVxyXG4gICAgICAgICAgICAgICAgLy8gXHR9XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PSAnVEVYVCcpIHtcclxuICAgICAgICAgICAgICAgIC8vdGhlIGZvbnQgbG9hZGluZyBwYXJ0XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKHtcclxuICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IG5vZGUuZm9udE5hbWVbJ2ZhbWlseSddLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBub2RlLmZvbnROYW1lWydzdHlsZSddXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFRleHQudGV4dDJDdXJ2ZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGNhbGNDdXJ2ZXModmVjdG9ycywgdmVjdG9yTGVuZ3RocywgeCwgeSkge1xyXG4gICAgbGV0IHBvaW50QXJyID0gW107XHJcbiAgICBmb3IgKHZhciBjdXJ2ZSBpbiB2ZWN0b3JzKSB7XHJcbiAgICAgICAgcG9pbnRBcnIucHVzaCguLi5DdXJ2ZS5wb2ludE9uQ3VydmUodmVjdG9yc1tjdXJ2ZV0sIDEwMCwgdHJ1ZSkpO1xyXG4gICAgfVxyXG4gICAgbGV0IGEgPSBwb2ludEFycjtcclxuICAgIGNvbnN0IG5ld05vZGVzID0gW107XHJcbiAgICBmb3IgKHZhciBiID0gMDsgYiA8IGEubGVuZ3RoOyBiKyspIHtcclxuICAgICAgICBpZiAoaXNOYU4oYVtiXVswXVswXSkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcclxuICAgICAgICAgICAgdGVzdC5yZXNpemVXaXRob3V0Q29uc3RyYWludHMoMC4xLCAwLjQpO1xyXG4gICAgICAgICAgICB0ZXN0LnkgPSBhW2JdWzBdWzFdO1xyXG4gICAgICAgICAgICB0ZXN0LnggPSBhW2JdWzBdWzBdO1xyXG4gICAgICAgICAgICB0ZXN0LnJvdGF0aW9uID0gYVtiXVswXVsyXTtcclxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQodGVzdCk7XHJcbiAgICAgICAgICAgIG5ld05vZGVzLnB1c2godGVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZmlnbWEuZmxhdHRlbihuZXdOb2Rlcyk7XHJcbiAgICBjb25zb2xlLmxvZyhwb2ludEFycik7XHJcbn1cclxuLy8gVGhpcyBzaG93cyB0aGUgSFRNTCBwYWdlIGluIFwidWkuaHRtbFwiLlxyXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgbGV0IHNlbGVjdHR5cGUgPSBcIm5vdGhpbmdcIjtcclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcclxuICAgICAgICBzZWxlY3R0eXBlID0gXCJub3RoaW5nXCI7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIHNlbGVjdGVkXCIpO1xyXG4gICAgfVxyXG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnc2VsZWN0aW9uJywgc2VsZWN0dHlwZSB9KTtcclxufSk7XHJcbi8vIENhbGxzIHRvIFwicGFyZW50LnBvc3RNZXNzYWdlXCIgZnJvbSB3aXRoaW4gdGhlIEhUTUwgcGFnZSB3aWxsIHRyaWdnZXIgdGhpc1xyXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcclxuLy8gcG9zdGVkIG1lc3NhZ2UuXHJcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdkby10aGUtdGhpbmcnKSB7XHJcbiAgICAgICAgbWFpbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1zZy50eXBlID09PSAnY2FuY2VsJykge1xyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCdrJyk7XHJcbiAgICB9XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzdmcnKSB7XHJcbiAgICAgICAgLy90dXJucyBvdXQgdSBkb250IG5lZWQgdGhpcyBvb3BzXHJcbiAgICAgICAgLy92YXIgcmVsdmVjdCA9IGFiczJyZWwobXNnLnZlY3RvcnNbMF0sIG1zZy54LCBtc2cueSlcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlbHZlY3QpXHJcbiAgICAgICAgY2FsY0N1cnZlcyhtc2cudmVjdG9ycywgbXNnLnZlY3Rvckxlbmd0aHMsIG1zZy54LCBtc2cueSk7XHJcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcclxuICAgIH1cclxuICAgIC8vIE1ha2Ugc3VyZSB0byBjbG9zZSB0aGUgcGx1Z2luIHdoZW4geW91J3JlIGRvbmUuIE90aGVyd2lzZSB0aGUgcGx1Z2luIHdpbGxcclxuICAgIC8vIGtlZXAgcnVubmluZywgd2hpY2ggc2hvd3MgdGhlIGNhbmNlbCBidXR0b24gYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuLlxyXG4gICAgLy8gd2hhdCBpZiBpIGRvbnQgd2FubmEgbG1hby4gZGVmYXVsdCBnZW5lcmF0ZWQgdHV0b3JpYWwgaGVhZGFzc1xyXG59O1xyXG4iLCIvKlxyXG4gICAgY29kZSBmb3IgYWxsIHRoZSBjdXJ2ZSBoYW5kbGluZyBmdW5jdGlvbnNcclxuICAgIGNyZWF0ZXI6IGxhc3QgbmlnaHRcclxuICAgIHdlYnNpdGU6IG5vdHNpbW9uLnNwYWNlXHJcbiAgICB2ZXJzaW9uOiBpbSBiYWJ5XHJcbiAgICBnaXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9jb2RlbGFzdG5pZ2h0L3RvLXBhdGgtZmlnbWFcclxuKi9cclxuLy90dXJuIHdoYXRldmVyIHRoZSBmdWNrIHN2ZyBjb2RlIGlzIGludG8gYXJyYXkgb2YgcG9pbnRzIGdyb3VwZWQgaW50byA0IG9yIDIgKCB0aGlzIGlzIGRlcGVuZGFudCBvbiB3aGF0IHR5cGUgb2YgYmV6aWVyIGN1cnZlIGl0IGlzLiBsb29rIGl0IHVwKVxyXG4vLyBmaWdtYSBkb2VzbnQgaGF2ZSB0aGUgMyBwb2ludCBiZXppZXIgY3VydmUgaW4gdmVjdG9yIG1vZGUsIG9ubHkgNCBvciAyLlxyXG5pbXBvcnQgKiBhcyBFeHRyYSBmcm9tICcuL2V4dHJhJztcclxuZXhwb3J0IHZhciBzdmcyQXJyID0gZnVuY3Rpb24gKHN2Z0RhdGEpIHtcclxuICAgIC8qXHJcbiAgICBzdmdEYXRhOiB0aGUgZnVja2luZyBzaGl0dHkgc3ZnIHBhdGggZGF0YSBmdWNrXHJcbiAgICBpIHdhbnQgaXQgdG8gZW5kIHVwIGxpa2U6IFtbcG9pbnQxLDIsMyw0XSxbNCw1XSxbNSw2LDcsOF0uLi4uXVxyXG4gICAgaSBmdWNraW5nIGhhdGUgdGhpcyBzaGl0XHJcbiAgICAqL1xyXG4gICAgY29uc29sZS5sb2coXCJicnVoMlwiKTtcclxuICAgIGxldCB0ZXN0ID0gc3ZnRGF0YS5zcGxpdCgnTScpOyAvL3NwbGl0IGlmIG1vcmUgdGhlbiAxIHNlY3Rpb24gYW5kIGdldHMgcmlkIG9mIHRoZSBleHRyYSBhcnJheSB2YWx1ZSBhdCBmcm9udFxyXG4gICAgdGVzdC5zaGlmdCgpO1xyXG4gICAgaWYgKHRlc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIC8vIHRocm93IGVycm9yIGlmIHRoZXJlcyB0b28gbWFueSBsaW5lcyBiZWNhc3VlIGltIGxhenlcclxuICAgICAgICB0aHJvdyAnVE9PIE1BTlkgTElORVMhISExMTExIHRoaXMgb25seSBzdXBwb3J0cyBvbmUgY29udGlub3VzIHZlY3Rvcic7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGNsZWFuVHlwZSA9IFtdO1xyXG4gICAgdmFyIHBvbyA9IHRlc3RbMF0udHJpbSgpLnNwbGl0KC8gTHxDIC8pOyAvLyBzcGxpdHMgc3RyaW5nIGludG8gdGhlIGNodW5rcyBvZiBkaWZmZXJlbnQgbGluZXNcclxuICAgIHZhciBzcGxpY2VpbiA9IFtdO1xyXG4gICAgZm9yICh2YXIgZSBpbiBwb28pIHtcclxuICAgICAgICAvL21hZ2ljXHJcbiAgICAgICAgdmFyIHNhZCA9IEV4dHJhLmFyckNodW5rKHBvb1tlXS50cmltKCkuc3BsaXQoJyAnKSwgMik7XHJcbiAgICAgICAgLy90aGlzIGFkZHMgdGhlIGxhc3QgcG9pbnQgZnJvbSB0aGUgcHJldmlvdXMgYXJyYXkgaW50byB0aGUgbmV4dCBvbmUuXHJcbiAgICAgICAgc2FkLnVuc2hpZnQoc3BsaWNlaW4pO1xyXG4gICAgICAgIHNwbGljZWluID0gc2FkW3NhZC5sZW5ndGggLSAxXTtcclxuICAgICAgICBjbGVhblR5cGUucHVzaChzYWQpO1xyXG4gICAgfVxyXG4gICAgY2xlYW5UeXBlLnNoaWZ0KCk7IC8vIGdldCByaWQgb2YgdGhlIGV4dHJhIGVtcHR5IGFycmF5IHZhbHVlXHJcbiAgICByZXR1cm4gY2xlYW5UeXBlO1xyXG59O1xyXG4vLyB0dXJucyB0aGUgYWJzb2x1dGUgdmFsdWVzIG9mIHBvaW50cyBpbiB0byByZWxhdGl2ZVxyXG5leHBvcnQgdmFyIGFiczJyZWwgPSBmdW5jdGlvbiAoUG9pbnRBcnIsIHgsIHkpIHtcclxuICAgIHZhciByZWxjdXJ2ZSA9IFtdO1xyXG4gICAgZm9yICh2YXIgZSBpbiBQb2ludEFycikge1xyXG4gICAgICAgIHZhciByZWxwb2ludCA9IFtOdW1iZXIoUG9pbnRBcnJbZV1bMF0pIC0geCwgTnVtYmVyKFBvaW50QXJyW2VdWzFdKSAtIHldO1xyXG4gICAgICAgIHJlbGN1cnZlLnB1c2gocmVscG9pbnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFBvaW50QXJyW2VdKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZWxjdXJ2ZTtcclxufTtcclxuLy9kaXN0YW5jZSBiZXR3ZWVuIHBvaW50cyBhIGFuZCBiXHJcbmV4cG9ydCB2YXIgZGlzdEJ0d24gPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgLypcclxuICBhOiBbeDEseTFdXHJcbiAgYjogW3gyLHkyXVxyXG4gICovXHJcbiAgICBmb3IgKHZhciBjIGluIGEpIHtcclxuICAgICAgICBhW2NdID0gTnVtYmVyKGFbY10pO1xyXG4gICAgICAgIGJbY10gPSBOdW1iZXIoYltjXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KChiWzBdIC0gYVswXSksIDIpICsgTWF0aC5wb3coKGJbMV0gLSBhWzFdKSwgMikpO1xyXG59O1xyXG4vL2ZpbmQgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzIGEgYW5kIGIgb3ZlciB0aW1lXHJcbi8vIGluIHRoaXMgY2FzZSB0aW1lIGlzIHBpeGVsc1xyXG5leHBvcnQgdmFyIHBvaW50QnR3biA9IGZ1bmN0aW9uIChhLCBiLCB0LCB0aW1lKSB7XHJcbiAgICAvKlxyXG4gIGE6IFt4MSx5MV1cclxuICBiOiBbeDIseTJdXHJcbiAgdGltZTogbnVtYmVyXHJcbiAgcm90YXRpb246IGFsc28gcmV0dXJuIHJvdGF0aW9uIGlmIHRydWVcclxuICAqL1xyXG4gICAgZm9yICh2YXIgYyBpbiBhKSB7XHJcbiAgICAgICAgYVtjXSA9IE51bWJlcihhW2NdKTtcclxuICAgICAgICBiW2NdID0gTnVtYmVyKGJbY10pO1xyXG4gICAgfVxyXG4gICAgLy9maW5kIHRoZSB1bml0ICB2ZWN0b3IgYmV0d2VlbiBwb2ludHMgYSBhbmQgYlxyXG4gICAgLy8gbm90IHJlYWxseSB1bml0IHZlY3RvciBpbiB0aGUgbWF0aCBzZW5zZSB0aG9cclxuICAgIGNvbnN0IHVuaXRWZWN0b3IgPSBbKGJbMF0gLSBhWzBdKSAvIHRpbWUsIChiWzFdIC0gYVsxXSkgLyB0aW1lXTtcclxuICAgIHJldHVybiBbYVswXSArIHVuaXRWZWN0b3JbMF0gKiB0LCBhWzFdICsgdW5pdFZlY3RvclsxXSAqIHRdO1xyXG59O1xyXG4vL2NhbGN1bGF0ZSBEZSBDYXN0ZWxqYXXigJlzIGFsZ29yaXRobSBmcm9tIDItNCBwb2ludHMgIGh0dHBzOi8vamF2YXNjcmlwdC5pbmZvL2Jlemllci1jdXJ2ZVxyXG4vLyBiYXNpY2FsbHkgdHVybnMgNCBwb2ludHMgb24gYSBiZWl6ZXIgaW50byBhIGN1cnZlXHJcbmV4cG9ydCB2YXIgcG9pbnRPbkN1cnZlID0gZnVuY3Rpb24gKGN1cnZlLCB0aW1lID0gMTAwLCByb3RhdGlvbiA9IGZhbHNlKSB7XHJcbiAgICAvKlxyXG4gIGN1cnZlIFtwb2ludDEsIHBvaW50MiwgcG9pbnQzLCBwb2ludDRdXHJcbiAgICAgLSBlYWNoIHBvaW50OiBbeCx5XVxyXG4gICovXHJcbiAgICB2YXIgY2FzdGVsamF1ID0gZnVuY3Rpb24gKGN1cnZlLCB0LCB0aW1lLCByb3RhdGlvbiA9IGZhbHNlLCBsYXN0cm90ID0gMCkge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGN1cnZlLmxlbmd0aCAtIDE7IGMrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gZGlzdEJ0d24oY3VydmVbY10sIGN1cnZlW2MgKyAxXSk7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBvaW50QnR3bihjdXJ2ZVtjXSwgY3VydmVbYyArIDFdLCB0LCB0aW1lKTtcclxuICAgICAgICAgICAgYXJyLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBpZiAocm90YXRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vZmlnbWEgd2FudHMgdGhpcyBudW1iZXIgdG8gYmUgaW4gZGVncmVlcyBiZWNhc3VlIGZ1Y2sgeW91IGkgZ3Vlc3NcclxuICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbigoY3VydmVbYyArIDFdWzBdIC0gY3VydmVbY11bMF0pIC8gKGN1cnZlW2MgKyAxXVsxXSAtIGN1cnZlW2NdWzFdKSkgKlxyXG4gICAgICAgICAgICAgICAgICAgICgxODAgLyBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlID0gOTAgKyBhbmdsZTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJ2ZVtjICsgMV1bMV0gLSBjdXJ2ZVtjXVsxXSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDE4MCArIGFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcG9pbnQucHVzaChhbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICBsZXQgZmluYWxhcnIgPSBbXTtcclxuICAgIGlmIChjdXJ2ZS5sZW5ndGggPT0gMikge1xyXG4gICAgICAgIGZvciAodmFyIHQgPSAxOyB0IDwgdGltZTsgdCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmaW5hbGFyci5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3Ryb3QgPSBmaW5hbGFycltmaW5hbGFyci5sZW5ndGggLSAxXVsyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgYXJyMSA9IGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSwgcm90YXRpb24sIGxhc3Ryb3QpO1xyXG4gICAgICAgICAgICBmaW5hbGFyci5wdXNoKGFycjEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIHQgPSAxOyB0IDw9IHRpbWU7IHQrKykge1xyXG4gICAgICAgICAgICBpZiAoZmluYWxhcnIubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cm90ID0gZmluYWxhcnJbZmluYWxhcnIubGVuZ3RoIC0gMV1bMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGFycjEgPSBjYXN0ZWxqYXUoY3VydmUsIHQsIHRpbWUpO1xyXG4gICAgICAgICAgICBsZXQgYXJyMiA9IGNhc3RlbGphdShhcnIxLCB0LCB0aW1lKTtcclxuICAgICAgICAgICAgbGV0IGFycjMgPSBjYXN0ZWxqYXUoYXJyMiwgdCwgdGltZSwgcm90YXRpb24sIGxhc3Ryb3QpO1xyXG4gICAgICAgICAgICAvL2NvdWxkIGkgdXNlIHJlY3Vyc2l2ZT8geWVhLiBhbSBpIGdvbm5hPyBubyB0aGF0IHNvdW5kcyBsaWtlIHdvcmtcclxuICAgICAgICAgICAgLy8gbGV0IGFycjEgPSBjYXN0ZWxqYXUoXHJcbiAgICAgICAgICAgIC8vIFx0Y2FzdGVsamF1KGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSksIHQsIHRpbWUpLFxyXG4gICAgICAgICAgICAvLyBcdHQsXHJcbiAgICAgICAgICAgIC8vIFx0dGltZSxcclxuICAgICAgICAgICAgLy8gXHRyb3RhdGlvblxyXG4gICAgICAgICAgICAvLyApXHJcbiAgICAgICAgICAgIGZpbmFsYXJyLnB1c2goYXJyMyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbmFsYXJyO1xyXG59O1xyXG4iLCIvKlxyXG4gICAgbWlzYyBmdW5jdGlvbnNcclxuICAgIGNyZWF0ZXI6IGxhc3QgbmlnaHRcclxuICAgIHdlYnNpdGU6IG5vdHNpbW9uLnNwYWNlXHJcbiAgICB2ZXJzaW9uOiBpbSBiYWJ5XHJcbiAgICBnaXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9jb2RlbGFzdG5pZ2h0L3RvLXBhdGgtZmlnbWFcclxuKi9cclxuLy9zcGxpdHMgYXJyYXkgaW50byBjaHVua3NcclxuLy8gZ290IHRoaXMgY29kZSBmcm9tIGh0dHBzOi8vbWVkaXVtLmNvbS9ARHJhZ29uemEvZm91ci13YXlzLXRvLWNodW5rLWFuLWFycmF5LWUxOWM4ODllYWM0XHJcbi8vIGF1dGhvcjogTmdvYyBWdW9uZyBodHRwczovL2RyYWdvbnphLmlvXHJcbmV4cG9ydCB2YXIgYXJyQ2h1bmsgPSBmdW5jdGlvbiAoYXJyYXksIHNpemUpIHtcclxuICAgIGNvbnN0IGNodW5rZWQgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsYXN0ID0gY2h1bmtlZFtjaHVua2VkLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmICghbGFzdCB8fCBsYXN0Lmxlbmd0aCA9PT0gc2l6ZSkge1xyXG4gICAgICAgICAgICBjaHVua2VkLnB1c2goW2FycmF5W2ldXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsYXN0LnB1c2goYXJyYXlbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjaHVua2VkO1xyXG59O1xyXG4iLCIvKlxyXG4gICAgY29kZSBmb3IgYWxsIHRoZSB0ZXh0IGhhbmRsaW5nIGZ1bmN0aW9uc1xyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG4vL2NvbnZlcnQgdGV4dCBpbnRvIGluZGl2aXN1YWwgY2hhcmFjdGVyc1xyXG5leHBvcnQgZnVuY3Rpb24gdGV4dDJDdXJ2ZShub2RlKSB7XHJcbiAgICAvL2NvbnZlcnQgdGV4dCBpbnRvIGVhY2ggbGV0dGVyIGluZGl2dXNhbGx5XHJcbiAgICBjb25zdCBuZXdOb2RlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhckFyciA9IFsuLi5ub2RlLmNoYXJhY3RlcnNdO1xyXG4gICAgbGV0IHNwYWNpbmcgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoYXJhY3RlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsZXR0ZXIgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XHJcbiAgICAgICAgbGV0dGVyLmNoYXJhY3RlcnMgPSBjaGFyQXJyW2ldO1xyXG4gICAgICAgIC8vIGNlbnRlciB0aGUgbGV0dGVyc1xyXG4gICAgICAgIGxldHRlci50ZXh0QWxpZ25Ib3Jpem9udGFsID0gJ0NFTlRFUic7XHJcbiAgICAgICAgbGV0dGVyLnRleHRBbGlnblZlcnRpY2FsID0gJ0NFTlRFUic7XHJcbiAgICAgICAgbGV0dGVyLnRleHRBdXRvUmVzaXplID0gJ1dJRFRIX0FORF9IRUlHSFQnO1xyXG4gICAgICAgIC8vY29weSBzZXR0aW5nc1xyXG4gICAgICAgIGxldHRlci5mb250U2l6ZSA9IG5vZGUuZm9udFNpemU7XHJcbiAgICAgICAgbGV0dGVyLmZvbnROYW1lID0gbm9kZS5mb250TmFtZTtcclxuICAgICAgICAvL3NldCBsb2NhdGlvbnNcclxuICAgICAgICBsZXR0ZXIueCA9IG5vZGUueCArIHNwYWNpbmc7XHJcbiAgICAgICAgbGV0dGVyLnkgPSBub2RlLnkgKyBub2RlLmhlaWdodCArIDM7XHJcbiAgICAgICAgLy9zcGFjZWluZyB0aGVtXHJcbiAgICAgICAgc3BhY2luZyA9IHNwYWNpbmcgKyBsZXR0ZXIud2lkdGg7XHJcbiAgICAgICAgLy9yb3RhdGVcclxuICAgICAgICAvL2FwcGVuZCB0aGF0IHNoaXRcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChsZXR0ZXIpO1xyXG4gICAgICAgIG5ld05vZGVzLnB1c2gobGV0dGVyKTtcclxuICAgIH1cclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5ld05vZGVzO1xyXG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5ld05vZGVzKTtcclxuICAgIHJldHVybjtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9
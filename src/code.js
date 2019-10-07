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
/*! no static exports found */
/***/ (function(module, exports) {

/*
    source code for text 2 curve for figma
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        console.log(msg);
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixVQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNEJBQTRCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsNkJBQTZCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxhQUFhO0FBQzlDO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsIi8qXHJcbiAgICBzb3VyY2UgY29kZSBmb3IgdGV4dCAyIGN1cnZlIGZvciBmaWdtYVxyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbi8vc3BsaXRzIGFycmF5IGludG8gY2h1bmtzXHJcbi8vIGdvdCB0aGlzIGNvZGUgZnJvbSBodHRwczovL21lZGl1bS5jb20vQERyYWdvbnphL2ZvdXItd2F5cy10by1jaHVuay1hbi1hcnJheS1lMTljODg5ZWFjNFxyXG4vLyBhdXRob3I6IE5nb2MgVnVvbmcgaHR0cHM6Ly9kcmFnb256YS5pb1xyXG52YXIgYXJyQ2h1bmsgPSBmdW5jdGlvbiAoYXJyYXksIHNpemUpIHtcclxuICAgIGNvbnN0IGNodW5rZWQgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsYXN0ID0gY2h1bmtlZFtjaHVua2VkLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmICghbGFzdCB8fCBsYXN0Lmxlbmd0aCA9PT0gc2l6ZSkge1xyXG4gICAgICAgICAgICBjaHVua2VkLnB1c2goW2FycmF5W2ldXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsYXN0LnB1c2goYXJyYXlbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjaHVua2VkO1xyXG59O1xyXG4vL3R1cm4gd2hhdGV2ZXIgdGhlIGZ1Y2sgc3ZnIGNvZGUgaXMgaW50byBhcnJheSBvZiBwb2ludHMgZ3JvdXBlZCBpbnRvIDQgb3IgMiAoIHRoaXMgaXMgZGVwZW5kYW50IG9uIHdoYXQgdHlwZSBvZiBiZXppZXIgY3VydmUgaXQgaXMuIGxvb2sgaXQgdXApXHJcbi8vIGZpZ21hIGRvZXNudCBoYXZlIHRoZSAzIHBvaW50IGJlemllciBjdXJ2ZSBpbiB2ZWN0b3IgbW9kZSwgb25seSA0IG9yIDIuXHJcbnZhciBzdmcyQXJyID0gZnVuY3Rpb24gKHN2Z0RhdGEpIHtcclxuICAgIC8qXHJcbiAgICBzdmdEYXRhOiB0aGUgZnVja2luZyBzaGl0dHkgc3ZnIHBhdGggZGF0YSBmdWNrXHJcbiAgICBpIHdhbnQgaXQgdG8gZW5kIHVwIGxpa2U6IFtbcG9pbnQxLDIsMyw0XSxbNCw1XSxbNSw2LDcsOF0uLi4uXVxyXG4gICAgaSBmdWNraW5nIGhhdGUgdGhpcyBzaGl0XHJcbiAgICAqL1xyXG4gICAgbGV0IHRlc3QgPSBzdmdEYXRhLnNwbGl0KCdNJyk7IC8vc3BsaXQgaWYgbW9yZSB0aGVuIDEgc2VjdGlvbiBhbmQgZ2V0cyByaWQgb2YgdGhlIGV4dHJhIGFycmF5IHZhbHVlIGF0IGZyb250XHJcbiAgICB0ZXN0LnNoaWZ0KCk7XHJcbiAgICBpZiAodGVzdC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgLy8gdGhyb3cgZXJyb3IgaWYgdGhlcmVzIHRvbyBtYW55IGxpbmVzIGJlY2FzdWUgaW0gbGF6eVxyXG4gICAgICAgIHRocm93ICdUT08gTUFOWSBMSU5FUyEhITExMTEgdGhpcyBvbmx5IHN1cHBvcnRzIG9uZSBjb250aW5vdXMgdmVjdG9yJztcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgY2xlYW5UeXBlID0gW107XHJcbiAgICB2YXIgcG9vID0gdGVzdFswXS50cmltKCkuc3BsaXQoLyBMfEMgLyk7IC8vIHNwbGl0cyBzdHJpbmcgaW50byB0aGUgY2h1bmtzIG9mIGRpZmZlcmVudCBsaW5lc1xyXG4gICAgdmFyIHNwbGljZWluID0gW107XHJcbiAgICBmb3IgKHZhciBlIGluIHBvbykge1xyXG4gICAgICAgIC8vbWFnaWNcclxuICAgICAgICB2YXIgc2FkID0gYXJyQ2h1bmsocG9vW2VdLnRyaW0oKS5zcGxpdCgnICcpLCAyKTtcclxuICAgICAgICAvL3RoaXMgYWRkcyB0aGUgbGFzdCBwb2ludCBmcm9tIHRoZSBwcmV2aW91cyBhcnJheSBpbnRvIHRoZSBuZXh0IG9uZS5cclxuICAgICAgICBzYWQudW5zaGlmdChzcGxpY2Vpbik7XHJcbiAgICAgICAgc3BsaWNlaW4gPSBzYWRbc2FkLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGNsZWFuVHlwZS5wdXNoKHNhZCk7XHJcbiAgICB9XHJcbiAgICBjbGVhblR5cGUuc2hpZnQoKTsgLy8gZ2V0IHJpZCBvZiB0aGUgZXh0cmEgZW1wdHkgYXJyYXkgdmFsdWVcclxuICAgIHJldHVybiBjbGVhblR5cGU7XHJcbn07XHJcbi8vIHR1cm5zIHRoZSBhYnNvbHV0ZSB2YWx1ZXMgb2YgcG9pbnRzIGluIHRvIHJlbGF0aXZlXHJcbnZhciBhYnMycmVsID0gZnVuY3Rpb24gKFBvaW50QXJyLCB4LCB5KSB7XHJcbiAgICB2YXIgcmVsY3VydmUgPSBbXTtcclxuICAgIGZvciAodmFyIGUgaW4gUG9pbnRBcnIpIHtcclxuICAgICAgICB2YXIgcmVscG9pbnQgPSBbTnVtYmVyKFBvaW50QXJyW2VdWzBdKSAtIHgsIE51bWJlcihQb2ludEFycltlXVsxXSkgLSB5XTtcclxuICAgICAgICByZWxjdXJ2ZS5wdXNoKHJlbHBvaW50KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhQb2ludEFycltlXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVsY3VydmU7XHJcbn07XHJcbi8vZGlzdGFuY2UgYmV0d2VlbiBwb2ludHMgYSBhbmQgYlxyXG52YXIgZGlzdEJ0d24gPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgLypcclxuICBhOiBbeDEseTFdXHJcbiAgYjogW3gyLHkyXVxyXG4gICovXHJcbiAgICBmb3IgKHZhciBjIGluIGEpIHtcclxuICAgICAgICBhW2NdID0gTnVtYmVyKGFbY10pO1xyXG4gICAgICAgIGJbY10gPSBOdW1iZXIoYltjXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KChiWzBdIC0gYVswXSksIDIpICsgTWF0aC5wb3coKGJbMV0gLSBhWzFdKSwgMikpO1xyXG59O1xyXG4vL2ZpbmQgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzIGEgYW5kIGIgb3ZlciB0aW1lXHJcbi8vIGluIHRoaXMgY2FzZSB0aW1lIGlzIHBpeGVsc1xyXG52YXIgcG9pbnRCdHduID0gZnVuY3Rpb24gKGEsIGIsIHQsIHRpbWUpIHtcclxuICAgIC8qXHJcbiAgYTogW3gxLHkxXVxyXG4gIGI6IFt4Mix5Ml1cclxuICB0aW1lOiBudW1iZXJcclxuICByb3RhdGlvbjogYWxzbyByZXR1cm4gcm90YXRpb24gaWYgdHJ1ZVxyXG4gICovXHJcbiAgICBmb3IgKHZhciBjIGluIGEpIHtcclxuICAgICAgICBhW2NdID0gTnVtYmVyKGFbY10pO1xyXG4gICAgICAgIGJbY10gPSBOdW1iZXIoYltjXSk7XHJcbiAgICB9XHJcbiAgICAvL2ZpbmQgdGhlIHVuaXQgIHZlY3RvciBiZXR3ZWVuIHBvaW50cyBhIGFuZCBiXHJcbiAgICAvLyBub3QgcmVhbGx5IHVuaXQgdmVjdG9yIGluIHRoZSBtYXRoIHNlbnNlIHRob1xyXG4gICAgY29uc3QgdW5pdFZlY3RvciA9IFsoYlswXSAtIGFbMF0pIC8gdGltZSwgKGJbMV0gLSBhWzFdKSAvIHRpbWVdO1xyXG4gICAgcmV0dXJuIFthWzBdICsgdW5pdFZlY3RvclswXSAqIHQsIGFbMV0gKyB1bml0VmVjdG9yWzFdICogdF07XHJcbn07XHJcbi8vY2FsY3VsYXRlIERlIENhc3RlbGphdeKAmXMgYWxnb3JpdGhtIGZyb20gMi00IHBvaW50cyAgaHR0cHM6Ly9qYXZhc2NyaXB0LmluZm8vYmV6aWVyLWN1cnZlXHJcbi8vIGJhc2ljYWxseSB0dXJucyA0IHBvaW50cyBvbiBhIGJlaXplciBpbnRvIGEgY3VydmVcclxuZnVuY3Rpb24gcG9pbnRPbkN1cnZlKGN1cnZlLCB0aW1lID0gMTAwLCByb3RhdGlvbiA9IGZhbHNlKSB7XHJcbiAgICAvKlxyXG4gIGN1cnZlIFtwb2ludDEsIHBvaW50MiwgcG9pbnQzLCBwb2ludDRdXHJcbiAgICAgLSBlYWNoIHBvaW50OiBbeCx5XVxyXG4gICovXHJcbiAgICB2YXIgY2FzdGVsamF1ID0gZnVuY3Rpb24gKGN1cnZlLCB0LCB0aW1lLCByb3RhdGlvbiA9IGZhbHNlLCBsYXN0cm90ID0gMCkge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGN1cnZlLmxlbmd0aCAtIDE7IGMrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gZGlzdEJ0d24oY3VydmVbY10sIGN1cnZlW2MgKyAxXSk7XHJcbiAgICAgICAgICAgIGxldCBwb2ludCA9IHBvaW50QnR3bihjdXJ2ZVtjXSwgY3VydmVbYyArIDFdLCB0LCB0aW1lKTtcclxuICAgICAgICAgICAgYXJyLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICBpZiAocm90YXRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vZmlnbWEgd2FudHMgdGhpcyBudW1iZXIgdG8gYmUgaW4gZGVncmVlcyBiZWNhc3VlIGZ1Y2sgeW91IGkgZ3Vlc3NcclxuICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbigoY3VydmVbYyArIDFdWzBdIC0gY3VydmVbY11bMF0pIC8gKGN1cnZlW2MgKyAxXVsxXSAtIGN1cnZlW2NdWzFdKSkgKlxyXG4gICAgICAgICAgICAgICAgICAgICgxODAgLyBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgIGFuZ2xlID0gOTAgKyBhbmdsZTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJ2ZVtjICsgMV1bMV0gLSBjdXJ2ZVtjXVsxXSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZSA9IDE4MCArIGFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcG9pbnQucHVzaChhbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICBsZXQgZmluYWxhcnIgPSBbXTtcclxuICAgIGlmIChjdXJ2ZS5sZW5ndGggPT0gMikge1xyXG4gICAgICAgIGZvciAodmFyIHQgPSAxOyB0IDwgdGltZTsgdCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmaW5hbGFyci5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3Ryb3QgPSBmaW5hbGFycltmaW5hbGFyci5sZW5ndGggLSAxXVsyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgYXJyMSA9IGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSwgcm90YXRpb24sIGxhc3Ryb3QpO1xyXG4gICAgICAgICAgICBmaW5hbGFyci5wdXNoKGFycjEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIHQgPSAxOyB0IDw9IHRpbWU7IHQrKykge1xyXG4gICAgICAgICAgICBpZiAoZmluYWxhcnIubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cm90ID0gZmluYWxhcnJbZmluYWxhcnIubGVuZ3RoIC0gMV1bMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGFycjEgPSBjYXN0ZWxqYXUoY3VydmUsIHQsIHRpbWUpO1xyXG4gICAgICAgICAgICBsZXQgYXJyMiA9IGNhc3RlbGphdShhcnIxLCB0LCB0aW1lKTtcclxuICAgICAgICAgICAgbGV0IGFycjMgPSBjYXN0ZWxqYXUoYXJyMiwgdCwgdGltZSwgcm90YXRpb24sIGxhc3Ryb3QpO1xyXG4gICAgICAgICAgICAvL2NvdWxkIGkgdXNlIHJlY3Vyc2l2ZT8geWVhLiBhbSBpIGdvbm5hPyBubyB0aGF0IHNvdW5kcyBsaWtlIHdvcmtcclxuICAgICAgICAgICAgLy8gbGV0IGFycjEgPSBjYXN0ZWxqYXUoXHJcbiAgICAgICAgICAgIC8vIFx0Y2FzdGVsamF1KGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSksIHQsIHRpbWUpLFxyXG4gICAgICAgICAgICAvLyBcdHQsXHJcbiAgICAgICAgICAgIC8vIFx0dGltZSxcclxuICAgICAgICAgICAgLy8gXHRyb3RhdGlvblxyXG4gICAgICAgICAgICAvLyApXHJcbiAgICAgICAgICAgIGZpbmFsYXJyLnB1c2goYXJyMyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbmFsYXJyO1xyXG59XHJcbi8vY29udmVydCB0ZXh0IGludG8gaW5kaXZpc3VhbCBjaGFyYWN0ZXJzXHJcbmZ1bmN0aW9uIHRleHQyQ3VydmUobm9kZSkge1xyXG4gICAgLy9jb252ZXJ0IHRleHQgaW50byBlYWNoIGxldHRlciBpbmRpdnVzYWxseVxyXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBbXTtcclxuICAgIGNvbnN0IGNoYXJBcnIgPSBbLi4ubm9kZS5jaGFyYWN0ZXJzXTtcclxuICAgIGxldCBzcGFjaW5nID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jaGFyYWN0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgbGV0dGVyID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xyXG4gICAgICAgIGxldHRlci5jaGFyYWN0ZXJzID0gY2hhckFycltpXTtcclxuICAgICAgICAvLyBjZW50ZXIgdGhlIGxldHRlcnNcclxuICAgICAgICBsZXR0ZXIudGV4dEFsaWduSG9yaXpvbnRhbCA9ICdDRU5URVInO1xyXG4gICAgICAgIGxldHRlci50ZXh0QWxpZ25WZXJ0aWNhbCA9ICdDRU5URVInO1xyXG4gICAgICAgIGxldHRlci50ZXh0QXV0b1Jlc2l6ZSA9ICdXSURUSF9BTkRfSEVJR0hUJztcclxuICAgICAgICAvL2NvcHkgc2V0dGluZ3NcclxuICAgICAgICBsZXR0ZXIuZm9udFNpemUgPSBub2RlLmZvbnRTaXplO1xyXG4gICAgICAgIGxldHRlci5mb250TmFtZSA9IG5vZGUuZm9udE5hbWU7XHJcbiAgICAgICAgLy9zZXQgbG9jYXRpb25zXHJcbiAgICAgICAgbGV0dGVyLnggPSBub2RlLnggKyBzcGFjaW5nO1xyXG4gICAgICAgIGxldHRlci55ID0gbm9kZS55ICsgbm9kZS5oZWlnaHQgKyAzO1xyXG4gICAgICAgIC8vc3BhY2VpbmcgdGhlbVxyXG4gICAgICAgIHNwYWNpbmcgPSBzcGFjaW5nICsgbGV0dGVyLndpZHRoO1xyXG4gICAgICAgIC8vcm90YXRlXHJcbiAgICAgICAgLy9hcHBlbmQgdGhhdCBzaGl0XHJcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQobGV0dGVyKTtcclxuICAgICAgICBuZXdOb2Rlcy5wdXNoKGxldHRlcik7XHJcbiAgICB9XHJcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBuZXdOb2RlcztcclxuICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhuZXdOb2Rlcyk7XHJcbiAgICByZXR1cm47XHJcbn1cclxuLy8gbWFpbiBjb2RlXHJcbi8vYXN5bmMgcmVxdWlyZWQgYmVjYXVzZSBmaWdtYSBhcGkgcmVxdWlyZXMgeW91IHRvIGxvYWQgZm9udHMgaW50byB0aGUgcGx1Z2luIHRvIHVzZSB0aGVtXHJcbi8vaG9uZXN0bHkgaW0gcmVhbGx5IHRlbXB0ZWQgdG8ganVzdCBoYXJkY29kZSByb2JvdG8gaW5zdGVhZFxyXG5mdW5jdGlvbiBtYWluKCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBsZXQgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oJ25vdGhpbmdzIHNlbGVjdGVkIGR1bWJhc3MnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiAoIHNlbGVjdGlvbi5sZW5ndGggPiAyIHx8IHNlbGVjdGlvbi5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgLy8gICBmaWdtYS5jbG9zZVBsdWdpbihcInlvdSBuZWVkIFRXTyB0aGluZ3Mgc2VsZWN0ZWQgY2FuIHlvdSByZWFkP1wiKTtcclxuICAgICAgICAvLyAgIC8vcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09ICdWRUNUT1InKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZWN0b3JzID0gc3ZnMkFycihub2RlLnZlY3RvclBhdGhzWzBdLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGFuIGh0bWwgc3ZnIGVsZW1lbnQgYmVjYXN1ZSB0aGUgYnVpbHRpbiBmdW5jdGlvbiBvbmx5IHdvcmtzIG9uIHN2ZyBmaWxlc1xyXG4gICAgICAgICAgICAgICAgLy8gc28gYXBwYXJlbnRseSB5b3UgY2FudCBldmVuIGluaXQgYSBzdmcgcGF0aCBoZXJlIHNvIGkgaGF2ZSB0byBzZW5kIGl0IHRvIHRoZSBVSSBIVE1MXHJcbiAgICAgICAgICAgICAgICAvL01BU1NJViBCclVIXHJcbiAgICAgICAgICAgICAgICB2YXIgeCA9IG5vZGUueDtcclxuICAgICAgICAgICAgICAgIHZhciB5ID0gbm9kZS55O1xyXG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnc3ZnJywgdmVjdG9ycywgeCwgeSB9KTtcclxuICAgICAgICAgICAgICAgIC8vdGVzdGRhdGFzXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ZGF0YSA9IFtcclxuICAgICAgICAgICAgICAgICAgICBbMS4zODg1ODY0MDE5MzkzOTIsIDIxLjcyOTE1NDU4Njc5MTk5Ml0sXHJcbiAgICAgICAgICAgICAgICAgICAgWy00LjA3NDk4OTQzODA1Njk0NiwgMi4yMjkxNTA3NzIwOTQ3MjY2XSxcclxuICAgICAgICAgICAgICAgICAgICBbNi45MjQ5ODc3OTI5Njg3NSwgLTMuNzc1NzQ5NDQ0OTYxNTQ4XSxcclxuICAgICAgICAgICAgICAgICAgICBbMjguMzg4NTkxNzY2MzU3NDIyLCAyLjIyOTE1MjQ0MTAyNDc4MDNdXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgLy92YXIgYSA9IHBvaW50T25DdXJ2ZSh0ZXN0ZGF0YSlcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld05vZGVzID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgKHZhciBiID0wO2IgPCBhLmxlbmd0aDtiKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0aWYgKGlzTmFOKGFbYl1bMF1bMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBcdGNvbnN0IHRlc3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcclxuICAgICAgICAgICAgICAgIC8vIFx0dGVzdC5yZXNpemUoMSwxKTtcclxuICAgICAgICAgICAgICAgIC8vIFx0dGVzdC55PWFbYl1bMF1bMF1cclxuICAgICAgICAgICAgICAgIC8vIFx0dGVzdC54PWFbYl1bMF1bMV1cclxuICAgICAgICAgICAgICAgIC8vIFx0dGVzdC5yb3RhdGlvbj1hW2JdWzBdWzJdXHJcbiAgICAgICAgICAgICAgICAvLyBcdGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHRlc3QpXHJcbiAgICAgICAgICAgICAgICAvLyBcdG5ld05vZGVzLnB1c2godGVzdClcclxuICAgICAgICAgICAgICAgIC8vIFx0fVxyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1RFWFQnKSB7XHJcbiAgICAgICAgICAgICAgICAvL3RoZSBmb250IGxvYWRpbmcgcGFydFxyXG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFtaWx5OiBub2RlLmZvbnROYW1lWydmYW1pbHknXSxcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogbm9kZS5mb250TmFtZVsnc3R5bGUnXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0ZXh0MkN1cnZlKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY2FsY0N1cnZlcyh2ZWN0b3JzLCB2ZWN0b3JMZW5ndGhzLCB4LCB5KSB7XHJcbiAgICBsZXQgcG9pbnRBcnIgPSBbXTtcclxuICAgIGZvciAodmFyIGN1cnZlIGluIHZlY3RvcnMpIHtcclxuICAgICAgICBwb2ludEFyci5wdXNoKC4uLnBvaW50T25DdXJ2ZSh2ZWN0b3JzW2N1cnZlXSwgMTAwLCB0cnVlKSk7XHJcbiAgICB9XHJcbiAgICBsZXQgYSA9IHBvaW50QXJyO1xyXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBbXTtcclxuICAgIGZvciAodmFyIGIgPSAwOyBiIDwgYS5sZW5ndGg7IGIrKykge1xyXG4gICAgICAgIGlmIChpc05hTihhW2JdWzBdWzBdKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGVzdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xyXG4gICAgICAgICAgICB0ZXN0LnJlc2l6ZVdpdGhvdXRDb25zdHJhaW50cygwLjEsIDAuNCk7XHJcbiAgICAgICAgICAgIHRlc3QueSA9IGFbYl1bMF1bMV07XHJcbiAgICAgICAgICAgIHRlc3QueCA9IGFbYl1bMF1bMF07XHJcbiAgICAgICAgICAgIHRlc3Qucm90YXRpb24gPSBhW2JdWzBdWzJdO1xyXG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZCh0ZXN0KTtcclxuICAgICAgICAgICAgbmV3Tm9kZXMucHVzaCh0ZXN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmaWdtYS5mbGF0dGVuKG5ld05vZGVzKTtcclxuICAgIGNvbnNvbGUubG9nKHBvaW50QXJyKTtcclxufVxyXG4vLyBUaGlzIHNob3dzIHRoZSBIVE1MIHBhZ2UgaW4gXCJ1aS5odG1sXCIuXHJcbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XHJcbi8vIENhbGxzIHRvIFwicGFyZW50LnBvc3RNZXNzYWdlXCIgZnJvbSB3aXRoaW4gdGhlIEhUTUwgcGFnZSB3aWxsIHRyaWdnZXIgdGhpc1xyXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcclxuLy8gcG9zdGVkIG1lc3NhZ2UuXHJcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdkby10aGUtdGhpbmcnKSB7XHJcbiAgICAgICAgbWFpbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKG1zZy50eXBlID09PSAnY2FuY2VsJykge1xyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCdrJyk7XHJcbiAgICB9XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzdmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICAvL3R1cm5zIG91dCB1IGRvbnQgbmVlZCB0aGlzIG9vcHNcclxuICAgICAgICAvL3ZhciByZWx2ZWN0ID0gYWJzMnJlbChtc2cudmVjdG9yc1swXSwgbXNnLngsIG1zZy55KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVsdmVjdClcclxuICAgICAgICBjYWxjQ3VydmVzKG1zZy52ZWN0b3JzLCBtc2cudmVjdG9yTGVuZ3RocywgbXNnLngsIG1zZy55KTtcclxuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xyXG4gICAgfVxyXG4gICAgLy8gTWFrZSBzdXJlIHRvIGNsb3NlIHRoZSBwbHVnaW4gd2hlbiB5b3UncmUgZG9uZS4gT3RoZXJ3aXNlIHRoZSBwbHVnaW4gd2lsbFxyXG4gICAgLy8ga2VlcCBydW5uaW5nLCB3aGljaCBzaG93cyB0aGUgY2FuY2VsIGJ1dHRvbiBhdCB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAvLyB3aGF0IGlmIGkgZG9udCB3YW5uYSBsbWFvLiBkZWZhdWx0IGdlbmVyYXRlZCB0dXRvcmlhbCBoZWFkYXNzXHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=
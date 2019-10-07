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
    github: https://github.com/codelastnight/text2path-figma
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixVQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNEJBQTRCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsNkJBQTZCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxhQUFhO0FBQzlDO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsIi8qXHJcbiAgICBzb3VyY2UgY29kZSBmb3IgdGV4dCAyIGN1cnZlIGZvciBmaWdtYVxyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdGV4dDJwYXRoLWZpZ21hXHJcbiovXHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuLy9zcGxpdHMgYXJyYXkgaW50byBjaHVua3NcclxuLy8gZ290IHRoaXMgY29kZSBmcm9tIGh0dHBzOi8vbWVkaXVtLmNvbS9ARHJhZ29uemEvZm91ci13YXlzLXRvLWNodW5rLWFuLWFycmF5LWUxOWM4ODllYWM0XHJcbi8vIGF1dGhvcjogTmdvYyBWdW9uZyBodHRwczovL2RyYWdvbnphLmlvXHJcbnZhciBhcnJDaHVuayA9IGZ1bmN0aW9uIChhcnJheSwgc2l6ZSkge1xyXG4gICAgY29uc3QgY2h1bmtlZCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGxhc3QgPSBjaHVua2VkW2NodW5rZWQubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWYgKCFsYXN0IHx8IGxhc3QubGVuZ3RoID09PSBzaXplKSB7XHJcbiAgICAgICAgICAgIGNodW5rZWQucHVzaChbYXJyYXlbaV1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxhc3QucHVzaChhcnJheVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNodW5rZWQ7XHJcbn07XHJcbi8vdHVybiB3aGF0ZXZlciB0aGUgZnVjayBzdmcgY29kZSBpcyBpbnRvIGFycmF5IG9mIHBvaW50cyBncm91cGVkIGludG8gNCBvciAyICggdGhpcyBpcyBkZXBlbmRhbnQgb24gd2hhdCB0eXBlIG9mIGJlemllciBjdXJ2ZSBpdCBpcy4gbG9vayBpdCB1cClcclxuLy8gZmlnbWEgZG9lc250IGhhdmUgdGhlIDMgcG9pbnQgYmV6aWVyIGN1cnZlIGluIHZlY3RvciBtb2RlLCBvbmx5IDQgb3IgMi5cclxudmFyIHN2ZzJBcnIgPSBmdW5jdGlvbiAoc3ZnRGF0YSkge1xyXG4gICAgLypcclxuICAgIHN2Z0RhdGE6IHRoZSBmdWNraW5nIHNoaXR0eSBzdmcgcGF0aCBkYXRhIGZ1Y2tcclxuICAgIGkgd2FudCBpdCB0byBlbmQgdXAgbGlrZTogW1twb2ludDEsMiwzLDRdLFs0LDVdLFs1LDYsNyw4XS4uLi5dXHJcbiAgICBpIGZ1Y2tpbmcgaGF0ZSB0aGlzIHNoaXRcclxuICAgICovXHJcbiAgICBsZXQgdGVzdCA9IHN2Z0RhdGEuc3BsaXQoJ00nKTsgLy9zcGxpdCBpZiBtb3JlIHRoZW4gMSBzZWN0aW9uIGFuZCBnZXRzIHJpZCBvZiB0aGUgZXh0cmEgYXJyYXkgdmFsdWUgYXQgZnJvbnRcclxuICAgIHRlc3Quc2hpZnQoKTtcclxuICAgIGlmICh0ZXN0Lmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAvLyB0aHJvdyBlcnJvciBpZiB0aGVyZXMgdG9vIG1hbnkgbGluZXMgYmVjYXN1ZSBpbSBsYXp5XHJcbiAgICAgICAgdGhyb3cgJ1RPTyBNQU5ZIExJTkVTISEhMTExMSB0aGlzIG9ubHkgc3VwcG9ydHMgb25lIGNvbnRpbm91cyB2ZWN0b3InO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBjbGVhblR5cGUgPSBbXTtcclxuICAgIHZhciBwb28gPSB0ZXN0WzBdLnRyaW0oKS5zcGxpdCgvIEx8QyAvKTsgLy8gc3BsaXRzIHN0cmluZyBpbnRvIHRoZSBjaHVua3Mgb2YgZGlmZmVyZW50IGxpbmVzXHJcbiAgICB2YXIgc3BsaWNlaW4gPSBbXTtcclxuICAgIGZvciAodmFyIGUgaW4gcG9vKSB7XHJcbiAgICAgICAgLy9tYWdpY1xyXG4gICAgICAgIHZhciBzYWQgPSBhcnJDaHVuayhwb29bZV0udHJpbSgpLnNwbGl0KCcgJyksIDIpO1xyXG4gICAgICAgIC8vdGhpcyBhZGRzIHRoZSBsYXN0IHBvaW50IGZyb20gdGhlIHByZXZpb3VzIGFycmF5IGludG8gdGhlIG5leHQgb25lLlxyXG4gICAgICAgIHNhZC51bnNoaWZ0KHNwbGljZWluKTtcclxuICAgICAgICBzcGxpY2VpbiA9IHNhZFtzYWQubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgY2xlYW5UeXBlLnB1c2goc2FkKTtcclxuICAgIH1cclxuICAgIGNsZWFuVHlwZS5zaGlmdCgpOyAvLyBnZXQgcmlkIG9mIHRoZSBleHRyYSBlbXB0eSBhcnJheSB2YWx1ZVxyXG4gICAgcmV0dXJuIGNsZWFuVHlwZTtcclxufTtcclxuLy8gdHVybnMgdGhlIGFic29sdXRlIHZhbHVlcyBvZiBwb2ludHMgaW4gdG8gcmVsYXRpdmVcclxudmFyIGFiczJyZWwgPSBmdW5jdGlvbiAoUG9pbnRBcnIsIHgsIHkpIHtcclxuICAgIHZhciByZWxjdXJ2ZSA9IFtdO1xyXG4gICAgZm9yICh2YXIgZSBpbiBQb2ludEFycikge1xyXG4gICAgICAgIHZhciByZWxwb2ludCA9IFtOdW1iZXIoUG9pbnRBcnJbZV1bMF0pIC0geCwgTnVtYmVyKFBvaW50QXJyW2VdWzFdKSAtIHldO1xyXG4gICAgICAgIHJlbGN1cnZlLnB1c2gocmVscG9pbnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFBvaW50QXJyW2VdKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZWxjdXJ2ZTtcclxufTtcclxuLy9kaXN0YW5jZSBiZXR3ZWVuIHBvaW50cyBhIGFuZCBiXHJcbnZhciBkaXN0QnR3biA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAvKlxyXG4gIGE6IFt4MSx5MV1cclxuICBiOiBbeDIseTJdXHJcbiAgKi9cclxuICAgIGZvciAodmFyIGMgaW4gYSkge1xyXG4gICAgICAgIGFbY10gPSBOdW1iZXIoYVtjXSk7XHJcbiAgICAgICAgYltjXSA9IE51bWJlcihiW2NdKTtcclxuICAgIH1cclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKGJbMF0gLSBhWzBdKSwgMikgKyBNYXRoLnBvdygoYlsxXSAtIGFbMV0pLCAyKSk7XHJcbn07XHJcbi8vZmluZCBwb2ludCBiZXR3ZWVuIHR3byBwb2ludHMgYSBhbmQgYiBvdmVyIHRpbWVcclxuLy8gaW4gdGhpcyBjYXNlIHRpbWUgaXMgcGl4ZWxzXHJcbnZhciBwb2ludEJ0d24gPSBmdW5jdGlvbiAoYSwgYiwgdCwgdGltZSkge1xyXG4gICAgLypcclxuICBhOiBbeDEseTFdXHJcbiAgYjogW3gyLHkyXVxyXG4gIHRpbWU6IG51bWJlclxyXG4gIHJvdGF0aW9uOiBhbHNvIHJldHVybiByb3RhdGlvbiBpZiB0cnVlXHJcbiAgKi9cclxuICAgIGZvciAodmFyIGMgaW4gYSkge1xyXG4gICAgICAgIGFbY10gPSBOdW1iZXIoYVtjXSk7XHJcbiAgICAgICAgYltjXSA9IE51bWJlcihiW2NdKTtcclxuICAgIH1cclxuICAgIC8vZmluZCB0aGUgdW5pdCAgdmVjdG9yIGJldHdlZW4gcG9pbnRzIGEgYW5kIGJcclxuICAgIC8vIG5vdCByZWFsbHkgdW5pdCB2ZWN0b3IgaW4gdGhlIG1hdGggc2Vuc2UgdGhvXHJcbiAgICBjb25zdCB1bml0VmVjdG9yID0gWyhiWzBdIC0gYVswXSkgLyB0aW1lLCAoYlsxXSAtIGFbMV0pIC8gdGltZV07XHJcbiAgICByZXR1cm4gW2FbMF0gKyB1bml0VmVjdG9yWzBdICogdCwgYVsxXSArIHVuaXRWZWN0b3JbMV0gKiB0XTtcclxufTtcclxuLy9jYWxjdWxhdGUgRGUgQ2FzdGVsamF14oCZcyBhbGdvcml0aG0gZnJvbSAyLTQgcG9pbnRzICBodHRwczovL2phdmFzY3JpcHQuaW5mby9iZXppZXItY3VydmVcclxuLy8gYmFzaWNhbGx5IHR1cm5zIDQgcG9pbnRzIG9uIGEgYmVpemVyIGludG8gYSBjdXJ2ZVxyXG5mdW5jdGlvbiBwb2ludE9uQ3VydmUoY3VydmUsIHRpbWUgPSAxMDAsIHJvdGF0aW9uID0gZmFsc2UpIHtcclxuICAgIC8qXHJcbiAgY3VydmUgW3BvaW50MSwgcG9pbnQyLCBwb2ludDMsIHBvaW50NF1cclxuICAgICAtIGVhY2ggcG9pbnQ6IFt4LHldXHJcbiAgKi9cclxuICAgIHZhciBjYXN0ZWxqYXUgPSBmdW5jdGlvbiAoY3VydmUsIHQsIHRpbWUsIHJvdGF0aW9uID0gZmFsc2UsIGxhc3Ryb3QgPSAwKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY3VydmUubGVuZ3RoIC0gMTsgYysrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBkaXN0QnR3bihjdXJ2ZVtjXSwgY3VydmVbYyArIDFdKTtcclxuICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRCdHduKGN1cnZlW2NdLCBjdXJ2ZVtjICsgMV0sIHQsIHRpbWUpO1xyXG4gICAgICAgICAgICBhcnIucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIGlmIChyb3RhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgLy9maWdtYSB3YW50cyB0aGlzIG51bWJlciB0byBiZSBpbiBkZWdyZWVzIGJlY2FzdWUgZnVjayB5b3UgaSBndWVzc1xyXG4gICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gTWF0aC5hdGFuKChjdXJ2ZVtjICsgMV1bMF0gLSBjdXJ2ZVtjXVswXSkgLyAoY3VydmVbYyArIDFdWzFdIC0gY3VydmVbY11bMV0pKSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKDE4MCAvIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgYW5nbGUgPSA5MCArIGFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnZlW2MgKyAxXVsxXSAtIGN1cnZlW2NdWzFdIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlID0gMTgwICsgYW5nbGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwb2ludC5wdXNoKGFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuICAgIGxldCBmaW5hbGFyciA9IFtdO1xyXG4gICAgaWYgKGN1cnZlLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgZm9yICh2YXIgdCA9IDE7IHQgPCB0aW1lOyB0KyspIHtcclxuICAgICAgICAgICAgaWYgKGZpbmFsYXJyLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdHJvdCA9IGZpbmFsYXJyW2ZpbmFsYXJyLmxlbmd0aCAtIDFdWzJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBhcnIxID0gY2FzdGVsamF1KGN1cnZlLCB0LCB0aW1lLCByb3RhdGlvbiwgbGFzdHJvdCk7XHJcbiAgICAgICAgICAgIGZpbmFsYXJyLnB1c2goYXJyMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZm9yICh2YXIgdCA9IDE7IHQgPD0gdGltZTsgdCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmaW5hbGFyci5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3Ryb3QgPSBmaW5hbGFycltmaW5hbGFyci5sZW5ndGggLSAxXVsyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgYXJyMSA9IGNhc3RlbGphdShjdXJ2ZSwgdCwgdGltZSk7XHJcbiAgICAgICAgICAgIGxldCBhcnIyID0gY2FzdGVsamF1KGFycjEsIHQsIHRpbWUpO1xyXG4gICAgICAgICAgICBsZXQgYXJyMyA9IGNhc3RlbGphdShhcnIyLCB0LCB0aW1lLCByb3RhdGlvbiwgbGFzdHJvdCk7XHJcbiAgICAgICAgICAgIC8vY291bGQgaSB1c2UgcmVjdXJzaXZlPyB5ZWEuIGFtIGkgZ29ubmE/IG5vIHRoYXQgc291bmRzIGxpa2Ugd29ya1xyXG4gICAgICAgICAgICAvLyBsZXQgYXJyMSA9IGNhc3RlbGphdShcclxuICAgICAgICAgICAgLy8gXHRjYXN0ZWxqYXUoY2FzdGVsamF1KGN1cnZlLCB0LCB0aW1lKSwgdCwgdGltZSksXHJcbiAgICAgICAgICAgIC8vIFx0dCxcclxuICAgICAgICAgICAgLy8gXHR0aW1lLFxyXG4gICAgICAgICAgICAvLyBcdHJvdGF0aW9uXHJcbiAgICAgICAgICAgIC8vIClcclxuICAgICAgICAgICAgZmluYWxhcnIucHVzaChhcnIzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmluYWxhcnI7XHJcbn1cclxuLy9jb252ZXJ0IHRleHQgaW50byBpbmRpdmlzdWFsIGNoYXJhY3RlcnNcclxuZnVuY3Rpb24gdGV4dDJDdXJ2ZShub2RlKSB7XHJcbiAgICAvL2NvbnZlcnQgdGV4dCBpbnRvIGVhY2ggbGV0dGVyIGluZGl2dXNhbGx5XHJcbiAgICBjb25zdCBuZXdOb2RlcyA9IFtdO1xyXG4gICAgY29uc3QgY2hhckFyciA9IFsuLi5ub2RlLmNoYXJhY3RlcnNdO1xyXG4gICAgbGV0IHNwYWNpbmcgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoYXJhY3RlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBsZXR0ZXIgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XHJcbiAgICAgICAgbGV0dGVyLmNoYXJhY3RlcnMgPSBjaGFyQXJyW2ldO1xyXG4gICAgICAgIC8vIGNlbnRlciB0aGUgbGV0dGVyc1xyXG4gICAgICAgIGxldHRlci50ZXh0QWxpZ25Ib3Jpem9udGFsID0gJ0NFTlRFUic7XHJcbiAgICAgICAgbGV0dGVyLnRleHRBbGlnblZlcnRpY2FsID0gJ0NFTlRFUic7XHJcbiAgICAgICAgbGV0dGVyLnRleHRBdXRvUmVzaXplID0gJ1dJRFRIX0FORF9IRUlHSFQnO1xyXG4gICAgICAgIC8vY29weSBzZXR0aW5nc1xyXG4gICAgICAgIGxldHRlci5mb250U2l6ZSA9IG5vZGUuZm9udFNpemU7XHJcbiAgICAgICAgbGV0dGVyLmZvbnROYW1lID0gbm9kZS5mb250TmFtZTtcclxuICAgICAgICAvL3NldCBsb2NhdGlvbnNcclxuICAgICAgICBsZXR0ZXIueCA9IG5vZGUueCArIHNwYWNpbmc7XHJcbiAgICAgICAgbGV0dGVyLnkgPSBub2RlLnkgKyBub2RlLmhlaWdodCArIDM7XHJcbiAgICAgICAgLy9zcGFjZWluZyB0aGVtXHJcbiAgICAgICAgc3BhY2luZyA9IHNwYWNpbmcgKyBsZXR0ZXIud2lkdGg7XHJcbiAgICAgICAgLy9yb3RhdGVcclxuICAgICAgICAvL2FwcGVuZCB0aGF0IHNoaXRcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChsZXR0ZXIpO1xyXG4gICAgICAgIG5ld05vZGVzLnB1c2gobGV0dGVyKTtcclxuICAgIH1cclxuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5ld05vZGVzO1xyXG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5ld05vZGVzKTtcclxuICAgIHJldHVybjtcclxufVxyXG4vLyBtYWluIGNvZGVcclxuLy9hc3luYyByZXF1aXJlZCBiZWNhdXNlIGZpZ21hIGFwaSByZXF1aXJlcyB5b3UgdG8gbG9hZCBmb250cyBpbnRvIHRoZSBwbHVnaW4gdG8gdXNlIHRoZW1cclxuLy9ob25lc3RseSBpbSByZWFsbHkgdGVtcHRlZCB0byBqdXN0IGhhcmRjb2RlIHJvYm90byBpbnN0ZWFkXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbignbm90aGluZ3Mgc2VsZWN0ZWQgZHVtYmFzcycpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmICggc2VsZWN0aW9uLmxlbmd0aCA+IDIgfHwgc2VsZWN0aW9uLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAvLyAgIGZpZ21hLmNsb3NlUGx1Z2luKFwieW91IG5lZWQgVFdPIHRoaW5ncyBzZWxlY3RlZCBjYW4geW91IHJlYWQ/XCIpO1xyXG4gICAgICAgIC8vICAgLy9yZXR1cm47XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgPT0gJ1ZFQ1RPUicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlY3RvcnMgPSBzdmcyQXJyKG5vZGUudmVjdG9yUGF0aHNbMF0uZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYW4gaHRtbCBzdmcgZWxlbWVudCBiZWNhc3VlIHRoZSBidWlsdGluIGZ1bmN0aW9uIG9ubHkgd29ya3Mgb24gc3ZnIGZpbGVzXHJcbiAgICAgICAgICAgICAgICAvLyBzbyBhcHBhcmVudGx5IHlvdSBjYW50IGV2ZW4gaW5pdCBhIHN2ZyBwYXRoIGhlcmUgc28gaSBoYXZlIHRvIHNlbmQgaXQgdG8gdGhlIFVJIEhUTUxcclxuICAgICAgICAgICAgICAgIC8vTUFTU0lWIEJyVUhcclxuICAgICAgICAgICAgICAgIHZhciB4ID0gbm9kZS54O1xyXG4gICAgICAgICAgICAgICAgdmFyIHkgPSBub2RlLnk7XHJcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdzdmcnLCB2ZWN0b3JzLCB4LCB5IH0pO1xyXG4gICAgICAgICAgICAgICAgLy90ZXN0ZGF0YXNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RkYXRhID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIFsxLjM4ODU4NjQwMTkzOTM5MiwgMjEuNzI5MTU0NTg2NzkxOTkyXSxcclxuICAgICAgICAgICAgICAgICAgICBbLTQuMDc0OTg5NDM4MDU2OTQ2LCAyLjIyOTE1MDc3MjA5NDcyNjZdLFxyXG4gICAgICAgICAgICAgICAgICAgIFs2LjkyNDk4Nzc5Mjk2ODc1LCAtMy43NzU3NDk0NDQ5NjE1NDhdLFxyXG4gICAgICAgICAgICAgICAgICAgIFsyOC4zODg1OTE3NjYzNTc0MjIsIDIuMjI5MTUyNDQxMDI0NzgwM11cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBhID0gcG9pbnRPbkN1cnZlKHRlc3RkYXRhKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Tm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciAodmFyIGIgPTA7YiA8IGEubGVuZ3RoO2IrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gXHRpZiAoaXNOYU4oYVtiXVswXVswXSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0fSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFx0Y29uc3QgdGVzdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0LnJlc2l6ZSgxLDEpO1xyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0Lnk9YVtiXVswXVswXVxyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0Lng9YVtiXVswXVsxXVxyXG4gICAgICAgICAgICAgICAgLy8gXHR0ZXN0LnJvdGF0aW9uPWFbYl1bMF1bMl1cclxuICAgICAgICAgICAgICAgIC8vIFx0ZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQodGVzdClcclxuICAgICAgICAgICAgICAgIC8vIFx0bmV3Tm9kZXMucHVzaCh0ZXN0KVxyXG4gICAgICAgICAgICAgICAgLy8gXHR9XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PSAnVEVYVCcpIHtcclxuICAgICAgICAgICAgICAgIC8vdGhlIGZvbnQgbG9hZGluZyBwYXJ0XHJcbiAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKHtcclxuICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IG5vZGUuZm9udE5hbWVbJ2ZhbWlseSddLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBub2RlLmZvbnROYW1lWydzdHlsZSddXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRleHQyQ3VydmUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjYWxjQ3VydmVzKHZlY3RvcnMsIHZlY3Rvckxlbmd0aHMsIHgsIHkpIHtcclxuICAgIGxldCBwb2ludEFyciA9IFtdO1xyXG4gICAgZm9yICh2YXIgY3VydmUgaW4gdmVjdG9ycykge1xyXG4gICAgICAgIHBvaW50QXJyLnB1c2goLi4ucG9pbnRPbkN1cnZlKHZlY3RvcnNbY3VydmVdLCAxMDAsIHRydWUpKTtcclxuICAgIH1cclxuICAgIGxldCBhID0gcG9pbnRBcnI7XHJcbiAgICBjb25zdCBuZXdOb2RlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgYiA9IDA7IGIgPCBhLmxlbmd0aDsgYisrKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGFbYl1bMF1bMF0pKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0ZXN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgICAgIHRlc3QucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKDAuMSwgMC40KTtcclxuICAgICAgICAgICAgdGVzdC55ID0gYVtiXVswXVsxXTtcclxuICAgICAgICAgICAgdGVzdC54ID0gYVtiXVswXVswXTtcclxuICAgICAgICAgICAgdGVzdC5yb3RhdGlvbiA9IGFbYl1bMF1bMl07XHJcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHRlc3QpO1xyXG4gICAgICAgICAgICBuZXdOb2Rlcy5wdXNoKHRlc3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZpZ21hLmZsYXR0ZW4obmV3Tm9kZXMpO1xyXG4gICAgY29uc29sZS5sb2cocG9pbnRBcnIpO1xyXG59XHJcbi8vIFRoaXMgc2hvd3MgdGhlIEhUTUwgcGFnZSBpbiBcInVpLmh0bWxcIi5cclxuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcclxuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXHJcbi8vIGNhbGxiYWNrLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBwYXNzZWQgdGhlIFwicGx1Z2luTWVzc2FnZVwiIHByb3BlcnR5IG9mIHRoZVxyXG4vLyBwb3N0ZWQgbWVzc2FnZS5cclxuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2RvLXRoZS10aGluZycpIHtcclxuICAgICAgICBtYWluKCk7XHJcbiAgICB9XHJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdjYW5jZWwnKSB7XHJcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oJ2snKTtcclxuICAgIH1cclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3N2ZycpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgIC8vdHVybnMgb3V0IHUgZG9udCBuZWVkIHRoaXMgb29wc1xyXG4gICAgICAgIC8vdmFyIHJlbHZlY3QgPSBhYnMycmVsKG1zZy52ZWN0b3JzWzBdLCBtc2cueCwgbXNnLnkpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZWx2ZWN0KVxyXG4gICAgICAgIGNhbGNDdXJ2ZXMobXNnLnZlY3RvcnMsIG1zZy52ZWN0b3JMZW5ndGhzLCBtc2cueCwgbXNnLnkpO1xyXG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICB9XHJcbiAgICAvLyBNYWtlIHN1cmUgdG8gY2xvc2UgdGhlIHBsdWdpbiB3aGVuIHlvdSdyZSBkb25lLiBPdGhlcndpc2UgdGhlIHBsdWdpbiB3aWxsXHJcbiAgICAvLyBrZWVwIHJ1bm5pbmcsIHdoaWNoIHNob3dzIHRoZSBjYW5jZWwgYnV0dG9uIGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbi5cclxuICAgIC8vIHdoYXQgaWYgaSBkb250IHdhbm5hIGxtYW8uIGRlZmF1bHQgZ2VuZXJhdGVkIHR1dG9yaWFsIGhlYWRhc3NcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src_old/ts/curve.ts":
/*!*****************************!*\
  !*** ./src_old/ts/curve.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allPoints": () => (/* binding */ allPoints)
/* harmony export */ });
/* harmony import */ var bezier_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bezier-js */ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/bezier.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src_old/ts/helper.ts");
/*
    code for all the curve handling functions
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/


/**
 * calculate point on a curve at time t from 2 or 4 points
 * * De Casteljau’s algorithm  https://javascript.info/bezier-curve
 * @param curve
 * @param t current time
 * @param rotation boolean should calculate rotation?
 */
const casteljau = (curve, t, setting, calcRot = false) => {
    let arr = [];
    // using a for loop here becasue i need to access the next curve from the current one
    for (var c = 0; c < curve.length - 1; c++) {
        let point = (0,_helper__WEBPACK_IMPORTED_MODULE_1__.pointBtwn)(curve[c], curve[c + 1], t, setting.precision);
        arr.push(point);
        if (calcRot && setting.rotCheck) {
            //figma wants this number to be in degrees becasue fuck you i guess
            let angle = Math.atan((curve[c + 1].x - curve[c].x) / (curve[c + 1].y - curve[c].y)) *
                (180 / Math.PI);
            // flip angle calculations based on if going left or right
            if (curve[c + 1].y - curve[c].y < 0) {
                angle = 180 + angle;
            }
            point.angle = 90 + angle;
        }
    }
    return arr;
};
/**
 * basically turns 4 points on a bezier into a curve
 * * utalizes the casteljau function
 * @param curve [point1, point2, point3, point4]
 * @param setting options data
 * @param totalDist total length of the curve up to that point
 */
const pointOnCurve = (curve, setting, totalDist) => {
    let finalarr = [];
    for (var t = 0; t < setting.precision; t++) {
        //could i use recursive? yea. am i gonna? no that sounds like work
        // if straight line, do this
        let arr1 = [];
        if (curve.length == 2) {
            arr1 = casteljau(curve, t, setting, true);
        }
        // if curved line, do this
        else {
            arr1 = casteljau(casteljau(casteljau(curve, t, setting), t, setting), t, setting, true);
        }
        // get rid of the extra bracket
        let pointdata = arr1[0];
        // calculate the distance between entirepoints to estimate the distance at that specific point
        if (finalarr.length > 0) {
            const addDist = (0,_helper__WEBPACK_IMPORTED_MODULE_1__.distBtwn)(finalarr[finalarr.length - 1], pointdata);
            pointdata.dist = addDist;
            pointdata.totalDist = addDist + finalarr[finalarr.length - 1].totalDist;
            totalDist = pointdata.totalDist;
        }
        else {
            pointdata.dist = 0;
            pointdata.totalDist = totalDist;
        }
        finalarr.push(pointdata);
    }
    return finalarr;
};
/**
 * calculate all points on the parsed svg data
 * @param svgData
 * @param setting
 * @param rotation
 */
const allPoints = (svgData, setting) => {
    let pointArr = [];
    let vectors = (0,_helper__WEBPACK_IMPORTED_MODULE_1__.parseSVG)(svgData);
    // reverse the points if the settings say so
    if (setting.reverse) {
        vectors = vectors.map(curve => {
            return curve.reverse();
        }).reverse();
    }
    let totalDist = 0;
    for (var curve in vectors) {
        pointArr.push(...pointOnCurve(vectors[curve], setting, totalDist));
        totalDist = pointArr[pointArr.length - 1].totalDist;
    }
    return pointArr;
};
/**
 * basically turns 4 points on a bezier into a curve
 * * utalizes the casteljau function
 * @param curve [point1, point2, point3, point4]
 * @param t number;
 * @param setting options data
 */
const getPointFromCurve = (curve, t, setting) => {
    const bezier = new bezier_js__WEBPACK_IMPORTED_MODULE_0__.Bezier(curve);
    return bezier.get(t);
};


/***/ }),

/***/ "./src_old/ts/helper.ts":
/*!******************************!*\
  !*** ./src_old/ts/helper.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deepCopy": () => (/* binding */ deepCopy),
/* harmony export */   "distBtwn": () => (/* binding */ distBtwn),
/* harmony export */   "isLinked": () => (/* binding */ isLinked),
/* harmony export */   "move": () => (/* binding */ move),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "parseSVG": () => (/* binding */ parseSVG),
/* harmony export */   "pointBtwn": () => (/* binding */ pointBtwn),
/* harmony export */   "pointBtwnByLength": () => (/* binding */ pointBtwnByLength),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "setLink": () => (/* binding */ setLink),
/* harmony export */   "titleCase": () => (/* binding */ titleCase)
/* harmony export */ });
//plugin data key name
const keyName = "pathData";
/**
 * get data from an object
 * @param group the group object to look into
 */
const getLink = (group, updateOtherId = "", key = keyName) => {
    // get data from plugin
    var getData = group.getSharedPluginData("topathfigma", key);
    let outData = JSON.parse(getData);
    // handle edge case where object changes type, in which case id updates
    // why figma why
    let otherId = outData.other.id;
    if (updateOtherId && updateOtherId != outData.other.id) {
        otherId = updateOtherId;
    }
    // only id's are stored, becasue its a shallow copy. 
    // get data from linked objects
    outData.curve = figma.getNodeById(outData.curve.id);
    outData.other = figma.getNodeById(otherId);
    setLink(group, outData);
    if (outData.curve == null || outData.other == null)
        return null;
    return outData;
};
/**
 * check if a group object is in linked state
 * @param group the group object to check
 */
const isLinked = (group, updateOtherId = "") => {
    try {
        var data = getLink(group, updateOtherId);
        return data;
    }
    catch (_a) {
        return null;
    }
};
/**
 * set the link data into the group object
 * @param group target group object
 * @param data data to set into object
 */
var setLink = (group, data, key = keyName) => {
    group.setSharedPluginData(data.namespace, key, JSON.stringify(data));
};
/**
 * turn whatever svg code is into array of points grouped into 4 or 2 ( this is dependant on what type of bezier curve it is. look it up)
 *  * note: figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
 * @param svgData svg path data bruh moment
 * @returns array of array of points, eg [[point1,2,3,4],[4,5],[5,6,7,8]....]
 */
const parseSVG = (svgData) => {
    const test = svgData.replace('Z', '').split('M'); //split if more then 1 section and gets rid of the extra array value at front
    test.shift();
    // throw error if theres too many lines becasue im lazy
    if (test.length > 1)
        throw 'TOO MANY LINES! this plugin only supports one continous vector';
    const bezierChunks = test[0].trim().split(/ L|C /); // splits string into the chunks of different lines
    // the point to splice into the next curve
    let splicein = [];
    // the output group of curves (which is a group of points)
    // imma be honest i dont know how i made this work its magic 
    let cleanType = bezierChunks.map(e => {
        //split each string in the chunk into points
        const splitPoints = arrChunk(e.trim().split(' '), 2);
        //this adds the last point from the previous array into the next one.
        splitPoints.unshift(splicein);
        splicein = splitPoints[splitPoints.length - 1];
        const typedPoints = splitPoints.map((point) => {
            return {
                x: Number(point[0]),
                y: Number(point[1])
            };
        });
        return typedPoints;
    });
    cleanType.shift(); // get rid of the extra empty array value
    return cleanType;
};
/**
 * distance between points a and b
 * @param a first point
 * @param b second point
 */
const distBtwn = (a, b) => {
    return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
};
/**
 * find point between two points a and b over time
 * *in this case time is pixels
 * @param a point a
 * @param b point b
 * @param t current time
 * @param time total time
 */
const pointBtwn = (a, b, t, time) => {
    //find the unit  vector between points a and b
    // not really unit vector in the math sense tho
    //const unitVector: Point = { x: , y: (} 
    return {
        x: a.x + ((b.x - a.x) / time) * t,
        y: a.y + ((b.y - a.y) / time) * t
    };
};
//
/**
 * find point between two points a and b over distance
 * @param a
 * @param b
 * @param dist
 * @param totalDist
 * @param angle
 */
var pointBtwnByLength = (a, b, dist, totalDist, // length between the two known points
angle) => {
    // finds the x value of a point between two points given the magnitude of that point
    const t = Math.cos((angle * Math.PI) / 180) * dist;
    const newPoint = pointBtwn(a, b, t, totalDist);
    newPoint.angle = angle;
    return newPoint;
};
// 
/**
 * splits array into chunks.
 *  I got this code from https://medium.com/@Dragonza/four-ways-to-chunk-an-array-e19c889eac4
 *  author: Ngoc Vuong https://dragonza.io
 *
 * @param array input array
 * @param size  size of each chunk
 */
const arrChunk = (array, size) => {
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
//matrix manipulation code taken from https://github.com/figma/plugin-samples/blob/master/circletext/code.ts
//author: Jonathan Chan https://github.com/jyc http://jyc.eqv.io
// the biggest thanks I am mathmatically challenged
/**
 * multiply matrixes together
 * @param a
 * @param b
 */
const multiply = (a, b) => {
    return [
        [
            a[0][0] * b[0][0] + a[0][1] * b[1][0],
            a[0][0] * b[0][1] + a[0][1] * b[1][1],
            a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]
        ],
        [
            a[1][0] * b[0][0] + a[1][1] * b[1][0],
            a[1][0] * b[0][1] + a[1][1] * b[1][1] + 0,
            a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]
        ]
    ];
};
/**
 * create a move transform
 * @param x
 * @param y
 */
const move = (x, y) => {
    return [[1, 0, x], [0, 1, y]];
};
/**
 * Creates a "rotate" transform.
 * @param theta
 */
const rotate = (theta) => {
    return [
        [Math.cos(theta), Math.sin(theta), 0],
        [-Math.sin(theta), Math.cos(theta), 0]
    ];
};
/**
 * deep copy but exclude children
 * @param theta
 */
const deepCopy = (inObject) => {
    let outObject, value, key;
    if (typeof inObject == 'function') {
        return "";
    }
    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        if (key != "children" && key != "parent") {
            value = inObject[key];
            // Recursively (deep) copy for nested objects, including arrays
            outObject[key] = deepCopy(value);
        }
        else {
            value = "";
        }
    }
    return outObject;
};
/**
 * returns the string in title case
 * @param str input text string
 */
const titleCase = (str) => {
    return str.toLowerCase().split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
};


/***/ }),

/***/ "./src_old/ts/place.ts":
/*!*****************************!*\
  !*** ./src_old/ts/place.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deleteNodeinGroup": () => (/* binding */ deleteNodeinGroup),
/* harmony export */   "object2Curve": () => (/* binding */ object2Curve),
/* harmony export */   "text2Curve": () => (/* binding */ text2Curve)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src_old/ts/helper.ts");
/*
    code for all the placing in the figma page
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/

/**
 * place the objects on a point, based on user settings.
 * @param object
 * @param point
 * @param options
 * @param curve
 */
const place = (object, point, options, curve) => {
    // if point returns null, just delete
    if (!point) {
        object.remove();
        return;
    }
    //set names
    object.name = object.name.replace("[Linked] ", '[Copy] ');
    // find center of object
    const center = {
        x: 0 - object.width * options.horizontalAlign,
        y: 0 - object.height * options.verticalAlign
    };
    //angle of object converted to degrees
    let angle = ((point.angle - 180) * Math.PI) / 180;
    // zero it
    //spaceing them
    object.relativeTransform = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.move)(center.x, center.y);
    // more code taken from jyc, the god himself https://github.com/jyc http://jyc.eqv.io
    // Rotate the object.
    //object.rotation = 0
    object.relativeTransform = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.multiply)((0,_helper__WEBPACK_IMPORTED_MODULE_0__.rotate)(angle), object.relativeTransform);
    //move the object
    object.relativeTransform = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.multiply)((0,_helper__WEBPACK_IMPORTED_MODULE_0__.move)(point.x + curve.relativeTransform[0][2], point.y + curve.relativeTransform[1][2]), object.relativeTransform);
};
/**
 * estimates and returns the point closest to where the object should be, based on horizontal length
 * @param pointArr
 * @param pass
 */
const object2Point = (pointArr, pass) => {
    //
    //let rotation
    let estPoint;
    for (pass.pointIndex; pass.pointIndex + 1 < pointArr.length; pass.pointIndex++) {
        // find nearest point to the length of the word
        if (pass.spacing <= pointArr[pass.pointIndex + 1].totalDist) {
            let nextpoint = pointArr[pass.pointIndex + 1];
            let angle = pointArr[pass.pointIndex].angle ? pointArr[pass.pointIndex].angle : pass.defaultRot;
            estPoint = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.pointBtwnByLength)(pointArr[pass.pointIndex], nextpoint, (pass.spacing - pointArr[pass.pointIndex].totalDist), // the length between the current point and the next point
            nextpoint.dist, angle //rotation
            );
            // skip over points with inifinity or NaN
            if (estPoint.x === Infinity || isNaN(estPoint.x)) {
            }
            // stop calculating and return the current point 
            else {
                break;
            }
        }
    }
    return estPoint;
};
/**
 * convert text into indivisual characters, then put those on a curve
 * @param node
 * @param pointArr
 * @param data
 * @param group
 */
const text2Curve = (node, pointArr, data, group) => {
    const newNodes = [];
    var options = data.setting;
    //convert text into each letter indivusally
    node.textAutoResize = 'WIDTH_AND_HEIGHT';
    // if title case, then fix the text to fit title case
    const charArr = [...(node.textCase == "TITLE" ? (0,_helper__WEBPACK_IMPORTED_MODULE_0__.titleCase)(node.characters) : node.characters)];
    // values needed to pass between each objects
    let pass = {
        spacing: 0 + options.offset,
        pointIndex: 0,
        defaultRot: node.rotation + 180
    };
    // disable spacing option in text mode
    options.spacing = 0;
    let prevletter = 0;
    for (let i = 0; i < charArr.length; i++) {
        let letter = node.clone();
        //copy settings
        letter.setPluginData("linkedID", "");
        letter.fontName = node.getRangeFontName(i, i + 1);
        letter.fontSize = node.getRangeFontSize(i, i + 1);
        letter.characters = safeSpace(charArr[i]) + ' ';
        if (node.textCase === "TITLE")
            letter.textCase = "ORIGINAL";
        letter.letterSpacing = node.getRangeLetterSpacing(i, i + 1);
        // center the letters
        //letter.textAlignHorizontal = 'CENTER'
        letter.textAlignVertical = 'CENTER';
        letter.textAutoResize = 'WIDTH_AND_HEIGHT';
        // put the object in the right place
        pass.spacing = pass.spacing + letter.width * options.horizontalAlign + (prevletter * (1 - options.horizontalAlign)) + options.spacing;
        prevletter = letter.width;
        let point = object2Point(pointArr, pass);
        // place the thing
        place(letter, point, options, data.curve);
        //append that shit
        letter.characters = safeSpace(charArr[i]);
        newNodes.push(letter);
        group.appendChild(letter);
        // kill loop early if the objects are longer then the curve
        // replace later with a better thing
        if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
            letter.remove();
            break;
        }
    }
    return;
};
/**
 * clones the objects x amount of times to curve
 * @param node
 * @param pointArr
 * @param data
 * @param group
 */
const object2Curve = (node, pointArr, data, group) => {
    const newNodes = [];
    var options = data.setting;
    // values needed to pass between each objects
    let pass = {
        spacing: 0 + options.offset,
        pointIndex: 0,
        defaultRot: node.rotation + 180
    };
    for (let i = 0; i < options.count; i++) {
        //copy object
        let object;
        node.type === 'COMPONENT' ? object = node.createInstance() : object = node.clone();
        // find the position where object should go
        let point = object2Point(pointArr, pass);
        pass.spacing = pass.spacing + object.width + options.spacing;
        object.setPluginData("linkedID", "");
        // place the thing
        place(object, point, options, data.curve);
        //append that shit
        newNodes.push(object);
        group.appendChild(object);
        // kill loop early if the objects are longer then the curve
        // replace later with a better thing
        if (pass.spacing >= pointArr[pointArr.length - 1].totalDist) {
            //object.remove()
            break;
        }
    }
    // if autowidth put object at very last point
    if (!options.isLoop && options.autoWidth) {
        let object;
        node.type === 'COMPONENT' ? object = node.createInstance() : object = node.clone();
        object.setPluginData("linkedID", "");
        const point = pointArr[pointArr.length - 1];
        if (!options.rotCheck) {
            point.angle = node.rotation - 180;
        }
        place(object, point, options, data.curve);
        newNodes.push(object);
        group.appendChild(object);
    }
    // group things and scroll into view
    return;
};
/**
 * remove all nodes in a group besides the curve node
 * @param group group object to look through
 * @param curveID the object id to NOT delete
 */
const deleteNodeinGroup = (group, curveID) => {
    group.children.forEach(i => { if (i.id !== curveID)
        i.remove(); });
};
// this didn't need to be a function but like i already wrote so
/**
 * case for handling spaces, becasue figma will auto them as 0 width; character 8197 isnt the best but you kno what... its good enough
 * @param c input string
 */
const safeSpace = (c) => {
    return c.replace(' ', String.fromCharCode(8197));
};


/***/ }),

/***/ "./src_old/ts/selection.ts":
/*!*********************************!*\
  !*** ./src_old/ts/selection.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decide": () => (/* binding */ decide),
/* harmony export */   "isLinkedObject": () => (/* binding */ isLinkedObject),
/* harmony export */   "onChange": () => (/* binding */ onChange),
/* harmony export */   "prevData": () => (/* binding */ prevData),
/* harmony export */   "prevDataChange": () => (/* binding */ prevDataChange),
/* harmony export */   "send": () => (/* binding */ send),
/* harmony export */   "setPluginClose": () => (/* binding */ setPluginClose),
/* harmony export */   "timerWatch": () => (/* binding */ timerWatch)
/* harmony export */ });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./src_old/ts/helper.ts");
/*
    code for handling selection logic
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma
*/

/**
 * bool of whether or not currently selected is already a linked object
 */
let isLinkedObject = false;
/**
 *
 */
let prevData = "";
/**
 * i forgot what this does. fix later
 * @param setData
 */
const prevDataChange = (setData) => {
    return prevData = setData;
};
/**
 * bool state of whether or not plugin is closed
 */
let pluginClose = false;
const setPluginClose = (state) => {
    pluginClose = state;
};
/**
 * decide which one in the selected is the curve and which is the object
 * @param selection
 * @param setting
 */
const decide = (selection, setting) => {
    let curve;
    let n;
    let other;
    let type = "clone";
    const filterselect = selection.filter(n => n.type === 'VECTOR' || n.type === 'ELLIPSE');
    // if two curves are selected, select one with bigger x or y
    // im sure theres a way to make this code smaller but idk how
    if (filterselect.length == 2) {
        const object1 = filterselect[0];
        const object2 = filterselect[1];
        if (object1.width + object1.height > object2.width + object2.height) {
            n = object1;
            other = object2;
        }
        else {
            n = object2;
            other = object1;
        }
    }
    else {
        const object1 = filterselect[0];
        // this case, only one in filterselect so select default.
        n = object1;
        // select the other one.
        other = selection.filter(a => a.type !== 'VECTOR' && a.type !== 'ELLIPSE')[0];
    }
    if (other.type === 'TEXT')
        type = "text";
    // if eclipse, flatten the ellipse so it is registered as a curve.
    // this isn't ideal at all, but it reduces code.
    if (n.type == 'ELLIPSE') {
        curve = figma.flatten([n]);
        figma.currentPage.selection = [other, curve];
    }
    else {
        curve = n;
    }
    return {
        namespace: "topathfigma",
        curve: curve,
        other: other,
        setting: setting,
        type: type
    };
};
/**
 * do things on a selection change
 */
const onChange = () => {
    const selection = figma.currentPage.selection;
    isLinkedObject = false;
    prevDataChange("");
    // case handling is torture
    // check if theres anything selected
    switch (selection.length) {
        case 2:
            //check if a curve is selected
            if (selection.filter(node => node.type === 'VECTOR' || node.type === 'ELLIPSE').length > 0) {
                // if its a text or somethin else
                if (selection.filter(node => node.type === 'TEXT').length == 1) {
                    send('text', selection);
                }
                else {
                    send('clone', selection);
                }
            }
            else {
                send('nocurve');
            }
            break;
        case 1:
            // if selecting a linked group
            const selected = selection[0];
            const groupId = selected.getPluginData("linkedID");
            if (groupId) {
                isLinkedObject = true;
            }
            else if (selected.type === 'GROUP') {
                const groupData = _helper__WEBPACK_IMPORTED_MODULE_0__.isLinked(selected);
                if (groupData) {
                    send('linkedGroup', selected, groupData);
                }
                else {
                    send('one');
                    // get the data from that.
                }
            }
            else {
                send('one');
            }
            break;
        case 0:
            send('nothing');
            break;
        default:
            send('toomany');
    }
    return selection;
};
/**
 * update ui only when selection is changed
 * @param value
 * @param selection
 * @param data
 */
const send = (value, selection = null, data = null) => {
    if (selection != null) {
        if (data == null) {
            data = decide(selection, null);
        }
        var svgdata = data.curve.vectorPaths[0].data;
        if (data.curve.vectorPaths[0].data.match(/M/g).length > 1)
            value = 'vectornetwork';
        const width = data.other.width;
        figma.ui.postMessage({ type: 'svg', width, value, data, svgdata });
    }
    else {
        figma.ui.postMessage({ type: 'rest', value });
    }
};
/**
 * watch every set 300 milliseconds, if certain objects are selected, watch for changes
 */
const timerWatch = () => {
    setTimeout(function () {
        if (!pluginClose) {
            if (isLinkedObject) {
                let localselection = figma.currentPage.selection;
                const groupId = localselection[0].getPluginData("linkedID");
                // deepcopy to get unlinked copy
                const data = JSON.stringify(_helper__WEBPACK_IMPORTED_MODULE_0__.deepCopy(localselection[0]));
                // compare current object with prevData (previously rendered data)
                if (prevData != data) {
                    const groupNode = figma.getNodeById(groupId);
                    const groupData = _helper__WEBPACK_IMPORTED_MODULE_0__.isLinked(groupNode, localselection[0].id);
                    send('linkedGroup', groupNode, groupData);
                    prevDataChange(data);
                }
            }
            timerWatch();
        }
        return;
    }, 300);
};


/***/ }),

/***/ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/bezier.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/bezier.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bezier": () => (/* binding */ Bezier)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/utils.js");
/* harmony import */ var _poly_bezier_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./poly-bezier.js */ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/poly-bezier.js");
/**
  A javascript Bezier curve library by Pomax.

  Based on http://pomax.github.io/bezierinfo

  This code is MIT licensed.
**/




// math-inlining.
const { abs, min, max, cos, sin, acos, sqrt } = Math;
const pi = Math.PI;
// a zero coordinate, which is surprisingly useful
const ZERO = { x: 0, y: 0, z: 0 };

/**
 * Bezier curve constructor.
 *
 * ...docs pending...
 */
class Bezier {
  constructor(coords) {
    let args =
      coords && coords.forEach ? coords : Array.from(arguments).slice();
    let coordlen = false;

    if (typeof args[0] === "object") {
      coordlen = args.length;
      const newargs = [];
      args.forEach(function (point) {
        ["x", "y", "z"].forEach(function (d) {
          if (typeof point[d] !== "undefined") {
            newargs.push(point[d]);
          }
        });
      });
      args = newargs;
    }

    let higher = false;
    const len = args.length;

    if (coordlen) {
      if (coordlen > 4) {
        if (arguments.length !== 1) {
          throw new Error(
            "Only new Bezier(point[]) is accepted for 4th and higher order curves"
          );
        }
        higher = true;
      }
    } else {
      if (len !== 6 && len !== 8 && len !== 9 && len !== 12) {
        if (arguments.length !== 1) {
          throw new Error(
            "Only new Bezier(point[]) is accepted for 4th and higher order curves"
          );
        }
      }
    }

    const _3d = (this._3d =
      (!higher && (len === 9 || len === 12)) ||
      (coords && coords[0] && typeof coords[0].z !== "undefined"));

    const points = (this.points = []);
    for (let idx = 0, step = _3d ? 3 : 2; idx < len; idx += step) {
      var point = {
        x: args[idx],
        y: args[idx + 1],
      };
      if (_3d) {
        point.z = args[idx + 2];
      }
      points.push(point);
    }
    const order = (this.order = points.length - 1);

    const dims = (this.dims = ["x", "y"]);
    if (_3d) dims.push("z");
    this.dimlen = dims.length;

    // is this curve, practically speaking, a straight line?
    const aligned = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.align(points, { p1: points[0], p2: points[order] });
    const baselength = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(points[0], points[order]);
    this._linear = aligned.reduce((t, p) => t + abs(p.y), 0) < baselength / 50;

    this._lut = [];
    this._t1 = 0;
    this._t2 = 1;
    this.update();
  }

  static quadraticFromPoints(p1, p2, p3, t) {
    if (typeof t === "undefined") {
      t = 0.5;
    }
    // shortcuts, although they're really dumb
    if (t === 0) {
      return new Bezier(p2, p2, p3);
    }
    if (t === 1) {
      return new Bezier(p1, p2, p2);
    }
    // real fitting.
    const abc = Bezier.getABC(2, p1, p2, p3, t);
    return new Bezier(p1, abc.A, p3);
  }

  static cubicFromPoints(S, B, E, t, d1) {
    if (typeof t === "undefined") {
      t = 0.5;
    }
    const abc = Bezier.getABC(3, S, B, E, t);
    if (typeof d1 === "undefined") {
      d1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(B, abc.C);
    }
    const d2 = (d1 * (1 - t)) / t;

    const selen = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(S, E),
      lx = (E.x - S.x) / selen,
      ly = (E.y - S.y) / selen,
      bx1 = d1 * lx,
      by1 = d1 * ly,
      bx2 = d2 * lx,
      by2 = d2 * ly;
    // derivation of new hull coordinates
    const e1 = { x: B.x - bx1, y: B.y - by1 },
      e2 = { x: B.x + bx2, y: B.y + by2 },
      A = abc.A,
      v1 = { x: A.x + (e1.x - A.x) / (1 - t), y: A.y + (e1.y - A.y) / (1 - t) },
      v2 = { x: A.x + (e2.x - A.x) / t, y: A.y + (e2.y - A.y) / t },
      nc1 = { x: S.x + (v1.x - S.x) / t, y: S.y + (v1.y - S.y) / t },
      nc2 = {
        x: E.x + (v2.x - E.x) / (1 - t),
        y: E.y + (v2.y - E.y) / (1 - t),
      };
    // ...done
    return new Bezier(S, nc1, nc2, E);
  }

  static getUtils() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils;
  }

  getUtils() {
    return Bezier.getUtils();
  }

  static get PolyBezier() {
    return _poly_bezier_js__WEBPACK_IMPORTED_MODULE_1__.PolyBezier;
  }

  valueOf() {
    return this.toString();
  }

  toString() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.pointsToString(this.points);
  }

  toSVG() {
    if (this._3d) return false;
    const p = this.points,
      x = p[0].x,
      y = p[0].y,
      s = ["M", x, y, this.order === 2 ? "Q" : "C"];
    for (let i = 1, last = p.length; i < last; i++) {
      s.push(p[i].x);
      s.push(p[i].y);
    }
    return s.join(" ");
  }

  setRatios(ratios) {
    if (ratios.length !== this.points.length) {
      throw new Error("incorrect number of ratio values");
    }
    this.ratios = ratios;
    this._lut = []; //  invalidate any precomputed LUT
  }

  verify() {
    const print = this.coordDigest();
    if (print !== this._print) {
      this._print = print;
      this.update();
    }
  }

  coordDigest() {
    return this.points
      .map(function (c, pos) {
        return "" + pos + c.x + c.y + (c.z ? c.z : 0);
      })
      .join("");
  }

  update() {
    // invalidate any precomputed LUT
    this._lut = [];
    this.dpoints = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.derive(this.points, this._3d);
    this.computedirection();
  }

  computedirection() {
    const points = this.points;
    const angle = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.angle(points[0], points[this.order], points[1]);
    this.clockwise = angle > 0;
  }

  length() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.length(this.derivative.bind(this));
  }

  static getABC(order = 2, S, B, E, t = 0.5) {
    const u = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.projectionratio(t, order),
      um = 1 - u,
      C = {
        x: u * S.x + um * E.x,
        y: u * S.y + um * E.y,
      },
      s = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.abcratio(t, order),
      A = {
        x: B.x + (B.x - C.x) / s,
        y: B.y + (B.y - C.y) / s,
      };
    return { A, B, C, S, E };
  }

  getABC(t, B) {
    B = B || this.get(t);
    let S = this.points[0];
    let E = this.points[this.order];
    return Bezier.getABC(this.order, S, B, E, t);
  }

  getLUT(steps) {
    this.verify();
    steps = steps || 100;
    if (this._lut.length === steps) {
      return this._lut;
    }
    this._lut = [];
    // n steps means n+1 points
    steps++;
    this._lut = [];
    for (let i = 0, p, t; i < steps; i++) {
      t = i / (steps - 1);
      p = this.compute(t);
      p.t = t;
      this._lut.push(p);
    }
    return this._lut;
  }

  on(point, error) {
    error = error || 5;
    const lut = this.getLUT(),
      hits = [];
    for (let i = 0, c, t = 0; i < lut.length; i++) {
      c = lut[i];
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(c, point) < error) {
        hits.push(c);
        t += i / lut.length;
      }
    }
    if (!hits.length) return false;
    return (t /= hits.length);
  }

  project(point) {
    // step 1: coarse check
    const LUT = this.getLUT(),
      l = LUT.length - 1,
      closest = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.closest(LUT, point),
      mpos = closest.mpos,
      t1 = (mpos - 1) / l,
      t2 = (mpos + 1) / l,
      step = 0.1 / l;

    // step 2: fine check
    let mdist = closest.mdist,
      t = t1,
      ft = t,
      p;
    mdist += 1;
    for (let d; t < t2 + step; t += step) {
      p = this.compute(t);
      d = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(point, p);
      if (d < mdist) {
        mdist = d;
        ft = t;
      }
    }
    ft = ft < 0 ? 0 : ft > 1 ? 1 : ft;
    p = this.compute(ft);
    p.t = ft;
    p.d = mdist;
    return p;
  }

  get(t) {
    return this.compute(t);
  }

  point(idx) {
    return this.points[idx];
  }

  compute(t) {
    if (this.ratios) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.computeWithRatios(t, this.points, this.ratios, this._3d);
    }
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.compute(t, this.points, this._3d, this.ratios);
  }

  raise() {
    const p = this.points,
      np = [p[0]],
      k = p.length;
    for (let i = 1, pi, pim; i < k; i++) {
      pi = p[i];
      pim = p[i - 1];
      np[i] = {
        x: ((k - i) / k) * pi.x + (i / k) * pim.x,
        y: ((k - i) / k) * pi.y + (i / k) * pim.y,
      };
    }
    np[k] = p[k - 1];
    return new Bezier(np);
  }

  derivative(t) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.compute(t, this.dpoints[0], this._3d);
  }

  dderivative(t) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.compute(t, this.dpoints[1], this._3d);
  }

  align() {
    let p = this.points;
    return new Bezier(_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.align(p, { p1: p[0], p2: p[p.length - 1] }));
  }

  curvature(t) {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.curvature(t, this.dpoints[0], this.dpoints[1], this._3d);
  }

  inflections() {
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.inflections(this.points);
  }

  normal(t) {
    return this._3d ? this.__normal3(t) : this.__normal2(t);
  }

  __normal2(t) {
    const d = this.derivative(t);
    const q = sqrt(d.x * d.x + d.y * d.y);
    return { t, x: -d.y / q, y: d.x / q };
  }

  __normal3(t) {
    // see http://stackoverflow.com/questions/25453159
    const r1 = this.derivative(t),
      r2 = this.derivative(t + 0.01),
      q1 = sqrt(r1.x * r1.x + r1.y * r1.y + r1.z * r1.z),
      q2 = sqrt(r2.x * r2.x + r2.y * r2.y + r2.z * r2.z);
    r1.x /= q1;
    r1.y /= q1;
    r1.z /= q1;
    r2.x /= q2;
    r2.y /= q2;
    r2.z /= q2;
    // cross product
    const c = {
      x: r2.y * r1.z - r2.z * r1.y,
      y: r2.z * r1.x - r2.x * r1.z,
      z: r2.x * r1.y - r2.y * r1.x,
    };
    const m = sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
    c.x /= m;
    c.y /= m;
    c.z /= m;
    // rotation matrix
    const R = [
      c.x * c.x,
      c.x * c.y - c.z,
      c.x * c.z + c.y,
      c.x * c.y + c.z,
      c.y * c.y,
      c.y * c.z - c.x,
      c.x * c.z - c.y,
      c.y * c.z + c.x,
      c.z * c.z,
    ];
    // normal vector:
    const n = {
      t,
      x: R[0] * r1.x + R[1] * r1.y + R[2] * r1.z,
      y: R[3] * r1.x + R[4] * r1.y + R[5] * r1.z,
      z: R[6] * r1.x + R[7] * r1.y + R[8] * r1.z,
    };
    return n;
  }

  hull(t) {
    let p = this.points,
      _p = [],
      q = [],
      idx = 0;
    q[idx++] = p[0];
    q[idx++] = p[1];
    q[idx++] = p[2];
    if (this.order === 3) {
      q[idx++] = p[3];
    }
    // we lerp between all points at each iteration, until we have 1 point left.
    while (p.length > 1) {
      _p = [];
      for (let i = 0, pt, l = p.length - 1; i < l; i++) {
        pt = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.lerp(t, p[i], p[i + 1]);
        q[idx++] = pt;
        _p.push(pt);
      }
      p = _p;
    }
    return q;
  }

  split(t1, t2) {
    // shortcuts
    if (t1 === 0 && !!t2) {
      return this.split(t2).left;
    }
    if (t2 === 1) {
      return this.split(t1).right;
    }

    // no shortcut: use "de Casteljau" iteration.
    const q = this.hull(t1);
    const result = {
      left:
        this.order === 2
          ? new Bezier([q[0], q[3], q[5]])
          : new Bezier([q[0], q[4], q[7], q[9]]),
      right:
        this.order === 2
          ? new Bezier([q[5], q[4], q[2]])
          : new Bezier([q[9], q[8], q[6], q[3]]),
      span: q,
    };

    // make sure we bind _t1/_t2 information!
    result.left._t1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(0, 0, 1, this._t1, this._t2);
    result.left._t2 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(t1, 0, 1, this._t1, this._t2);
    result.right._t1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(t1, 0, 1, this._t1, this._t2);
    result.right._t2 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(1, 0, 1, this._t1, this._t2);

    // if we have no t2, we're done
    if (!t2) {
      return result;
    }

    // if we have a t2, split again:
    t2 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(t2, t1, 1, 0, 1);
    return result.right.split(t2).left;
  }

  extrema() {
    const result = {};
    let roots = [];

    this.dims.forEach(
      function (dim) {
        let mfn = function (v) {
          return v[dim];
        };
        let p = this.dpoints[0].map(mfn);
        result[dim] = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.droots(p);
        if (this.order === 3) {
          p = this.dpoints[1].map(mfn);
          result[dim] = result[dim].concat(_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.droots(p));
        }
        result[dim] = result[dim].filter(function (t) {
          return t >= 0 && t <= 1;
        });
        roots = roots.concat(result[dim].sort(_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.numberSort));
      }.bind(this)
    );

    result.values = roots.sort(_utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.numberSort).filter(function (v, idx) {
      return roots.indexOf(v) === idx;
    });

    return result;
  }

  bbox() {
    const extrema = this.extrema(),
      result = {};
    this.dims.forEach(
      function (d) {
        result[d] = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.getminmax(this, d, extrema[d]);
      }.bind(this)
    );
    return result;
  }

  overlaps(curve) {
    const lbbox = this.bbox(),
      tbbox = curve.bbox();
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.bboxoverlap(lbbox, tbbox);
  }

  offset(t, d) {
    if (typeof d !== "undefined") {
      const c = this.get(t),
        n = this.normal(t);
      const ret = {
        c: c,
        n: n,
        x: c.x + n.x * d,
        y: c.y + n.y * d,
      };
      if (this._3d) {
        ret.z = c.z + n.z * d;
      }
      return ret;
    }
    if (this._linear) {
      const nv = this.normal(0),
        coords = this.points.map(function (p) {
          const ret = {
            x: p.x + t * nv.x,
            y: p.y + t * nv.y,
          };
          if (p.z && nv.z) {
            ret.z = p.z + t * nv.z;
          }
          return ret;
        });
      return [new Bezier(coords)];
    }
    return this.reduce().map(function (s) {
      if (s._linear) {
        return s.offset(t)[0];
      }
      return s.scale(t);
    });
  }

  simple() {
    if (this.order === 3) {
      const a1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.angle(this.points[0], this.points[3], this.points[1]);
      const a2 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.angle(this.points[0], this.points[3], this.points[2]);
      if ((a1 > 0 && a2 < 0) || (a1 < 0 && a2 > 0)) return false;
    }
    const n1 = this.normal(0);
    const n2 = this.normal(1);
    let s = n1.x * n2.x + n1.y * n2.y;
    if (this._3d) {
      s += n1.z * n2.z;
    }
    return abs(acos(s)) < pi / 3;
  }

  reduce() {
    // TODO: examine these var types in more detail...
    let i,
      t1 = 0,
      t2 = 0,
      step = 0.01,
      segment,
      pass1 = [],
      pass2 = [];
    // first pass: split on extrema
    let extrema = this.extrema().values;
    if (extrema.indexOf(0) === -1) {
      extrema = [0].concat(extrema);
    }
    if (extrema.indexOf(1) === -1) {
      extrema.push(1);
    }

    for (t1 = extrema[0], i = 1; i < extrema.length; i++) {
      t2 = extrema[i];
      segment = this.split(t1, t2);
      segment._t1 = t1;
      segment._t2 = t2;
      pass1.push(segment);
      t1 = t2;
    }

    // second pass: further reduce these segments to simple segments
    pass1.forEach(function (p1) {
      t1 = 0;
      t2 = 0;
      while (t2 <= 1) {
        for (t2 = t1 + step; t2 <= 1 + step; t2 += step) {
          segment = p1.split(t1, t2);
          if (!segment.simple()) {
            t2 -= step;
            if (abs(t1 - t2) < step) {
              // we can never form a reduction
              return [];
            }
            segment = p1.split(t1, t2);
            segment._t1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(t1, 0, 1, p1._t1, p1._t2);
            segment._t2 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(t2, 0, 1, p1._t1, p1._t2);
            pass2.push(segment);
            t1 = t2;
            break;
          }
        }
      }
      if (t1 < 1) {
        segment = p1.split(t1, 1);
        segment._t1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(t1, 0, 1, p1._t1, p1._t2);
        segment._t2 = p1._t2;
        pass2.push(segment);
      }
    });
    return pass2;
  }

  translate(v, d1, d2) {
    d2 = typeof d2 === "number" ? d2 : d1;

    // TODO: make this take curves with control points outside
    //       of the start-end interval into account

    const o = this.order;
    let d = this.points.map((_, i) => (1 - i / o) * d1 + (i / o) * d2);
    return new Bezier(
      this.points.map((p, i) => ({
        x: p.x + v.x * d[i],
        y: p.y + v.y * d[i],
      }))
    );
  }

  scale(d) {
    const order = this.order;
    let distanceFn = false;
    if (typeof d === "function") {
      distanceFn = d;
    }
    if (distanceFn && order === 2) {
      return this.raise().scale(distanceFn);
    }

    // TODO: add special handling for non-linear degenerate curves.

    const clockwise = this.clockwise;
    const points = this.points;

    if (this._linear) {
      return this.translate(
        this.normal(0),
        distanceFn ? distanceFn(0) : d,
        distanceFn ? distanceFn(1) : d
      );
    }

    const r1 = distanceFn ? distanceFn(0) : d;
    const r2 = distanceFn ? distanceFn(1) : d;
    const v = [this.offset(0, 10), this.offset(1, 10)];
    const np = [];
    const o = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.lli4(v[0], v[0].c, v[1], v[1].c);

    if (!o) {
      throw new Error("cannot scale this curve. Try reducing it first.");
    }

    // move all points by distance 'd' wrt the origin 'o',
    // and move end points by fixed distance along normal.
    [0, 1].forEach(function (t) {
      const p = (np[t * order] = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.copy(points[t * order]));
      p.x += (t ? r2 : r1) * v[t].n.x;
      p.y += (t ? r2 : r1) * v[t].n.y;
    });

    if (!distanceFn) {
      // move control points to lie on the intersection of the offset
      // derivative vector, and the origin-through-control vector
      [0, 1].forEach((t) => {
        if (order === 2 && !!t) return;
        const p = np[t * order];
        const d = this.derivative(t);
        const p2 = { x: p.x + d.x, y: p.y + d.y };
        np[t + 1] = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.lli4(p, p2, o, points[t + 1]);
      });
      return new Bezier(np);
    }

    // move control points by "however much necessary to
    // ensure the correct tangent to endpoint".
    [0, 1].forEach(function (t) {
      if (order === 2 && !!t) return;
      var p = points[t + 1];
      var ov = {
        x: p.x - o.x,
        y: p.y - o.y,
      };
      var rc = distanceFn ? distanceFn((t + 1) / order) : d;
      if (distanceFn && !clockwise) rc = -rc;
      var m = sqrt(ov.x * ov.x + ov.y * ov.y);
      ov.x /= m;
      ov.y /= m;
      np[t + 1] = {
        x: p.x + rc * ov.x,
        y: p.y + rc * ov.y,
      };
    });
    return new Bezier(np);
  }

  outline(d1, d2, d3, d4) {
    d2 = d2 === undefined ? d1 : d2;

    if (this._linear) {
      // TODO: find the actual extrema, because they might
      //       be before the start, or past the end.

      const n = this.normal(0);
      const start = this.points[0];
      const end = this.points[this.points.length - 1];
      let s, mid, e;

      if (d3 === undefined) {
        d3 = d1;
        d4 = d2;
      }

      s = { x: start.x + n.x * d1, y: start.y + n.y * d1 };
      e = { x: end.x + n.x * d3, y: end.y + n.y * d3 };
      mid = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
      const fline = [s, mid, e];

      s = { x: start.x - n.x * d2, y: start.y - n.y * d2 };
      e = { x: end.x - n.x * d4, y: end.y - n.y * d4 };
      mid = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
      const bline = [e, mid, s];

      const ls = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.makeline(bline[2], fline[0]);
      const le = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.makeline(fline[2], bline[0]);
      const segments = [ls, new Bezier(fline), le, new Bezier(bline)];
      return new _poly_bezier_js__WEBPACK_IMPORTED_MODULE_1__.PolyBezier(segments);
    }

    const reduced = this.reduce(),
      len = reduced.length,
      fcurves = [];

    let bcurves = [],
      p,
      alen = 0,
      tlen = this.length();

    const graduated = typeof d3 !== "undefined" && typeof d4 !== "undefined";

    function linearDistanceFunction(s, e, tlen, alen, slen) {
      return function (v) {
        const f1 = alen / tlen,
          f2 = (alen + slen) / tlen,
          d = e - s;
        return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.map(v, 0, 1, s + f1 * d, s + f2 * d);
      };
    }

    // form curve oulines
    reduced.forEach(function (segment) {
      const slen = segment.length();
      if (graduated) {
        fcurves.push(
          segment.scale(linearDistanceFunction(d1, d3, tlen, alen, slen))
        );
        bcurves.push(
          segment.scale(linearDistanceFunction(-d2, -d4, tlen, alen, slen))
        );
      } else {
        fcurves.push(segment.scale(d1));
        bcurves.push(segment.scale(-d2));
      }
      alen += slen;
    });

    // reverse the "return" outline
    bcurves = bcurves
      .map(function (s) {
        p = s.points;
        if (p[3]) {
          s.points = [p[3], p[2], p[1], p[0]];
        } else {
          s.points = [p[2], p[1], p[0]];
        }
        return s;
      })
      .reverse();

    // form the endcaps as lines
    const fs = fcurves[0].points[0],
      fe = fcurves[len - 1].points[fcurves[len - 1].points.length - 1],
      bs = bcurves[len - 1].points[bcurves[len - 1].points.length - 1],
      be = bcurves[0].points[0],
      ls = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.makeline(bs, fs),
      le = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.makeline(fe, be),
      segments = [ls].concat(fcurves).concat([le]).concat(bcurves);

    return new _poly_bezier_js__WEBPACK_IMPORTED_MODULE_1__.PolyBezier(segments);
  }

  outlineshapes(d1, d2, curveIntersectionThreshold) {
    d2 = d2 || d1;
    const outline = this.outline(d1, d2).curves;
    const shapes = [];
    for (let i = 1, len = outline.length; i < len / 2; i++) {
      const shape = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.makeshape(
        outline[i],
        outline[len - i],
        curveIntersectionThreshold
      );
      shape.startcap.virtual = i > 1;
      shape.endcap.virtual = i < len / 2 - 1;
      shapes.push(shape);
    }
    return shapes;
  }

  intersects(curve, curveIntersectionThreshold) {
    if (!curve) return this.selfintersects(curveIntersectionThreshold);
    if (curve.p1 && curve.p2) {
      return this.lineIntersects(curve);
    }
    if (curve instanceof Bezier) {
      curve = curve.reduce();
    }
    return this.curveintersects(
      this.reduce(),
      curve,
      curveIntersectionThreshold
    );
  }

  lineIntersects(line) {
    const mx = min(line.p1.x, line.p2.x),
      my = min(line.p1.y, line.p2.y),
      MX = max(line.p1.x, line.p2.x),
      MY = max(line.p1.y, line.p2.y);
    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.roots(this.points, line).filter((t) => {
      var p = this.get(t);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.between(p.x, mx, MX) && _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.between(p.y, my, MY);
    });
  }

  selfintersects(curveIntersectionThreshold) {
    // "simple" curves cannot intersect with their direct
    // neighbour, so for each segment X we check whether
    // it intersects [0:x-2][x+2:last].

    const reduced = this.reduce(),
      len = reduced.length - 2,
      results = [];

    for (let i = 0, result, left, right; i < len; i++) {
      left = reduced.slice(i, i + 1);
      right = reduced.slice(i + 2);
      result = this.curveintersects(left, right, curveIntersectionThreshold);
      results.push(...result);
    }
    return results;
  }

  curveintersects(c1, c2, curveIntersectionThreshold) {
    const pairs = [];
    // step 1: pair off any overlapping segments
    c1.forEach(function (l) {
      c2.forEach(function (r) {
        if (l.overlaps(r)) {
          pairs.push({ left: l, right: r });
        }
      });
    });
    // step 2: for each pairing, run through the convergence algorithm.
    let intersections = [];
    pairs.forEach(function (pair) {
      const result = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.pairiteration(
        pair.left,
        pair.right,
        curveIntersectionThreshold
      );
      if (result.length > 0) {
        intersections = intersections.concat(result);
      }
    });
    return intersections;
  }

  arcs(errorThreshold) {
    errorThreshold = errorThreshold || 0.5;
    return this._iterate(errorThreshold, []);
  }

  _error(pc, np1, s, e) {
    const q = (e - s) / 4,
      c1 = this.get(s + q),
      c2 = this.get(e - q),
      ref = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(pc, np1),
      d1 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(pc, c1),
      d2 = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.dist(pc, c2);
    return abs(d1 - ref) + abs(d2 - ref);
  }

  _iterate(errorThreshold, circles) {
    let t_s = 0,
      t_e = 1,
      safety;
    // we do a binary search to find the "good `t` closest to no-longer-good"
    do {
      safety = 0;

      // step 1: start with the maximum possible arc
      t_e = 1;

      // points:
      let np1 = this.get(t_s),
        np2,
        np3,
        arc,
        prev_arc;

      // booleans:
      let curr_good = false,
        prev_good = false,
        done;

      // numbers:
      let t_m = t_e,
        prev_e = 1,
        step = 0;

      // step 2: find the best possible arc
      do {
        prev_good = curr_good;
        prev_arc = arc;
        t_m = (t_s + t_e) / 2;
        step++;

        np2 = this.get(t_m);
        np3 = this.get(t_e);

        arc = _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.getccenter(np1, np2, np3);

        //also save the t values
        arc.interval = {
          start: t_s,
          end: t_e,
        };

        let error = this._error(arc, np1, t_s, t_e);
        curr_good = error <= errorThreshold;

        done = prev_good && !curr_good;
        if (!done) prev_e = t_e;

        // this arc is fine: we can move 'e' up to see if we can find a wider arc
        if (curr_good) {
          // if e is already at max, then we're done for this arc.
          if (t_e >= 1) {
            // make sure we cap at t=1
            arc.interval.end = prev_e = 1;
            prev_arc = arc;
            // if we capped the arc segment to t=1 we also need to make sure that
            // the arc's end angle is correct with respect to the bezier end point.
            if (t_e > 1) {
              let d = {
                x: arc.x + arc.r * cos(arc.e),
                y: arc.y + arc.r * sin(arc.e),
              };
              arc.e += _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.angle({ x: arc.x, y: arc.y }, d, this.get(1));
            }
            break;
          }
          // if not, move it up by half the iteration distance
          t_e = t_e + (t_e - t_s) / 2;
        } else {
          // this is a bad arc: we need to move 'e' down to find a good arc
          t_e = t_m;
        }
      } while (!done && safety++ < 100);

      if (safety >= 100) {
        break;
      }

      // console.log("L835: [F] arc found", t_s, prev_e, prev_arc.x, prev_arc.y, prev_arc.s, prev_arc.e);

      prev_arc = prev_arc ? prev_arc : arc;
      circles.push(prev_arc);
      t_s = prev_e;
    } while (t_e < 1);
    return circles;
  }
}




/***/ }),

/***/ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/poly-bezier.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/poly-bezier.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PolyBezier": () => (/* binding */ PolyBezier)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/utils.js");


/**
 * Poly Bezier
 * @param {[type]} curves [description]
 */
class PolyBezier {
  constructor(curves) {
    this.curves = [];
    this._3d = false;
    if (!!curves) {
      this.curves = curves;
      this._3d = this.curves[0]._3d;
    }
  }

  valueOf() {
    return this.toString();
  }

  toString() {
    return (
      "[" +
      this.curves
        .map(function (curve) {
          return _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.pointsToString(curve.points);
        })
        .join(", ") +
      "]"
    );
  }

  addCurve(curve) {
    this.curves.push(curve);
    this._3d = this._3d || curve._3d;
  }

  length() {
    return this.curves
      .map(function (v) {
        return v.length();
      })
      .reduce(function (a, b) {
        return a + b;
      });
  }

  curve(idx) {
    return this.curves[idx];
  }

  bbox() {
    const c = this.curves;
    var bbox = c[0].bbox();
    for (var i = 1; i < c.length; i++) {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.utils.expandbox(bbox, c[i].bbox());
    }
    return bbox;
  }

  offset(d) {
    const offset = [];
    this.curves.forEach(function (v) {
      offset.push(...v.offset(d));
    });
    return new PolyBezier(offset);
  }
}




/***/ }),

/***/ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/utils.js":
/*!********************************************************************************!*\
  !*** ./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/utils.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "utils": () => (/* binding */ utils)
/* harmony export */ });
/* harmony import */ var _bezier_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bezier.js */ "./node_modules/.pnpm/bezier-js@6.1.0/node_modules/bezier-js/src/bezier.js");


// math-inlining.
const { abs, cos, sin, acos, atan2, sqrt, pow } = Math;

// cube root function yielding real roots
function crt(v) {
  return v < 0 ? -pow(-v, 1 / 3) : pow(v, 1 / 3);
}

// trig constants
const pi = Math.PI,
  tau = 2 * pi,
  quart = pi / 2,
  // float precision significant decimal
  epsilon = 0.000001,
  // extremas used in bbox calculation and similar algorithms
  nMax = Number.MAX_SAFE_INTEGER || 9007199254740991,
  nMin = Number.MIN_SAFE_INTEGER || -9007199254740991,
  // a zero coordinate, which is surprisingly useful
  ZERO = { x: 0, y: 0, z: 0 };

// Bezier utility functions
const utils = {
  // Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
  Tvalues: [
    -0.0640568928626056260850430826247450385909,
    0.0640568928626056260850430826247450385909,
    -0.1911188674736163091586398207570696318404,
    0.1911188674736163091586398207570696318404,
    -0.3150426796961633743867932913198102407864,
    0.3150426796961633743867932913198102407864,
    -0.4337935076260451384870842319133497124524,
    0.4337935076260451384870842319133497124524,
    -0.5454214713888395356583756172183723700107,
    0.5454214713888395356583756172183723700107,
    -0.6480936519369755692524957869107476266696,
    0.6480936519369755692524957869107476266696,
    -0.7401241915785543642438281030999784255232,
    0.7401241915785543642438281030999784255232,
    -0.8200019859739029219539498726697452080761,
    0.8200019859739029219539498726697452080761,
    -0.8864155270044010342131543419821967550873,
    0.8864155270044010342131543419821967550873,
    -0.9382745520027327585236490017087214496548,
    0.9382745520027327585236490017087214496548,
    -0.9747285559713094981983919930081690617411,
    0.9747285559713094981983919930081690617411,
    -0.9951872199970213601799974097007368118745,
    0.9951872199970213601799974097007368118745,
  ],

  // Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
  Cvalues: [
    0.1279381953467521569740561652246953718517,
    0.1279381953467521569740561652246953718517,
    0.1258374563468282961213753825111836887264,
    0.1258374563468282961213753825111836887264,
    0.121670472927803391204463153476262425607,
    0.121670472927803391204463153476262425607,
    0.1155056680537256013533444839067835598622,
    0.1155056680537256013533444839067835598622,
    0.1074442701159656347825773424466062227946,
    0.1074442701159656347825773424466062227946,
    0.0976186521041138882698806644642471544279,
    0.0976186521041138882698806644642471544279,
    0.086190161531953275917185202983742667185,
    0.086190161531953275917185202983742667185,
    0.0733464814110803057340336152531165181193,
    0.0733464814110803057340336152531165181193,
    0.0592985849154367807463677585001085845412,
    0.0592985849154367807463677585001085845412,
    0.0442774388174198061686027482113382288593,
    0.0442774388174198061686027482113382288593,
    0.0285313886289336631813078159518782864491,
    0.0285313886289336631813078159518782864491,
    0.0123412297999871995468056670700372915759,
    0.0123412297999871995468056670700372915759,
  ],

  arcfn: function (t, derivativeFn) {
    const d = derivativeFn(t);
    let l = d.x * d.x + d.y * d.y;
    if (typeof d.z !== "undefined") {
      l += d.z * d.z;
    }
    return sqrt(l);
  },

  compute: function (t, points, _3d) {
    // shortcuts
    if (t === 0) {
      points[0].t = 0;
      return points[0];
    }

    const order = points.length - 1;

    if (t === 1) {
      points[order].t = 1;
      return points[order];
    }

    const mt = 1 - t;
    let p = points;

    // constant?
    if (order === 0) {
      points[0].t = t;
      return points[0];
    }

    // linear?
    if (order === 1) {
      const ret = {
        x: mt * p[0].x + t * p[1].x,
        y: mt * p[0].y + t * p[1].y,
        t: t,
      };
      if (_3d) {
        ret.z = mt * p[0].z + t * p[1].z;
      }
      return ret;
    }

    // quadratic/cubic curve?
    if (order < 4) {
      let mt2 = mt * mt,
        t2 = t * t,
        a,
        b,
        c,
        d = 0;
      if (order === 2) {
        p = [p[0], p[1], p[2], ZERO];
        a = mt2;
        b = mt * t * 2;
        c = t2;
      } else if (order === 3) {
        a = mt2 * mt;
        b = mt2 * t * 3;
        c = mt * t2 * 3;
        d = t * t2;
      }
      const ret = {
        x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
        y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y,
        t: t,
      };
      if (_3d) {
        ret.z = a * p[0].z + b * p[1].z + c * p[2].z + d * p[3].z;
      }
      return ret;
    }

    // higher order curves: use de Casteljau's computation
    const dCpts = JSON.parse(JSON.stringify(points));
    while (dCpts.length > 1) {
      for (let i = 0; i < dCpts.length - 1; i++) {
        dCpts[i] = {
          x: dCpts[i].x + (dCpts[i + 1].x - dCpts[i].x) * t,
          y: dCpts[i].y + (dCpts[i + 1].y - dCpts[i].y) * t,
        };
        if (typeof dCpts[i].z !== "undefined") {
          dCpts[i] = dCpts[i].z + (dCpts[i + 1].z - dCpts[i].z) * t;
        }
      }
      dCpts.splice(dCpts.length - 1, 1);
    }
    dCpts[0].t = t;
    return dCpts[0];
  },

  computeWithRatios: function (t, points, ratios, _3d) {
    const mt = 1 - t,
      r = ratios,
      p = points;

    let f1 = r[0],
      f2 = r[1],
      f3 = r[2],
      f4 = r[3],
      d;

    // spec for linear
    f1 *= mt;
    f2 *= t;

    if (p.length === 2) {
      d = f1 + f2;
      return {
        x: (f1 * p[0].x + f2 * p[1].x) / d,
        y: (f1 * p[0].y + f2 * p[1].y) / d,
        z: !_3d ? false : (f1 * p[0].z + f2 * p[1].z) / d,
        t: t,
      };
    }

    // upgrade to quadratic
    f1 *= mt;
    f2 *= 2 * mt;
    f3 *= t * t;

    if (p.length === 3) {
      d = f1 + f2 + f3;
      return {
        x: (f1 * p[0].x + f2 * p[1].x + f3 * p[2].x) / d,
        y: (f1 * p[0].y + f2 * p[1].y + f3 * p[2].y) / d,
        z: !_3d ? false : (f1 * p[0].z + f2 * p[1].z + f3 * p[2].z) / d,
        t: t,
      };
    }

    // upgrade to cubic
    f1 *= mt;
    f2 *= 1.5 * mt;
    f3 *= 3 * mt;
    f4 *= t * t * t;

    if (p.length === 4) {
      d = f1 + f2 + f3 + f4;
      return {
        x: (f1 * p[0].x + f2 * p[1].x + f3 * p[2].x + f4 * p[3].x) / d,
        y: (f1 * p[0].y + f2 * p[1].y + f3 * p[2].y + f4 * p[3].y) / d,
        z: !_3d
          ? false
          : (f1 * p[0].z + f2 * p[1].z + f3 * p[2].z + f4 * p[3].z) / d,
        t: t,
      };
    }
  },

  derive: function (points, _3d) {
    const dpoints = [];
    for (let p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
      const list = [];
      for (let j = 0, dpt; j < c; j++) {
        dpt = {
          x: c * (p[j + 1].x - p[j].x),
          y: c * (p[j + 1].y - p[j].y),
        };
        if (_3d) {
          dpt.z = c * (p[j + 1].z - p[j].z);
        }
        list.push(dpt);
      }
      dpoints.push(list);
      p = list;
    }
    return dpoints;
  },

  between: function (v, m, M) {
    return (
      (m <= v && v <= M) ||
      utils.approximately(v, m) ||
      utils.approximately(v, M)
    );
  },

  approximately: function (a, b, precision) {
    return abs(a - b) <= (precision || epsilon);
  },

  length: function (derivativeFn) {
    const z = 0.5,
      len = utils.Tvalues.length;

    let sum = 0;

    for (let i = 0, t; i < len; i++) {
      t = z * utils.Tvalues[i] + z;
      sum += utils.Cvalues[i] * utils.arcfn(t, derivativeFn);
    }
    return z * sum;
  },

  map: function (v, ds, de, ts, te) {
    const d1 = de - ds,
      d2 = te - ts,
      v2 = v - ds,
      r = v2 / d1;
    return ts + d2 * r;
  },

  lerp: function (r, v1, v2) {
    const ret = {
      x: v1.x + r * (v2.x - v1.x),
      y: v1.y + r * (v2.y - v1.y),
    };
    if (v1.z !== undefined && v2.z !== undefined) {
      ret.z = v1.z + r * (v2.z - v1.z);
    }
    return ret;
  },

  pointToString: function (p) {
    let s = p.x + "/" + p.y;
    if (typeof p.z !== "undefined") {
      s += "/" + p.z;
    }
    return s;
  },

  pointsToString: function (points) {
    return "[" + points.map(utils.pointToString).join(", ") + "]";
  },

  copy: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  angle: function (o, v1, v2) {
    const dx1 = v1.x - o.x,
      dy1 = v1.y - o.y,
      dx2 = v2.x - o.x,
      dy2 = v2.y - o.y,
      cross = dx1 * dy2 - dy1 * dx2,
      dot = dx1 * dx2 + dy1 * dy2;
    return atan2(cross, dot);
  },

  // round as string, to avoid rounding errors
  round: function (v, d) {
    const s = "" + v;
    const pos = s.indexOf(".");
    return parseFloat(s.substring(0, pos + 1 + d));
  },

  dist: function (p1, p2) {
    const dx = p1.x - p2.x,
      dy = p1.y - p2.y;
    return sqrt(dx * dx + dy * dy);
  },

  closest: function (LUT, point) {
    let mdist = pow(2, 63),
      mpos,
      d;
    LUT.forEach(function (p, idx) {
      d = utils.dist(point, p);
      if (d < mdist) {
        mdist = d;
        mpos = idx;
      }
    });
    return { mdist: mdist, mpos: mpos };
  },

  abcratio: function (t, n) {
    // see ratio(t) note on http://pomax.github.io/bezierinfo/#abc
    if (n !== 2 && n !== 3) {
      return false;
    }
    if (typeof t === "undefined") {
      t = 0.5;
    } else if (t === 0 || t === 1) {
      return t;
    }
    const bottom = pow(t, n) + pow(1 - t, n),
      top = bottom - 1;
    return abs(top / bottom);
  },

  projectionratio: function (t, n) {
    // see u(t) note on http://pomax.github.io/bezierinfo/#abc
    if (n !== 2 && n !== 3) {
      return false;
    }
    if (typeof t === "undefined") {
      t = 0.5;
    } else if (t === 0 || t === 1) {
      return t;
    }
    const top = pow(1 - t, n),
      bottom = pow(t, n) + top;
    return top / bottom;
  },

  lli8: function (x1, y1, x2, y2, x3, y3, x4, y4) {
    const nx =
        (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
      ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
      d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (d == 0) {
      return false;
    }
    return { x: nx / d, y: ny / d };
  },

  lli4: function (p1, p2, p3, p4) {
    const x1 = p1.x,
      y1 = p1.y,
      x2 = p2.x,
      y2 = p2.y,
      x3 = p3.x,
      y3 = p3.y,
      x4 = p4.x,
      y4 = p4.y;
    return utils.lli8(x1, y1, x2, y2, x3, y3, x4, y4);
  },

  lli: function (v1, v2) {
    return utils.lli4(v1, v1.c, v2, v2.c);
  },

  makeline: function (p1, p2) {
    return new _bezier_js__WEBPACK_IMPORTED_MODULE_0__.Bezier(
      p1.x,
      p1.y,
      (p1.x + p2.x) / 2,
      (p1.y + p2.y) / 2,
      p2.x,
      p2.y
    );
  },

  findbbox: function (sections) {
    let mx = nMax,
      my = nMax,
      MX = nMin,
      MY = nMin;
    sections.forEach(function (s) {
      const bbox = s.bbox();
      if (mx > bbox.x.min) mx = bbox.x.min;
      if (my > bbox.y.min) my = bbox.y.min;
      if (MX < bbox.x.max) MX = bbox.x.max;
      if (MY < bbox.y.max) MY = bbox.y.max;
    });
    return {
      x: { min: mx, mid: (mx + MX) / 2, max: MX, size: MX - mx },
      y: { min: my, mid: (my + MY) / 2, max: MY, size: MY - my },
    };
  },

  shapeintersections: function (
    s1,
    bbox1,
    s2,
    bbox2,
    curveIntersectionThreshold
  ) {
    if (!utils.bboxoverlap(bbox1, bbox2)) return [];
    const intersections = [];
    const a1 = [s1.startcap, s1.forward, s1.back, s1.endcap];
    const a2 = [s2.startcap, s2.forward, s2.back, s2.endcap];
    a1.forEach(function (l1) {
      if (l1.virtual) return;
      a2.forEach(function (l2) {
        if (l2.virtual) return;
        const iss = l1.intersects(l2, curveIntersectionThreshold);
        if (iss.length > 0) {
          iss.c1 = l1;
          iss.c2 = l2;
          iss.s1 = s1;
          iss.s2 = s2;
          intersections.push(iss);
        }
      });
    });
    return intersections;
  },

  makeshape: function (forward, back, curveIntersectionThreshold) {
    const bpl = back.points.length;
    const fpl = forward.points.length;
    const start = utils.makeline(back.points[bpl - 1], forward.points[0]);
    const end = utils.makeline(forward.points[fpl - 1], back.points[0]);
    const shape = {
      startcap: start,
      forward: forward,
      back: back,
      endcap: end,
      bbox: utils.findbbox([start, forward, back, end]),
    };
    shape.intersections = function (s2) {
      return utils.shapeintersections(
        shape,
        shape.bbox,
        s2,
        s2.bbox,
        curveIntersectionThreshold
      );
    };
    return shape;
  },

  getminmax: function (curve, d, list) {
    if (!list) return { min: 0, max: 0 };
    let min = nMax,
      max = nMin,
      t,
      c;
    if (list.indexOf(0) === -1) {
      list = [0].concat(list);
    }
    if (list.indexOf(1) === -1) {
      list.push(1);
    }
    for (let i = 0, len = list.length; i < len; i++) {
      t = list[i];
      c = curve.get(t);
      if (c[d] < min) {
        min = c[d];
      }
      if (c[d] > max) {
        max = c[d];
      }
    }
    return { min: min, mid: (min + max) / 2, max: max, size: max - min };
  },

  align: function (points, line) {
    const tx = line.p1.x,
      ty = line.p1.y,
      a = -atan2(line.p2.y - ty, line.p2.x - tx),
      d = function (v) {
        return {
          x: (v.x - tx) * cos(a) - (v.y - ty) * sin(a),
          y: (v.x - tx) * sin(a) + (v.y - ty) * cos(a),
        };
      };
    return points.map(d);
  },

  roots: function (points, line) {
    line = line || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };

    const order = points.length - 1;
    const aligned = utils.align(points, line);
    const reduce = function (t) {
      return 0 <= t && t <= 1;
    };

    if (order === 2) {
      const a = aligned[0].y,
        b = aligned[1].y,
        c = aligned[2].y,
        d = a - 2 * b + c;
      if (d !== 0) {
        const m1 = -sqrt(b * b - a * c),
          m2 = -a + b,
          v1 = -(m1 + m2) / d,
          v2 = -(-m1 + m2) / d;
        return [v1, v2].filter(reduce);
      } else if (b !== c && d === 0) {
        return [(2 * b - c) / (2 * b - 2 * c)].filter(reduce);
      }
      return [];
    }

    // see http://www.trans4mind.com/personal_development/mathematics/polynomials/cubicAlgebra.htm
    const pa = aligned[0].y,
      pb = aligned[1].y,
      pc = aligned[2].y,
      pd = aligned[3].y;

    let d = -pa + 3 * pb - 3 * pc + pd,
      a = 3 * pa - 6 * pb + 3 * pc,
      b = -3 * pa + 3 * pb,
      c = pa;

    if (utils.approximately(d, 0)) {
      // this is not a cubic curve.
      if (utils.approximately(a, 0)) {
        // in fact, this is not a quadratic curve either.
        if (utils.approximately(b, 0)) {
          // in fact in fact, there are no solutions.
          return [];
        }
        // linear solution:
        return [-c / b].filter(reduce);
      }
      // quadratic solution:
      const q = sqrt(b * b - 4 * a * c),
        a2 = 2 * a;
      return [(q - b) / a2, (-b - q) / a2].filter(reduce);
    }

    // at this point, we know we need a cubic solution:

    a /= d;
    b /= d;
    c /= d;

    const p = (3 * b - a * a) / 3,
      p3 = p / 3,
      q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
      q2 = q / 2,
      discriminant = q2 * q2 + p3 * p3 * p3;

    let u1, v1, x1, x2, x3;
    if (discriminant < 0) {
      const mp3 = -p / 3,
        mp33 = mp3 * mp3 * mp3,
        r = sqrt(mp33),
        t = -q / (2 * r),
        cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
        phi = acos(cosphi),
        crtr = crt(r),
        t1 = 2 * crtr;
      x1 = t1 * cos(phi / 3) - a / 3;
      x2 = t1 * cos((phi + tau) / 3) - a / 3;
      x3 = t1 * cos((phi + 2 * tau) / 3) - a / 3;
      return [x1, x2, x3].filter(reduce);
    } else if (discriminant === 0) {
      u1 = q2 < 0 ? crt(-q2) : -crt(q2);
      x1 = 2 * u1 - a / 3;
      x2 = -u1 - a / 3;
      return [x1, x2].filter(reduce);
    } else {
      const sd = sqrt(discriminant);
      u1 = crt(-q2 + sd);
      v1 = crt(q2 + sd);
      return [u1 - v1 - a / 3].filter(reduce);
    }
  },

  droots: function (p) {
    // quadratic roots are easy
    if (p.length === 3) {
      const a = p[0],
        b = p[1],
        c = p[2],
        d = a - 2 * b + c;
      if (d !== 0) {
        const m1 = -sqrt(b * b - a * c),
          m2 = -a + b,
          v1 = -(m1 + m2) / d,
          v2 = -(-m1 + m2) / d;
        return [v1, v2];
      } else if (b !== c && d === 0) {
        return [(2 * b - c) / (2 * (b - c))];
      }
      return [];
    }

    // linear roots are even easier
    if (p.length === 2) {
      const a = p[0],
        b = p[1];
      if (a !== b) {
        return [a / (a - b)];
      }
      return [];
    }

    return [];
  },

  curvature: function (t, d1, d2, _3d, kOnly) {
    let num,
      dnm,
      adk,
      dk,
      k = 0,
      r = 0;

    //
    // We're using the following formula for curvature:
    //
    //              x'y" - y'x"
    //   k(t) = ------------------
    //           (x'² + y'²)^(3/2)
    //
    // from https://en.wikipedia.org/wiki/Radius_of_curvature#Definition
    //
    // With it corresponding 3D counterpart:
    //
    //          sqrt( (y'z" - y"z')² + (z'x" - z"x')² + (x'y" - x"y')²)
    //   k(t) = -------------------------------------------------------
    //                     (x'² + y'² + z'²)^(3/2)
    //

    const d = utils.compute(t, d1);
    const dd = utils.compute(t, d2);
    const qdsum = d.x * d.x + d.y * d.y;

    if (_3d) {
      num = sqrt(
        pow(d.y * dd.z - dd.y * d.z, 2) +
          pow(d.z * dd.x - dd.z * d.x, 2) +
          pow(d.x * dd.y - dd.x * d.y, 2)
      );
      dnm = pow(qdsum + d.z * d.z, 3 / 2);
    } else {
      num = d.x * dd.y - d.y * dd.x;
      dnm = pow(qdsum, 3 / 2);
    }

    if (num === 0 || dnm === 0) {
      return { k: 0, r: 0 };
    }

    k = num / dnm;
    r = dnm / num;

    // We're also computing the derivative of kappa, because
    // there is value in knowing the rate of change for the
    // curvature along the curve. And we're just going to
    // ballpark it based on an epsilon.
    if (!kOnly) {
      // compute k'(t) based on the interval before, and after it,
      // to at least try to not introduce forward/backward pass bias.
      const pk = utils.curvature(t - 0.001, d1, d2, _3d, true).k;
      const nk = utils.curvature(t + 0.001, d1, d2, _3d, true).k;
      dk = (nk - k + (k - pk)) / 2;
      adk = (abs(nk - k) + abs(k - pk)) / 2;
    }

    return { k: k, r: r, dk: dk, adk: adk };
  },

  inflections: function (points) {
    if (points.length < 4) return [];

    // FIXME: TODO: add in inflection abstraction for quartic+ curves?

    const p = utils.align(points, { p1: points[0], p2: points.slice(-1)[0] }),
      a = p[2].x * p[1].y,
      b = p[3].x * p[1].y,
      c = p[1].x * p[2].y,
      d = p[3].x * p[2].y,
      v1 = 18 * (-3 * a + 2 * b + 3 * c - d),
      v2 = 18 * (3 * a - b - 3 * c),
      v3 = 18 * (c - a);

    if (utils.approximately(v1, 0)) {
      if (!utils.approximately(v2, 0)) {
        let t = -v3 / v2;
        if (0 <= t && t <= 1) return [t];
      }
      return [];
    }

    const d2 = 2 * v1;

    if (utils.approximately(d2, 0)) return [];

    const trm = v2 * v2 - 4 * v1 * v3;

    if (trm < 0) return [];

    const sq = Math.sqrt(trm);

    return [(sq - v2) / d2, -(v2 + sq) / d2].filter(function (r) {
      return 0 <= r && r <= 1;
    });
  },

  bboxoverlap: function (b1, b2) {
    const dims = ["x", "y"],
      len = dims.length;

    for (let i = 0, dim, l, t, d; i < len; i++) {
      dim = dims[i];
      l = b1[dim].mid;
      t = b2[dim].mid;
      d = (b1[dim].size + b2[dim].size) / 2;
      if (abs(l - t) >= d) return false;
    }
    return true;
  },

  expandbox: function (bbox, _bbox) {
    if (_bbox.x.min < bbox.x.min) {
      bbox.x.min = _bbox.x.min;
    }
    if (_bbox.y.min < bbox.y.min) {
      bbox.y.min = _bbox.y.min;
    }
    if (_bbox.z && _bbox.z.min < bbox.z.min) {
      bbox.z.min = _bbox.z.min;
    }
    if (_bbox.x.max > bbox.x.max) {
      bbox.x.max = _bbox.x.max;
    }
    if (_bbox.y.max > bbox.y.max) {
      bbox.y.max = _bbox.y.max;
    }
    if (_bbox.z && _bbox.z.max > bbox.z.max) {
      bbox.z.max = _bbox.z.max;
    }
    bbox.x.mid = (bbox.x.min + bbox.x.max) / 2;
    bbox.y.mid = (bbox.y.min + bbox.y.max) / 2;
    if (bbox.z) {
      bbox.z.mid = (bbox.z.min + bbox.z.max) / 2;
    }
    bbox.x.size = bbox.x.max - bbox.x.min;
    bbox.y.size = bbox.y.max - bbox.y.min;
    if (bbox.z) {
      bbox.z.size = bbox.z.max - bbox.z.min;
    }
  },

  pairiteration: function (c1, c2, curveIntersectionThreshold) {
    const c1b = c1.bbox(),
      c2b = c2.bbox(),
      r = 100000,
      threshold = curveIntersectionThreshold || 0.5;

    if (
      c1b.x.size + c1b.y.size < threshold &&
      c2b.x.size + c2b.y.size < threshold
    ) {
      return [
        (((r * (c1._t1 + c1._t2)) / 2) | 0) / r +
          "/" +
          (((r * (c2._t1 + c2._t2)) / 2) | 0) / r,
      ];
    }

    let cc1 = c1.split(0.5),
      cc2 = c2.split(0.5),
      pairs = [
        { left: cc1.left, right: cc2.left },
        { left: cc1.left, right: cc2.right },
        { left: cc1.right, right: cc2.right },
        { left: cc1.right, right: cc2.left },
      ];

    pairs = pairs.filter(function (pair) {
      return utils.bboxoverlap(pair.left.bbox(), pair.right.bbox());
    });

    let results = [];

    if (pairs.length === 0) return results;

    pairs.forEach(function (pair) {
      results = results.concat(
        utils.pairiteration(pair.left, pair.right, threshold)
      );
    });

    results = results.filter(function (v, i) {
      return results.indexOf(v) === i;
    });

    return results;
  },

  getccenter: function (p1, p2, p3) {
    const dx1 = p2.x - p1.x,
      dy1 = p2.y - p1.y,
      dx2 = p3.x - p2.x,
      dy2 = p3.y - p2.y,
      dx1p = dx1 * cos(quart) - dy1 * sin(quart),
      dy1p = dx1 * sin(quart) + dy1 * cos(quart),
      dx2p = dx2 * cos(quart) - dy2 * sin(quart),
      dy2p = dx2 * sin(quart) + dy2 * cos(quart),
      // chord midpoints
      mx1 = (p1.x + p2.x) / 2,
      my1 = (p1.y + p2.y) / 2,
      mx2 = (p2.x + p3.x) / 2,
      my2 = (p2.y + p3.y) / 2,
      // midpoint offsets
      mx1n = mx1 + dx1p,
      my1n = my1 + dy1p,
      mx2n = mx2 + dx2p,
      my2n = my2 + dy2p,
      // intersection of these lines:
      arc = utils.lli8(mx1, my1, mx1n, my1n, mx2, my2, mx2n, my2n),
      r = utils.dist(arc, p1);

    // arc start/end values, over mid point:
    let s = atan2(p1.y - arc.y, p1.x - arc.x),
      m = atan2(p2.y - arc.y, p2.x - arc.x),
      e = atan2(p3.y - arc.y, p3.x - arc.x),
      _;

    // determine arc direction (cw/ccw correction)
    if (s < e) {
      // if s<m<e, arc(s, e)
      // if m<s<e, arc(e, s + tau)
      // if s<e<m, arc(e, s + tau)
      if (s > m || m > e) {
        s += tau;
      }
      if (s > e) {
        _ = e;
        e = s;
        s = _;
      }
    } else {
      // if e<m<s, arc(e, s)
      // if m<e<s, arc(s, e + tau)
      // if e<s<m, arc(s, e + tau)
      if (e < m && m < s) {
        _ = e;
        e = s;
        s = _;
      } else {
        e += tau;
      }
    }
    // assign and done.
    arc.s = s;
    arc.e = e;
    arc.r = r;
    return arc;
  },

  numberSort: function (a, b) {
    return a - b;
  },
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src_old/code.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ts_curve__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ts/curve */ "./src_old/ts/curve.ts");
/* harmony import */ var _ts_place__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ts/place */ "./src_old/ts/place.ts");
/* harmony import */ var _ts_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ts/helper */ "./src_old/ts/helper.ts");
/* harmony import */ var _ts_selection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ts/selection */ "./src_old/ts/selection.ts");
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
    source code for "to path", a plugin for figma
    creater: last night
    website: notsimon.space
    version: im baby
    github: https://github.com/codelastnight/to-path-figma

    disclaimer:
    i dont know how to code
*/




/**
 * checks if the code is initially run after an object is selected.
 */
let firstRender = true;
/**
 * current selection stored so its accessible later
 */
let SelectionNodes = [];
/**
 * main code
 * * async required because figma api requires you to load fonts into the plugin to use them...
 * honestly im really tempted to just hardcode a dumb font like swanky and moo moo instead
 * @param group
 * @param data
 */
const main = (group, data) => __awaiter(void 0, void 0, void 0, function* () {
    // select the curve
    // take the svg data of the curve and turn it into an array of points
    //idk if i should store this or not. its pretty fast to calculate so....
    const pointArr = _ts_curve__WEBPACK_IMPORTED_MODULE_0__.allPoints(data.curve.vectorPaths[0].data, data.setting);
    // load all fonts in selected object if group or frame or text  
    if (data.other.type === 'TEXT' || data.other.type === 'FRAME' || data.other.type === 'GROUP') {
        if (firstRender) {
            let textnode = data.other.type === 'TEXT' ? [data.other] : data.other.findAll(e => e.type === 'TEXT');
            for (const find of textnode) {
                for (let i = 0; i < find.characters.length; i++) {
                    yield figma.loadFontAsync(find.getRangeFontName(i, i + 1));
                    if (find.hasMissingFont) {
                        figma.closePlugin('Text contains a missing font, please install the font first!');
                    }
                }
            }
        }
    }
    _ts_place__WEBPACK_IMPORTED_MODULE_1__.deleteNodeinGroup(group, data.curveCloneID);
    data.other.type === 'TEXT' ? _ts_place__WEBPACK_IMPORTED_MODULE_1__.text2Curve(data.other, pointArr, data, group) : _ts_place__WEBPACK_IMPORTED_MODULE_1__.object2Curve(data.other, pointArr, data, group);
    _ts_helper__WEBPACK_IMPORTED_MODULE_2__.setLink(group, data);
    return;
});
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'do-the-thing') {
        let group;
        const groupId = SelectionNodes[0].getPluginData("linkedID");
        if (groupId) {
            group = figma.getNodeById(groupId);
        }
        else {
            group = SelectionNodes.find(i => i.type === "GROUP");
        }
        var data = _ts_helper__WEBPACK_IMPORTED_MODULE_2__.isLinked(group);
        if (data) {
            data.setting = msg.options;
            yield main(group, data);
            group.setRelaunchData({ relaunch: 'Edit with To Path' });
            firstRender = false;
        }
        else {
            _ts_selection__WEBPACK_IMPORTED_MODULE_3__.send('linklost');
        }
    }
    // initial run when "link" button is hit
    if (msg.type === 'initial-link') {
        const data = _ts_selection__WEBPACK_IMPORTED_MODULE_3__.decide(SelectionNodes, msg.options);
        //rename paths
        data.other.name = "[Linked] " + data.other.name.replace("[Linked] ", '');
        data.curve.name = "[Linked] " + data.curve.name.replace('[Linked] ', '');
        //clone curve Selection to retain curve shape
        const clone2 = data.curve;
        data.curveCloneID = clone2.id;
        data.curve.parent.appendChild(clone2);
        // make a new group 
        let group = figma.group([clone2], data.curve.parent);
        group.name = "Linked Path Group";
        figma.currentPage.selection = [group];
        // link custom data
        _ts_helper__WEBPACK_IMPORTED_MODULE_2__.setLink(group, data);
        data.curve.setPluginData("linkedID", group.id);
        data.other.setPluginData("linkedID", group.id);
        console.log(Date.now());
        yield main(group, data);
        group.setRelaunchData({ relaunch: 'Edit with To Path' });
        firstRender = false;
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // what if i dont wanna lmao
}));
//watches for selecition change and notifies UI
figma.on('selectionchange', () => {
    SelectionNodes = _ts_selection__WEBPACK_IMPORTED_MODULE_3__.onChange();
    if (!firstRender)
        firstRender = true;
});
figma.on('close', () => {
    _ts_selection__WEBPACK_IMPORTED_MODULE_3__.setPluginClose(true);
});
// run things initially
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 280, height: 480 });
//checks for initial Selection
SelectionNodes = _ts_selection__WEBPACK_IMPORTED_MODULE_3__.onChange();
// run timerwatch when plugin starts
_ts_selection__WEBPACK_IMPORTED_MODULE_3__.timerWatch();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1Asa0NBQWtDO0FBQ2xDLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isc0JBQXNCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxrREFBa0QsT0FBTztBQUN6RDtBQUNBLDJCQUEyQixPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx1QkFBdUIsU0FBUztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGFBQWE7QUFDYixHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxlQUFlLDhDQUFNO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsV0FBVyxxREFBcUQ7QUFDaEUsV0FBVyxxREFBcUQ7QUFDaEU7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsU0FBUztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLHFCQUFxQixNQUFNLFlBQVksUUFBUTs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWE7QUFDYixHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUEsb0NBQW9DLHdDQUF3QztBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBLGtDQUFrQyxTQUFTO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7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QTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQSxpQkFBaUIsbURBQWtCO0FBQ25DO0FBQ0EscURBQW9CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG8tcGF0aC1maWdtYS8uL3NyY19vbGQvdHMvY3VydmUudHMiLCJ3ZWJwYWNrOi8vdG8tcGF0aC1maWdtYS8uL3NyY19vbGQvdHMvaGVscGVyLnRzIiwid2VicGFjazovL3RvLXBhdGgtZmlnbWEvLi9zcmNfb2xkL3RzL3BsYWNlLnRzIiwid2VicGFjazovL3RvLXBhdGgtZmlnbWEvLi9zcmNfb2xkL3RzL3NlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly90by1wYXRoLWZpZ21hLy4vbm9kZV9tb2R1bGVzLy5wbnBtL2Jlemllci1qc0A2LjEuMC9ub2RlX21vZHVsZXMvYmV6aWVyLWpzL3NyYy9iZXppZXIuanMiLCJ3ZWJwYWNrOi8vdG8tcGF0aC1maWdtYS8uL25vZGVfbW9kdWxlcy8ucG5wbS9iZXppZXItanNANi4xLjAvbm9kZV9tb2R1bGVzL2Jlemllci1qcy9zcmMvcG9seS1iZXppZXIuanMiLCJ3ZWJwYWNrOi8vdG8tcGF0aC1maWdtYS8uL25vZGVfbW9kdWxlcy8ucG5wbS9iZXppZXItanNANi4xLjAvbm9kZV9tb2R1bGVzL2Jlemllci1qcy9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vdG8tcGF0aC1maWdtYS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1wYXRoLWZpZ21hL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1wYXRoLWZpZ21hL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tcGF0aC1maWdtYS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLXBhdGgtZmlnbWEvLi9zcmNfb2xkL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICAgIGNvZGUgZm9yIGFsbCB0aGUgY3VydmUgaGFuZGxpbmcgZnVuY3Rpb25zXHJcbiAgICBjcmVhdGVyOiBsYXN0IG5pZ2h0XHJcbiAgICB3ZWJzaXRlOiBub3RzaW1vbi5zcGFjZVxyXG4gICAgdmVyc2lvbjogaW0gYmFieVxyXG4gICAgZ2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vY29kZWxhc3RuaWdodC90by1wYXRoLWZpZ21hXHJcbiovXHJcbmltcG9ydCB7IEJlemllciB9IGZyb20gXCJiZXppZXItanNcIjtcclxuaW1wb3J0IHsgZGlzdEJ0d24sIHBvaW50QnR3biwgcGFyc2VTVkcgfSBmcm9tICcuL2hlbHBlcic7XHJcbi8qKlxyXG4gKiBjYWxjdWxhdGUgcG9pbnQgb24gYSBjdXJ2ZSBhdCB0aW1lIHQgZnJvbSAyIG9yIDQgcG9pbnRzXHJcbiAqICogRGUgQ2FzdGVsamF14oCZcyBhbGdvcml0aG0gIGh0dHBzOi8vamF2YXNjcmlwdC5pbmZvL2Jlemllci1jdXJ2ZVxyXG4gKiBAcGFyYW0gY3VydmVcclxuICogQHBhcmFtIHQgY3VycmVudCB0aW1lXHJcbiAqIEBwYXJhbSByb3RhdGlvbiBib29sZWFuIHNob3VsZCBjYWxjdWxhdGUgcm90YXRpb24/XHJcbiAqL1xyXG5jb25zdCBjYXN0ZWxqYXUgPSAoY3VydmUsIHQsIHNldHRpbmcsIGNhbGNSb3QgPSBmYWxzZSkgPT4ge1xyXG4gICAgbGV0IGFyciA9IFtdO1xyXG4gICAgLy8gdXNpbmcgYSBmb3IgbG9vcCBoZXJlIGJlY2FzdWUgaSBuZWVkIHRvIGFjY2VzcyB0aGUgbmV4dCBjdXJ2ZSBmcm9tIHRoZSBjdXJyZW50IG9uZVxyXG4gICAgZm9yICh2YXIgYyA9IDA7IGMgPCBjdXJ2ZS5sZW5ndGggLSAxOyBjKyspIHtcclxuICAgICAgICBsZXQgcG9pbnQgPSBwb2ludEJ0d24oY3VydmVbY10sIGN1cnZlW2MgKyAxXSwgdCwgc2V0dGluZy5wcmVjaXNpb24pO1xyXG4gICAgICAgIGFyci5wdXNoKHBvaW50KTtcclxuICAgICAgICBpZiAoY2FsY1JvdCAmJiBzZXR0aW5nLnJvdENoZWNrKSB7XHJcbiAgICAgICAgICAgIC8vZmlnbWEgd2FudHMgdGhpcyBudW1iZXIgdG8gYmUgaW4gZGVncmVlcyBiZWNhc3VlIGZ1Y2sgeW91IGkgZ3Vlc3NcclxuICAgICAgICAgICAgbGV0IGFuZ2xlID0gTWF0aC5hdGFuKChjdXJ2ZVtjICsgMV0ueCAtIGN1cnZlW2NdLngpIC8gKGN1cnZlW2MgKyAxXS55IC0gY3VydmVbY10ueSkpICpcclxuICAgICAgICAgICAgICAgICgxODAgLyBNYXRoLlBJKTtcclxuICAgICAgICAgICAgLy8gZmxpcCBhbmdsZSBjYWxjdWxhdGlvbnMgYmFzZWQgb24gaWYgZ29pbmcgbGVmdCBvciByaWdodFxyXG4gICAgICAgICAgICBpZiAoY3VydmVbYyArIDFdLnkgLSBjdXJ2ZVtjXS55IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgYW5nbGUgPSAxODAgKyBhbmdsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb2ludC5hbmdsZSA9IDkwICsgYW5nbGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFycjtcclxufTtcclxuLyoqXHJcbiAqIGJhc2ljYWxseSB0dXJucyA0IHBvaW50cyBvbiBhIGJlemllciBpbnRvIGEgY3VydmVcclxuICogKiB1dGFsaXplcyB0aGUgY2FzdGVsamF1IGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSBjdXJ2ZSBbcG9pbnQxLCBwb2ludDIsIHBvaW50MywgcG9pbnQ0XVxyXG4gKiBAcGFyYW0gc2V0dGluZyBvcHRpb25zIGRhdGFcclxuICogQHBhcmFtIHRvdGFsRGlzdCB0b3RhbCBsZW5ndGggb2YgdGhlIGN1cnZlIHVwIHRvIHRoYXQgcG9pbnRcclxuICovXHJcbmNvbnN0IHBvaW50T25DdXJ2ZSA9IChjdXJ2ZSwgc2V0dGluZywgdG90YWxEaXN0KSA9PiB7XHJcbiAgICBsZXQgZmluYWxhcnIgPSBbXTtcclxuICAgIGZvciAodmFyIHQgPSAwOyB0IDwgc2V0dGluZy5wcmVjaXNpb247IHQrKykge1xyXG4gICAgICAgIC8vY291bGQgaSB1c2UgcmVjdXJzaXZlPyB5ZWEuIGFtIGkgZ29ubmE/IG5vIHRoYXQgc291bmRzIGxpa2Ugd29ya1xyXG4gICAgICAgIC8vIGlmIHN0cmFpZ2h0IGxpbmUsIGRvIHRoaXNcclxuICAgICAgICBsZXQgYXJyMSA9IFtdO1xyXG4gICAgICAgIGlmIChjdXJ2ZS5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICBhcnIxID0gY2FzdGVsamF1KGN1cnZlLCB0LCBzZXR0aW5nLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgY3VydmVkIGxpbmUsIGRvIHRoaXNcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYXJyMSA9IGNhc3RlbGphdShjYXN0ZWxqYXUoY2FzdGVsamF1KGN1cnZlLCB0LCBzZXR0aW5nKSwgdCwgc2V0dGluZyksIHQsIHNldHRpbmcsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnZXQgcmlkIG9mIHRoZSBleHRyYSBicmFja2V0XHJcbiAgICAgICAgbGV0IHBvaW50ZGF0YSA9IGFycjFbMF07XHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGVudGlyZXBvaW50cyB0byBlc3RpbWF0ZSB0aGUgZGlzdGFuY2UgYXQgdGhhdCBzcGVjaWZpYyBwb2ludFxyXG4gICAgICAgIGlmIChmaW5hbGFyci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkZERpc3QgPSBkaXN0QnR3bihmaW5hbGFycltmaW5hbGFyci5sZW5ndGggLSAxXSwgcG9pbnRkYXRhKTtcclxuICAgICAgICAgICAgcG9pbnRkYXRhLmRpc3QgPSBhZGREaXN0O1xyXG4gICAgICAgICAgICBwb2ludGRhdGEudG90YWxEaXN0ID0gYWRkRGlzdCArIGZpbmFsYXJyW2ZpbmFsYXJyLmxlbmd0aCAtIDFdLnRvdGFsRGlzdDtcclxuICAgICAgICAgICAgdG90YWxEaXN0ID0gcG9pbnRkYXRhLnRvdGFsRGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHBvaW50ZGF0YS5kaXN0ID0gMDtcclxuICAgICAgICAgICAgcG9pbnRkYXRhLnRvdGFsRGlzdCA9IHRvdGFsRGlzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxhcnIucHVzaChwb2ludGRhdGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpbmFsYXJyO1xyXG59O1xyXG4vKipcclxuICogY2FsY3VsYXRlIGFsbCBwb2ludHMgb24gdGhlIHBhcnNlZCBzdmcgZGF0YVxyXG4gKiBAcGFyYW0gc3ZnRGF0YVxyXG4gKiBAcGFyYW0gc2V0dGluZ1xyXG4gKiBAcGFyYW0gcm90YXRpb25cclxuICovXHJcbmV4cG9ydCBjb25zdCBhbGxQb2ludHMgPSAoc3ZnRGF0YSwgc2V0dGluZykgPT4ge1xyXG4gICAgbGV0IHBvaW50QXJyID0gW107XHJcbiAgICBsZXQgdmVjdG9ycyA9IHBhcnNlU1ZHKHN2Z0RhdGEpO1xyXG4gICAgLy8gcmV2ZXJzZSB0aGUgcG9pbnRzIGlmIHRoZSBzZXR0aW5ncyBzYXkgc29cclxuICAgIGlmIChzZXR0aW5nLnJldmVyc2UpIHtcclxuICAgICAgICB2ZWN0b3JzID0gdmVjdG9ycy5tYXAoY3VydmUgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VydmUucmV2ZXJzZSgpO1xyXG4gICAgICAgIH0pLnJldmVyc2UoKTtcclxuICAgIH1cclxuICAgIGxldCB0b3RhbERpc3QgPSAwO1xyXG4gICAgZm9yICh2YXIgY3VydmUgaW4gdmVjdG9ycykge1xyXG4gICAgICAgIHBvaW50QXJyLnB1c2goLi4ucG9pbnRPbkN1cnZlKHZlY3RvcnNbY3VydmVdLCBzZXR0aW5nLCB0b3RhbERpc3QpKTtcclxuICAgICAgICB0b3RhbERpc3QgPSBwb2ludEFycltwb2ludEFyci5sZW5ndGggLSAxXS50b3RhbERpc3Q7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcG9pbnRBcnI7XHJcbn07XHJcbi8qKlxyXG4gKiBiYXNpY2FsbHkgdHVybnMgNCBwb2ludHMgb24gYSBiZXppZXIgaW50byBhIGN1cnZlXHJcbiAqICogdXRhbGl6ZXMgdGhlIGNhc3RlbGphdSBmdW5jdGlvblxyXG4gKiBAcGFyYW0gY3VydmUgW3BvaW50MSwgcG9pbnQyLCBwb2ludDMsIHBvaW50NF1cclxuICogQHBhcmFtIHQgbnVtYmVyO1xyXG4gKiBAcGFyYW0gc2V0dGluZyBvcHRpb25zIGRhdGFcclxuICovXHJcbmNvbnN0IGdldFBvaW50RnJvbUN1cnZlID0gKGN1cnZlLCB0LCBzZXR0aW5nKSA9PiB7XHJcbiAgICBjb25zdCBiZXppZXIgPSBuZXcgQmV6aWVyKGN1cnZlKTtcclxuICAgIHJldHVybiBiZXppZXIuZ2V0KHQpO1xyXG59O1xyXG4iLCIvL3BsdWdpbiBkYXRhIGtleSBuYW1lXHJcbmNvbnN0IGtleU5hbWUgPSBcInBhdGhEYXRhXCI7XHJcbi8qKlxyXG4gKiBnZXQgZGF0YSBmcm9tIGFuIG9iamVjdFxyXG4gKiBAcGFyYW0gZ3JvdXAgdGhlIGdyb3VwIG9iamVjdCB0byBsb29rIGludG9cclxuICovXHJcbmNvbnN0IGdldExpbmsgPSAoZ3JvdXAsIHVwZGF0ZU90aGVySWQgPSBcIlwiLCBrZXkgPSBrZXlOYW1lKSA9PiB7XHJcbiAgICAvLyBnZXQgZGF0YSBmcm9tIHBsdWdpblxyXG4gICAgdmFyIGdldERhdGEgPSBncm91cC5nZXRTaGFyZWRQbHVnaW5EYXRhKFwidG9wYXRoZmlnbWFcIiwga2V5KTtcclxuICAgIGxldCBvdXREYXRhID0gSlNPTi5wYXJzZShnZXREYXRhKTtcclxuICAgIC8vIGhhbmRsZSBlZGdlIGNhc2Ugd2hlcmUgb2JqZWN0IGNoYW5nZXMgdHlwZSwgaW4gd2hpY2ggY2FzZSBpZCB1cGRhdGVzXHJcbiAgICAvLyB3aHkgZmlnbWEgd2h5XHJcbiAgICBsZXQgb3RoZXJJZCA9IG91dERhdGEub3RoZXIuaWQ7XHJcbiAgICBpZiAodXBkYXRlT3RoZXJJZCAmJiB1cGRhdGVPdGhlcklkICE9IG91dERhdGEub3RoZXIuaWQpIHtcclxuICAgICAgICBvdGhlcklkID0gdXBkYXRlT3RoZXJJZDtcclxuICAgIH1cclxuICAgIC8vIG9ubHkgaWQncyBhcmUgc3RvcmVkLCBiZWNhc3VlIGl0cyBhIHNoYWxsb3cgY29weS4gXHJcbiAgICAvLyBnZXQgZGF0YSBmcm9tIGxpbmtlZCBvYmplY3RzXHJcbiAgICBvdXREYXRhLmN1cnZlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQob3V0RGF0YS5jdXJ2ZS5pZCk7XHJcbiAgICBvdXREYXRhLm90aGVyID0gZmlnbWEuZ2V0Tm9kZUJ5SWQob3RoZXJJZCk7XHJcbiAgICBzZXRMaW5rKGdyb3VwLCBvdXREYXRhKTtcclxuICAgIGlmIChvdXREYXRhLmN1cnZlID09IG51bGwgfHwgb3V0RGF0YS5vdGhlciA9PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG91dERhdGE7XHJcbn07XHJcbi8qKlxyXG4gKiBjaGVjayBpZiBhIGdyb3VwIG9iamVjdCBpcyBpbiBsaW5rZWQgc3RhdGVcclxuICogQHBhcmFtIGdyb3VwIHRoZSBncm91cCBvYmplY3QgdG8gY2hlY2tcclxuICovXHJcbmV4cG9ydCBjb25zdCBpc0xpbmtlZCA9IChncm91cCwgdXBkYXRlT3RoZXJJZCA9IFwiXCIpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRMaW5rKGdyb3VwLCB1cGRhdGVPdGhlcklkKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogc2V0IHRoZSBsaW5rIGRhdGEgaW50byB0aGUgZ3JvdXAgb2JqZWN0XHJcbiAqIEBwYXJhbSBncm91cCB0YXJnZXQgZ3JvdXAgb2JqZWN0XHJcbiAqIEBwYXJhbSBkYXRhIGRhdGEgdG8gc2V0IGludG8gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgdmFyIHNldExpbmsgPSAoZ3JvdXAsIGRhdGEsIGtleSA9IGtleU5hbWUpID0+IHtcclxuICAgIGdyb3VwLnNldFNoYXJlZFBsdWdpbkRhdGEoZGF0YS5uYW1lc3BhY2UsIGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG59O1xyXG4vKipcclxuICogdHVybiB3aGF0ZXZlciBzdmcgY29kZSBpcyBpbnRvIGFycmF5IG9mIHBvaW50cyBncm91cGVkIGludG8gNCBvciAyICggdGhpcyBpcyBkZXBlbmRhbnQgb24gd2hhdCB0eXBlIG9mIGJlemllciBjdXJ2ZSBpdCBpcy4gbG9vayBpdCB1cClcclxuICogICogbm90ZTogZmlnbWEgZG9lc250IGhhdmUgdGhlIDMgcG9pbnQgYmV6aWVyIGN1cnZlIGluIHZlY3RvciBtb2RlLCBvbmx5IDQgb3IgMi5cclxuICogQHBhcmFtIHN2Z0RhdGEgc3ZnIHBhdGggZGF0YSBicnVoIG1vbWVudFxyXG4gKiBAcmV0dXJucyBhcnJheSBvZiBhcnJheSBvZiBwb2ludHMsIGVnIFtbcG9pbnQxLDIsMyw0XSxbNCw1XSxbNSw2LDcsOF0uLi4uXVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHBhcnNlU1ZHID0gKHN2Z0RhdGEpID0+IHtcclxuICAgIGNvbnN0IHRlc3QgPSBzdmdEYXRhLnJlcGxhY2UoJ1onLCAnJykuc3BsaXQoJ00nKTsgLy9zcGxpdCBpZiBtb3JlIHRoZW4gMSBzZWN0aW9uIGFuZCBnZXRzIHJpZCBvZiB0aGUgZXh0cmEgYXJyYXkgdmFsdWUgYXQgZnJvbnRcclxuICAgIHRlc3Quc2hpZnQoKTtcclxuICAgIC8vIHRocm93IGVycm9yIGlmIHRoZXJlcyB0b28gbWFueSBsaW5lcyBiZWNhc3VlIGltIGxhenlcclxuICAgIGlmICh0ZXN0Lmxlbmd0aCA+IDEpXHJcbiAgICAgICAgdGhyb3cgJ1RPTyBNQU5ZIExJTkVTISB0aGlzIHBsdWdpbiBvbmx5IHN1cHBvcnRzIG9uZSBjb250aW5vdXMgdmVjdG9yJztcclxuICAgIGNvbnN0IGJlemllckNodW5rcyA9IHRlc3RbMF0udHJpbSgpLnNwbGl0KC8gTHxDIC8pOyAvLyBzcGxpdHMgc3RyaW5nIGludG8gdGhlIGNodW5rcyBvZiBkaWZmZXJlbnQgbGluZXNcclxuICAgIC8vIHRoZSBwb2ludCB0byBzcGxpY2UgaW50byB0aGUgbmV4dCBjdXJ2ZVxyXG4gICAgbGV0IHNwbGljZWluID0gW107XHJcbiAgICAvLyB0aGUgb3V0cHV0IGdyb3VwIG9mIGN1cnZlcyAod2hpY2ggaXMgYSBncm91cCBvZiBwb2ludHMpXHJcbiAgICAvLyBpbW1hIGJlIGhvbmVzdCBpIGRvbnQga25vdyBob3cgaSBtYWRlIHRoaXMgd29yayBpdHMgbWFnaWMgXHJcbiAgICBsZXQgY2xlYW5UeXBlID0gYmV6aWVyQ2h1bmtzLm1hcChlID0+IHtcclxuICAgICAgICAvL3NwbGl0IGVhY2ggc3RyaW5nIGluIHRoZSBjaHVuayBpbnRvIHBvaW50c1xyXG4gICAgICAgIGNvbnN0IHNwbGl0UG9pbnRzID0gYXJyQ2h1bmsoZS50cmltKCkuc3BsaXQoJyAnKSwgMik7XHJcbiAgICAgICAgLy90aGlzIGFkZHMgdGhlIGxhc3QgcG9pbnQgZnJvbSB0aGUgcHJldmlvdXMgYXJyYXkgaW50byB0aGUgbmV4dCBvbmUuXHJcbiAgICAgICAgc3BsaXRQb2ludHMudW5zaGlmdChzcGxpY2Vpbik7XHJcbiAgICAgICAgc3BsaWNlaW4gPSBzcGxpdFBvaW50c1tzcGxpdFBvaW50cy5sZW5ndGggLSAxXTtcclxuICAgICAgICBjb25zdCB0eXBlZFBvaW50cyA9IHNwbGl0UG9pbnRzLm1hcCgocG9pbnQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IE51bWJlcihwb2ludFswXSksXHJcbiAgICAgICAgICAgICAgICB5OiBOdW1iZXIocG9pbnRbMV0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVkUG9pbnRzO1xyXG4gICAgfSk7XHJcbiAgICBjbGVhblR5cGUuc2hpZnQoKTsgLy8gZ2V0IHJpZCBvZiB0aGUgZXh0cmEgZW1wdHkgYXJyYXkgdmFsdWVcclxuICAgIHJldHVybiBjbGVhblR5cGU7XHJcbn07XHJcbi8qKlxyXG4gKiBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cyBhIGFuZCBiXHJcbiAqIEBwYXJhbSBhIGZpcnN0IHBvaW50XHJcbiAqIEBwYXJhbSBiIHNlY29uZCBwb2ludFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGRpc3RCdHduID0gKGEsIGIpID0+IHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKGIueCAtIGEueCksIDIpICsgTWF0aC5wb3coKGIueSAtIGEueSksIDIpKTtcclxufTtcclxuLyoqXHJcbiAqIGZpbmQgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzIGEgYW5kIGIgb3ZlciB0aW1lXHJcbiAqICppbiB0aGlzIGNhc2UgdGltZSBpcyBwaXhlbHNcclxuICogQHBhcmFtIGEgcG9pbnQgYVxyXG4gKiBAcGFyYW0gYiBwb2ludCBiXHJcbiAqIEBwYXJhbSB0IGN1cnJlbnQgdGltZVxyXG4gKiBAcGFyYW0gdGltZSB0b3RhbCB0aW1lXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcG9pbnRCdHduID0gKGEsIGIsIHQsIHRpbWUpID0+IHtcclxuICAgIC8vZmluZCB0aGUgdW5pdCAgdmVjdG9yIGJldHdlZW4gcG9pbnRzIGEgYW5kIGJcclxuICAgIC8vIG5vdCByZWFsbHkgdW5pdCB2ZWN0b3IgaW4gdGhlIG1hdGggc2Vuc2UgdGhvXHJcbiAgICAvL2NvbnN0IHVuaXRWZWN0b3I6IFBvaW50ID0geyB4OiAsIHk6ICh9IFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBhLnggKyAoKGIueCAtIGEueCkgLyB0aW1lKSAqIHQsXHJcbiAgICAgICAgeTogYS55ICsgKChiLnkgLSBhLnkpIC8gdGltZSkgKiB0XHJcbiAgICB9O1xyXG59O1xyXG4vL1xyXG4vKipcclxuICogZmluZCBwb2ludCBiZXR3ZWVuIHR3byBwb2ludHMgYSBhbmQgYiBvdmVyIGRpc3RhbmNlXHJcbiAqIEBwYXJhbSBhXHJcbiAqIEBwYXJhbSBiXHJcbiAqIEBwYXJhbSBkaXN0XHJcbiAqIEBwYXJhbSB0b3RhbERpc3RcclxuICogQHBhcmFtIGFuZ2xlXHJcbiAqL1xyXG5leHBvcnQgdmFyIHBvaW50QnR3bkJ5TGVuZ3RoID0gKGEsIGIsIGRpc3QsIHRvdGFsRGlzdCwgLy8gbGVuZ3RoIGJldHdlZW4gdGhlIHR3byBrbm93biBwb2ludHNcclxuYW5nbGUpID0+IHtcclxuICAgIC8vIGZpbmRzIHRoZSB4IHZhbHVlIG9mIGEgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzIGdpdmVuIHRoZSBtYWduaXR1ZGUgb2YgdGhhdCBwb2ludFxyXG4gICAgY29uc3QgdCA9IE1hdGguY29zKChhbmdsZSAqIE1hdGguUEkpIC8gMTgwKSAqIGRpc3Q7XHJcbiAgICBjb25zdCBuZXdQb2ludCA9IHBvaW50QnR3bihhLCBiLCB0LCB0b3RhbERpc3QpO1xyXG4gICAgbmV3UG9pbnQuYW5nbGUgPSBhbmdsZTtcclxuICAgIHJldHVybiBuZXdQb2ludDtcclxufTtcclxuLy8gXHJcbi8qKlxyXG4gKiBzcGxpdHMgYXJyYXkgaW50byBjaHVua3MuXHJcbiAqICBJIGdvdCB0aGlzIGNvZGUgZnJvbSBodHRwczovL21lZGl1bS5jb20vQERyYWdvbnphL2ZvdXItd2F5cy10by1jaHVuay1hbi1hcnJheS1lMTljODg5ZWFjNFxyXG4gKiAgYXV0aG9yOiBOZ29jIFZ1b25nIGh0dHBzOi8vZHJhZ29uemEuaW9cclxuICpcclxuICogQHBhcmFtIGFycmF5IGlucHV0IGFycmF5XHJcbiAqIEBwYXJhbSBzaXplICBzaXplIG9mIGVhY2ggY2h1bmtcclxuICovXHJcbmNvbnN0IGFyckNodW5rID0gKGFycmF5LCBzaXplKSA9PiB7XHJcbiAgICBjb25zdCBjaHVua2VkID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IGNodW5rZWRbY2h1bmtlZC5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAoIWxhc3QgfHwgbGFzdC5sZW5ndGggPT09IHNpemUpIHtcclxuICAgICAgICAgICAgY2h1bmtlZC5wdXNoKFthcnJheVtpXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGFzdC5wdXNoKGFycmF5W2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2h1bmtlZDtcclxufTtcclxuLy9tYXRyaXggbWFuaXB1bGF0aW9uIGNvZGUgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmlnbWEvcGx1Z2luLXNhbXBsZXMvYmxvYi9tYXN0ZXIvY2lyY2xldGV4dC9jb2RlLnRzXHJcbi8vYXV0aG9yOiBKb25hdGhhbiBDaGFuIGh0dHBzOi8vZ2l0aHViLmNvbS9qeWMgaHR0cDovL2p5Yy5lcXYuaW9cclxuLy8gdGhlIGJpZ2dlc3QgdGhhbmtzIEkgYW0gbWF0aG1hdGljYWxseSBjaGFsbGVuZ2VkXHJcbi8qKlxyXG4gKiBtdWx0aXBseSBtYXRyaXhlcyB0b2dldGhlclxyXG4gKiBAcGFyYW0gYVxyXG4gKiBAcGFyYW0gYlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG11bHRpcGx5ID0gKGEsIGIpID0+IHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICBhWzBdWzBdICogYlswXVswXSArIGFbMF1bMV0gKiBiWzFdWzBdLFxyXG4gICAgICAgICAgICBhWzBdWzBdICogYlswXVsxXSArIGFbMF1bMV0gKiBiWzFdWzFdLFxyXG4gICAgICAgICAgICBhWzBdWzBdICogYlswXVsyXSArIGFbMF1bMV0gKiBiWzFdWzJdICsgYVswXVsyXVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICBhWzFdWzBdICogYlswXVswXSArIGFbMV1bMV0gKiBiWzFdWzBdLFxyXG4gICAgICAgICAgICBhWzFdWzBdICogYlswXVsxXSArIGFbMV1bMV0gKiBiWzFdWzFdICsgMCxcclxuICAgICAgICAgICAgYVsxXVswXSAqIGJbMF1bMl0gKyBhWzFdWzFdICogYlsxXVsyXSArIGFbMV1bMl1cclxuICAgICAgICBdXHJcbiAgICBdO1xyXG59O1xyXG4vKipcclxuICogY3JlYXRlIGEgbW92ZSB0cmFuc2Zvcm1cclxuICogQHBhcmFtIHhcclxuICogQHBhcmFtIHlcclxuICovXHJcbmV4cG9ydCBjb25zdCBtb3ZlID0gKHgsIHkpID0+IHtcclxuICAgIHJldHVybiBbWzEsIDAsIHhdLCBbMCwgMSwgeV1dO1xyXG59O1xyXG4vKipcclxuICogQ3JlYXRlcyBhIFwicm90YXRlXCIgdHJhbnNmb3JtLlxyXG4gKiBAcGFyYW0gdGhldGFcclxuICovXHJcbmV4cG9ydCBjb25zdCByb3RhdGUgPSAodGhldGEpID0+IHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgW01hdGguY29zKHRoZXRhKSwgTWF0aC5zaW4odGhldGEpLCAwXSxcclxuICAgICAgICBbLU1hdGguc2luKHRoZXRhKSwgTWF0aC5jb3ModGhldGEpLCAwXVxyXG4gICAgXTtcclxufTtcclxuLyoqXHJcbiAqIGRlZXAgY29weSBidXQgZXhjbHVkZSBjaGlsZHJlblxyXG4gKiBAcGFyYW0gdGhldGFcclxuICovXHJcbmV4cG9ydCBjb25zdCBkZWVwQ29weSA9IChpbk9iamVjdCkgPT4ge1xyXG4gICAgbGV0IG91dE9iamVjdCwgdmFsdWUsIGtleTtcclxuICAgIGlmICh0eXBlb2YgaW5PYmplY3QgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBpbk9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpbk9iamVjdCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBpbk9iamVjdDsgLy8gUmV0dXJuIHRoZSB2YWx1ZSBpZiBpbk9iamVjdCBpcyBub3QgYW4gb2JqZWN0XHJcbiAgICB9XHJcbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgb3Igb2JqZWN0IHRvIGhvbGQgdGhlIHZhbHVlc1xyXG4gICAgb3V0T2JqZWN0ID0gQXJyYXkuaXNBcnJheShpbk9iamVjdCkgPyBbXSA6IHt9O1xyXG4gICAgZm9yIChrZXkgaW4gaW5PYmplY3QpIHtcclxuICAgICAgICBpZiAoa2V5ICE9IFwiY2hpbGRyZW5cIiAmJiBrZXkgIT0gXCJwYXJlbnRcIikge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGluT2JqZWN0W2tleV07XHJcbiAgICAgICAgICAgIC8vIFJlY3Vyc2l2ZWx5IChkZWVwKSBjb3B5IGZvciBuZXN0ZWQgb2JqZWN0cywgaW5jbHVkaW5nIGFycmF5c1xyXG4gICAgICAgICAgICBvdXRPYmplY3Rba2V5XSA9IGRlZXBDb3B5KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0T2JqZWN0O1xyXG59O1xyXG4vKipcclxuICogcmV0dXJucyB0aGUgc3RyaW5nIGluIHRpdGxlIGNhc2VcclxuICogQHBhcmFtIHN0ciBpbnB1dCB0ZXh0IHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHRpdGxlQ2FzZSA9IChzdHIpID0+IHtcclxuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpLm1hcChmdW5jdGlvbiAod29yZCkge1xyXG4gICAgICAgIHJldHVybiB3b3JkLnJlcGxhY2Uod29yZFswXSwgd29yZFswXS50b1VwcGVyQ2FzZSgpKTtcclxuICAgIH0pLmpvaW4oJyAnKTtcclxufTtcclxuIiwiLypcclxuICAgIGNvZGUgZm9yIGFsbCB0aGUgcGxhY2luZyBpbiB0aGUgZmlnbWEgcGFnZVxyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG5pbXBvcnQgeyBtdWx0aXBseSwgbW92ZSwgcm90YXRlLCBwb2ludEJ0d25CeUxlbmd0aCwgdGl0bGVDYXNlIH0gZnJvbSAnLi9oZWxwZXInO1xyXG4vKipcclxuICogcGxhY2UgdGhlIG9iamVjdHMgb24gYSBwb2ludCwgYmFzZWQgb24gdXNlciBzZXR0aW5ncy5cclxuICogQHBhcmFtIG9iamVjdFxyXG4gKiBAcGFyYW0gcG9pbnRcclxuICogQHBhcmFtIG9wdGlvbnNcclxuICogQHBhcmFtIGN1cnZlXHJcbiAqL1xyXG5jb25zdCBwbGFjZSA9IChvYmplY3QsIHBvaW50LCBvcHRpb25zLCBjdXJ2ZSkgPT4ge1xyXG4gICAgLy8gaWYgcG9pbnQgcmV0dXJucyBudWxsLCBqdXN0IGRlbGV0ZVxyXG4gICAgaWYgKCFwb2ludCkge1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvL3NldCBuYW1lc1xyXG4gICAgb2JqZWN0Lm5hbWUgPSBvYmplY3QubmFtZS5yZXBsYWNlKFwiW0xpbmtlZF0gXCIsICdbQ29weV0gJyk7XHJcbiAgICAvLyBmaW5kIGNlbnRlciBvZiBvYmplY3RcclxuICAgIGNvbnN0IGNlbnRlciA9IHtcclxuICAgICAgICB4OiAwIC0gb2JqZWN0LndpZHRoICogb3B0aW9ucy5ob3Jpem9udGFsQWxpZ24sXHJcbiAgICAgICAgeTogMCAtIG9iamVjdC5oZWlnaHQgKiBvcHRpb25zLnZlcnRpY2FsQWxpZ25cclxuICAgIH07XHJcbiAgICAvL2FuZ2xlIG9mIG9iamVjdCBjb252ZXJ0ZWQgdG8gZGVncmVlc1xyXG4gICAgbGV0IGFuZ2xlID0gKChwb2ludC5hbmdsZSAtIDE4MCkgKiBNYXRoLlBJKSAvIDE4MDtcclxuICAgIC8vIHplcm8gaXRcclxuICAgIC8vc3BhY2VpbmcgdGhlbVxyXG4gICAgb2JqZWN0LnJlbGF0aXZlVHJhbnNmb3JtID0gbW92ZShjZW50ZXIueCwgY2VudGVyLnkpO1xyXG4gICAgLy8gbW9yZSBjb2RlIHRha2VuIGZyb20ganljLCB0aGUgZ29kIGhpbXNlbGYgaHR0cHM6Ly9naXRodWIuY29tL2p5YyBodHRwOi8vanljLmVxdi5pb1xyXG4gICAgLy8gUm90YXRlIHRoZSBvYmplY3QuXHJcbiAgICAvL29iamVjdC5yb3RhdGlvbiA9IDBcclxuICAgIG9iamVjdC5yZWxhdGl2ZVRyYW5zZm9ybSA9IG11bHRpcGx5KHJvdGF0ZShhbmdsZSksIG9iamVjdC5yZWxhdGl2ZVRyYW5zZm9ybSk7XHJcbiAgICAvL21vdmUgdGhlIG9iamVjdFxyXG4gICAgb2JqZWN0LnJlbGF0aXZlVHJhbnNmb3JtID0gbXVsdGlwbHkobW92ZShwb2ludC54ICsgY3VydmUucmVsYXRpdmVUcmFuc2Zvcm1bMF1bMl0sIHBvaW50LnkgKyBjdXJ2ZS5yZWxhdGl2ZVRyYW5zZm9ybVsxXVsyXSksIG9iamVjdC5yZWxhdGl2ZVRyYW5zZm9ybSk7XHJcbn07XHJcbi8qKlxyXG4gKiBlc3RpbWF0ZXMgYW5kIHJldHVybnMgdGhlIHBvaW50IGNsb3Nlc3QgdG8gd2hlcmUgdGhlIG9iamVjdCBzaG91bGQgYmUsIGJhc2VkIG9uIGhvcml6b250YWwgbGVuZ3RoXHJcbiAqIEBwYXJhbSBwb2ludEFyclxyXG4gKiBAcGFyYW0gcGFzc1xyXG4gKi9cclxuY29uc3Qgb2JqZWN0MlBvaW50ID0gKHBvaW50QXJyLCBwYXNzKSA9PiB7XHJcbiAgICAvL1xyXG4gICAgLy9sZXQgcm90YXRpb25cclxuICAgIGxldCBlc3RQb2ludDtcclxuICAgIGZvciAocGFzcy5wb2ludEluZGV4OyBwYXNzLnBvaW50SW5kZXggKyAxIDwgcG9pbnRBcnIubGVuZ3RoOyBwYXNzLnBvaW50SW5kZXgrKykge1xyXG4gICAgICAgIC8vIGZpbmQgbmVhcmVzdCBwb2ludCB0byB0aGUgbGVuZ3RoIG9mIHRoZSB3b3JkXHJcbiAgICAgICAgaWYgKHBhc3Muc3BhY2luZyA8PSBwb2ludEFycltwYXNzLnBvaW50SW5kZXggKyAxXS50b3RhbERpc3QpIHtcclxuICAgICAgICAgICAgbGV0IG5leHRwb2ludCA9IHBvaW50QXJyW3Bhc3MucG9pbnRJbmRleCArIDFdO1xyXG4gICAgICAgICAgICBsZXQgYW5nbGUgPSBwb2ludEFycltwYXNzLnBvaW50SW5kZXhdLmFuZ2xlID8gcG9pbnRBcnJbcGFzcy5wb2ludEluZGV4XS5hbmdsZSA6IHBhc3MuZGVmYXVsdFJvdDtcclxuICAgICAgICAgICAgZXN0UG9pbnQgPSBwb2ludEJ0d25CeUxlbmd0aChwb2ludEFycltwYXNzLnBvaW50SW5kZXhdLCBuZXh0cG9pbnQsIChwYXNzLnNwYWNpbmcgLSBwb2ludEFycltwYXNzLnBvaW50SW5kZXhdLnRvdGFsRGlzdCksIC8vIHRoZSBsZW5ndGggYmV0d2VlbiB0aGUgY3VycmVudCBwb2ludCBhbmQgdGhlIG5leHQgcG9pbnRcclxuICAgICAgICAgICAgbmV4dHBvaW50LmRpc3QsIGFuZ2xlIC8vcm90YXRpb25cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgLy8gc2tpcCBvdmVyIHBvaW50cyB3aXRoIGluaWZpbml0eSBvciBOYU5cclxuICAgICAgICAgICAgaWYgKGVzdFBvaW50LnggPT09IEluZmluaXR5IHx8IGlzTmFOKGVzdFBvaW50LngpKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc3RvcCBjYWxjdWxhdGluZyBhbmQgcmV0dXJuIHRoZSBjdXJyZW50IHBvaW50IFxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVzdFBvaW50O1xyXG59O1xyXG4vKipcclxuICogY29udmVydCB0ZXh0IGludG8gaW5kaXZpc3VhbCBjaGFyYWN0ZXJzLCB0aGVuIHB1dCB0aG9zZSBvbiBhIGN1cnZlXHJcbiAqIEBwYXJhbSBub2RlXHJcbiAqIEBwYXJhbSBwb2ludEFyclxyXG4gKiBAcGFyYW0gZGF0YVxyXG4gKiBAcGFyYW0gZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjb25zdCB0ZXh0MkN1cnZlID0gKG5vZGUsIHBvaW50QXJyLCBkYXRhLCBncm91cCkgPT4ge1xyXG4gICAgY29uc3QgbmV3Tm9kZXMgPSBbXTtcclxuICAgIHZhciBvcHRpb25zID0gZGF0YS5zZXR0aW5nO1xyXG4gICAgLy9jb252ZXJ0IHRleHQgaW50byBlYWNoIGxldHRlciBpbmRpdnVzYWxseVxyXG4gICAgbm9kZS50ZXh0QXV0b1Jlc2l6ZSA9ICdXSURUSF9BTkRfSEVJR0hUJztcclxuICAgIC8vIGlmIHRpdGxlIGNhc2UsIHRoZW4gZml4IHRoZSB0ZXh0IHRvIGZpdCB0aXRsZSBjYXNlXHJcbiAgICBjb25zdCBjaGFyQXJyID0gWy4uLihub2RlLnRleHRDYXNlID09IFwiVElUTEVcIiA/IHRpdGxlQ2FzZShub2RlLmNoYXJhY3RlcnMpIDogbm9kZS5jaGFyYWN0ZXJzKV07XHJcbiAgICAvLyB2YWx1ZXMgbmVlZGVkIHRvIHBhc3MgYmV0d2VlbiBlYWNoIG9iamVjdHNcclxuICAgIGxldCBwYXNzID0ge1xyXG4gICAgICAgIHNwYWNpbmc6IDAgKyBvcHRpb25zLm9mZnNldCxcclxuICAgICAgICBwb2ludEluZGV4OiAwLFxyXG4gICAgICAgIGRlZmF1bHRSb3Q6IG5vZGUucm90YXRpb24gKyAxODBcclxuICAgIH07XHJcbiAgICAvLyBkaXNhYmxlIHNwYWNpbmcgb3B0aW9uIGluIHRleHQgbW9kZVxyXG4gICAgb3B0aW9ucy5zcGFjaW5nID0gMDtcclxuICAgIGxldCBwcmV2bGV0dGVyID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhckFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBsZXR0ZXIgPSBub2RlLmNsb25lKCk7XHJcbiAgICAgICAgLy9jb3B5IHNldHRpbmdzXHJcbiAgICAgICAgbGV0dGVyLnNldFBsdWdpbkRhdGEoXCJsaW5rZWRJRFwiLCBcIlwiKTtcclxuICAgICAgICBsZXR0ZXIuZm9udE5hbWUgPSBub2RlLmdldFJhbmdlRm9udE5hbWUoaSwgaSArIDEpO1xyXG4gICAgICAgIGxldHRlci5mb250U2l6ZSA9IG5vZGUuZ2V0UmFuZ2VGb250U2l6ZShpLCBpICsgMSk7XHJcbiAgICAgICAgbGV0dGVyLmNoYXJhY3RlcnMgPSBzYWZlU3BhY2UoY2hhckFycltpXSkgKyAnICc7XHJcbiAgICAgICAgaWYgKG5vZGUudGV4dENhc2UgPT09IFwiVElUTEVcIilcclxuICAgICAgICAgICAgbGV0dGVyLnRleHRDYXNlID0gXCJPUklHSU5BTFwiO1xyXG4gICAgICAgIGxldHRlci5sZXR0ZXJTcGFjaW5nID0gbm9kZS5nZXRSYW5nZUxldHRlclNwYWNpbmcoaSwgaSArIDEpO1xyXG4gICAgICAgIC8vIGNlbnRlciB0aGUgbGV0dGVyc1xyXG4gICAgICAgIC8vbGV0dGVyLnRleHRBbGlnbkhvcml6b250YWwgPSAnQ0VOVEVSJ1xyXG4gICAgICAgIGxldHRlci50ZXh0QWxpZ25WZXJ0aWNhbCA9ICdDRU5URVInO1xyXG4gICAgICAgIGxldHRlci50ZXh0QXV0b1Jlc2l6ZSA9ICdXSURUSF9BTkRfSEVJR0hUJztcclxuICAgICAgICAvLyBwdXQgdGhlIG9iamVjdCBpbiB0aGUgcmlnaHQgcGxhY2VcclxuICAgICAgICBwYXNzLnNwYWNpbmcgPSBwYXNzLnNwYWNpbmcgKyBsZXR0ZXIud2lkdGggKiBvcHRpb25zLmhvcml6b250YWxBbGlnbiArIChwcmV2bGV0dGVyICogKDEgLSBvcHRpb25zLmhvcml6b250YWxBbGlnbikpICsgb3B0aW9ucy5zcGFjaW5nO1xyXG4gICAgICAgIHByZXZsZXR0ZXIgPSBsZXR0ZXIud2lkdGg7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gb2JqZWN0MlBvaW50KHBvaW50QXJyLCBwYXNzKTtcclxuICAgICAgICAvLyBwbGFjZSB0aGUgdGhpbmdcclxuICAgICAgICBwbGFjZShsZXR0ZXIsIHBvaW50LCBvcHRpb25zLCBkYXRhLmN1cnZlKTtcclxuICAgICAgICAvL2FwcGVuZCB0aGF0IHNoaXRcclxuICAgICAgICBsZXR0ZXIuY2hhcmFjdGVycyA9IHNhZmVTcGFjZShjaGFyQXJyW2ldKTtcclxuICAgICAgICBuZXdOb2Rlcy5wdXNoKGxldHRlcik7XHJcbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQobGV0dGVyKTtcclxuICAgICAgICAvLyBraWxsIGxvb3AgZWFybHkgaWYgdGhlIG9iamVjdHMgYXJlIGxvbmdlciB0aGVuIHRoZSBjdXJ2ZVxyXG4gICAgICAgIC8vIHJlcGxhY2UgbGF0ZXIgd2l0aCBhIGJldHRlciB0aGluZ1xyXG4gICAgICAgIGlmIChwYXNzLnNwYWNpbmcgPj0gcG9pbnRBcnJbcG9pbnRBcnIubGVuZ3RoIC0gMV0udG90YWxEaXN0KSB7XHJcbiAgICAgICAgICAgIGxldHRlci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG59O1xyXG4vKipcclxuICogY2xvbmVzIHRoZSBvYmplY3RzIHggYW1vdW50IG9mIHRpbWVzIHRvIGN1cnZlXHJcbiAqIEBwYXJhbSBub2RlXHJcbiAqIEBwYXJhbSBwb2ludEFyclxyXG4gKiBAcGFyYW0gZGF0YVxyXG4gKiBAcGFyYW0gZ3JvdXBcclxuICovXHJcbmV4cG9ydCBjb25zdCBvYmplY3QyQ3VydmUgPSAobm9kZSwgcG9pbnRBcnIsIGRhdGEsIGdyb3VwKSA9PiB7XHJcbiAgICBjb25zdCBuZXdOb2RlcyA9IFtdO1xyXG4gICAgdmFyIG9wdGlvbnMgPSBkYXRhLnNldHRpbmc7XHJcbiAgICAvLyB2YWx1ZXMgbmVlZGVkIHRvIHBhc3MgYmV0d2VlbiBlYWNoIG9iamVjdHNcclxuICAgIGxldCBwYXNzID0ge1xyXG4gICAgICAgIHNwYWNpbmc6IDAgKyBvcHRpb25zLm9mZnNldCxcclxuICAgICAgICBwb2ludEluZGV4OiAwLFxyXG4gICAgICAgIGRlZmF1bHRSb3Q6IG5vZGUucm90YXRpb24gKyAxODBcclxuICAgIH07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuY291bnQ7IGkrKykge1xyXG4gICAgICAgIC8vY29weSBvYmplY3RcclxuICAgICAgICBsZXQgb2JqZWN0O1xyXG4gICAgICAgIG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgPyBvYmplY3QgPSBub2RlLmNyZWF0ZUluc3RhbmNlKCkgOiBvYmplY3QgPSBub2RlLmNsb25lKCk7XHJcbiAgICAgICAgLy8gZmluZCB0aGUgcG9zaXRpb24gd2hlcmUgb2JqZWN0IHNob3VsZCBnb1xyXG4gICAgICAgIGxldCBwb2ludCA9IG9iamVjdDJQb2ludChwb2ludEFyciwgcGFzcyk7XHJcbiAgICAgICAgcGFzcy5zcGFjaW5nID0gcGFzcy5zcGFjaW5nICsgb2JqZWN0LndpZHRoICsgb3B0aW9ucy5zcGFjaW5nO1xyXG4gICAgICAgIG9iamVjdC5zZXRQbHVnaW5EYXRhKFwibGlua2VkSURcIiwgXCJcIik7XHJcbiAgICAgICAgLy8gcGxhY2UgdGhlIHRoaW5nXHJcbiAgICAgICAgcGxhY2Uob2JqZWN0LCBwb2ludCwgb3B0aW9ucywgZGF0YS5jdXJ2ZSk7XHJcbiAgICAgICAgLy9hcHBlbmQgdGhhdCBzaGl0XHJcbiAgICAgICAgbmV3Tm9kZXMucHVzaChvYmplY3QpO1xyXG4gICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKG9iamVjdCk7XHJcbiAgICAgICAgLy8ga2lsbCBsb29wIGVhcmx5IGlmIHRoZSBvYmplY3RzIGFyZSBsb25nZXIgdGhlbiB0aGUgY3VydmVcclxuICAgICAgICAvLyByZXBsYWNlIGxhdGVyIHdpdGggYSBiZXR0ZXIgdGhpbmdcclxuICAgICAgICBpZiAocGFzcy5zcGFjaW5nID49IHBvaW50QXJyW3BvaW50QXJyLmxlbmd0aCAtIDFdLnRvdGFsRGlzdCkge1xyXG4gICAgICAgICAgICAvL29iamVjdC5yZW1vdmUoKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBpZiBhdXRvd2lkdGggcHV0IG9iamVjdCBhdCB2ZXJ5IGxhc3QgcG9pbnRcclxuICAgIGlmICghb3B0aW9ucy5pc0xvb3AgJiYgb3B0aW9ucy5hdXRvV2lkdGgpIHtcclxuICAgICAgICBsZXQgb2JqZWN0O1xyXG4gICAgICAgIG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgPyBvYmplY3QgPSBub2RlLmNyZWF0ZUluc3RhbmNlKCkgOiBvYmplY3QgPSBub2RlLmNsb25lKCk7XHJcbiAgICAgICAgb2JqZWN0LnNldFBsdWdpbkRhdGEoXCJsaW5rZWRJRFwiLCBcIlwiKTtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHBvaW50QXJyW3BvaW50QXJyLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmICghb3B0aW9ucy5yb3RDaGVjaykge1xyXG4gICAgICAgICAgICBwb2ludC5hbmdsZSA9IG5vZGUucm90YXRpb24gLSAxODA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBsYWNlKG9iamVjdCwgcG9pbnQsIG9wdGlvbnMsIGRhdGEuY3VydmUpO1xyXG4gICAgICAgIG5ld05vZGVzLnB1c2gob2JqZWN0KTtcclxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChvYmplY3QpO1xyXG4gICAgfVxyXG4gICAgLy8gZ3JvdXAgdGhpbmdzIGFuZCBzY3JvbGwgaW50byB2aWV3XHJcbiAgICByZXR1cm47XHJcbn07XHJcbi8qKlxyXG4gKiByZW1vdmUgYWxsIG5vZGVzIGluIGEgZ3JvdXAgYmVzaWRlcyB0aGUgY3VydmUgbm9kZVxyXG4gKiBAcGFyYW0gZ3JvdXAgZ3JvdXAgb2JqZWN0IHRvIGxvb2sgdGhyb3VnaFxyXG4gKiBAcGFyYW0gY3VydmVJRCB0aGUgb2JqZWN0IGlkIHRvIE5PVCBkZWxldGVcclxuICovXHJcbmV4cG9ydCBjb25zdCBkZWxldGVOb2RlaW5Hcm91cCA9IChncm91cCwgY3VydmVJRCkgPT4ge1xyXG4gICAgZ3JvdXAuY2hpbGRyZW4uZm9yRWFjaChpID0+IHsgaWYgKGkuaWQgIT09IGN1cnZlSUQpXHJcbiAgICAgICAgaS5yZW1vdmUoKTsgfSk7XHJcbn07XHJcbi8vIHRoaXMgZGlkbid0IG5lZWQgdG8gYmUgYSBmdW5jdGlvbiBidXQgbGlrZSBpIGFscmVhZHkgd3JvdGUgc29cclxuLyoqXHJcbiAqIGNhc2UgZm9yIGhhbmRsaW5nIHNwYWNlcywgYmVjYXN1ZSBmaWdtYSB3aWxsIGF1dG8gdGhlbSBhcyAwIHdpZHRoOyBjaGFyYWN0ZXIgODE5NyBpc250IHRoZSBiZXN0IGJ1dCB5b3Uga25vIHdoYXQuLi4gaXRzIGdvb2QgZW5vdWdoXHJcbiAqIEBwYXJhbSBjIGlucHV0IHN0cmluZ1xyXG4gKi9cclxuY29uc3Qgc2FmZVNwYWNlID0gKGMpID0+IHtcclxuICAgIHJldHVybiBjLnJlcGxhY2UoJyAnLCBTdHJpbmcuZnJvbUNoYXJDb2RlKDgxOTcpKTtcclxufTtcclxuIiwiLypcclxuICAgIGNvZGUgZm9yIGhhbmRsaW5nIHNlbGVjdGlvbiBsb2dpY1xyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG4qL1xyXG5pbXBvcnQgKiBhcyBoZWxwZXIgZnJvbSAnLi9oZWxwZXInO1xyXG4vKipcclxuICogYm9vbCBvZiB3aGV0aGVyIG9yIG5vdCBjdXJyZW50bHkgc2VsZWN0ZWQgaXMgYWxyZWFkeSBhIGxpbmtlZCBvYmplY3RcclxuICovXHJcbmV4cG9ydCBsZXQgaXNMaW5rZWRPYmplY3QgPSBmYWxzZTtcclxuLyoqXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgbGV0IHByZXZEYXRhID0gXCJcIjtcclxuLyoqXHJcbiAqIGkgZm9yZ290IHdoYXQgdGhpcyBkb2VzLiBmaXggbGF0ZXJcclxuICogQHBhcmFtIHNldERhdGFcclxuICovXHJcbmV4cG9ydCBjb25zdCBwcmV2RGF0YUNoYW5nZSA9IChzZXREYXRhKSA9PiB7XHJcbiAgICByZXR1cm4gcHJldkRhdGEgPSBzZXREYXRhO1xyXG59O1xyXG4vKipcclxuICogYm9vbCBzdGF0ZSBvZiB3aGV0aGVyIG9yIG5vdCBwbHVnaW4gaXMgY2xvc2VkXHJcbiAqL1xyXG5sZXQgcGx1Z2luQ2xvc2UgPSBmYWxzZTtcclxuZXhwb3J0IGNvbnN0IHNldFBsdWdpbkNsb3NlID0gKHN0YXRlKSA9PiB7XHJcbiAgICBwbHVnaW5DbG9zZSA9IHN0YXRlO1xyXG59O1xyXG4vKipcclxuICogZGVjaWRlIHdoaWNoIG9uZSBpbiB0aGUgc2VsZWN0ZWQgaXMgdGhlIGN1cnZlIGFuZCB3aGljaCBpcyB0aGUgb2JqZWN0XHJcbiAqIEBwYXJhbSBzZWxlY3Rpb25cclxuICogQHBhcmFtIHNldHRpbmdcclxuICovXHJcbmV4cG9ydCBjb25zdCBkZWNpZGUgPSAoc2VsZWN0aW9uLCBzZXR0aW5nKSA9PiB7XHJcbiAgICBsZXQgY3VydmU7XHJcbiAgICBsZXQgbjtcclxuICAgIGxldCBvdGhlcjtcclxuICAgIGxldCB0eXBlID0gXCJjbG9uZVwiO1xyXG4gICAgY29uc3QgZmlsdGVyc2VsZWN0ID0gc2VsZWN0aW9uLmZpbHRlcihuID0+IG4udHlwZSA9PT0gJ1ZFQ1RPUicgfHwgbi50eXBlID09PSAnRUxMSVBTRScpO1xyXG4gICAgLy8gaWYgdHdvIGN1cnZlcyBhcmUgc2VsZWN0ZWQsIHNlbGVjdCBvbmUgd2l0aCBiaWdnZXIgeCBvciB5XHJcbiAgICAvLyBpbSBzdXJlIHRoZXJlcyBhIHdheSB0byBtYWtlIHRoaXMgY29kZSBzbWFsbGVyIGJ1dCBpZGsgaG93XHJcbiAgICBpZiAoZmlsdGVyc2VsZWN0Lmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MSA9IGZpbHRlcnNlbGVjdFswXTtcclxuICAgICAgICBjb25zdCBvYmplY3QyID0gZmlsdGVyc2VsZWN0WzFdO1xyXG4gICAgICAgIGlmIChvYmplY3QxLndpZHRoICsgb2JqZWN0MS5oZWlnaHQgPiBvYmplY3QyLndpZHRoICsgb2JqZWN0Mi5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbiA9IG9iamVjdDE7XHJcbiAgICAgICAgICAgIG90aGVyID0gb2JqZWN0MjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG4gPSBvYmplY3QyO1xyXG4gICAgICAgICAgICBvdGhlciA9IG9iamVjdDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0MSA9IGZpbHRlcnNlbGVjdFswXTtcclxuICAgICAgICAvLyB0aGlzIGNhc2UsIG9ubHkgb25lIGluIGZpbHRlcnNlbGVjdCBzbyBzZWxlY3QgZGVmYXVsdC5cclxuICAgICAgICBuID0gb2JqZWN0MTtcclxuICAgICAgICAvLyBzZWxlY3QgdGhlIG90aGVyIG9uZS5cclxuICAgICAgICBvdGhlciA9IHNlbGVjdGlvbi5maWx0ZXIoYSA9PiBhLnR5cGUgIT09ICdWRUNUT1InICYmIGEudHlwZSAhPT0gJ0VMTElQU0UnKVswXTtcclxuICAgIH1cclxuICAgIGlmIChvdGhlci50eXBlID09PSAnVEVYVCcpXHJcbiAgICAgICAgdHlwZSA9IFwidGV4dFwiO1xyXG4gICAgLy8gaWYgZWNsaXBzZSwgZmxhdHRlbiB0aGUgZWxsaXBzZSBzbyBpdCBpcyByZWdpc3RlcmVkIGFzIGEgY3VydmUuXHJcbiAgICAvLyB0aGlzIGlzbid0IGlkZWFsIGF0IGFsbCwgYnV0IGl0IHJlZHVjZXMgY29kZS5cclxuICAgIGlmIChuLnR5cGUgPT0gJ0VMTElQU0UnKSB7XHJcbiAgICAgICAgY3VydmUgPSBmaWdtYS5mbGF0dGVuKFtuXSk7XHJcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW290aGVyLCBjdXJ2ZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjdXJ2ZSA9IG47XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWVzcGFjZTogXCJ0b3BhdGhmaWdtYVwiLFxyXG4gICAgICAgIGN1cnZlOiBjdXJ2ZSxcclxuICAgICAgICBvdGhlcjogb3RoZXIsXHJcbiAgICAgICAgc2V0dGluZzogc2V0dGluZyxcclxuICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICB9O1xyXG59O1xyXG4vKipcclxuICogZG8gdGhpbmdzIG9uIGEgc2VsZWN0aW9uIGNoYW5nZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG9uQ2hhbmdlID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgaXNMaW5rZWRPYmplY3QgPSBmYWxzZTtcclxuICAgIHByZXZEYXRhQ2hhbmdlKFwiXCIpO1xyXG4gICAgLy8gY2FzZSBoYW5kbGluZyBpcyB0b3J0dXJlXHJcbiAgICAvLyBjaGVjayBpZiB0aGVyZXMgYW55dGhpbmcgc2VsZWN0ZWRcclxuICAgIHN3aXRjaCAoc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgLy9jaGVjayBpZiBhIGN1cnZlIGlzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb24uZmlsdGVyKG5vZGUgPT4gbm9kZS50eXBlID09PSAnVkVDVE9SJyB8fCBub2RlLnR5cGUgPT09ICdFTExJUFNFJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgaXRzIGEgdGV4dCBvciBzb21ldGhpbiBlbHNlXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uLmZpbHRlcihub2RlID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbmQoJ3RleHQnLCBzZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VuZCgnY2xvbmUnLCBzZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VuZCgnbm9jdXJ2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgLy8gaWYgc2VsZWN0aW5nIGEgbGlua2VkIGdyb3VwXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgICAgICBjb25zdCBncm91cElkID0gc2VsZWN0ZWQuZ2V0UGx1Z2luRGF0YShcImxpbmtlZElEXCIpO1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXBJZCkge1xyXG4gICAgICAgICAgICAgICAgaXNMaW5rZWRPYmplY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNlbGVjdGVkLnR5cGUgPT09ICdHUk9VUCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwRGF0YSA9IGhlbHBlci5pc0xpbmtlZChzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VuZCgnbGlua2VkR3JvdXAnLCBzZWxlY3RlZCwgZ3JvdXBEYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbmQoJ29uZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZGF0YSBmcm9tIHRoYXQuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZW5kKCdvbmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIHNlbmQoJ25vdGhpbmcnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgc2VuZCgndG9vbWFueScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNlbGVjdGlvbjtcclxufTtcclxuLyoqXHJcbiAqIHVwZGF0ZSB1aSBvbmx5IHdoZW4gc2VsZWN0aW9uIGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEBwYXJhbSBzZWxlY3Rpb25cclxuICogQHBhcmFtIGRhdGFcclxuICovXHJcbmV4cG9ydCBjb25zdCBzZW5kID0gKHZhbHVlLCBzZWxlY3Rpb24gPSBudWxsLCBkYXRhID0gbnVsbCkgPT4ge1xyXG4gICAgaWYgKHNlbGVjdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkYXRhID0gZGVjaWRlKHNlbGVjdGlvbiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdmdkYXRhID0gZGF0YS5jdXJ2ZS52ZWN0b3JQYXRoc1swXS5kYXRhO1xyXG4gICAgICAgIGlmIChkYXRhLmN1cnZlLnZlY3RvclBhdGhzWzBdLmRhdGEubWF0Y2goL00vZykubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgdmFsdWUgPSAndmVjdG9ybmV0d29yayc7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBkYXRhLm90aGVyLndpZHRoO1xyXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3N2ZycsIHdpZHRoLCB2YWx1ZSwgZGF0YSwgc3ZnZGF0YSB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3Jlc3QnLCB2YWx1ZSB9KTtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIHdhdGNoIGV2ZXJ5IHNldCAzMDAgbWlsbGlzZWNvbmRzLCBpZiBjZXJ0YWluIG9iamVjdHMgYXJlIHNlbGVjdGVkLCB3YXRjaCBmb3IgY2hhbmdlc1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHRpbWVyV2F0Y2ggPSAoKSA9PiB7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXBsdWdpbkNsb3NlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0xpbmtlZE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxvY2Fsc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBJZCA9IGxvY2Fsc2VsZWN0aW9uWzBdLmdldFBsdWdpbkRhdGEoXCJsaW5rZWRJRFwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGRlZXBjb3B5IHRvIGdldCB1bmxpbmtlZCBjb3B5XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoaGVscGVyLmRlZXBDb3B5KGxvY2Fsc2VsZWN0aW9uWzBdKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb21wYXJlIGN1cnJlbnQgb2JqZWN0IHdpdGggcHJldkRhdGEgKHByZXZpb3VzbHkgcmVuZGVyZWQgZGF0YSlcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2RGF0YSAhPSBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBOb2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoZ3JvdXBJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBEYXRhID0gaGVscGVyLmlzTGlua2VkKGdyb3VwTm9kZSwgbG9jYWxzZWxlY3Rpb25bMF0uaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbmQoJ2xpbmtlZEdyb3VwJywgZ3JvdXBOb2RlLCBncm91cERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZEYXRhQ2hhbmdlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRpbWVyV2F0Y2goKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSwgMzAwKTtcclxufTtcclxuIiwiLyoqXG4gIEEgamF2YXNjcmlwdCBCZXppZXIgY3VydmUgbGlicmFyeSBieSBQb21heC5cblxuICBCYXNlZCBvbiBodHRwOi8vcG9tYXguZ2l0aHViLmlvL2JlemllcmluZm9cblxuICBUaGlzIGNvZGUgaXMgTUlUIGxpY2Vuc2VkLlxuKiovXG5cbmltcG9ydCB7IHV0aWxzIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmltcG9ydCB7IFBvbHlCZXppZXIgfSBmcm9tIFwiLi9wb2x5LWJlemllci5qc1wiO1xuXG4vLyBtYXRoLWlubGluaW5nLlxuY29uc3QgeyBhYnMsIG1pbiwgbWF4LCBjb3MsIHNpbiwgYWNvcywgc3FydCB9ID0gTWF0aDtcbmNvbnN0IHBpID0gTWF0aC5QSTtcbi8vIGEgemVybyBjb29yZGluYXRlLCB3aGljaCBpcyBzdXJwcmlzaW5nbHkgdXNlZnVsXG5jb25zdCBaRVJPID0geyB4OiAwLCB5OiAwLCB6OiAwIH07XG5cbi8qKlxuICogQmV6aWVyIGN1cnZlIGNvbnN0cnVjdG9yLlxuICpcbiAqIC4uLmRvY3MgcGVuZGluZy4uLlxuICovXG5jbGFzcyBCZXppZXIge1xuICBjb25zdHJ1Y3Rvcihjb29yZHMpIHtcbiAgICBsZXQgYXJncyA9XG4gICAgICBjb29yZHMgJiYgY29vcmRzLmZvckVhY2ggPyBjb29yZHMgOiBBcnJheS5mcm9tKGFyZ3VtZW50cykuc2xpY2UoKTtcbiAgICBsZXQgY29vcmRsZW4gPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgY29vcmRsZW4gPSBhcmdzLmxlbmd0aDtcbiAgICAgIGNvbnN0IG5ld2FyZ3MgPSBbXTtcbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgW1wieFwiLCBcInlcIiwgXCJ6XCJdLmZvckVhY2goZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHBvaW50W2RdICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBuZXdhcmdzLnB1c2gocG9pbnRbZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGFyZ3MgPSBuZXdhcmdzO1xuICAgIH1cblxuICAgIGxldCBoaWdoZXIgPSBmYWxzZTtcbiAgICBjb25zdCBsZW4gPSBhcmdzLmxlbmd0aDtcblxuICAgIGlmIChjb29yZGxlbikge1xuICAgICAgaWYgKGNvb3JkbGVuID4gNCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiT25seSBuZXcgQmV6aWVyKHBvaW50W10pIGlzIGFjY2VwdGVkIGZvciA0dGggYW5kIGhpZ2hlciBvcmRlciBjdXJ2ZXNcIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaGlnaGVyID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGxlbiAhPT0gNiAmJiBsZW4gIT09IDggJiYgbGVuICE9PSA5ICYmIGxlbiAhPT0gMTIpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIk9ubHkgbmV3IEJlemllcihwb2ludFtdKSBpcyBhY2NlcHRlZCBmb3IgNHRoIGFuZCBoaWdoZXIgb3JkZXIgY3VydmVzXCJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgXzNkID0gKHRoaXMuXzNkID1cbiAgICAgICghaGlnaGVyICYmIChsZW4gPT09IDkgfHwgbGVuID09PSAxMikpIHx8XG4gICAgICAoY29vcmRzICYmIGNvb3Jkc1swXSAmJiB0eXBlb2YgY29vcmRzWzBdLnogIT09IFwidW5kZWZpbmVkXCIpKTtcblxuICAgIGNvbnN0IHBvaW50cyA9ICh0aGlzLnBvaW50cyA9IFtdKTtcbiAgICBmb3IgKGxldCBpZHggPSAwLCBzdGVwID0gXzNkID8gMyA6IDI7IGlkeCA8IGxlbjsgaWR4ICs9IHN0ZXApIHtcbiAgICAgIHZhciBwb2ludCA9IHtcbiAgICAgICAgeDogYXJnc1tpZHhdLFxuICAgICAgICB5OiBhcmdzW2lkeCArIDFdLFxuICAgICAgfTtcbiAgICAgIGlmIChfM2QpIHtcbiAgICAgICAgcG9pbnQueiA9IGFyZ3NbaWR4ICsgMl07XG4gICAgICB9XG4gICAgICBwb2ludHMucHVzaChwb2ludCk7XG4gICAgfVxuICAgIGNvbnN0IG9yZGVyID0gKHRoaXMub3JkZXIgPSBwb2ludHMubGVuZ3RoIC0gMSk7XG5cbiAgICBjb25zdCBkaW1zID0gKHRoaXMuZGltcyA9IFtcInhcIiwgXCJ5XCJdKTtcbiAgICBpZiAoXzNkKSBkaW1zLnB1c2goXCJ6XCIpO1xuICAgIHRoaXMuZGltbGVuID0gZGltcy5sZW5ndGg7XG5cbiAgICAvLyBpcyB0aGlzIGN1cnZlLCBwcmFjdGljYWxseSBzcGVha2luZywgYSBzdHJhaWdodCBsaW5lP1xuICAgIGNvbnN0IGFsaWduZWQgPSB1dGlscy5hbGlnbihwb2ludHMsIHsgcDE6IHBvaW50c1swXSwgcDI6IHBvaW50c1tvcmRlcl0gfSk7XG4gICAgY29uc3QgYmFzZWxlbmd0aCA9IHV0aWxzLmRpc3QocG9pbnRzWzBdLCBwb2ludHNbb3JkZXJdKTtcbiAgICB0aGlzLl9saW5lYXIgPSBhbGlnbmVkLnJlZHVjZSgodCwgcCkgPT4gdCArIGFicyhwLnkpLCAwKSA8IGJhc2VsZW5ndGggLyA1MDtcblxuICAgIHRoaXMuX2x1dCA9IFtdO1xuICAgIHRoaXMuX3QxID0gMDtcbiAgICB0aGlzLl90MiA9IDE7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIHN0YXRpYyBxdWFkcmF0aWNGcm9tUG9pbnRzKHAxLCBwMiwgcDMsIHQpIHtcbiAgICBpZiAodHlwZW9mIHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHQgPSAwLjU7XG4gICAgfVxuICAgIC8vIHNob3J0Y3V0cywgYWx0aG91Z2ggdGhleSdyZSByZWFsbHkgZHVtYlxuICAgIGlmICh0ID09PSAwKSB7XG4gICAgICByZXR1cm4gbmV3IEJlemllcihwMiwgcDIsIHAzKTtcbiAgICB9XG4gICAgaWYgKHQgPT09IDEpIHtcbiAgICAgIHJldHVybiBuZXcgQmV6aWVyKHAxLCBwMiwgcDIpO1xuICAgIH1cbiAgICAvLyByZWFsIGZpdHRpbmcuXG4gICAgY29uc3QgYWJjID0gQmV6aWVyLmdldEFCQygyLCBwMSwgcDIsIHAzLCB0KTtcbiAgICByZXR1cm4gbmV3IEJlemllcihwMSwgYWJjLkEsIHAzKTtcbiAgfVxuXG4gIHN0YXRpYyBjdWJpY0Zyb21Qb2ludHMoUywgQiwgRSwgdCwgZDEpIHtcbiAgICBpZiAodHlwZW9mIHQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHQgPSAwLjU7XG4gICAgfVxuICAgIGNvbnN0IGFiYyA9IEJlemllci5nZXRBQkMoMywgUywgQiwgRSwgdCk7XG4gICAgaWYgKHR5cGVvZiBkMSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgZDEgPSB1dGlscy5kaXN0KEIsIGFiYy5DKTtcbiAgICB9XG4gICAgY29uc3QgZDIgPSAoZDEgKiAoMSAtIHQpKSAvIHQ7XG5cbiAgICBjb25zdCBzZWxlbiA9IHV0aWxzLmRpc3QoUywgRSksXG4gICAgICBseCA9IChFLnggLSBTLngpIC8gc2VsZW4sXG4gICAgICBseSA9IChFLnkgLSBTLnkpIC8gc2VsZW4sXG4gICAgICBieDEgPSBkMSAqIGx4LFxuICAgICAgYnkxID0gZDEgKiBseSxcbiAgICAgIGJ4MiA9IGQyICogbHgsXG4gICAgICBieTIgPSBkMiAqIGx5O1xuICAgIC8vIGRlcml2YXRpb24gb2YgbmV3IGh1bGwgY29vcmRpbmF0ZXNcbiAgICBjb25zdCBlMSA9IHsgeDogQi54IC0gYngxLCB5OiBCLnkgLSBieTEgfSxcbiAgICAgIGUyID0geyB4OiBCLnggKyBieDIsIHk6IEIueSArIGJ5MiB9LFxuICAgICAgQSA9IGFiYy5BLFxuICAgICAgdjEgPSB7IHg6IEEueCArIChlMS54IC0gQS54KSAvICgxIC0gdCksIHk6IEEueSArIChlMS55IC0gQS55KSAvICgxIC0gdCkgfSxcbiAgICAgIHYyID0geyB4OiBBLnggKyAoZTIueCAtIEEueCkgLyB0LCB5OiBBLnkgKyAoZTIueSAtIEEueSkgLyB0IH0sXG4gICAgICBuYzEgPSB7IHg6IFMueCArICh2MS54IC0gUy54KSAvIHQsIHk6IFMueSArICh2MS55IC0gUy55KSAvIHQgfSxcbiAgICAgIG5jMiA9IHtcbiAgICAgICAgeDogRS54ICsgKHYyLnggLSBFLngpIC8gKDEgLSB0KSxcbiAgICAgICAgeTogRS55ICsgKHYyLnkgLSBFLnkpIC8gKDEgLSB0KSxcbiAgICAgIH07XG4gICAgLy8gLi4uZG9uZVxuICAgIHJldHVybiBuZXcgQmV6aWVyKFMsIG5jMSwgbmMyLCBFKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRVdGlscygpIHtcbiAgICByZXR1cm4gdXRpbHM7XG4gIH1cblxuICBnZXRVdGlscygpIHtcbiAgICByZXR1cm4gQmV6aWVyLmdldFV0aWxzKCk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IFBvbHlCZXppZXIoKSB7XG4gICAgcmV0dXJuIFBvbHlCZXppZXI7XG4gIH1cblxuICB2YWx1ZU9mKCkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdXRpbHMucG9pbnRzVG9TdHJpbmcodGhpcy5wb2ludHMpO1xuICB9XG5cbiAgdG9TVkcoKSB7XG4gICAgaWYgKHRoaXMuXzNkKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcCA9IHRoaXMucG9pbnRzLFxuICAgICAgeCA9IHBbMF0ueCxcbiAgICAgIHkgPSBwWzBdLnksXG4gICAgICBzID0gW1wiTVwiLCB4LCB5LCB0aGlzLm9yZGVyID09PSAyID8gXCJRXCIgOiBcIkNcIl07XG4gICAgZm9yIChsZXQgaSA9IDEsIGxhc3QgPSBwLmxlbmd0aDsgaSA8IGxhc3Q7IGkrKykge1xuICAgICAgcy5wdXNoKHBbaV0ueCk7XG4gICAgICBzLnB1c2gocFtpXS55KTtcbiAgICB9XG4gICAgcmV0dXJuIHMuam9pbihcIiBcIik7XG4gIH1cblxuICBzZXRSYXRpb3MocmF0aW9zKSB7XG4gICAgaWYgKHJhdGlvcy5sZW5ndGggIT09IHRoaXMucG9pbnRzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5jb3JyZWN0IG51bWJlciBvZiByYXRpbyB2YWx1ZXNcIik7XG4gICAgfVxuICAgIHRoaXMucmF0aW9zID0gcmF0aW9zO1xuICAgIHRoaXMuX2x1dCA9IFtdOyAvLyAgaW52YWxpZGF0ZSBhbnkgcHJlY29tcHV0ZWQgTFVUXG4gIH1cblxuICB2ZXJpZnkoKSB7XG4gICAgY29uc3QgcHJpbnQgPSB0aGlzLmNvb3JkRGlnZXN0KCk7XG4gICAgaWYgKHByaW50ICE9PSB0aGlzLl9wcmludCkge1xuICAgICAgdGhpcy5fcHJpbnQgPSBwcmludDtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgY29vcmREaWdlc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzXG4gICAgICAubWFwKGZ1bmN0aW9uIChjLCBwb3MpIHtcbiAgICAgICAgcmV0dXJuIFwiXCIgKyBwb3MgKyBjLnggKyBjLnkgKyAoYy56ID8gYy56IDogMCk7XG4gICAgICB9KVxuICAgICAgLmpvaW4oXCJcIik7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgLy8gaW52YWxpZGF0ZSBhbnkgcHJlY29tcHV0ZWQgTFVUXG4gICAgdGhpcy5fbHV0ID0gW107XG4gICAgdGhpcy5kcG9pbnRzID0gdXRpbHMuZGVyaXZlKHRoaXMucG9pbnRzLCB0aGlzLl8zZCk7XG4gICAgdGhpcy5jb21wdXRlZGlyZWN0aW9uKCk7XG4gIH1cblxuICBjb21wdXRlZGlyZWN0aW9uKCkge1xuICAgIGNvbnN0IHBvaW50cyA9IHRoaXMucG9pbnRzO1xuICAgIGNvbnN0IGFuZ2xlID0gdXRpbHMuYW5nbGUocG9pbnRzWzBdLCBwb2ludHNbdGhpcy5vcmRlcl0sIHBvaW50c1sxXSk7XG4gICAgdGhpcy5jbG9ja3dpc2UgPSBhbmdsZSA+IDA7XG4gIH1cblxuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHV0aWxzLmxlbmd0aCh0aGlzLmRlcml2YXRpdmUuYmluZCh0aGlzKSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0QUJDKG9yZGVyID0gMiwgUywgQiwgRSwgdCA9IDAuNSkge1xuICAgIGNvbnN0IHUgPSB1dGlscy5wcm9qZWN0aW9ucmF0aW8odCwgb3JkZXIpLFxuICAgICAgdW0gPSAxIC0gdSxcbiAgICAgIEMgPSB7XG4gICAgICAgIHg6IHUgKiBTLnggKyB1bSAqIEUueCxcbiAgICAgICAgeTogdSAqIFMueSArIHVtICogRS55LFxuICAgICAgfSxcbiAgICAgIHMgPSB1dGlscy5hYmNyYXRpbyh0LCBvcmRlciksXG4gICAgICBBID0ge1xuICAgICAgICB4OiBCLnggKyAoQi54IC0gQy54KSAvIHMsXG4gICAgICAgIHk6IEIueSArIChCLnkgLSBDLnkpIC8gcyxcbiAgICAgIH07XG4gICAgcmV0dXJuIHsgQSwgQiwgQywgUywgRSB9O1xuICB9XG5cbiAgZ2V0QUJDKHQsIEIpIHtcbiAgICBCID0gQiB8fCB0aGlzLmdldCh0KTtcbiAgICBsZXQgUyA9IHRoaXMucG9pbnRzWzBdO1xuICAgIGxldCBFID0gdGhpcy5wb2ludHNbdGhpcy5vcmRlcl07XG4gICAgcmV0dXJuIEJlemllci5nZXRBQkModGhpcy5vcmRlciwgUywgQiwgRSwgdCk7XG4gIH1cblxuICBnZXRMVVQoc3RlcHMpIHtcbiAgICB0aGlzLnZlcmlmeSgpO1xuICAgIHN0ZXBzID0gc3RlcHMgfHwgMTAwO1xuICAgIGlmICh0aGlzLl9sdXQubGVuZ3RoID09PSBzdGVwcykge1xuICAgICAgcmV0dXJuIHRoaXMuX2x1dDtcbiAgICB9XG4gICAgdGhpcy5fbHV0ID0gW107XG4gICAgLy8gbiBzdGVwcyBtZWFucyBuKzEgcG9pbnRzXG4gICAgc3RlcHMrKztcbiAgICB0aGlzLl9sdXQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgcCwgdDsgaSA8IHN0ZXBzOyBpKyspIHtcbiAgICAgIHQgPSBpIC8gKHN0ZXBzIC0gMSk7XG4gICAgICBwID0gdGhpcy5jb21wdXRlKHQpO1xuICAgICAgcC50ID0gdDtcbiAgICAgIHRoaXMuX2x1dC5wdXNoKHApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbHV0O1xuICB9XG5cbiAgb24ocG9pbnQsIGVycm9yKSB7XG4gICAgZXJyb3IgPSBlcnJvciB8fCA1O1xuICAgIGNvbnN0IGx1dCA9IHRoaXMuZ2V0TFVUKCksXG4gICAgICBoaXRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGMsIHQgPSAwOyBpIDwgbHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjID0gbHV0W2ldO1xuICAgICAgaWYgKHV0aWxzLmRpc3QoYywgcG9pbnQpIDwgZXJyb3IpIHtcbiAgICAgICAgaGl0cy5wdXNoKGMpO1xuICAgICAgICB0ICs9IGkgLyBsdXQubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWhpdHMubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuICh0IC89IGhpdHMubGVuZ3RoKTtcbiAgfVxuXG4gIHByb2plY3QocG9pbnQpIHtcbiAgICAvLyBzdGVwIDE6IGNvYXJzZSBjaGVja1xuICAgIGNvbnN0IExVVCA9IHRoaXMuZ2V0TFVUKCksXG4gICAgICBsID0gTFVULmxlbmd0aCAtIDEsXG4gICAgICBjbG9zZXN0ID0gdXRpbHMuY2xvc2VzdChMVVQsIHBvaW50KSxcbiAgICAgIG1wb3MgPSBjbG9zZXN0Lm1wb3MsXG4gICAgICB0MSA9IChtcG9zIC0gMSkgLyBsLFxuICAgICAgdDIgPSAobXBvcyArIDEpIC8gbCxcbiAgICAgIHN0ZXAgPSAwLjEgLyBsO1xuXG4gICAgLy8gc3RlcCAyOiBmaW5lIGNoZWNrXG4gICAgbGV0IG1kaXN0ID0gY2xvc2VzdC5tZGlzdCxcbiAgICAgIHQgPSB0MSxcbiAgICAgIGZ0ID0gdCxcbiAgICAgIHA7XG4gICAgbWRpc3QgKz0gMTtcbiAgICBmb3IgKGxldCBkOyB0IDwgdDIgKyBzdGVwOyB0ICs9IHN0ZXApIHtcbiAgICAgIHAgPSB0aGlzLmNvbXB1dGUodCk7XG4gICAgICBkID0gdXRpbHMuZGlzdChwb2ludCwgcCk7XG4gICAgICBpZiAoZCA8IG1kaXN0KSB7XG4gICAgICAgIG1kaXN0ID0gZDtcbiAgICAgICAgZnQgPSB0O1xuICAgICAgfVxuICAgIH1cbiAgICBmdCA9IGZ0IDwgMCA/IDAgOiBmdCA+IDEgPyAxIDogZnQ7XG4gICAgcCA9IHRoaXMuY29tcHV0ZShmdCk7XG4gICAgcC50ID0gZnQ7XG4gICAgcC5kID0gbWRpc3Q7XG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICBnZXQodCkge1xuICAgIHJldHVybiB0aGlzLmNvbXB1dGUodCk7XG4gIH1cblxuICBwb2ludChpZHgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNbaWR4XTtcbiAgfVxuXG4gIGNvbXB1dGUodCkge1xuICAgIGlmICh0aGlzLnJhdGlvcykge1xuICAgICAgcmV0dXJuIHV0aWxzLmNvbXB1dGVXaXRoUmF0aW9zKHQsIHRoaXMucG9pbnRzLCB0aGlzLnJhdGlvcywgdGhpcy5fM2QpO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbHMuY29tcHV0ZSh0LCB0aGlzLnBvaW50cywgdGhpcy5fM2QsIHRoaXMucmF0aW9zKTtcbiAgfVxuXG4gIHJhaXNlKCkge1xuICAgIGNvbnN0IHAgPSB0aGlzLnBvaW50cyxcbiAgICAgIG5wID0gW3BbMF1dLFxuICAgICAgayA9IHAubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAxLCBwaSwgcGltOyBpIDwgazsgaSsrKSB7XG4gICAgICBwaSA9IHBbaV07XG4gICAgICBwaW0gPSBwW2kgLSAxXTtcbiAgICAgIG5wW2ldID0ge1xuICAgICAgICB4OiAoKGsgLSBpKSAvIGspICogcGkueCArIChpIC8gaykgKiBwaW0ueCxcbiAgICAgICAgeTogKChrIC0gaSkgLyBrKSAqIHBpLnkgKyAoaSAvIGspICogcGltLnksXG4gICAgICB9O1xuICAgIH1cbiAgICBucFtrXSA9IHBbayAtIDFdO1xuICAgIHJldHVybiBuZXcgQmV6aWVyKG5wKTtcbiAgfVxuXG4gIGRlcml2YXRpdmUodCkge1xuICAgIHJldHVybiB1dGlscy5jb21wdXRlKHQsIHRoaXMuZHBvaW50c1swXSwgdGhpcy5fM2QpO1xuICB9XG5cbiAgZGRlcml2YXRpdmUodCkge1xuICAgIHJldHVybiB1dGlscy5jb21wdXRlKHQsIHRoaXMuZHBvaW50c1sxXSwgdGhpcy5fM2QpO1xuICB9XG5cbiAgYWxpZ24oKSB7XG4gICAgbGV0IHAgPSB0aGlzLnBvaW50cztcbiAgICByZXR1cm4gbmV3IEJlemllcih1dGlscy5hbGlnbihwLCB7IHAxOiBwWzBdLCBwMjogcFtwLmxlbmd0aCAtIDFdIH0pKTtcbiAgfVxuXG4gIGN1cnZhdHVyZSh0KSB7XG4gICAgcmV0dXJuIHV0aWxzLmN1cnZhdHVyZSh0LCB0aGlzLmRwb2ludHNbMF0sIHRoaXMuZHBvaW50c1sxXSwgdGhpcy5fM2QpO1xuICB9XG5cbiAgaW5mbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHV0aWxzLmluZmxlY3Rpb25zKHRoaXMucG9pbnRzKTtcbiAgfVxuXG4gIG5vcm1hbCh0KSB7XG4gICAgcmV0dXJuIHRoaXMuXzNkID8gdGhpcy5fX25vcm1hbDModCkgOiB0aGlzLl9fbm9ybWFsMih0KTtcbiAgfVxuXG4gIF9fbm9ybWFsMih0KSB7XG4gICAgY29uc3QgZCA9IHRoaXMuZGVyaXZhdGl2ZSh0KTtcbiAgICBjb25zdCBxID0gc3FydChkLnggKiBkLnggKyBkLnkgKiBkLnkpO1xuICAgIHJldHVybiB7IHQsIHg6IC1kLnkgLyBxLCB5OiBkLnggLyBxIH07XG4gIH1cblxuICBfX25vcm1hbDModCkge1xuICAgIC8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI1NDUzMTU5XG4gICAgY29uc3QgcjEgPSB0aGlzLmRlcml2YXRpdmUodCksXG4gICAgICByMiA9IHRoaXMuZGVyaXZhdGl2ZSh0ICsgMC4wMSksXG4gICAgICBxMSA9IHNxcnQocjEueCAqIHIxLnggKyByMS55ICogcjEueSArIHIxLnogKiByMS56KSxcbiAgICAgIHEyID0gc3FydChyMi54ICogcjIueCArIHIyLnkgKiByMi55ICsgcjIueiAqIHIyLnopO1xuICAgIHIxLnggLz0gcTE7XG4gICAgcjEueSAvPSBxMTtcbiAgICByMS56IC89IHExO1xuICAgIHIyLnggLz0gcTI7XG4gICAgcjIueSAvPSBxMjtcbiAgICByMi56IC89IHEyO1xuICAgIC8vIGNyb3NzIHByb2R1Y3RcbiAgICBjb25zdCBjID0ge1xuICAgICAgeDogcjIueSAqIHIxLnogLSByMi56ICogcjEueSxcbiAgICAgIHk6IHIyLnogKiByMS54IC0gcjIueCAqIHIxLnosXG4gICAgICB6OiByMi54ICogcjEueSAtIHIyLnkgKiByMS54LFxuICAgIH07XG4gICAgY29uc3QgbSA9IHNxcnQoYy54ICogYy54ICsgYy55ICogYy55ICsgYy56ICogYy56KTtcbiAgICBjLnggLz0gbTtcbiAgICBjLnkgLz0gbTtcbiAgICBjLnogLz0gbTtcbiAgICAvLyByb3RhdGlvbiBtYXRyaXhcbiAgICBjb25zdCBSID0gW1xuICAgICAgYy54ICogYy54LFxuICAgICAgYy54ICogYy55IC0gYy56LFxuICAgICAgYy54ICogYy56ICsgYy55LFxuICAgICAgYy54ICogYy55ICsgYy56LFxuICAgICAgYy55ICogYy55LFxuICAgICAgYy55ICogYy56IC0gYy54LFxuICAgICAgYy54ICogYy56IC0gYy55LFxuICAgICAgYy55ICogYy56ICsgYy54LFxuICAgICAgYy56ICogYy56LFxuICAgIF07XG4gICAgLy8gbm9ybWFsIHZlY3RvcjpcbiAgICBjb25zdCBuID0ge1xuICAgICAgdCxcbiAgICAgIHg6IFJbMF0gKiByMS54ICsgUlsxXSAqIHIxLnkgKyBSWzJdICogcjEueixcbiAgICAgIHk6IFJbM10gKiByMS54ICsgUls0XSAqIHIxLnkgKyBSWzVdICogcjEueixcbiAgICAgIHo6IFJbNl0gKiByMS54ICsgUls3XSAqIHIxLnkgKyBSWzhdICogcjEueixcbiAgICB9O1xuICAgIHJldHVybiBuO1xuICB9XG5cbiAgaHVsbCh0KSB7XG4gICAgbGV0IHAgPSB0aGlzLnBvaW50cyxcbiAgICAgIF9wID0gW10sXG4gICAgICBxID0gW10sXG4gICAgICBpZHggPSAwO1xuICAgIHFbaWR4KytdID0gcFswXTtcbiAgICBxW2lkeCsrXSA9IHBbMV07XG4gICAgcVtpZHgrK10gPSBwWzJdO1xuICAgIGlmICh0aGlzLm9yZGVyID09PSAzKSB7XG4gICAgICBxW2lkeCsrXSA9IHBbM107XG4gICAgfVxuICAgIC8vIHdlIGxlcnAgYmV0d2VlbiBhbGwgcG9pbnRzIGF0IGVhY2ggaXRlcmF0aW9uLCB1bnRpbCB3ZSBoYXZlIDEgcG9pbnQgbGVmdC5cbiAgICB3aGlsZSAocC5sZW5ndGggPiAxKSB7XG4gICAgICBfcCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIHB0LCBsID0gcC5sZW5ndGggLSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHB0ID0gdXRpbHMubGVycCh0LCBwW2ldLCBwW2kgKyAxXSk7XG4gICAgICAgIHFbaWR4KytdID0gcHQ7XG4gICAgICAgIF9wLnB1c2gocHQpO1xuICAgICAgfVxuICAgICAgcCA9IF9wO1xuICAgIH1cbiAgICByZXR1cm4gcTtcbiAgfVxuXG4gIHNwbGl0KHQxLCB0Mikge1xuICAgIC8vIHNob3J0Y3V0c1xuICAgIGlmICh0MSA9PT0gMCAmJiAhIXQyKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGxpdCh0MikubGVmdDtcbiAgICB9XG4gICAgaWYgKHQyID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGxpdCh0MSkucmlnaHQ7XG4gICAgfVxuXG4gICAgLy8gbm8gc2hvcnRjdXQ6IHVzZSBcImRlIENhc3RlbGphdVwiIGl0ZXJhdGlvbi5cbiAgICBjb25zdCBxID0gdGhpcy5odWxsKHQxKTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBsZWZ0OlxuICAgICAgICB0aGlzLm9yZGVyID09PSAyXG4gICAgICAgICAgPyBuZXcgQmV6aWVyKFtxWzBdLCBxWzNdLCBxWzVdXSlcbiAgICAgICAgICA6IG5ldyBCZXppZXIoW3FbMF0sIHFbNF0sIHFbN10sIHFbOV1dKSxcbiAgICAgIHJpZ2h0OlxuICAgICAgICB0aGlzLm9yZGVyID09PSAyXG4gICAgICAgICAgPyBuZXcgQmV6aWVyKFtxWzVdLCBxWzRdLCBxWzJdXSlcbiAgICAgICAgICA6IG5ldyBCZXppZXIoW3FbOV0sIHFbOF0sIHFbNl0sIHFbM11dKSxcbiAgICAgIHNwYW46IHEsXG4gICAgfTtcblxuICAgIC8vIG1ha2Ugc3VyZSB3ZSBiaW5kIF90MS9fdDIgaW5mb3JtYXRpb24hXG4gICAgcmVzdWx0LmxlZnQuX3QxID0gdXRpbHMubWFwKDAsIDAsIDEsIHRoaXMuX3QxLCB0aGlzLl90Mik7XG4gICAgcmVzdWx0LmxlZnQuX3QyID0gdXRpbHMubWFwKHQxLCAwLCAxLCB0aGlzLl90MSwgdGhpcy5fdDIpO1xuICAgIHJlc3VsdC5yaWdodC5fdDEgPSB1dGlscy5tYXAodDEsIDAsIDEsIHRoaXMuX3QxLCB0aGlzLl90Mik7XG4gICAgcmVzdWx0LnJpZ2h0Ll90MiA9IHV0aWxzLm1hcCgxLCAwLCAxLCB0aGlzLl90MSwgdGhpcy5fdDIpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBubyB0Miwgd2UncmUgZG9uZVxuICAgIGlmICghdDIpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIHQyLCBzcGxpdCBhZ2FpbjpcbiAgICB0MiA9IHV0aWxzLm1hcCh0MiwgdDEsIDEsIDAsIDEpO1xuICAgIHJldHVybiByZXN1bHQucmlnaHQuc3BsaXQodDIpLmxlZnQ7XG4gIH1cblxuICBleHRyZW1hKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGxldCByb290cyA9IFtdO1xuXG4gICAgdGhpcy5kaW1zLmZvckVhY2goXG4gICAgICBmdW5jdGlvbiAoZGltKSB7XG4gICAgICAgIGxldCBtZm4gPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgIHJldHVybiB2W2RpbV07XG4gICAgICAgIH07XG4gICAgICAgIGxldCBwID0gdGhpcy5kcG9pbnRzWzBdLm1hcChtZm4pO1xuICAgICAgICByZXN1bHRbZGltXSA9IHV0aWxzLmRyb290cyhwKTtcbiAgICAgICAgaWYgKHRoaXMub3JkZXIgPT09IDMpIHtcbiAgICAgICAgICBwID0gdGhpcy5kcG9pbnRzWzFdLm1hcChtZm4pO1xuICAgICAgICAgIHJlc3VsdFtkaW1dID0gcmVzdWx0W2RpbV0uY29uY2F0KHV0aWxzLmRyb290cyhwKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W2RpbV0gPSByZXN1bHRbZGltXS5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gdCA+PSAwICYmIHQgPD0gMTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJvb3RzID0gcm9vdHMuY29uY2F0KHJlc3VsdFtkaW1dLnNvcnQodXRpbHMubnVtYmVyU29ydCkpO1xuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcblxuICAgIHJlc3VsdC52YWx1ZXMgPSByb290cy5zb3J0KHV0aWxzLm51bWJlclNvcnQpLmZpbHRlcihmdW5jdGlvbiAodiwgaWR4KSB7XG4gICAgICByZXR1cm4gcm9vdHMuaW5kZXhPZih2KSA9PT0gaWR4O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGJib3goKSB7XG4gICAgY29uc3QgZXh0cmVtYSA9IHRoaXMuZXh0cmVtYSgpLFxuICAgICAgcmVzdWx0ID0ge307XG4gICAgdGhpcy5kaW1zLmZvckVhY2goXG4gICAgICBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXN1bHRbZF0gPSB1dGlscy5nZXRtaW5tYXgodGhpcywgZCwgZXh0cmVtYVtkXSk7XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBvdmVybGFwcyhjdXJ2ZSkge1xuICAgIGNvbnN0IGxiYm94ID0gdGhpcy5iYm94KCksXG4gICAgICB0YmJveCA9IGN1cnZlLmJib3goKTtcbiAgICByZXR1cm4gdXRpbHMuYmJveG92ZXJsYXAobGJib3gsIHRiYm94KTtcbiAgfVxuXG4gIG9mZnNldCh0LCBkKSB7XG4gICAgaWYgKHR5cGVvZiBkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjb25zdCBjID0gdGhpcy5nZXQodCksXG4gICAgICAgIG4gPSB0aGlzLm5vcm1hbCh0KTtcbiAgICAgIGNvbnN0IHJldCA9IHtcbiAgICAgICAgYzogYyxcbiAgICAgICAgbjogbixcbiAgICAgICAgeDogYy54ICsgbi54ICogZCxcbiAgICAgICAgeTogYy55ICsgbi55ICogZCxcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fM2QpIHtcbiAgICAgICAgcmV0LnogPSBjLnogKyBuLnogKiBkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2xpbmVhcikge1xuICAgICAgY29uc3QgbnYgPSB0aGlzLm5vcm1hbCgwKSxcbiAgICAgICAgY29vcmRzID0gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgY29uc3QgcmV0ID0ge1xuICAgICAgICAgICAgeDogcC54ICsgdCAqIG52LngsXG4gICAgICAgICAgICB5OiBwLnkgKyB0ICogbnYueSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwLnogJiYgbnYueikge1xuICAgICAgICAgICAgcmV0LnogPSBwLnogKyB0ICogbnYuejtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSk7XG4gICAgICByZXR1cm4gW25ldyBCZXppZXIoY29vcmRzKV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlZHVjZSgpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgaWYgKHMuX2xpbmVhcikge1xuICAgICAgICByZXR1cm4gcy5vZmZzZXQodClbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4gcy5zY2FsZSh0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNpbXBsZSgpIHtcbiAgICBpZiAodGhpcy5vcmRlciA9PT0gMykge1xuICAgICAgY29uc3QgYTEgPSB1dGlscy5hbmdsZSh0aGlzLnBvaW50c1swXSwgdGhpcy5wb2ludHNbM10sIHRoaXMucG9pbnRzWzFdKTtcbiAgICAgIGNvbnN0IGEyID0gdXRpbHMuYW5nbGUodGhpcy5wb2ludHNbMF0sIHRoaXMucG9pbnRzWzNdLCB0aGlzLnBvaW50c1syXSk7XG4gICAgICBpZiAoKGExID4gMCAmJiBhMiA8IDApIHx8IChhMSA8IDAgJiYgYTIgPiAwKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBuMSA9IHRoaXMubm9ybWFsKDApO1xuICAgIGNvbnN0IG4yID0gdGhpcy5ub3JtYWwoMSk7XG4gICAgbGV0IHMgPSBuMS54ICogbjIueCArIG4xLnkgKiBuMi55O1xuICAgIGlmICh0aGlzLl8zZCkge1xuICAgICAgcyArPSBuMS56ICogbjIuejtcbiAgICB9XG4gICAgcmV0dXJuIGFicyhhY29zKHMpKSA8IHBpIC8gMztcbiAgfVxuXG4gIHJlZHVjZSgpIHtcbiAgICAvLyBUT0RPOiBleGFtaW5lIHRoZXNlIHZhciB0eXBlcyBpbiBtb3JlIGRldGFpbC4uLlxuICAgIGxldCBpLFxuICAgICAgdDEgPSAwLFxuICAgICAgdDIgPSAwLFxuICAgICAgc3RlcCA9IDAuMDEsXG4gICAgICBzZWdtZW50LFxuICAgICAgcGFzczEgPSBbXSxcbiAgICAgIHBhc3MyID0gW107XG4gICAgLy8gZmlyc3QgcGFzczogc3BsaXQgb24gZXh0cmVtYVxuICAgIGxldCBleHRyZW1hID0gdGhpcy5leHRyZW1hKCkudmFsdWVzO1xuICAgIGlmIChleHRyZW1hLmluZGV4T2YoMCkgPT09IC0xKSB7XG4gICAgICBleHRyZW1hID0gWzBdLmNvbmNhdChleHRyZW1hKTtcbiAgICB9XG4gICAgaWYgKGV4dHJlbWEuaW5kZXhPZigxKSA9PT0gLTEpIHtcbiAgICAgIGV4dHJlbWEucHVzaCgxKTtcbiAgICB9XG5cbiAgICBmb3IgKHQxID0gZXh0cmVtYVswXSwgaSA9IDE7IGkgPCBleHRyZW1hLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0MiA9IGV4dHJlbWFbaV07XG4gICAgICBzZWdtZW50ID0gdGhpcy5zcGxpdCh0MSwgdDIpO1xuICAgICAgc2VnbWVudC5fdDEgPSB0MTtcbiAgICAgIHNlZ21lbnQuX3QyID0gdDI7XG4gICAgICBwYXNzMS5wdXNoKHNlZ21lbnQpO1xuICAgICAgdDEgPSB0MjtcbiAgICB9XG5cbiAgICAvLyBzZWNvbmQgcGFzczogZnVydGhlciByZWR1Y2UgdGhlc2Ugc2VnbWVudHMgdG8gc2ltcGxlIHNlZ21lbnRzXG4gICAgcGFzczEuZm9yRWFjaChmdW5jdGlvbiAocDEpIHtcbiAgICAgIHQxID0gMDtcbiAgICAgIHQyID0gMDtcbiAgICAgIHdoaWxlICh0MiA8PSAxKSB7XG4gICAgICAgIGZvciAodDIgPSB0MSArIHN0ZXA7IHQyIDw9IDEgKyBzdGVwOyB0MiArPSBzdGVwKSB7XG4gICAgICAgICAgc2VnbWVudCA9IHAxLnNwbGl0KHQxLCB0Mik7XG4gICAgICAgICAgaWYgKCFzZWdtZW50LnNpbXBsZSgpKSB7XG4gICAgICAgICAgICB0MiAtPSBzdGVwO1xuICAgICAgICAgICAgaWYgKGFicyh0MSAtIHQyKSA8IHN0ZXApIHtcbiAgICAgICAgICAgICAgLy8gd2UgY2FuIG5ldmVyIGZvcm0gYSByZWR1Y3Rpb25cbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VnbWVudCA9IHAxLnNwbGl0KHQxLCB0Mik7XG4gICAgICAgICAgICBzZWdtZW50Ll90MSA9IHV0aWxzLm1hcCh0MSwgMCwgMSwgcDEuX3QxLCBwMS5fdDIpO1xuICAgICAgICAgICAgc2VnbWVudC5fdDIgPSB1dGlscy5tYXAodDIsIDAsIDEsIHAxLl90MSwgcDEuX3QyKTtcbiAgICAgICAgICAgIHBhc3MyLnB1c2goc2VnbWVudCk7XG4gICAgICAgICAgICB0MSA9IHQyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodDEgPCAxKSB7XG4gICAgICAgIHNlZ21lbnQgPSBwMS5zcGxpdCh0MSwgMSk7XG4gICAgICAgIHNlZ21lbnQuX3QxID0gdXRpbHMubWFwKHQxLCAwLCAxLCBwMS5fdDEsIHAxLl90Mik7XG4gICAgICAgIHNlZ21lbnQuX3QyID0gcDEuX3QyO1xuICAgICAgICBwYXNzMi5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwYXNzMjtcbiAgfVxuXG4gIHRyYW5zbGF0ZSh2LCBkMSwgZDIpIHtcbiAgICBkMiA9IHR5cGVvZiBkMiA9PT0gXCJudW1iZXJcIiA/IGQyIDogZDE7XG5cbiAgICAvLyBUT0RPOiBtYWtlIHRoaXMgdGFrZSBjdXJ2ZXMgd2l0aCBjb250cm9sIHBvaW50cyBvdXRzaWRlXG4gICAgLy8gICAgICAgb2YgdGhlIHN0YXJ0LWVuZCBpbnRlcnZhbCBpbnRvIGFjY291bnRcblxuICAgIGNvbnN0IG8gPSB0aGlzLm9yZGVyO1xuICAgIGxldCBkID0gdGhpcy5wb2ludHMubWFwKChfLCBpKSA9PiAoMSAtIGkgLyBvKSAqIGQxICsgKGkgLyBvKSAqIGQyKTtcbiAgICByZXR1cm4gbmV3IEJlemllcihcbiAgICAgIHRoaXMucG9pbnRzLm1hcCgocCwgaSkgPT4gKHtcbiAgICAgICAgeDogcC54ICsgdi54ICogZFtpXSxcbiAgICAgICAgeTogcC55ICsgdi55ICogZFtpXSxcbiAgICAgIH0pKVxuICAgICk7XG4gIH1cblxuICBzY2FsZShkKSB7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLm9yZGVyO1xuICAgIGxldCBkaXN0YW5jZUZuID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiBkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGRpc3RhbmNlRm4gPSBkO1xuICAgIH1cbiAgICBpZiAoZGlzdGFuY2VGbiAmJiBvcmRlciA9PT0gMikge1xuICAgICAgcmV0dXJuIHRoaXMucmFpc2UoKS5zY2FsZShkaXN0YW5jZUZuKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBhZGQgc3BlY2lhbCBoYW5kbGluZyBmb3Igbm9uLWxpbmVhciBkZWdlbmVyYXRlIGN1cnZlcy5cblxuICAgIGNvbnN0IGNsb2Nrd2lzZSA9IHRoaXMuY2xvY2t3aXNlO1xuICAgIGNvbnN0IHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgaWYgKHRoaXMuX2xpbmVhcikge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKFxuICAgICAgICB0aGlzLm5vcm1hbCgwKSxcbiAgICAgICAgZGlzdGFuY2VGbiA/IGRpc3RhbmNlRm4oMCkgOiBkLFxuICAgICAgICBkaXN0YW5jZUZuID8gZGlzdGFuY2VGbigxKSA6IGRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgcjEgPSBkaXN0YW5jZUZuID8gZGlzdGFuY2VGbigwKSA6IGQ7XG4gICAgY29uc3QgcjIgPSBkaXN0YW5jZUZuID8gZGlzdGFuY2VGbigxKSA6IGQ7XG4gICAgY29uc3QgdiA9IFt0aGlzLm9mZnNldCgwLCAxMCksIHRoaXMub2Zmc2V0KDEsIDEwKV07XG4gICAgY29uc3QgbnAgPSBbXTtcbiAgICBjb25zdCBvID0gdXRpbHMubGxpNCh2WzBdLCB2WzBdLmMsIHZbMV0sIHZbMV0uYyk7XG5cbiAgICBpZiAoIW8pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbm5vdCBzY2FsZSB0aGlzIGN1cnZlLiBUcnkgcmVkdWNpbmcgaXQgZmlyc3QuXCIpO1xuICAgIH1cblxuICAgIC8vIG1vdmUgYWxsIHBvaW50cyBieSBkaXN0YW5jZSAnZCcgd3J0IHRoZSBvcmlnaW4gJ28nLFxuICAgIC8vIGFuZCBtb3ZlIGVuZCBwb2ludHMgYnkgZml4ZWQgZGlzdGFuY2UgYWxvbmcgbm9ybWFsLlxuICAgIFswLCAxXS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICBjb25zdCBwID0gKG5wW3QgKiBvcmRlcl0gPSB1dGlscy5jb3B5KHBvaW50c1t0ICogb3JkZXJdKSk7XG4gICAgICBwLnggKz0gKHQgPyByMiA6IHIxKSAqIHZbdF0ubi54O1xuICAgICAgcC55ICs9ICh0ID8gcjIgOiByMSkgKiB2W3RdLm4ueTtcbiAgICB9KTtcblxuICAgIGlmICghZGlzdGFuY2VGbikge1xuICAgICAgLy8gbW92ZSBjb250cm9sIHBvaW50cyB0byBsaWUgb24gdGhlIGludGVyc2VjdGlvbiBvZiB0aGUgb2Zmc2V0XG4gICAgICAvLyBkZXJpdmF0aXZlIHZlY3RvciwgYW5kIHRoZSBvcmlnaW4tdGhyb3VnaC1jb250cm9sIHZlY3RvclxuICAgICAgWzAsIDFdLmZvckVhY2goKHQpID0+IHtcbiAgICAgICAgaWYgKG9yZGVyID09PSAyICYmICEhdCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBwID0gbnBbdCAqIG9yZGVyXTtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuZGVyaXZhdGl2ZSh0KTtcbiAgICAgICAgY29uc3QgcDIgPSB7IHg6IHAueCArIGQueCwgeTogcC55ICsgZC55IH07XG4gICAgICAgIG5wW3QgKyAxXSA9IHV0aWxzLmxsaTQocCwgcDIsIG8sIHBvaW50c1t0ICsgMV0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IEJlemllcihucCk7XG4gICAgfVxuXG4gICAgLy8gbW92ZSBjb250cm9sIHBvaW50cyBieSBcImhvd2V2ZXIgbXVjaCBuZWNlc3NhcnkgdG9cbiAgICAvLyBlbnN1cmUgdGhlIGNvcnJlY3QgdGFuZ2VudCB0byBlbmRwb2ludFwiLlxuICAgIFswLCAxXS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICBpZiAob3JkZXIgPT09IDIgJiYgISF0KSByZXR1cm47XG4gICAgICB2YXIgcCA9IHBvaW50c1t0ICsgMV07XG4gICAgICB2YXIgb3YgPSB7XG4gICAgICAgIHg6IHAueCAtIG8ueCxcbiAgICAgICAgeTogcC55IC0gby55LFxuICAgICAgfTtcbiAgICAgIHZhciByYyA9IGRpc3RhbmNlRm4gPyBkaXN0YW5jZUZuKCh0ICsgMSkgLyBvcmRlcikgOiBkO1xuICAgICAgaWYgKGRpc3RhbmNlRm4gJiYgIWNsb2Nrd2lzZSkgcmMgPSAtcmM7XG4gICAgICB2YXIgbSA9IHNxcnQob3YueCAqIG92LnggKyBvdi55ICogb3YueSk7XG4gICAgICBvdi54IC89IG07XG4gICAgICBvdi55IC89IG07XG4gICAgICBucFt0ICsgMV0gPSB7XG4gICAgICAgIHg6IHAueCArIHJjICogb3YueCxcbiAgICAgICAgeTogcC55ICsgcmMgKiBvdi55LFxuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IEJlemllcihucCk7XG4gIH1cblxuICBvdXRsaW5lKGQxLCBkMiwgZDMsIGQ0KSB7XG4gICAgZDIgPSBkMiA9PT0gdW5kZWZpbmVkID8gZDEgOiBkMjtcblxuICAgIGlmICh0aGlzLl9saW5lYXIpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgdGhlIGFjdHVhbCBleHRyZW1hLCBiZWNhdXNlIHRoZXkgbWlnaHRcbiAgICAgIC8vICAgICAgIGJlIGJlZm9yZSB0aGUgc3RhcnQsIG9yIHBhc3QgdGhlIGVuZC5cblxuICAgICAgY29uc3QgbiA9IHRoaXMubm9ybWFsKDApO1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50c1swXTtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgbGV0IHMsIG1pZCwgZTtcblxuICAgICAgaWYgKGQzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZDMgPSBkMTtcbiAgICAgICAgZDQgPSBkMjtcbiAgICAgIH1cblxuICAgICAgcyA9IHsgeDogc3RhcnQueCArIG4ueCAqIGQxLCB5OiBzdGFydC55ICsgbi55ICogZDEgfTtcbiAgICAgIGUgPSB7IHg6IGVuZC54ICsgbi54ICogZDMsIHk6IGVuZC55ICsgbi55ICogZDMgfTtcbiAgICAgIG1pZCA9IHsgeDogKHMueCArIGUueCkgLyAyLCB5OiAocy55ICsgZS55KSAvIDIgfTtcbiAgICAgIGNvbnN0IGZsaW5lID0gW3MsIG1pZCwgZV07XG5cbiAgICAgIHMgPSB7IHg6IHN0YXJ0LnggLSBuLnggKiBkMiwgeTogc3RhcnQueSAtIG4ueSAqIGQyIH07XG4gICAgICBlID0geyB4OiBlbmQueCAtIG4ueCAqIGQ0LCB5OiBlbmQueSAtIG4ueSAqIGQ0IH07XG4gICAgICBtaWQgPSB7IHg6IChzLnggKyBlLngpIC8gMiwgeTogKHMueSArIGUueSkgLyAyIH07XG4gICAgICBjb25zdCBibGluZSA9IFtlLCBtaWQsIHNdO1xuXG4gICAgICBjb25zdCBscyA9IHV0aWxzLm1ha2VsaW5lKGJsaW5lWzJdLCBmbGluZVswXSk7XG4gICAgICBjb25zdCBsZSA9IHV0aWxzLm1ha2VsaW5lKGZsaW5lWzJdLCBibGluZVswXSk7XG4gICAgICBjb25zdCBzZWdtZW50cyA9IFtscywgbmV3IEJlemllcihmbGluZSksIGxlLCBuZXcgQmV6aWVyKGJsaW5lKV07XG4gICAgICByZXR1cm4gbmV3IFBvbHlCZXppZXIoc2VnbWVudHMpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZHVjZWQgPSB0aGlzLnJlZHVjZSgpLFxuICAgICAgbGVuID0gcmVkdWNlZC5sZW5ndGgsXG4gICAgICBmY3VydmVzID0gW107XG5cbiAgICBsZXQgYmN1cnZlcyA9IFtdLFxuICAgICAgcCxcbiAgICAgIGFsZW4gPSAwLFxuICAgICAgdGxlbiA9IHRoaXMubGVuZ3RoKCk7XG5cbiAgICBjb25zdCBncmFkdWF0ZWQgPSB0eXBlb2YgZDMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGQ0ICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gICAgZnVuY3Rpb24gbGluZWFyRGlzdGFuY2VGdW5jdGlvbihzLCBlLCB0bGVuLCBhbGVuLCBzbGVuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgY29uc3QgZjEgPSBhbGVuIC8gdGxlbixcbiAgICAgICAgICBmMiA9IChhbGVuICsgc2xlbikgLyB0bGVuLFxuICAgICAgICAgIGQgPSBlIC0gcztcbiAgICAgICAgcmV0dXJuIHV0aWxzLm1hcCh2LCAwLCAxLCBzICsgZjEgKiBkLCBzICsgZjIgKiBkKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybSBjdXJ2ZSBvdWxpbmVzXG4gICAgcmVkdWNlZC5mb3JFYWNoKGZ1bmN0aW9uIChzZWdtZW50KSB7XG4gICAgICBjb25zdCBzbGVuID0gc2VnbWVudC5sZW5ndGgoKTtcbiAgICAgIGlmIChncmFkdWF0ZWQpIHtcbiAgICAgICAgZmN1cnZlcy5wdXNoKFxuICAgICAgICAgIHNlZ21lbnQuc2NhbGUobGluZWFyRGlzdGFuY2VGdW5jdGlvbihkMSwgZDMsIHRsZW4sIGFsZW4sIHNsZW4pKVxuICAgICAgICApO1xuICAgICAgICBiY3VydmVzLnB1c2goXG4gICAgICAgICAgc2VnbWVudC5zY2FsZShsaW5lYXJEaXN0YW5jZUZ1bmN0aW9uKC1kMiwgLWQ0LCB0bGVuLCBhbGVuLCBzbGVuKSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZjdXJ2ZXMucHVzaChzZWdtZW50LnNjYWxlKGQxKSk7XG4gICAgICAgIGJjdXJ2ZXMucHVzaChzZWdtZW50LnNjYWxlKC1kMikpO1xuICAgICAgfVxuICAgICAgYWxlbiArPSBzbGVuO1xuICAgIH0pO1xuXG4gICAgLy8gcmV2ZXJzZSB0aGUgXCJyZXR1cm5cIiBvdXRsaW5lXG4gICAgYmN1cnZlcyA9IGJjdXJ2ZXNcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcCA9IHMucG9pbnRzO1xuICAgICAgICBpZiAocFszXSkge1xuICAgICAgICAgIHMucG9pbnRzID0gW3BbM10sIHBbMl0sIHBbMV0sIHBbMF1dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMucG9pbnRzID0gW3BbMl0sIHBbMV0sIHBbMF1dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzO1xuICAgICAgfSlcbiAgICAgIC5yZXZlcnNlKCk7XG5cbiAgICAvLyBmb3JtIHRoZSBlbmRjYXBzIGFzIGxpbmVzXG4gICAgY29uc3QgZnMgPSBmY3VydmVzWzBdLnBvaW50c1swXSxcbiAgICAgIGZlID0gZmN1cnZlc1tsZW4gLSAxXS5wb2ludHNbZmN1cnZlc1tsZW4gLSAxXS5wb2ludHMubGVuZ3RoIC0gMV0sXG4gICAgICBicyA9IGJjdXJ2ZXNbbGVuIC0gMV0ucG9pbnRzW2JjdXJ2ZXNbbGVuIC0gMV0ucG9pbnRzLmxlbmd0aCAtIDFdLFxuICAgICAgYmUgPSBiY3VydmVzWzBdLnBvaW50c1swXSxcbiAgICAgIGxzID0gdXRpbHMubWFrZWxpbmUoYnMsIGZzKSxcbiAgICAgIGxlID0gdXRpbHMubWFrZWxpbmUoZmUsIGJlKSxcbiAgICAgIHNlZ21lbnRzID0gW2xzXS5jb25jYXQoZmN1cnZlcykuY29uY2F0KFtsZV0pLmNvbmNhdChiY3VydmVzKTtcblxuICAgIHJldHVybiBuZXcgUG9seUJlemllcihzZWdtZW50cyk7XG4gIH1cblxuICBvdXRsaW5lc2hhcGVzKGQxLCBkMiwgY3VydmVJbnRlcnNlY3Rpb25UaHJlc2hvbGQpIHtcbiAgICBkMiA9IGQyIHx8IGQxO1xuICAgIGNvbnN0IG91dGxpbmUgPSB0aGlzLm91dGxpbmUoZDEsIGQyKS5jdXJ2ZXM7XG4gICAgY29uc3Qgc2hhcGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDEsIGxlbiA9IG91dGxpbmUubGVuZ3RoOyBpIDwgbGVuIC8gMjsgaSsrKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHV0aWxzLm1ha2VzaGFwZShcbiAgICAgICAgb3V0bGluZVtpXSxcbiAgICAgICAgb3V0bGluZVtsZW4gLSBpXSxcbiAgICAgICAgY3VydmVJbnRlcnNlY3Rpb25UaHJlc2hvbGRcbiAgICAgICk7XG4gICAgICBzaGFwZS5zdGFydGNhcC52aXJ0dWFsID0gaSA+IDE7XG4gICAgICBzaGFwZS5lbmRjYXAudmlydHVhbCA9IGkgPCBsZW4gLyAyIC0gMTtcbiAgICAgIHNoYXBlcy5wdXNoKHNoYXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIHNoYXBlcztcbiAgfVxuXG4gIGludGVyc2VjdHMoY3VydmUsIGN1cnZlSW50ZXJzZWN0aW9uVGhyZXNob2xkKSB7XG4gICAgaWYgKCFjdXJ2ZSkgcmV0dXJuIHRoaXMuc2VsZmludGVyc2VjdHMoY3VydmVJbnRlcnNlY3Rpb25UaHJlc2hvbGQpO1xuICAgIGlmIChjdXJ2ZS5wMSAmJiBjdXJ2ZS5wMikge1xuICAgICAgcmV0dXJuIHRoaXMubGluZUludGVyc2VjdHMoY3VydmUpO1xuICAgIH1cbiAgICBpZiAoY3VydmUgaW5zdGFuY2VvZiBCZXppZXIpIHtcbiAgICAgIGN1cnZlID0gY3VydmUucmVkdWNlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmN1cnZlaW50ZXJzZWN0cyhcbiAgICAgIHRoaXMucmVkdWNlKCksXG4gICAgICBjdXJ2ZSxcbiAgICAgIGN1cnZlSW50ZXJzZWN0aW9uVGhyZXNob2xkXG4gICAgKTtcbiAgfVxuXG4gIGxpbmVJbnRlcnNlY3RzKGxpbmUpIHtcbiAgICBjb25zdCBteCA9IG1pbihsaW5lLnAxLngsIGxpbmUucDIueCksXG4gICAgICBteSA9IG1pbihsaW5lLnAxLnksIGxpbmUucDIueSksXG4gICAgICBNWCA9IG1heChsaW5lLnAxLngsIGxpbmUucDIueCksXG4gICAgICBNWSA9IG1heChsaW5lLnAxLnksIGxpbmUucDIueSk7XG4gICAgcmV0dXJuIHV0aWxzLnJvb3RzKHRoaXMucG9pbnRzLCBsaW5lKS5maWx0ZXIoKHQpID0+IHtcbiAgICAgIHZhciBwID0gdGhpcy5nZXQodCk7XG4gICAgICByZXR1cm4gdXRpbHMuYmV0d2VlbihwLngsIG14LCBNWCkgJiYgdXRpbHMuYmV0d2VlbihwLnksIG15LCBNWSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWxmaW50ZXJzZWN0cyhjdXJ2ZUludGVyc2VjdGlvblRocmVzaG9sZCkge1xuICAgIC8vIFwic2ltcGxlXCIgY3VydmVzIGNhbm5vdCBpbnRlcnNlY3Qgd2l0aCB0aGVpciBkaXJlY3RcbiAgICAvLyBuZWlnaGJvdXIsIHNvIGZvciBlYWNoIHNlZ21lbnQgWCB3ZSBjaGVjayB3aGV0aGVyXG4gICAgLy8gaXQgaW50ZXJzZWN0cyBbMDp4LTJdW3grMjpsYXN0XS5cblxuICAgIGNvbnN0IHJlZHVjZWQgPSB0aGlzLnJlZHVjZSgpLFxuICAgICAgbGVuID0gcmVkdWNlZC5sZW5ndGggLSAyLFxuICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIHJlc3VsdCwgbGVmdCwgcmlnaHQ7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGVmdCA9IHJlZHVjZWQuc2xpY2UoaSwgaSArIDEpO1xuICAgICAgcmlnaHQgPSByZWR1Y2VkLnNsaWNlKGkgKyAyKTtcbiAgICAgIHJlc3VsdCA9IHRoaXMuY3VydmVpbnRlcnNlY3RzKGxlZnQsIHJpZ2h0LCBjdXJ2ZUludGVyc2VjdGlvblRocmVzaG9sZCk7XG4gICAgICByZXN1bHRzLnB1c2goLi4ucmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBjdXJ2ZWludGVyc2VjdHMoYzEsIGMyLCBjdXJ2ZUludGVyc2VjdGlvblRocmVzaG9sZCkge1xuICAgIGNvbnN0IHBhaXJzID0gW107XG4gICAgLy8gc3RlcCAxOiBwYWlyIG9mZiBhbnkgb3ZlcmxhcHBpbmcgc2VnbWVudHNcbiAgICBjMS5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICBjMi5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGlmIChsLm92ZXJsYXBzKHIpKSB7XG4gICAgICAgICAgcGFpcnMucHVzaCh7IGxlZnQ6IGwsIHJpZ2h0OiByIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyBzdGVwIDI6IGZvciBlYWNoIHBhaXJpbmcsIHJ1biB0aHJvdWdoIHRoZSBjb252ZXJnZW5jZSBhbGdvcml0aG0uXG4gICAgbGV0IGludGVyc2VjdGlvbnMgPSBbXTtcbiAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uIChwYWlyKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB1dGlscy5wYWlyaXRlcmF0aW9uKFxuICAgICAgICBwYWlyLmxlZnQsXG4gICAgICAgIHBhaXIucmlnaHQsXG4gICAgICAgIGN1cnZlSW50ZXJzZWN0aW9uVGhyZXNob2xkXG4gICAgICApO1xuICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zLmNvbmNhdChyZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xuICB9XG5cbiAgYXJjcyhlcnJvclRocmVzaG9sZCkge1xuICAgIGVycm9yVGhyZXNob2xkID0gZXJyb3JUaHJlc2hvbGQgfHwgMC41O1xuICAgIHJldHVybiB0aGlzLl9pdGVyYXRlKGVycm9yVGhyZXNob2xkLCBbXSk7XG4gIH1cblxuICBfZXJyb3IocGMsIG5wMSwgcywgZSkge1xuICAgIGNvbnN0IHEgPSAoZSAtIHMpIC8gNCxcbiAgICAgIGMxID0gdGhpcy5nZXQocyArIHEpLFxuICAgICAgYzIgPSB0aGlzLmdldChlIC0gcSksXG4gICAgICByZWYgPSB1dGlscy5kaXN0KHBjLCBucDEpLFxuICAgICAgZDEgPSB1dGlscy5kaXN0KHBjLCBjMSksXG4gICAgICBkMiA9IHV0aWxzLmRpc3QocGMsIGMyKTtcbiAgICByZXR1cm4gYWJzKGQxIC0gcmVmKSArIGFicyhkMiAtIHJlZik7XG4gIH1cblxuICBfaXRlcmF0ZShlcnJvclRocmVzaG9sZCwgY2lyY2xlcykge1xuICAgIGxldCB0X3MgPSAwLFxuICAgICAgdF9lID0gMSxcbiAgICAgIHNhZmV0eTtcbiAgICAvLyB3ZSBkbyBhIGJpbmFyeSBzZWFyY2ggdG8gZmluZCB0aGUgXCJnb29kIGB0YCBjbG9zZXN0IHRvIG5vLWxvbmdlci1nb29kXCJcbiAgICBkbyB7XG4gICAgICBzYWZldHkgPSAwO1xuXG4gICAgICAvLyBzdGVwIDE6IHN0YXJ0IHdpdGggdGhlIG1heGltdW0gcG9zc2libGUgYXJjXG4gICAgICB0X2UgPSAxO1xuXG4gICAgICAvLyBwb2ludHM6XG4gICAgICBsZXQgbnAxID0gdGhpcy5nZXQodF9zKSxcbiAgICAgICAgbnAyLFxuICAgICAgICBucDMsXG4gICAgICAgIGFyYyxcbiAgICAgICAgcHJldl9hcmM7XG5cbiAgICAgIC8vIGJvb2xlYW5zOlxuICAgICAgbGV0IGN1cnJfZ29vZCA9IGZhbHNlLFxuICAgICAgICBwcmV2X2dvb2QgPSBmYWxzZSxcbiAgICAgICAgZG9uZTtcblxuICAgICAgLy8gbnVtYmVyczpcbiAgICAgIGxldCB0X20gPSB0X2UsXG4gICAgICAgIHByZXZfZSA9IDEsXG4gICAgICAgIHN0ZXAgPSAwO1xuXG4gICAgICAvLyBzdGVwIDI6IGZpbmQgdGhlIGJlc3QgcG9zc2libGUgYXJjXG4gICAgICBkbyB7XG4gICAgICAgIHByZXZfZ29vZCA9IGN1cnJfZ29vZDtcbiAgICAgICAgcHJldl9hcmMgPSBhcmM7XG4gICAgICAgIHRfbSA9ICh0X3MgKyB0X2UpIC8gMjtcbiAgICAgICAgc3RlcCsrO1xuXG4gICAgICAgIG5wMiA9IHRoaXMuZ2V0KHRfbSk7XG4gICAgICAgIG5wMyA9IHRoaXMuZ2V0KHRfZSk7XG5cbiAgICAgICAgYXJjID0gdXRpbHMuZ2V0Y2NlbnRlcihucDEsIG5wMiwgbnAzKTtcblxuICAgICAgICAvL2Fsc28gc2F2ZSB0aGUgdCB2YWx1ZXNcbiAgICAgICAgYXJjLmludGVydmFsID0ge1xuICAgICAgICAgIHN0YXJ0OiB0X3MsXG4gICAgICAgICAgZW5kOiB0X2UsXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGVycm9yID0gdGhpcy5fZXJyb3IoYXJjLCBucDEsIHRfcywgdF9lKTtcbiAgICAgICAgY3Vycl9nb29kID0gZXJyb3IgPD0gZXJyb3JUaHJlc2hvbGQ7XG5cbiAgICAgICAgZG9uZSA9IHByZXZfZ29vZCAmJiAhY3Vycl9nb29kO1xuICAgICAgICBpZiAoIWRvbmUpIHByZXZfZSA9IHRfZTtcblxuICAgICAgICAvLyB0aGlzIGFyYyBpcyBmaW5lOiB3ZSBjYW4gbW92ZSAnZScgdXAgdG8gc2VlIGlmIHdlIGNhbiBmaW5kIGEgd2lkZXIgYXJjXG4gICAgICAgIGlmIChjdXJyX2dvb2QpIHtcbiAgICAgICAgICAvLyBpZiBlIGlzIGFscmVhZHkgYXQgbWF4LCB0aGVuIHdlJ3JlIGRvbmUgZm9yIHRoaXMgYXJjLlxuICAgICAgICAgIGlmICh0X2UgPj0gMSkge1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGNhcCBhdCB0PTFcbiAgICAgICAgICAgIGFyYy5pbnRlcnZhbC5lbmQgPSBwcmV2X2UgPSAxO1xuICAgICAgICAgICAgcHJldl9hcmMgPSBhcmM7XG4gICAgICAgICAgICAvLyBpZiB3ZSBjYXBwZWQgdGhlIGFyYyBzZWdtZW50IHRvIHQ9MSB3ZSBhbHNvIG5lZWQgdG8gbWFrZSBzdXJlIHRoYXRcbiAgICAgICAgICAgIC8vIHRoZSBhcmMncyBlbmQgYW5nbGUgaXMgY29ycmVjdCB3aXRoIHJlc3BlY3QgdG8gdGhlIGJlemllciBlbmQgcG9pbnQuXG4gICAgICAgICAgICBpZiAodF9lID4gMSkge1xuICAgICAgICAgICAgICBsZXQgZCA9IHtcbiAgICAgICAgICAgICAgICB4OiBhcmMueCArIGFyYy5yICogY29zKGFyYy5lKSxcbiAgICAgICAgICAgICAgICB5OiBhcmMueSArIGFyYy5yICogc2luKGFyYy5lKSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgYXJjLmUgKz0gdXRpbHMuYW5nbGUoeyB4OiBhcmMueCwgeTogYXJjLnkgfSwgZCwgdGhpcy5nZXQoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGlmIG5vdCwgbW92ZSBpdCB1cCBieSBoYWxmIHRoZSBpdGVyYXRpb24gZGlzdGFuY2VcbiAgICAgICAgICB0X2UgPSB0X2UgKyAodF9lIC0gdF9zKSAvIDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyBhIGJhZCBhcmM6IHdlIG5lZWQgdG8gbW92ZSAnZScgZG93biB0byBmaW5kIGEgZ29vZCBhcmNcbiAgICAgICAgICB0X2UgPSB0X207XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKCFkb25lICYmIHNhZmV0eSsrIDwgMTAwKTtcblxuICAgICAgaWYgKHNhZmV0eSA+PSAxMDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTDgzNTogW0ZdIGFyYyBmb3VuZFwiLCB0X3MsIHByZXZfZSwgcHJldl9hcmMueCwgcHJldl9hcmMueSwgcHJldl9hcmMucywgcHJldl9hcmMuZSk7XG5cbiAgICAgIHByZXZfYXJjID0gcHJldl9hcmMgPyBwcmV2X2FyYyA6IGFyYztcbiAgICAgIGNpcmNsZXMucHVzaChwcmV2X2FyYyk7XG4gICAgICB0X3MgPSBwcmV2X2U7XG4gICAgfSB3aGlsZSAodF9lIDwgMSk7XG4gICAgcmV0dXJuIGNpcmNsZXM7XG4gIH1cbn1cblxuZXhwb3J0IHsgQmV6aWVyIH07XG4iLCJpbXBvcnQgeyB1dGlscyB9IGZyb20gXCIuL3V0aWxzLmpzXCI7XG5cbi8qKlxuICogUG9seSBCZXppZXJcbiAqIEBwYXJhbSB7W3R5cGVdfSBjdXJ2ZXMgW2Rlc2NyaXB0aW9uXVxuICovXG5jbGFzcyBQb2x5QmV6aWVyIHtcbiAgY29uc3RydWN0b3IoY3VydmVzKSB7XG4gICAgdGhpcy5jdXJ2ZXMgPSBbXTtcbiAgICB0aGlzLl8zZCA9IGZhbHNlO1xuICAgIGlmICghIWN1cnZlcykge1xuICAgICAgdGhpcy5jdXJ2ZXMgPSBjdXJ2ZXM7XG4gICAgICB0aGlzLl8zZCA9IHRoaXMuY3VydmVzWzBdLl8zZDtcbiAgICB9XG4gIH1cblxuICB2YWx1ZU9mKCkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgXCJbXCIgK1xuICAgICAgdGhpcy5jdXJ2ZXNcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoY3VydmUpIHtcbiAgICAgICAgICByZXR1cm4gdXRpbHMucG9pbnRzVG9TdHJpbmcoY3VydmUucG9pbnRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oXCIsIFwiKSArXG4gICAgICBcIl1cIlxuICAgICk7XG4gIH1cblxuICBhZGRDdXJ2ZShjdXJ2ZSkge1xuICAgIHRoaXMuY3VydmVzLnB1c2goY3VydmUpO1xuICAgIHRoaXMuXzNkID0gdGhpcy5fM2QgfHwgY3VydmUuXzNkO1xuICB9XG5cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnZlc1xuICAgICAgLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gdi5sZW5ndGgoKTtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgIH0pO1xuICB9XG5cbiAgY3VydmUoaWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuY3VydmVzW2lkeF07XG4gIH1cblxuICBiYm94KCkge1xuICAgIGNvbnN0IGMgPSB0aGlzLmN1cnZlcztcbiAgICB2YXIgYmJveCA9IGNbMF0uYmJveCgpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgdXRpbHMuZXhwYW5kYm94KGJib3gsIGNbaV0uYmJveCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJib3g7XG4gIH1cblxuICBvZmZzZXQoZCkge1xuICAgIGNvbnN0IG9mZnNldCA9IFtdO1xuICAgIHRoaXMuY3VydmVzLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgIG9mZnNldC5wdXNoKC4uLnYub2Zmc2V0KGQpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IFBvbHlCZXppZXIob2Zmc2V0KTtcbiAgfVxufVxuXG5leHBvcnQgeyBQb2x5QmV6aWVyIH07XG4iLCJpbXBvcnQgeyBCZXppZXIgfSBmcm9tIFwiLi9iZXppZXIuanNcIjtcblxuLy8gbWF0aC1pbmxpbmluZy5cbmNvbnN0IHsgYWJzLCBjb3MsIHNpbiwgYWNvcywgYXRhbjIsIHNxcnQsIHBvdyB9ID0gTWF0aDtcblxuLy8gY3ViZSByb290IGZ1bmN0aW9uIHlpZWxkaW5nIHJlYWwgcm9vdHNcbmZ1bmN0aW9uIGNydCh2KSB7XG4gIHJldHVybiB2IDwgMCA/IC1wb3coLXYsIDEgLyAzKSA6IHBvdyh2LCAxIC8gMyk7XG59XG5cbi8vIHRyaWcgY29uc3RhbnRzXG5jb25zdCBwaSA9IE1hdGguUEksXG4gIHRhdSA9IDIgKiBwaSxcbiAgcXVhcnQgPSBwaSAvIDIsXG4gIC8vIGZsb2F0IHByZWNpc2lvbiBzaWduaWZpY2FudCBkZWNpbWFsXG4gIGVwc2lsb24gPSAwLjAwMDAwMSxcbiAgLy8gZXh0cmVtYXMgdXNlZCBpbiBiYm94IGNhbGN1bGF0aW9uIGFuZCBzaW1pbGFyIGFsZ29yaXRobXNcbiAgbk1heCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSIHx8IDkwMDcxOTkyNTQ3NDA5OTEsXG4gIG5NaW4gPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUiB8fCAtOTAwNzE5OTI1NDc0MDk5MSxcbiAgLy8gYSB6ZXJvIGNvb3JkaW5hdGUsIHdoaWNoIGlzIHN1cnByaXNpbmdseSB1c2VmdWxcbiAgWkVSTyA9IHsgeDogMCwgeTogMCwgejogMCB9O1xuXG4vLyBCZXppZXIgdXRpbGl0eSBmdW5jdGlvbnNcbmNvbnN0IHV0aWxzID0ge1xuICAvLyBMZWdlbmRyZS1HYXVzcyBhYnNjaXNzYWUgd2l0aCBuPTI0ICh4X2kgdmFsdWVzLCBkZWZpbmVkIGF0IGk9biBhcyB0aGUgcm9vdHMgb2YgdGhlIG50aCBvcmRlciBMZWdlbmRyZSBwb2x5bm9taWFsIFBuKHgpKVxuICBUdmFsdWVzOiBbXG4gICAgLTAuMDY0MDU2ODkyODYyNjA1NjI2MDg1MDQzMDgyNjI0NzQ1MDM4NTkwOSxcbiAgICAwLjA2NDA1Njg5Mjg2MjYwNTYyNjA4NTA0MzA4MjYyNDc0NTAzODU5MDksXG4gICAgLTAuMTkxMTE4ODY3NDczNjE2MzA5MTU4NjM5ODIwNzU3MDY5NjMxODQwNCxcbiAgICAwLjE5MTExODg2NzQ3MzYxNjMwOTE1ODYzOTgyMDc1NzA2OTYzMTg0MDQsXG4gICAgLTAuMzE1MDQyNjc5Njk2MTYzMzc0Mzg2NzkzMjkxMzE5ODEwMjQwNzg2NCxcbiAgICAwLjMxNTA0MjY3OTY5NjE2MzM3NDM4Njc5MzI5MTMxOTgxMDI0MDc4NjQsXG4gICAgLTAuNDMzNzkzNTA3NjI2MDQ1MTM4NDg3MDg0MjMxOTEzMzQ5NzEyNDUyNCxcbiAgICAwLjQzMzc5MzUwNzYyNjA0NTEzODQ4NzA4NDIzMTkxMzM0OTcxMjQ1MjQsXG4gICAgLTAuNTQ1NDIxNDcxMzg4ODM5NTM1NjU4Mzc1NjE3MjE4MzcyMzcwMDEwNyxcbiAgICAwLjU0NTQyMTQ3MTM4ODgzOTUzNTY1ODM3NTYxNzIxODM3MjM3MDAxMDcsXG4gICAgLTAuNjQ4MDkzNjUxOTM2OTc1NTY5MjUyNDk1Nzg2OTEwNzQ3NjI2NjY5NixcbiAgICAwLjY0ODA5MzY1MTkzNjk3NTU2OTI1MjQ5NTc4NjkxMDc0NzYyNjY2OTYsXG4gICAgLTAuNzQwMTI0MTkxNTc4NTU0MzY0MjQzODI4MTAzMDk5OTc4NDI1NTIzMixcbiAgICAwLjc0MDEyNDE5MTU3ODU1NDM2NDI0MzgyODEwMzA5OTk3ODQyNTUyMzIsXG4gICAgLTAuODIwMDAxOTg1OTczOTAyOTIxOTUzOTQ5ODcyNjY5NzQ1MjA4MDc2MSxcbiAgICAwLjgyMDAwMTk4NTk3MzkwMjkyMTk1Mzk0OTg3MjY2OTc0NTIwODA3NjEsXG4gICAgLTAuODg2NDE1NTI3MDA0NDAxMDM0MjEzMTU0MzQxOTgyMTk2NzU1MDg3MyxcbiAgICAwLjg4NjQxNTUyNzAwNDQwMTAzNDIxMzE1NDM0MTk4MjE5Njc1NTA4NzMsXG4gICAgLTAuOTM4Mjc0NTUyMDAyNzMyNzU4NTIzNjQ5MDAxNzA4NzIxNDQ5NjU0OCxcbiAgICAwLjkzODI3NDU1MjAwMjczMjc1ODUyMzY0OTAwMTcwODcyMTQ0OTY1NDgsXG4gICAgLTAuOTc0NzI4NTU1OTcxMzA5NDk4MTk4MzkxOTkzMDA4MTY5MDYxNzQxMSxcbiAgICAwLjk3NDcyODU1NTk3MTMwOTQ5ODE5ODM5MTk5MzAwODE2OTA2MTc0MTEsXG4gICAgLTAuOTk1MTg3MjE5OTk3MDIxMzYwMTc5OTk3NDA5NzAwNzM2ODExODc0NSxcbiAgICAwLjk5NTE4NzIxOTk5NzAyMTM2MDE3OTk5NzQwOTcwMDczNjgxMTg3NDUsXG4gIF0sXG5cbiAgLy8gTGVnZW5kcmUtR2F1c3Mgd2VpZ2h0cyB3aXRoIG49MjQgKHdfaSB2YWx1ZXMsIGRlZmluZWQgYnkgYSBmdW5jdGlvbiBsaW5rZWQgdG8gaW4gdGhlIEJlemllciBwcmltZXIgYXJ0aWNsZSlcbiAgQ3ZhbHVlczogW1xuICAgIDAuMTI3OTM4MTk1MzQ2NzUyMTU2OTc0MDU2MTY1MjI0Njk1MzcxODUxNyxcbiAgICAwLjEyNzkzODE5NTM0Njc1MjE1Njk3NDA1NjE2NTIyNDY5NTM3MTg1MTcsXG4gICAgMC4xMjU4Mzc0NTYzNDY4MjgyOTYxMjEzNzUzODI1MTExODM2ODg3MjY0LFxuICAgIDAuMTI1ODM3NDU2MzQ2ODI4Mjk2MTIxMzc1MzgyNTExMTgzNjg4NzI2NCxcbiAgICAwLjEyMTY3MDQ3MjkyNzgwMzM5MTIwNDQ2MzE1MzQ3NjI2MjQyNTYwNyxcbiAgICAwLjEyMTY3MDQ3MjkyNzgwMzM5MTIwNDQ2MzE1MzQ3NjI2MjQyNTYwNyxcbiAgICAwLjExNTUwNTY2ODA1MzcyNTYwMTM1MzM0NDQ4MzkwNjc4MzU1OTg2MjIsXG4gICAgMC4xMTU1MDU2NjgwNTM3MjU2MDEzNTMzNDQ0ODM5MDY3ODM1NTk4NjIyLFxuICAgIDAuMTA3NDQ0MjcwMTE1OTY1NjM0NzgyNTc3MzQyNDQ2NjA2MjIyNzk0NixcbiAgICAwLjEwNzQ0NDI3MDExNTk2NTYzNDc4MjU3NzM0MjQ0NjYwNjIyMjc5NDYsXG4gICAgMC4wOTc2MTg2NTIxMDQxMTM4ODgyNjk4ODA2NjQ0NjQyNDcxNTQ0Mjc5LFxuICAgIDAuMDk3NjE4NjUyMTA0MTEzODg4MjY5ODgwNjY0NDY0MjQ3MTU0NDI3OSxcbiAgICAwLjA4NjE5MDE2MTUzMTk1MzI3NTkxNzE4NTIwMjk4Mzc0MjY2NzE4NSxcbiAgICAwLjA4NjE5MDE2MTUzMTk1MzI3NTkxNzE4NTIwMjk4Mzc0MjY2NzE4NSxcbiAgICAwLjA3MzM0NjQ4MTQxMTA4MDMwNTczNDAzMzYxNTI1MzExNjUxODExOTMsXG4gICAgMC4wNzMzNDY0ODE0MTEwODAzMDU3MzQwMzM2MTUyNTMxMTY1MTgxMTkzLFxuICAgIDAuMDU5Mjk4NTg0OTE1NDM2NzgwNzQ2MzY3NzU4NTAwMTA4NTg0NTQxMixcbiAgICAwLjA1OTI5ODU4NDkxNTQzNjc4MDc0NjM2Nzc1ODUwMDEwODU4NDU0MTIsXG4gICAgMC4wNDQyNzc0Mzg4MTc0MTk4MDYxNjg2MDI3NDgyMTEzMzgyMjg4NTkzLFxuICAgIDAuMDQ0Mjc3NDM4ODE3NDE5ODA2MTY4NjAyNzQ4MjExMzM4MjI4ODU5MyxcbiAgICAwLjAyODUzMTM4ODYyODkzMzY2MzE4MTMwNzgxNTk1MTg3ODI4NjQ0OTEsXG4gICAgMC4wMjg1MzEzODg2Mjg5MzM2NjMxODEzMDc4MTU5NTE4NzgyODY0NDkxLFxuICAgIDAuMDEyMzQxMjI5Nzk5OTg3MTk5NTQ2ODA1NjY3MDcwMDM3MjkxNTc1OSxcbiAgICAwLjAxMjM0MTIyOTc5OTk4NzE5OTU0NjgwNTY2NzA3MDAzNzI5MTU3NTksXG4gIF0sXG5cbiAgYXJjZm46IGZ1bmN0aW9uICh0LCBkZXJpdmF0aXZlRm4pIHtcbiAgICBjb25zdCBkID0gZGVyaXZhdGl2ZUZuKHQpO1xuICAgIGxldCBsID0gZC54ICogZC54ICsgZC55ICogZC55O1xuICAgIGlmICh0eXBlb2YgZC56ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBsICs9IGQueiAqIGQuejtcbiAgICB9XG4gICAgcmV0dXJuIHNxcnQobCk7XG4gIH0sXG5cbiAgY29tcHV0ZTogZnVuY3Rpb24gKHQsIHBvaW50cywgXzNkKSB7XG4gICAgLy8gc2hvcnRjdXRzXG4gICAgaWYgKHQgPT09IDApIHtcbiAgICAgIHBvaW50c1swXS50ID0gMDtcbiAgICAgIHJldHVybiBwb2ludHNbMF07XG4gICAgfVxuXG4gICAgY29uc3Qgb3JkZXIgPSBwb2ludHMubGVuZ3RoIC0gMTtcblxuICAgIGlmICh0ID09PSAxKSB7XG4gICAgICBwb2ludHNbb3JkZXJdLnQgPSAxO1xuICAgICAgcmV0dXJuIHBvaW50c1tvcmRlcl07XG4gICAgfVxuXG4gICAgY29uc3QgbXQgPSAxIC0gdDtcbiAgICBsZXQgcCA9IHBvaW50cztcblxuICAgIC8vIGNvbnN0YW50P1xuICAgIGlmIChvcmRlciA9PT0gMCkge1xuICAgICAgcG9pbnRzWzBdLnQgPSB0O1xuICAgICAgcmV0dXJuIHBvaW50c1swXTtcbiAgICB9XG5cbiAgICAvLyBsaW5lYXI/XG4gICAgaWYgKG9yZGVyID09PSAxKSB7XG4gICAgICBjb25zdCByZXQgPSB7XG4gICAgICAgIHg6IG10ICogcFswXS54ICsgdCAqIHBbMV0ueCxcbiAgICAgICAgeTogbXQgKiBwWzBdLnkgKyB0ICogcFsxXS55LFxuICAgICAgICB0OiB0LFxuICAgICAgfTtcbiAgICAgIGlmIChfM2QpIHtcbiAgICAgICAgcmV0LnogPSBtdCAqIHBbMF0ueiArIHQgKiBwWzFdLno7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8vIHF1YWRyYXRpYy9jdWJpYyBjdXJ2ZT9cbiAgICBpZiAob3JkZXIgPCA0KSB7XG4gICAgICBsZXQgbXQyID0gbXQgKiBtdCxcbiAgICAgICAgdDIgPSB0ICogdCxcbiAgICAgICAgYSxcbiAgICAgICAgYixcbiAgICAgICAgYyxcbiAgICAgICAgZCA9IDA7XG4gICAgICBpZiAob3JkZXIgPT09IDIpIHtcbiAgICAgICAgcCA9IFtwWzBdLCBwWzFdLCBwWzJdLCBaRVJPXTtcbiAgICAgICAgYSA9IG10MjtcbiAgICAgICAgYiA9IG10ICogdCAqIDI7XG4gICAgICAgIGMgPSB0MjtcbiAgICAgIH0gZWxzZSBpZiAob3JkZXIgPT09IDMpIHtcbiAgICAgICAgYSA9IG10MiAqIG10O1xuICAgICAgICBiID0gbXQyICogdCAqIDM7XG4gICAgICAgIGMgPSBtdCAqIHQyICogMztcbiAgICAgICAgZCA9IHQgKiB0MjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJldCA9IHtcbiAgICAgICAgeDogYSAqIHBbMF0ueCArIGIgKiBwWzFdLnggKyBjICogcFsyXS54ICsgZCAqIHBbM10ueCxcbiAgICAgICAgeTogYSAqIHBbMF0ueSArIGIgKiBwWzFdLnkgKyBjICogcFsyXS55ICsgZCAqIHBbM10ueSxcbiAgICAgICAgdDogdCxcbiAgICAgIH07XG4gICAgICBpZiAoXzNkKSB7XG4gICAgICAgIHJldC56ID0gYSAqIHBbMF0ueiArIGIgKiBwWzFdLnogKyBjICogcFsyXS56ICsgZCAqIHBbM10uejtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLy8gaGlnaGVyIG9yZGVyIGN1cnZlczogdXNlIGRlIENhc3RlbGphdSdzIGNvbXB1dGF0aW9uXG4gICAgY29uc3QgZENwdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBvaW50cykpO1xuICAgIHdoaWxlIChkQ3B0cy5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRDcHRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICBkQ3B0c1tpXSA9IHtcbiAgICAgICAgICB4OiBkQ3B0c1tpXS54ICsgKGRDcHRzW2kgKyAxXS54IC0gZENwdHNbaV0ueCkgKiB0LFxuICAgICAgICAgIHk6IGRDcHRzW2ldLnkgKyAoZENwdHNbaSArIDFdLnkgLSBkQ3B0c1tpXS55KSAqIHQsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2YgZENwdHNbaV0ueiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGRDcHRzW2ldID0gZENwdHNbaV0ueiArIChkQ3B0c1tpICsgMV0ueiAtIGRDcHRzW2ldLnopICogdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZENwdHMuc3BsaWNlKGRDcHRzLmxlbmd0aCAtIDEsIDEpO1xuICAgIH1cbiAgICBkQ3B0c1swXS50ID0gdDtcbiAgICByZXR1cm4gZENwdHNbMF07XG4gIH0sXG5cbiAgY29tcHV0ZVdpdGhSYXRpb3M6IGZ1bmN0aW9uICh0LCBwb2ludHMsIHJhdGlvcywgXzNkKSB7XG4gICAgY29uc3QgbXQgPSAxIC0gdCxcbiAgICAgIHIgPSByYXRpb3MsXG4gICAgICBwID0gcG9pbnRzO1xuXG4gICAgbGV0IGYxID0gclswXSxcbiAgICAgIGYyID0gclsxXSxcbiAgICAgIGYzID0gclsyXSxcbiAgICAgIGY0ID0gclszXSxcbiAgICAgIGQ7XG5cbiAgICAvLyBzcGVjIGZvciBsaW5lYXJcbiAgICBmMSAqPSBtdDtcbiAgICBmMiAqPSB0O1xuXG4gICAgaWYgKHAubGVuZ3RoID09PSAyKSB7XG4gICAgICBkID0gZjEgKyBmMjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IChmMSAqIHBbMF0ueCArIGYyICogcFsxXS54KSAvIGQsXG4gICAgICAgIHk6IChmMSAqIHBbMF0ueSArIGYyICogcFsxXS55KSAvIGQsXG4gICAgICAgIHo6ICFfM2QgPyBmYWxzZSA6IChmMSAqIHBbMF0ueiArIGYyICogcFsxXS56KSAvIGQsXG4gICAgICAgIHQ6IHQsXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHVwZ3JhZGUgdG8gcXVhZHJhdGljXG4gICAgZjEgKj0gbXQ7XG4gICAgZjIgKj0gMiAqIG10O1xuICAgIGYzICo9IHQgKiB0O1xuXG4gICAgaWYgKHAubGVuZ3RoID09PSAzKSB7XG4gICAgICBkID0gZjEgKyBmMiArIGYzO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogKGYxICogcFswXS54ICsgZjIgKiBwWzFdLnggKyBmMyAqIHBbMl0ueCkgLyBkLFxuICAgICAgICB5OiAoZjEgKiBwWzBdLnkgKyBmMiAqIHBbMV0ueSArIGYzICogcFsyXS55KSAvIGQsXG4gICAgICAgIHo6ICFfM2QgPyBmYWxzZSA6IChmMSAqIHBbMF0ueiArIGYyICogcFsxXS56ICsgZjMgKiBwWzJdLnopIC8gZCxcbiAgICAgICAgdDogdCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gdXBncmFkZSB0byBjdWJpY1xuICAgIGYxICo9IG10O1xuICAgIGYyICo9IDEuNSAqIG10O1xuICAgIGYzICo9IDMgKiBtdDtcbiAgICBmNCAqPSB0ICogdCAqIHQ7XG5cbiAgICBpZiAocC5sZW5ndGggPT09IDQpIHtcbiAgICAgIGQgPSBmMSArIGYyICsgZjMgKyBmNDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IChmMSAqIHBbMF0ueCArIGYyICogcFsxXS54ICsgZjMgKiBwWzJdLnggKyBmNCAqIHBbM10ueCkgLyBkLFxuICAgICAgICB5OiAoZjEgKiBwWzBdLnkgKyBmMiAqIHBbMV0ueSArIGYzICogcFsyXS55ICsgZjQgKiBwWzNdLnkpIC8gZCxcbiAgICAgICAgejogIV8zZFxuICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICA6IChmMSAqIHBbMF0ueiArIGYyICogcFsxXS56ICsgZjMgKiBwWzJdLnogKyBmNCAqIHBbM10ueikgLyBkLFxuICAgICAgICB0OiB0LFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlOiBmdW5jdGlvbiAocG9pbnRzLCBfM2QpIHtcbiAgICBjb25zdCBkcG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgcCA9IHBvaW50cywgZCA9IHAubGVuZ3RoLCBjID0gZCAtIDE7IGQgPiAxOyBkLS0sIGMtLSkge1xuICAgICAgY29uc3QgbGlzdCA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDAsIGRwdDsgaiA8IGM7IGorKykge1xuICAgICAgICBkcHQgPSB7XG4gICAgICAgICAgeDogYyAqIChwW2ogKyAxXS54IC0gcFtqXS54KSxcbiAgICAgICAgICB5OiBjICogKHBbaiArIDFdLnkgLSBwW2pdLnkpLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoXzNkKSB7XG4gICAgICAgICAgZHB0LnogPSBjICogKHBbaiArIDFdLnogLSBwW2pdLnopO1xuICAgICAgICB9XG4gICAgICAgIGxpc3QucHVzaChkcHQpO1xuICAgICAgfVxuICAgICAgZHBvaW50cy5wdXNoKGxpc3QpO1xuICAgICAgcCA9IGxpc3Q7XG4gICAgfVxuICAgIHJldHVybiBkcG9pbnRzO1xuICB9LFxuXG4gIGJldHdlZW46IGZ1bmN0aW9uICh2LCBtLCBNKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIChtIDw9IHYgJiYgdiA8PSBNKSB8fFxuICAgICAgdXRpbHMuYXBwcm94aW1hdGVseSh2LCBtKSB8fFxuICAgICAgdXRpbHMuYXBwcm94aW1hdGVseSh2LCBNKVxuICAgICk7XG4gIH0sXG5cbiAgYXBwcm94aW1hdGVseTogZnVuY3Rpb24gKGEsIGIsIHByZWNpc2lvbikge1xuICAgIHJldHVybiBhYnMoYSAtIGIpIDw9IChwcmVjaXNpb24gfHwgZXBzaWxvbik7XG4gIH0sXG5cbiAgbGVuZ3RoOiBmdW5jdGlvbiAoZGVyaXZhdGl2ZUZuKSB7XG4gICAgY29uc3QgeiA9IDAuNSxcbiAgICAgIGxlbiA9IHV0aWxzLlR2YWx1ZXMubGVuZ3RoO1xuXG4gICAgbGV0IHN1bSA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgdDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0ID0geiAqIHV0aWxzLlR2YWx1ZXNbaV0gKyB6O1xuICAgICAgc3VtICs9IHV0aWxzLkN2YWx1ZXNbaV0gKiB1dGlscy5hcmNmbih0LCBkZXJpdmF0aXZlRm4pO1xuICAgIH1cbiAgICByZXR1cm4geiAqIHN1bTtcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uICh2LCBkcywgZGUsIHRzLCB0ZSkge1xuICAgIGNvbnN0IGQxID0gZGUgLSBkcyxcbiAgICAgIGQyID0gdGUgLSB0cyxcbiAgICAgIHYyID0gdiAtIGRzLFxuICAgICAgciA9IHYyIC8gZDE7XG4gICAgcmV0dXJuIHRzICsgZDIgKiByO1xuICB9LFxuXG4gIGxlcnA6IGZ1bmN0aW9uIChyLCB2MSwgdjIpIHtcbiAgICBjb25zdCByZXQgPSB7XG4gICAgICB4OiB2MS54ICsgciAqICh2Mi54IC0gdjEueCksXG4gICAgICB5OiB2MS55ICsgciAqICh2Mi55IC0gdjEueSksXG4gICAgfTtcbiAgICBpZiAodjEueiAhPT0gdW5kZWZpbmVkICYmIHYyLnogIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0LnogPSB2MS56ICsgciAqICh2Mi56IC0gdjEueik7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgcG9pbnRUb1N0cmluZzogZnVuY3Rpb24gKHApIHtcbiAgICBsZXQgcyA9IHAueCArIFwiL1wiICsgcC55O1xuICAgIGlmICh0eXBlb2YgcC56ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBzICs9IFwiL1wiICsgcC56O1xuICAgIH1cbiAgICByZXR1cm4gcztcbiAgfSxcblxuICBwb2ludHNUb1N0cmluZzogZnVuY3Rpb24gKHBvaW50cykge1xuICAgIHJldHVybiBcIltcIiArIHBvaW50cy5tYXAodXRpbHMucG9pbnRUb1N0cmluZykuam9pbihcIiwgXCIpICsgXCJdXCI7XG4gIH0sXG5cbiAgY29weTogZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9LFxuXG4gIGFuZ2xlOiBmdW5jdGlvbiAobywgdjEsIHYyKSB7XG4gICAgY29uc3QgZHgxID0gdjEueCAtIG8ueCxcbiAgICAgIGR5MSA9IHYxLnkgLSBvLnksXG4gICAgICBkeDIgPSB2Mi54IC0gby54LFxuICAgICAgZHkyID0gdjIueSAtIG8ueSxcbiAgICAgIGNyb3NzID0gZHgxICogZHkyIC0gZHkxICogZHgyLFxuICAgICAgZG90ID0gZHgxICogZHgyICsgZHkxICogZHkyO1xuICAgIHJldHVybiBhdGFuMihjcm9zcywgZG90KTtcbiAgfSxcblxuICAvLyByb3VuZCBhcyBzdHJpbmcsIHRvIGF2b2lkIHJvdW5kaW5nIGVycm9yc1xuICByb3VuZDogZnVuY3Rpb24gKHYsIGQpIHtcbiAgICBjb25zdCBzID0gXCJcIiArIHY7XG4gICAgY29uc3QgcG9zID0gcy5pbmRleE9mKFwiLlwiKTtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChzLnN1YnN0cmluZygwLCBwb3MgKyAxICsgZCkpO1xuICB9LFxuXG4gIGRpc3Q6IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICBjb25zdCBkeCA9IHAxLnggLSBwMi54LFxuICAgICAgZHkgPSBwMS55IC0gcDIueTtcbiAgICByZXR1cm4gc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIH0sXG5cbiAgY2xvc2VzdDogZnVuY3Rpb24gKExVVCwgcG9pbnQpIHtcbiAgICBsZXQgbWRpc3QgPSBwb3coMiwgNjMpLFxuICAgICAgbXBvcyxcbiAgICAgIGQ7XG4gICAgTFVULmZvckVhY2goZnVuY3Rpb24gKHAsIGlkeCkge1xuICAgICAgZCA9IHV0aWxzLmRpc3QocG9pbnQsIHApO1xuICAgICAgaWYgKGQgPCBtZGlzdCkge1xuICAgICAgICBtZGlzdCA9IGQ7XG4gICAgICAgIG1wb3MgPSBpZHg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHsgbWRpc3Q6IG1kaXN0LCBtcG9zOiBtcG9zIH07XG4gIH0sXG5cbiAgYWJjcmF0aW86IGZ1bmN0aW9uICh0LCBuKSB7XG4gICAgLy8gc2VlIHJhdGlvKHQpIG5vdGUgb24gaHR0cDovL3BvbWF4LmdpdGh1Yi5pby9iZXppZXJpbmZvLyNhYmNcbiAgICBpZiAobiAhPT0gMiAmJiBuICE9PSAzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdCA9IDAuNTtcbiAgICB9IGVsc2UgaWYgKHQgPT09IDAgfHwgdCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuICAgIGNvbnN0IGJvdHRvbSA9IHBvdyh0LCBuKSArIHBvdygxIC0gdCwgbiksXG4gICAgICB0b3AgPSBib3R0b20gLSAxO1xuICAgIHJldHVybiBhYnModG9wIC8gYm90dG9tKTtcbiAgfSxcblxuICBwcm9qZWN0aW9ucmF0aW86IGZ1bmN0aW9uICh0LCBuKSB7XG4gICAgLy8gc2VlIHUodCkgbm90ZSBvbiBodHRwOi8vcG9tYXguZ2l0aHViLmlvL2JlemllcmluZm8vI2FiY1xuICAgIGlmIChuICE9PSAyICYmIG4gIT09IDMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0ID0gMC41O1xuICAgIH0gZWxzZSBpZiAodCA9PT0gMCB8fCB0ID09PSAxKSB7XG4gICAgICByZXR1cm4gdDtcbiAgICB9XG4gICAgY29uc3QgdG9wID0gcG93KDEgLSB0LCBuKSxcbiAgICAgIGJvdHRvbSA9IHBvdyh0LCBuKSArIHRvcDtcbiAgICByZXR1cm4gdG9wIC8gYm90dG9tO1xuICB9LFxuXG4gIGxsaTg6IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQpIHtcbiAgICBjb25zdCBueCA9XG4gICAgICAgICh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpLFxuICAgICAgbnkgPSAoeDEgKiB5MiAtIHkxICogeDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzICogeTQgLSB5MyAqIHg0KSxcbiAgICAgIGQgPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XG4gICAgaWYgKGQgPT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4geyB4OiBueCAvIGQsIHk6IG55IC8gZCB9O1xuICB9LFxuXG4gIGxsaTQ6IGZ1bmN0aW9uIChwMSwgcDIsIHAzLCBwNCkge1xuICAgIGNvbnN0IHgxID0gcDEueCxcbiAgICAgIHkxID0gcDEueSxcbiAgICAgIHgyID0gcDIueCxcbiAgICAgIHkyID0gcDIueSxcbiAgICAgIHgzID0gcDMueCxcbiAgICAgIHkzID0gcDMueSxcbiAgICAgIHg0ID0gcDQueCxcbiAgICAgIHk0ID0gcDQueTtcbiAgICByZXR1cm4gdXRpbHMubGxpOCh4MSwgeTEsIHgyLCB5MiwgeDMsIHkzLCB4NCwgeTQpO1xuICB9LFxuXG4gIGxsaTogZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiB1dGlscy5sbGk0KHYxLCB2MS5jLCB2MiwgdjIuYyk7XG4gIH0sXG5cbiAgbWFrZWxpbmU6IGZ1bmN0aW9uIChwMSwgcDIpIHtcbiAgICByZXR1cm4gbmV3IEJlemllcihcbiAgICAgIHAxLngsXG4gICAgICBwMS55LFxuICAgICAgKHAxLnggKyBwMi54KSAvIDIsXG4gICAgICAocDEueSArIHAyLnkpIC8gMixcbiAgICAgIHAyLngsXG4gICAgICBwMi55XG4gICAgKTtcbiAgfSxcblxuICBmaW5kYmJveDogZnVuY3Rpb24gKHNlY3Rpb25zKSB7XG4gICAgbGV0IG14ID0gbk1heCxcbiAgICAgIG15ID0gbk1heCxcbiAgICAgIE1YID0gbk1pbixcbiAgICAgIE1ZID0gbk1pbjtcbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICBjb25zdCBiYm94ID0gcy5iYm94KCk7XG4gICAgICBpZiAobXggPiBiYm94LngubWluKSBteCA9IGJib3gueC5taW47XG4gICAgICBpZiAobXkgPiBiYm94LnkubWluKSBteSA9IGJib3gueS5taW47XG4gICAgICBpZiAoTVggPCBiYm94LngubWF4KSBNWCA9IGJib3gueC5tYXg7XG4gICAgICBpZiAoTVkgPCBiYm94LnkubWF4KSBNWSA9IGJib3gueS5tYXg7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHsgbWluOiBteCwgbWlkOiAobXggKyBNWCkgLyAyLCBtYXg6IE1YLCBzaXplOiBNWCAtIG14IH0sXG4gICAgICB5OiB7IG1pbjogbXksIG1pZDogKG15ICsgTVkpIC8gMiwgbWF4OiBNWSwgc2l6ZTogTVkgLSBteSB9LFxuICAgIH07XG4gIH0sXG5cbiAgc2hhcGVpbnRlcnNlY3Rpb25zOiBmdW5jdGlvbiAoXG4gICAgczEsXG4gICAgYmJveDEsXG4gICAgczIsXG4gICAgYmJveDIsXG4gICAgY3VydmVJbnRlcnNlY3Rpb25UaHJlc2hvbGRcbiAgKSB7XG4gICAgaWYgKCF1dGlscy5iYm94b3ZlcmxhcChiYm94MSwgYmJveDIpKSByZXR1cm4gW107XG4gICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGExID0gW3MxLnN0YXJ0Y2FwLCBzMS5mb3J3YXJkLCBzMS5iYWNrLCBzMS5lbmRjYXBdO1xuICAgIGNvbnN0IGEyID0gW3MyLnN0YXJ0Y2FwLCBzMi5mb3J3YXJkLCBzMi5iYWNrLCBzMi5lbmRjYXBdO1xuICAgIGExLmZvckVhY2goZnVuY3Rpb24gKGwxKSB7XG4gICAgICBpZiAobDEudmlydHVhbCkgcmV0dXJuO1xuICAgICAgYTIuZm9yRWFjaChmdW5jdGlvbiAobDIpIHtcbiAgICAgICAgaWYgKGwyLnZpcnR1YWwpIHJldHVybjtcbiAgICAgICAgY29uc3QgaXNzID0gbDEuaW50ZXJzZWN0cyhsMiwgY3VydmVJbnRlcnNlY3Rpb25UaHJlc2hvbGQpO1xuICAgICAgICBpZiAoaXNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpc3MuYzEgPSBsMTtcbiAgICAgICAgICBpc3MuYzIgPSBsMjtcbiAgICAgICAgICBpc3MuczEgPSBzMTtcbiAgICAgICAgICBpc3MuczIgPSBzMjtcbiAgICAgICAgICBpbnRlcnNlY3Rpb25zLnB1c2goaXNzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIH0sXG5cbiAgbWFrZXNoYXBlOiBmdW5jdGlvbiAoZm9yd2FyZCwgYmFjaywgY3VydmVJbnRlcnNlY3Rpb25UaHJlc2hvbGQpIHtcbiAgICBjb25zdCBicGwgPSBiYWNrLnBvaW50cy5sZW5ndGg7XG4gICAgY29uc3QgZnBsID0gZm9yd2FyZC5wb2ludHMubGVuZ3RoO1xuICAgIGNvbnN0IHN0YXJ0ID0gdXRpbHMubWFrZWxpbmUoYmFjay5wb2ludHNbYnBsIC0gMV0sIGZvcndhcmQucG9pbnRzWzBdKTtcbiAgICBjb25zdCBlbmQgPSB1dGlscy5tYWtlbGluZShmb3J3YXJkLnBvaW50c1tmcGwgLSAxXSwgYmFjay5wb2ludHNbMF0pO1xuICAgIGNvbnN0IHNoYXBlID0ge1xuICAgICAgc3RhcnRjYXA6IHN0YXJ0LFxuICAgICAgZm9yd2FyZDogZm9yd2FyZCxcbiAgICAgIGJhY2s6IGJhY2ssXG4gICAgICBlbmRjYXA6IGVuZCxcbiAgICAgIGJib3g6IHV0aWxzLmZpbmRiYm94KFtzdGFydCwgZm9yd2FyZCwgYmFjaywgZW5kXSksXG4gICAgfTtcbiAgICBzaGFwZS5pbnRlcnNlY3Rpb25zID0gZnVuY3Rpb24gKHMyKSB7XG4gICAgICByZXR1cm4gdXRpbHMuc2hhcGVpbnRlcnNlY3Rpb25zKFxuICAgICAgICBzaGFwZSxcbiAgICAgICAgc2hhcGUuYmJveCxcbiAgICAgICAgczIsXG4gICAgICAgIHMyLmJib3gsXG4gICAgICAgIGN1cnZlSW50ZXJzZWN0aW9uVGhyZXNob2xkXG4gICAgICApO1xuICAgIH07XG4gICAgcmV0dXJuIHNoYXBlO1xuICB9LFxuXG4gIGdldG1pbm1heDogZnVuY3Rpb24gKGN1cnZlLCBkLCBsaXN0KSB7XG4gICAgaWYgKCFsaXN0KSByZXR1cm4geyBtaW46IDAsIG1heDogMCB9O1xuICAgIGxldCBtaW4gPSBuTWF4LFxuICAgICAgbWF4ID0gbk1pbixcbiAgICAgIHQsXG4gICAgICBjO1xuICAgIGlmIChsaXN0LmluZGV4T2YoMCkgPT09IC0xKSB7XG4gICAgICBsaXN0ID0gWzBdLmNvbmNhdChsaXN0KTtcbiAgICB9XG4gICAgaWYgKGxpc3QuaW5kZXhPZigxKSA9PT0gLTEpIHtcbiAgICAgIGxpc3QucHVzaCgxKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHQgPSBsaXN0W2ldO1xuICAgICAgYyA9IGN1cnZlLmdldCh0KTtcbiAgICAgIGlmIChjW2RdIDwgbWluKSB7XG4gICAgICAgIG1pbiA9IGNbZF07XG4gICAgICB9XG4gICAgICBpZiAoY1tkXSA+IG1heCkge1xuICAgICAgICBtYXggPSBjW2RdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBtaW46IG1pbiwgbWlkOiAobWluICsgbWF4KSAvIDIsIG1heDogbWF4LCBzaXplOiBtYXggLSBtaW4gfTtcbiAgfSxcblxuICBhbGlnbjogZnVuY3Rpb24gKHBvaW50cywgbGluZSkge1xuICAgIGNvbnN0IHR4ID0gbGluZS5wMS54LFxuICAgICAgdHkgPSBsaW5lLnAxLnksXG4gICAgICBhID0gLWF0YW4yKGxpbmUucDIueSAtIHR5LCBsaW5lLnAyLnggLSB0eCksXG4gICAgICBkID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiAodi54IC0gdHgpICogY29zKGEpIC0gKHYueSAtIHR5KSAqIHNpbihhKSxcbiAgICAgICAgICB5OiAodi54IC0gdHgpICogc2luKGEpICsgKHYueSAtIHR5KSAqIGNvcyhhKSxcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgcmV0dXJuIHBvaW50cy5tYXAoZCk7XG4gIH0sXG5cbiAgcm9vdHM6IGZ1bmN0aW9uIChwb2ludHMsIGxpbmUpIHtcbiAgICBsaW5lID0gbGluZSB8fCB7IHAxOiB7IHg6IDAsIHk6IDAgfSwgcDI6IHsgeDogMSwgeTogMCB9IH07XG5cbiAgICBjb25zdCBvcmRlciA9IHBvaW50cy5sZW5ndGggLSAxO1xuICAgIGNvbnN0IGFsaWduZWQgPSB1dGlscy5hbGlnbihwb2ludHMsIGxpbmUpO1xuICAgIGNvbnN0IHJlZHVjZSA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gMCA8PSB0ICYmIHQgPD0gMTtcbiAgICB9O1xuXG4gICAgaWYgKG9yZGVyID09PSAyKSB7XG4gICAgICBjb25zdCBhID0gYWxpZ25lZFswXS55LFxuICAgICAgICBiID0gYWxpZ25lZFsxXS55LFxuICAgICAgICBjID0gYWxpZ25lZFsyXS55LFxuICAgICAgICBkID0gYSAtIDIgKiBiICsgYztcbiAgICAgIGlmIChkICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IG0xID0gLXNxcnQoYiAqIGIgLSBhICogYyksXG4gICAgICAgICAgbTIgPSAtYSArIGIsXG4gICAgICAgICAgdjEgPSAtKG0xICsgbTIpIC8gZCxcbiAgICAgICAgICB2MiA9IC0oLW0xICsgbTIpIC8gZDtcbiAgICAgICAgcmV0dXJuIFt2MSwgdjJdLmZpbHRlcihyZWR1Y2UpO1xuICAgICAgfSBlbHNlIGlmIChiICE9PSBjICYmIGQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFsoMiAqIGIgLSBjKSAvICgyICogYiAtIDIgKiBjKV0uZmlsdGVyKHJlZHVjZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gc2VlIGh0dHA6Ly93d3cudHJhbnM0bWluZC5jb20vcGVyc29uYWxfZGV2ZWxvcG1lbnQvbWF0aGVtYXRpY3MvcG9seW5vbWlhbHMvY3ViaWNBbGdlYnJhLmh0bVxuICAgIGNvbnN0IHBhID0gYWxpZ25lZFswXS55LFxuICAgICAgcGIgPSBhbGlnbmVkWzFdLnksXG4gICAgICBwYyA9IGFsaWduZWRbMl0ueSxcbiAgICAgIHBkID0gYWxpZ25lZFszXS55O1xuXG4gICAgbGV0IGQgPSAtcGEgKyAzICogcGIgLSAzICogcGMgKyBwZCxcbiAgICAgIGEgPSAzICogcGEgLSA2ICogcGIgKyAzICogcGMsXG4gICAgICBiID0gLTMgKiBwYSArIDMgKiBwYixcbiAgICAgIGMgPSBwYTtcblxuICAgIGlmICh1dGlscy5hcHByb3hpbWF0ZWx5KGQsIDApKSB7XG4gICAgICAvLyB0aGlzIGlzIG5vdCBhIGN1YmljIGN1cnZlLlxuICAgICAgaWYgKHV0aWxzLmFwcHJveGltYXRlbHkoYSwgMCkpIHtcbiAgICAgICAgLy8gaW4gZmFjdCwgdGhpcyBpcyBub3QgYSBxdWFkcmF0aWMgY3VydmUgZWl0aGVyLlxuICAgICAgICBpZiAodXRpbHMuYXBwcm94aW1hdGVseShiLCAwKSkge1xuICAgICAgICAgIC8vIGluIGZhY3QgaW4gZmFjdCwgdGhlcmUgYXJlIG5vIHNvbHV0aW9ucy5cbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgLy8gbGluZWFyIHNvbHV0aW9uOlxuICAgICAgICByZXR1cm4gWy1jIC8gYl0uZmlsdGVyKHJlZHVjZSk7XG4gICAgICB9XG4gICAgICAvLyBxdWFkcmF0aWMgc29sdXRpb246XG4gICAgICBjb25zdCBxID0gc3FydChiICogYiAtIDQgKiBhICogYyksXG4gICAgICAgIGEyID0gMiAqIGE7XG4gICAgICByZXR1cm4gWyhxIC0gYikgLyBhMiwgKC1iIC0gcSkgLyBhMl0uZmlsdGVyKHJlZHVjZSk7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgd2Uga25vdyB3ZSBuZWVkIGEgY3ViaWMgc29sdXRpb246XG5cbiAgICBhIC89IGQ7XG4gICAgYiAvPSBkO1xuICAgIGMgLz0gZDtcblxuICAgIGNvbnN0IHAgPSAoMyAqIGIgLSBhICogYSkgLyAzLFxuICAgICAgcDMgPSBwIC8gMyxcbiAgICAgIHEgPSAoMiAqIGEgKiBhICogYSAtIDkgKiBhICogYiArIDI3ICogYykgLyAyNyxcbiAgICAgIHEyID0gcSAvIDIsXG4gICAgICBkaXNjcmltaW5hbnQgPSBxMiAqIHEyICsgcDMgKiBwMyAqIHAzO1xuXG4gICAgbGV0IHUxLCB2MSwgeDEsIHgyLCB4MztcbiAgICBpZiAoZGlzY3JpbWluYW50IDwgMCkge1xuICAgICAgY29uc3QgbXAzID0gLXAgLyAzLFxuICAgICAgICBtcDMzID0gbXAzICogbXAzICogbXAzLFxuICAgICAgICByID0gc3FydChtcDMzKSxcbiAgICAgICAgdCA9IC1xIC8gKDIgKiByKSxcbiAgICAgICAgY29zcGhpID0gdCA8IC0xID8gLTEgOiB0ID4gMSA/IDEgOiB0LFxuICAgICAgICBwaGkgPSBhY29zKGNvc3BoaSksXG4gICAgICAgIGNydHIgPSBjcnQociksXG4gICAgICAgIHQxID0gMiAqIGNydHI7XG4gICAgICB4MSA9IHQxICogY29zKHBoaSAvIDMpIC0gYSAvIDM7XG4gICAgICB4MiA9IHQxICogY29zKChwaGkgKyB0YXUpIC8gMykgLSBhIC8gMztcbiAgICAgIHgzID0gdDEgKiBjb3MoKHBoaSArIDIgKiB0YXUpIC8gMykgLSBhIC8gMztcbiAgICAgIHJldHVybiBbeDEsIHgyLCB4M10uZmlsdGVyKHJlZHVjZSk7XG4gICAgfSBlbHNlIGlmIChkaXNjcmltaW5hbnQgPT09IDApIHtcbiAgICAgIHUxID0gcTIgPCAwID8gY3J0KC1xMikgOiAtY3J0KHEyKTtcbiAgICAgIHgxID0gMiAqIHUxIC0gYSAvIDM7XG4gICAgICB4MiA9IC11MSAtIGEgLyAzO1xuICAgICAgcmV0dXJuIFt4MSwgeDJdLmZpbHRlcihyZWR1Y2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZCA9IHNxcnQoZGlzY3JpbWluYW50KTtcbiAgICAgIHUxID0gY3J0KC1xMiArIHNkKTtcbiAgICAgIHYxID0gY3J0KHEyICsgc2QpO1xuICAgICAgcmV0dXJuIFt1MSAtIHYxIC0gYSAvIDNdLmZpbHRlcihyZWR1Y2UpO1xuICAgIH1cbiAgfSxcblxuICBkcm9vdHM6IGZ1bmN0aW9uIChwKSB7XG4gICAgLy8gcXVhZHJhdGljIHJvb3RzIGFyZSBlYXN5XG4gICAgaWYgKHAubGVuZ3RoID09PSAzKSB7XG4gICAgICBjb25zdCBhID0gcFswXSxcbiAgICAgICAgYiA9IHBbMV0sXG4gICAgICAgIGMgPSBwWzJdLFxuICAgICAgICBkID0gYSAtIDIgKiBiICsgYztcbiAgICAgIGlmIChkICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IG0xID0gLXNxcnQoYiAqIGIgLSBhICogYyksXG4gICAgICAgICAgbTIgPSAtYSArIGIsXG4gICAgICAgICAgdjEgPSAtKG0xICsgbTIpIC8gZCxcbiAgICAgICAgICB2MiA9IC0oLW0xICsgbTIpIC8gZDtcbiAgICAgICAgcmV0dXJuIFt2MSwgdjJdO1xuICAgICAgfSBlbHNlIGlmIChiICE9PSBjICYmIGQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFsoMiAqIGIgLSBjKSAvICgyICogKGIgLSBjKSldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8vIGxpbmVhciByb290cyBhcmUgZXZlbiBlYXNpZXJcbiAgICBpZiAocC5sZW5ndGggPT09IDIpIHtcbiAgICAgIGNvbnN0IGEgPSBwWzBdLFxuICAgICAgICBiID0gcFsxXTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIHJldHVybiBbYSAvIChhIC0gYildO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfSxcblxuICBjdXJ2YXR1cmU6IGZ1bmN0aW9uICh0LCBkMSwgZDIsIF8zZCwga09ubHkpIHtcbiAgICBsZXQgbnVtLFxuICAgICAgZG5tLFxuICAgICAgYWRrLFxuICAgICAgZGssXG4gICAgICBrID0gMCxcbiAgICAgIHIgPSAwO1xuXG4gICAgLy9cbiAgICAvLyBXZSdyZSB1c2luZyB0aGUgZm9sbG93aW5nIGZvcm11bGEgZm9yIGN1cnZhdHVyZTpcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICB4J3lcIiAtIHkneFwiXG4gICAgLy8gICBrKHQpID0gLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gICAgICAgICAgICh4J8KyICsgeSfCsileKDMvMilcbiAgICAvL1xuICAgIC8vIGZyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUmFkaXVzX29mX2N1cnZhdHVyZSNEZWZpbml0aW9uXG4gICAgLy9cbiAgICAvLyBXaXRoIGl0IGNvcnJlc3BvbmRpbmcgM0QgY291bnRlcnBhcnQ6XG4gICAgLy9cbiAgICAvLyAgICAgICAgICBzcXJ0KCAoeSd6XCIgLSB5XCJ6JynCsiArICh6J3hcIiAtIHpcIngnKcKyICsgKHgneVwiIC0geFwieScpwrIpXG4gICAgLy8gICBrKHQpID0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgKHgnwrIgKyB5J8KyICsgeifCsileKDMvMilcbiAgICAvL1xuXG4gICAgY29uc3QgZCA9IHV0aWxzLmNvbXB1dGUodCwgZDEpO1xuICAgIGNvbnN0IGRkID0gdXRpbHMuY29tcHV0ZSh0LCBkMik7XG4gICAgY29uc3QgcWRzdW0gPSBkLnggKiBkLnggKyBkLnkgKiBkLnk7XG5cbiAgICBpZiAoXzNkKSB7XG4gICAgICBudW0gPSBzcXJ0KFxuICAgICAgICBwb3coZC55ICogZGQueiAtIGRkLnkgKiBkLnosIDIpICtcbiAgICAgICAgICBwb3coZC56ICogZGQueCAtIGRkLnogKiBkLngsIDIpICtcbiAgICAgICAgICBwb3coZC54ICogZGQueSAtIGRkLnggKiBkLnksIDIpXG4gICAgICApO1xuICAgICAgZG5tID0gcG93KHFkc3VtICsgZC56ICogZC56LCAzIC8gMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG51bSA9IGQueCAqIGRkLnkgLSBkLnkgKiBkZC54O1xuICAgICAgZG5tID0gcG93KHFkc3VtLCAzIC8gMik7XG4gICAgfVxuXG4gICAgaWYgKG51bSA9PT0gMCB8fCBkbm0gPT09IDApIHtcbiAgICAgIHJldHVybiB7IGs6IDAsIHI6IDAgfTtcbiAgICB9XG5cbiAgICBrID0gbnVtIC8gZG5tO1xuICAgIHIgPSBkbm0gLyBudW07XG5cbiAgICAvLyBXZSdyZSBhbHNvIGNvbXB1dGluZyB0aGUgZGVyaXZhdGl2ZSBvZiBrYXBwYSwgYmVjYXVzZVxuICAgIC8vIHRoZXJlIGlzIHZhbHVlIGluIGtub3dpbmcgdGhlIHJhdGUgb2YgY2hhbmdlIGZvciB0aGVcbiAgICAvLyBjdXJ2YXR1cmUgYWxvbmcgdGhlIGN1cnZlLiBBbmQgd2UncmUganVzdCBnb2luZyB0b1xuICAgIC8vIGJhbGxwYXJrIGl0IGJhc2VkIG9uIGFuIGVwc2lsb24uXG4gICAgaWYgKCFrT25seSkge1xuICAgICAgLy8gY29tcHV0ZSBrJyh0KSBiYXNlZCBvbiB0aGUgaW50ZXJ2YWwgYmVmb3JlLCBhbmQgYWZ0ZXIgaXQsXG4gICAgICAvLyB0byBhdCBsZWFzdCB0cnkgdG8gbm90IGludHJvZHVjZSBmb3J3YXJkL2JhY2t3YXJkIHBhc3MgYmlhcy5cbiAgICAgIGNvbnN0IHBrID0gdXRpbHMuY3VydmF0dXJlKHQgLSAwLjAwMSwgZDEsIGQyLCBfM2QsIHRydWUpLms7XG4gICAgICBjb25zdCBuayA9IHV0aWxzLmN1cnZhdHVyZSh0ICsgMC4wMDEsIGQxLCBkMiwgXzNkLCB0cnVlKS5rO1xuICAgICAgZGsgPSAobmsgLSBrICsgKGsgLSBwaykpIC8gMjtcbiAgICAgIGFkayA9IChhYnMobmsgLSBrKSArIGFicyhrIC0gcGspKSAvIDI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgazogaywgcjogciwgZGs6IGRrLCBhZGs6IGFkayB9O1xuICB9LFxuXG4gIGluZmxlY3Rpb25zOiBmdW5jdGlvbiAocG9pbnRzKSB7XG4gICAgaWYgKHBvaW50cy5sZW5ndGggPCA0KSByZXR1cm4gW107XG5cbiAgICAvLyBGSVhNRTogVE9ETzogYWRkIGluIGluZmxlY3Rpb24gYWJzdHJhY3Rpb24gZm9yIHF1YXJ0aWMrIGN1cnZlcz9cblxuICAgIGNvbnN0IHAgPSB1dGlscy5hbGlnbihwb2ludHMsIHsgcDE6IHBvaW50c1swXSwgcDI6IHBvaW50cy5zbGljZSgtMSlbMF0gfSksXG4gICAgICBhID0gcFsyXS54ICogcFsxXS55LFxuICAgICAgYiA9IHBbM10ueCAqIHBbMV0ueSxcbiAgICAgIGMgPSBwWzFdLnggKiBwWzJdLnksXG4gICAgICBkID0gcFszXS54ICogcFsyXS55LFxuICAgICAgdjEgPSAxOCAqICgtMyAqIGEgKyAyICogYiArIDMgKiBjIC0gZCksXG4gICAgICB2MiA9IDE4ICogKDMgKiBhIC0gYiAtIDMgKiBjKSxcbiAgICAgIHYzID0gMTggKiAoYyAtIGEpO1xuXG4gICAgaWYgKHV0aWxzLmFwcHJveGltYXRlbHkodjEsIDApKSB7XG4gICAgICBpZiAoIXV0aWxzLmFwcHJveGltYXRlbHkodjIsIDApKSB7XG4gICAgICAgIGxldCB0ID0gLXYzIC8gdjI7XG4gICAgICAgIGlmICgwIDw9IHQgJiYgdCA8PSAxKSByZXR1cm4gW3RdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGQyID0gMiAqIHYxO1xuXG4gICAgaWYgKHV0aWxzLmFwcHJveGltYXRlbHkoZDIsIDApKSByZXR1cm4gW107XG5cbiAgICBjb25zdCB0cm0gPSB2MiAqIHYyIC0gNCAqIHYxICogdjM7XG5cbiAgICBpZiAodHJtIDwgMCkgcmV0dXJuIFtdO1xuXG4gICAgY29uc3Qgc3EgPSBNYXRoLnNxcnQodHJtKTtcblxuICAgIHJldHVybiBbKHNxIC0gdjIpIC8gZDIsIC0odjIgKyBzcSkgLyBkMl0uZmlsdGVyKGZ1bmN0aW9uIChyKSB7XG4gICAgICByZXR1cm4gMCA8PSByICYmIHIgPD0gMTtcbiAgICB9KTtcbiAgfSxcblxuICBiYm94b3ZlcmxhcDogZnVuY3Rpb24gKGIxLCBiMikge1xuICAgIGNvbnN0IGRpbXMgPSBbXCJ4XCIsIFwieVwiXSxcbiAgICAgIGxlbiA9IGRpbXMubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGRpbSwgbCwgdCwgZDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBkaW0gPSBkaW1zW2ldO1xuICAgICAgbCA9IGIxW2RpbV0ubWlkO1xuICAgICAgdCA9IGIyW2RpbV0ubWlkO1xuICAgICAgZCA9IChiMVtkaW1dLnNpemUgKyBiMltkaW1dLnNpemUpIC8gMjtcbiAgICAgIGlmIChhYnMobCAtIHQpID49IGQpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZXhwYW5kYm94OiBmdW5jdGlvbiAoYmJveCwgX2Jib3gpIHtcbiAgICBpZiAoX2Jib3gueC5taW4gPCBiYm94LngubWluKSB7XG4gICAgICBiYm94LngubWluID0gX2Jib3gueC5taW47XG4gICAgfVxuICAgIGlmIChfYmJveC55Lm1pbiA8IGJib3gueS5taW4pIHtcbiAgICAgIGJib3gueS5taW4gPSBfYmJveC55Lm1pbjtcbiAgICB9XG4gICAgaWYgKF9iYm94LnogJiYgX2Jib3guei5taW4gPCBiYm94LnoubWluKSB7XG4gICAgICBiYm94LnoubWluID0gX2Jib3guei5taW47XG4gICAgfVxuICAgIGlmIChfYmJveC54Lm1heCA+IGJib3gueC5tYXgpIHtcbiAgICAgIGJib3gueC5tYXggPSBfYmJveC54Lm1heDtcbiAgICB9XG4gICAgaWYgKF9iYm94LnkubWF4ID4gYmJveC55Lm1heCkge1xuICAgICAgYmJveC55Lm1heCA9IF9iYm94LnkubWF4O1xuICAgIH1cbiAgICBpZiAoX2Jib3gueiAmJiBfYmJveC56Lm1heCA+IGJib3guei5tYXgpIHtcbiAgICAgIGJib3guei5tYXggPSBfYmJveC56Lm1heDtcbiAgICB9XG4gICAgYmJveC54Lm1pZCA9IChiYm94LngubWluICsgYmJveC54Lm1heCkgLyAyO1xuICAgIGJib3gueS5taWQgPSAoYmJveC55Lm1pbiArIGJib3gueS5tYXgpIC8gMjtcbiAgICBpZiAoYmJveC56KSB7XG4gICAgICBiYm94LnoubWlkID0gKGJib3guei5taW4gKyBiYm94LnoubWF4KSAvIDI7XG4gICAgfVxuICAgIGJib3gueC5zaXplID0gYmJveC54Lm1heCAtIGJib3gueC5taW47XG4gICAgYmJveC55LnNpemUgPSBiYm94LnkubWF4IC0gYmJveC55Lm1pbjtcbiAgICBpZiAoYmJveC56KSB7XG4gICAgICBiYm94Lnouc2l6ZSA9IGJib3guei5tYXggLSBiYm94LnoubWluO1xuICAgIH1cbiAgfSxcblxuICBwYWlyaXRlcmF0aW9uOiBmdW5jdGlvbiAoYzEsIGMyLCBjdXJ2ZUludGVyc2VjdGlvblRocmVzaG9sZCkge1xuICAgIGNvbnN0IGMxYiA9IGMxLmJib3goKSxcbiAgICAgIGMyYiA9IGMyLmJib3goKSxcbiAgICAgIHIgPSAxMDAwMDAsXG4gICAgICB0aHJlc2hvbGQgPSBjdXJ2ZUludGVyc2VjdGlvblRocmVzaG9sZCB8fCAwLjU7XG5cbiAgICBpZiAoXG4gICAgICBjMWIueC5zaXplICsgYzFiLnkuc2l6ZSA8IHRocmVzaG9sZCAmJlxuICAgICAgYzJiLnguc2l6ZSArIGMyYi55LnNpemUgPCB0aHJlc2hvbGRcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICgoKHIgKiAoYzEuX3QxICsgYzEuX3QyKSkgLyAyKSB8IDApIC8gciArXG4gICAgICAgICAgXCIvXCIgK1xuICAgICAgICAgICgoKHIgKiAoYzIuX3QxICsgYzIuX3QyKSkgLyAyKSB8IDApIC8gcixcbiAgICAgIF07XG4gICAgfVxuXG4gICAgbGV0IGNjMSA9IGMxLnNwbGl0KDAuNSksXG4gICAgICBjYzIgPSBjMi5zcGxpdCgwLjUpLFxuICAgICAgcGFpcnMgPSBbXG4gICAgICAgIHsgbGVmdDogY2MxLmxlZnQsIHJpZ2h0OiBjYzIubGVmdCB9LFxuICAgICAgICB7IGxlZnQ6IGNjMS5sZWZ0LCByaWdodDogY2MyLnJpZ2h0IH0sXG4gICAgICAgIHsgbGVmdDogY2MxLnJpZ2h0LCByaWdodDogY2MyLnJpZ2h0IH0sXG4gICAgICAgIHsgbGVmdDogY2MxLnJpZ2h0LCByaWdodDogY2MyLmxlZnQgfSxcbiAgICAgIF07XG5cbiAgICBwYWlycyA9IHBhaXJzLmZpbHRlcihmdW5jdGlvbiAocGFpcikge1xuICAgICAgcmV0dXJuIHV0aWxzLmJib3hvdmVybGFwKHBhaXIubGVmdC5iYm94KCksIHBhaXIucmlnaHQuYmJveCgpKTtcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHRzID0gW107XG5cbiAgICBpZiAocGFpcnMubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzdWx0cztcblxuICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24gKHBhaXIpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChcbiAgICAgICAgdXRpbHMucGFpcml0ZXJhdGlvbihwYWlyLmxlZnQsIHBhaXIucmlnaHQsIHRocmVzaG9sZClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgIHJldHVybiByZXN1bHRzLmluZGV4T2YodikgPT09IGk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSxcblxuICBnZXRjY2VudGVyOiBmdW5jdGlvbiAocDEsIHAyLCBwMykge1xuICAgIGNvbnN0IGR4MSA9IHAyLnggLSBwMS54LFxuICAgICAgZHkxID0gcDIueSAtIHAxLnksXG4gICAgICBkeDIgPSBwMy54IC0gcDIueCxcbiAgICAgIGR5MiA9IHAzLnkgLSBwMi55LFxuICAgICAgZHgxcCA9IGR4MSAqIGNvcyhxdWFydCkgLSBkeTEgKiBzaW4ocXVhcnQpLFxuICAgICAgZHkxcCA9IGR4MSAqIHNpbihxdWFydCkgKyBkeTEgKiBjb3MocXVhcnQpLFxuICAgICAgZHgycCA9IGR4MiAqIGNvcyhxdWFydCkgLSBkeTIgKiBzaW4ocXVhcnQpLFxuICAgICAgZHkycCA9IGR4MiAqIHNpbihxdWFydCkgKyBkeTIgKiBjb3MocXVhcnQpLFxuICAgICAgLy8gY2hvcmQgbWlkcG9pbnRzXG4gICAgICBteDEgPSAocDEueCArIHAyLngpIC8gMixcbiAgICAgIG15MSA9IChwMS55ICsgcDIueSkgLyAyLFxuICAgICAgbXgyID0gKHAyLnggKyBwMy54KSAvIDIsXG4gICAgICBteTIgPSAocDIueSArIHAzLnkpIC8gMixcbiAgICAgIC8vIG1pZHBvaW50IG9mZnNldHNcbiAgICAgIG14MW4gPSBteDEgKyBkeDFwLFxuICAgICAgbXkxbiA9IG15MSArIGR5MXAsXG4gICAgICBteDJuID0gbXgyICsgZHgycCxcbiAgICAgIG15Mm4gPSBteTIgKyBkeTJwLFxuICAgICAgLy8gaW50ZXJzZWN0aW9uIG9mIHRoZXNlIGxpbmVzOlxuICAgICAgYXJjID0gdXRpbHMubGxpOChteDEsIG15MSwgbXgxbiwgbXkxbiwgbXgyLCBteTIsIG14Mm4sIG15Mm4pLFxuICAgICAgciA9IHV0aWxzLmRpc3QoYXJjLCBwMSk7XG5cbiAgICAvLyBhcmMgc3RhcnQvZW5kIHZhbHVlcywgb3ZlciBtaWQgcG9pbnQ6XG4gICAgbGV0IHMgPSBhdGFuMihwMS55IC0gYXJjLnksIHAxLnggLSBhcmMueCksXG4gICAgICBtID0gYXRhbjIocDIueSAtIGFyYy55LCBwMi54IC0gYXJjLngpLFxuICAgICAgZSA9IGF0YW4yKHAzLnkgLSBhcmMueSwgcDMueCAtIGFyYy54KSxcbiAgICAgIF87XG5cbiAgICAvLyBkZXRlcm1pbmUgYXJjIGRpcmVjdGlvbiAoY3cvY2N3IGNvcnJlY3Rpb24pXG4gICAgaWYgKHMgPCBlKSB7XG4gICAgICAvLyBpZiBzPG08ZSwgYXJjKHMsIGUpXG4gICAgICAvLyBpZiBtPHM8ZSwgYXJjKGUsIHMgKyB0YXUpXG4gICAgICAvLyBpZiBzPGU8bSwgYXJjKGUsIHMgKyB0YXUpXG4gICAgICBpZiAocyA+IG0gfHwgbSA+IGUpIHtcbiAgICAgICAgcyArPSB0YXU7XG4gICAgICB9XG4gICAgICBpZiAocyA+IGUpIHtcbiAgICAgICAgXyA9IGU7XG4gICAgICAgIGUgPSBzO1xuICAgICAgICBzID0gXztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgZTxtPHMsIGFyYyhlLCBzKVxuICAgICAgLy8gaWYgbTxlPHMsIGFyYyhzLCBlICsgdGF1KVxuICAgICAgLy8gaWYgZTxzPG0sIGFyYyhzLCBlICsgdGF1KVxuICAgICAgaWYgKGUgPCBtICYmIG0gPCBzKSB7XG4gICAgICAgIF8gPSBlO1xuICAgICAgICBlID0gcztcbiAgICAgICAgcyA9IF87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlICs9IHRhdTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYXNzaWduIGFuZCBkb25lLlxuICAgIGFyYy5zID0gcztcbiAgICBhcmMuZSA9IGU7XG4gICAgYXJjLnIgPSByO1xuICAgIHJldHVybiBhcmM7XG4gIH0sXG5cbiAgbnVtYmVyU29ydDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYSAtIGI7XG4gIH0sXG59O1xuXG5leHBvcnQgeyB1dGlscyB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbi8qXHJcbiAgICBzb3VyY2UgY29kZSBmb3IgXCJ0byBwYXRoXCIsIGEgcGx1Z2luIGZvciBmaWdtYVxyXG4gICAgY3JlYXRlcjogbGFzdCBuaWdodFxyXG4gICAgd2Vic2l0ZTogbm90c2ltb24uc3BhY2VcclxuICAgIHZlcnNpb246IGltIGJhYnlcclxuICAgIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2NvZGVsYXN0bmlnaHQvdG8tcGF0aC1maWdtYVxyXG5cclxuICAgIGRpc2NsYWltZXI6XHJcbiAgICBpIGRvbnQga25vdyBob3cgdG8gY29kZVxyXG4qL1xyXG5pbXBvcnQgKiBhcyBjdXJ2ZSBmcm9tICcuL3RzL2N1cnZlJztcclxuaW1wb3J0ICogYXMgcGxhY2UgZnJvbSAnLi90cy9wbGFjZSc7XHJcbmltcG9ydCAqIGFzIGhlbHBlciBmcm9tICcuL3RzL2hlbHBlcic7XHJcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuL3RzL3NlbGVjdGlvbic7XHJcbi8qKlxyXG4gKiBjaGVja3MgaWYgdGhlIGNvZGUgaXMgaW5pdGlhbGx5IHJ1biBhZnRlciBhbiBvYmplY3QgaXMgc2VsZWN0ZWQuXHJcbiAqL1xyXG5sZXQgZmlyc3RSZW5kZXIgPSB0cnVlO1xyXG4vKipcclxuICogY3VycmVudCBzZWxlY3Rpb24gc3RvcmVkIHNvIGl0cyBhY2Nlc3NpYmxlIGxhdGVyXHJcbiAqL1xyXG5sZXQgU2VsZWN0aW9uTm9kZXMgPSBbXTtcclxuLyoqXHJcbiAqIG1haW4gY29kZVxyXG4gKiAqIGFzeW5jIHJlcXVpcmVkIGJlY2F1c2UgZmlnbWEgYXBpIHJlcXVpcmVzIHlvdSB0byBsb2FkIGZvbnRzIGludG8gdGhlIHBsdWdpbiB0byB1c2UgdGhlbS4uLlxyXG4gKiBob25lc3RseSBpbSByZWFsbHkgdGVtcHRlZCB0byBqdXN0IGhhcmRjb2RlIGEgZHVtYiBmb250IGxpa2Ugc3dhbmt5IGFuZCBtb28gbW9vIGluc3RlYWRcclxuICogQHBhcmFtIGdyb3VwXHJcbiAqIEBwYXJhbSBkYXRhXHJcbiAqL1xyXG5jb25zdCBtYWluID0gKGdyb3VwLCBkYXRhKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgIC8vIHNlbGVjdCB0aGUgY3VydmVcclxuICAgIC8vIHRha2UgdGhlIHN2ZyBkYXRhIG9mIHRoZSBjdXJ2ZSBhbmQgdHVybiBpdCBpbnRvIGFuIGFycmF5IG9mIHBvaW50c1xyXG4gICAgLy9pZGsgaWYgaSBzaG91bGQgc3RvcmUgdGhpcyBvciBub3QuIGl0cyBwcmV0dHkgZmFzdCB0byBjYWxjdWxhdGUgc28uLi4uXHJcbiAgICBjb25zdCBwb2ludEFyciA9IGN1cnZlLmFsbFBvaW50cyhkYXRhLmN1cnZlLnZlY3RvclBhdGhzWzBdLmRhdGEsIGRhdGEuc2V0dGluZyk7XHJcbiAgICAvLyBsb2FkIGFsbCBmb250cyBpbiBzZWxlY3RlZCBvYmplY3QgaWYgZ3JvdXAgb3IgZnJhbWUgb3IgdGV4dCAgXHJcbiAgICBpZiAoZGF0YS5vdGhlci50eXBlID09PSAnVEVYVCcgfHwgZGF0YS5vdGhlci50eXBlID09PSAnRlJBTUUnIHx8IGRhdGEub3RoZXIudHlwZSA9PT0gJ0dST1VQJykge1xyXG4gICAgICAgIGlmIChmaXJzdFJlbmRlcikge1xyXG4gICAgICAgICAgICBsZXQgdGV4dG5vZGUgPSBkYXRhLm90aGVyLnR5cGUgPT09ICdURVhUJyA/IFtkYXRhLm90aGVyXSA6IGRhdGEub3RoZXIuZmluZEFsbChlID0+IGUudHlwZSA9PT0gJ1RFWFQnKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBmaW5kIG9mIHRleHRub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbmQuY2hhcmFjdGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZmluZC5nZXRSYW5nZUZvbnROYW1lKGksIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmQuaGFzTWlzc2luZ0ZvbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oJ1RleHQgY29udGFpbnMgYSBtaXNzaW5nIGZvbnQsIHBsZWFzZSBpbnN0YWxsIHRoZSBmb250IGZpcnN0IScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBsYWNlLmRlbGV0ZU5vZGVpbkdyb3VwKGdyb3VwLCBkYXRhLmN1cnZlQ2xvbmVJRCk7XHJcbiAgICBkYXRhLm90aGVyLnR5cGUgPT09ICdURVhUJyA/IHBsYWNlLnRleHQyQ3VydmUoZGF0YS5vdGhlciwgcG9pbnRBcnIsIGRhdGEsIGdyb3VwKSA6IHBsYWNlLm9iamVjdDJDdXJ2ZShkYXRhLm90aGVyLCBwb2ludEFyciwgZGF0YSwgZ3JvdXApO1xyXG4gICAgaGVscGVyLnNldExpbmsoZ3JvdXAsIGRhdGEpO1xyXG4gICAgcmV0dXJuO1xyXG59KTtcclxuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXHJcbi8vIGNhbGxiYWNrLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBwYXNzZWQgdGhlIFwicGx1Z2luTWVzc2FnZVwiIHByb3BlcnR5IG9mIHRoZVxyXG4vLyBwb3N0ZWQgbWVzc2FnZS5cclxuZmlnbWEudWkub24oJ21lc3NhZ2UnLCAobXNnKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2RvLXRoZS10aGluZycpIHtcclxuICAgICAgICBsZXQgZ3JvdXA7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBJZCA9IFNlbGVjdGlvbk5vZGVzWzBdLmdldFBsdWdpbkRhdGEoXCJsaW5rZWRJRFwiKTtcclxuICAgICAgICBpZiAoZ3JvdXBJZCkge1xyXG4gICAgICAgICAgICBncm91cCA9IGZpZ21hLmdldE5vZGVCeUlkKGdyb3VwSWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZ3JvdXAgPSBTZWxlY3Rpb25Ob2Rlcy5maW5kKGkgPT4gaS50eXBlID09PSBcIkdST1VQXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGF0YSA9IGhlbHBlci5pc0xpbmtlZChncm91cCk7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZGF0YS5zZXR0aW5nID0gbXNnLm9wdGlvbnM7XHJcbiAgICAgICAgICAgIHlpZWxkIG1haW4oZ3JvdXAsIGRhdGEpO1xyXG4gICAgICAgICAgICBncm91cC5zZXRSZWxhdW5jaERhdGEoeyByZWxhdW5jaDogJ0VkaXQgd2l0aCBUbyBQYXRoJyB9KTtcclxuICAgICAgICAgICAgZmlyc3RSZW5kZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvbi5zZW5kKCdsaW5rbG9zdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGluaXRpYWwgcnVuIHdoZW4gXCJsaW5rXCIgYnV0dG9uIGlzIGhpdFxyXG4gICAgaWYgKG1zZy50eXBlID09PSAnaW5pdGlhbC1saW5rJykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBzZWxlY3Rpb24uZGVjaWRlKFNlbGVjdGlvbk5vZGVzLCBtc2cub3B0aW9ucyk7XHJcbiAgICAgICAgLy9yZW5hbWUgcGF0aHNcclxuICAgICAgICBkYXRhLm90aGVyLm5hbWUgPSBcIltMaW5rZWRdIFwiICsgZGF0YS5vdGhlci5uYW1lLnJlcGxhY2UoXCJbTGlua2VkXSBcIiwgJycpO1xyXG4gICAgICAgIGRhdGEuY3VydmUubmFtZSA9IFwiW0xpbmtlZF0gXCIgKyBkYXRhLmN1cnZlLm5hbWUucmVwbGFjZSgnW0xpbmtlZF0gJywgJycpO1xyXG4gICAgICAgIC8vY2xvbmUgY3VydmUgU2VsZWN0aW9uIHRvIHJldGFpbiBjdXJ2ZSBzaGFwZVxyXG4gICAgICAgIGNvbnN0IGNsb25lMiA9IGRhdGEuY3VydmU7XHJcbiAgICAgICAgZGF0YS5jdXJ2ZUNsb25lSUQgPSBjbG9uZTIuaWQ7XHJcbiAgICAgICAgZGF0YS5jdXJ2ZS5wYXJlbnQuYXBwZW5kQ2hpbGQoY2xvbmUyKTtcclxuICAgICAgICAvLyBtYWtlIGEgbmV3IGdyb3VwIFxyXG4gICAgICAgIGxldCBncm91cCA9IGZpZ21hLmdyb3VwKFtjbG9uZTJdLCBkYXRhLmN1cnZlLnBhcmVudCk7XHJcbiAgICAgICAgZ3JvdXAubmFtZSA9IFwiTGlua2VkIFBhdGggR3JvdXBcIjtcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbZ3JvdXBdO1xyXG4gICAgICAgIC8vIGxpbmsgY3VzdG9tIGRhdGFcclxuICAgICAgICBoZWxwZXIuc2V0TGluayhncm91cCwgZGF0YSk7XHJcbiAgICAgICAgZGF0YS5jdXJ2ZS5zZXRQbHVnaW5EYXRhKFwibGlua2VkSURcIiwgZ3JvdXAuaWQpO1xyXG4gICAgICAgIGRhdGEub3RoZXIuc2V0UGx1Z2luRGF0YShcImxpbmtlZElEXCIsIGdyb3VwLmlkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhEYXRlLm5vdygpKTtcclxuICAgICAgICB5aWVsZCBtYWluKGdyb3VwLCBkYXRhKTtcclxuICAgICAgICBncm91cC5zZXRSZWxhdW5jaERhdGEoeyByZWxhdW5jaDogJ0VkaXQgd2l0aCBUbyBQYXRoJyB9KTtcclxuICAgICAgICBmaXJzdFJlbmRlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gTWFrZSBzdXJlIHRvIGNsb3NlIHRoZSBwbHVnaW4gd2hlbiB5b3UncmUgZG9uZS4gT3RoZXJ3aXNlIHRoZSBwbHVnaW4gd2lsbFxyXG4gICAgLy8ga2VlcCBydW5uaW5nLCB3aGljaCBzaG93cyB0aGUgY2FuY2VsIGJ1dHRvbiBhdCB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAvLyB3aGF0IGlmIGkgZG9udCB3YW5uYSBsbWFvXHJcbn0pKTtcclxuLy93YXRjaGVzIGZvciBzZWxlY2l0aW9uIGNoYW5nZSBhbmQgbm90aWZpZXMgVUlcclxuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcclxuICAgIFNlbGVjdGlvbk5vZGVzID0gc2VsZWN0aW9uLm9uQ2hhbmdlKCk7XHJcbiAgICBpZiAoIWZpcnN0UmVuZGVyKVxyXG4gICAgICAgIGZpcnN0UmVuZGVyID0gdHJ1ZTtcclxufSk7XHJcbmZpZ21hLm9uKCdjbG9zZScsICgpID0+IHtcclxuICAgIHNlbGVjdGlvbi5zZXRQbHVnaW5DbG9zZSh0cnVlKTtcclxufSk7XHJcbi8vIHJ1biB0aGluZ3MgaW5pdGlhbGx5XHJcbi8vIFRoaXMgc2hvd3MgdGhlIEhUTUwgcGFnZSBpbiBcInVpLmh0bWxcIi5cclxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAyODAsIGhlaWdodDogNDgwIH0pO1xyXG4vL2NoZWNrcyBmb3IgaW5pdGlhbCBTZWxlY3Rpb25cclxuU2VsZWN0aW9uTm9kZXMgPSBzZWxlY3Rpb24ub25DaGFuZ2UoKTtcclxuLy8gcnVuIHRpbWVyd2F0Y2ggd2hlbiBwbHVnaW4gc3RhcnRzXHJcbnNlbGVjdGlvbi50aW1lcldhdGNoKCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
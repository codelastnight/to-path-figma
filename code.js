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
var pointBtwn = function (a, b, t) {
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
    //find distance between
    const dist = distBtwn(a, b);
    //find the unit  vector between points a and b
    // not really unit vector in the math sense tho
    const unitVector = [(b[0] - a[0]) / 100, (b[1] - a[1]) / 100];
    return [a[0] + unitVector[0] * t, a[1] + unitVector[1] * t];
};
//calculate De Casteljau’s algorithm from 2-4 points  https://javascript.info/bezier-curve
// basically turns 4 points on a beizer into a curve
function pointOnCurve(curve, time = 100, rotation = false) {
    /*
  curve [point1, point2, point3, point4]
     - each point: [x,y]
  */
    var casteljau = function (curve, t, time, rotation = false) {
        let arr = [];
        for (var c = 0; c < curve.length - 1; c++) {
            const dist = distBtwn(curve[c], curve[c + 1]);
            let point = pointBtwn(curve[c], curve[c + 1], t);
            if (rotation) {
                //figma wants this number to be in degrees becasue fuck you i guess
                const angle = Math.acos(t / dist) * (180 / Math.PI);
                point.push(angle);
            }
            arr.push(point);
        }
        return arr;
    };
    let finalarr = [];
    if (curve.length == 2) {
        for (var t = 1; t < time; t++) {
            let arr1 = casteljau(curve, t, time, rotation);
            finalarr.push(arr1);
        }
    }
    else {
        for (var t = 1; t <= time; t++) {
            let arr1 = casteljau(curve, t, time);
            let arr2 = casteljau(arr1, t, time);
            let arr3 = casteljau(arr2, t, time, rotation);
            //could i use recursive? yea. am i gonna? no that sounds like work
            console.log(arr1);
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
function calcCurves(vectors, vectorLengths) {
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
            test.resize(0.1, 0.1);
            test.y = a[b][0][0];
            test.x = a[b][0][1];
            // 	test.rotation=a[b][0][2]
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
        calcCurves(msg.vectors, msg.vectorLengths);
        figma.closePlugin();
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // what if i dont wanna lmao. default generated tutorial headass
};

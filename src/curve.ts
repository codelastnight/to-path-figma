//import {Bezier} from 'bezier-js';

interface LineInfo {
	type: "LINE";
	points: Point[];
	length: number;
	cumulative: number;
	angle: number;
}
interface BezierInfo {
	type: "CUBIC";
	bezier: Bezier;
	length: number;
	cumulative: number;
	
}
export type BezierObject = BezierInfo | LineInfo;

/**
 * turn whatever svg code is into array of bezier objects
 *  * note: figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
 * @param svgData svg path data bruh moment
 * @returns array of lines and bezier objects
 */
 export const svgToBezier = (svgData: string): BezierObject[] => {
	const path = svgData.replace('Z', '').split('M').slice(1) //split if more then 1 section and gets rid of the extra array value at front
	// throw error if theres too many lines becasue im lazy
	if (path.length > 1) throw 'This plugin only supports one continous vector!'

	const bezierChunks = path[0].trim().split(/ L|C /) // splits string into the chunks of different lines

	// the point to splice into the next curve
	let splicein: string[] = bezierChunks[0].trim().split(' ')
	
	// var for cumulative;
	let cumulative = 0;
	// the output group of curves (which is a group of points)
	let bezierArray: (BezierInfo | LineInfo)[] = bezierChunks.splice(1).map(e => {
		
		const splitPoints = [...splicein,...e.trim().split(' ')]; 		//split each string in the chunk into points
		splicein = [splitPoints[splitPoints.length - 2],splitPoints[splitPoints.length - 2]] 		//this adds the last point from the previous array into the next one.
		
		const numberPoints = splitPoints.map((value)=> {return parseFloat(value)})
		if (numberPoints.length === 8) {
			const curve = new Bezier(numberPoints,100) // clean this up later, typedpoints is redundant.
			cumulative+=curve.length;

			const data:BezierInfo = {
				type: 'CUBIC',
				bezier: curve,
				length: curve.length,
				cumulative: cumulative
			}
			return data;
		} else if (numberPoints.length === 4) {
			const linePoints = [{x:numberPoints[0], y:numberPoints[1]},{x:numberPoints[1], y:numberPoints[2]}]
			const length = distBtwn(linePoints[0],linePoints[1]);
			cumulative+=length;
			const data:LineInfo = {
				type: "LINE",
				points: linePoints,
				length: length,
				cumulative: cumulative,
				angle: Math.atan2(linePoints[1].y - linePoints[0].y, linePoints[1].x - linePoints[0].x)
			}
			return data;
		} else {
			throw 'Error Parsing SVG! Is the vector a valid SVG?'
		}
	})
	return bezierArray
}

/**
 * distance between points a and b
 * @param a first point
 * @param b second point
 */
 export const distBtwn = (a: Point, b: Point): number => { 
	return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) 
}
interface Bezier {
	a: Point;
	b: Point;
	c: Point;
	d: Point;
	len: number;
	length: number;
	arcLengths: number[];

	mx(u: number): number
	my(u: number): number
	x(t: number):number
	y(t: number):number
	map(u:number):number

}
interface BezierConstructor {
	new (points: number[], n: number): Bezier;
	(): void;
  }
  
/**
 * https://gist.github.com/BonsaiDen/670236
 * 
 * @param a 
 * @param b 
 * @param c 
 * @param d 
 */
const Bezier = function(this: Bezier, points,n) {
    this.a = {x:points[0], y: points[1]};
    this.b = {x:points[2], y: points[3]};
    this.c = {x:points[4], y: points[5]};
    this.d = {x:points[6], y: points[7]};
    
    this.len = n;
    this.arcLengths = new Array(this.len + 1);
    this.arcLengths[0] = 0;
    
    var ox = this.x(0), oy = this.y(0), clen = 0;
    for(var i = 1; i <= this.len; i += 1) {
        var x = this.x(i * (1/n)), y = this.y(i * (1/n));
        var dx = ox - x, dy = oy - y;        
        clen += Math.sqrt(dx * dx + dy * dy);
        this.arcLengths[i] = clen;
        ox = x, oy = y;
    }
    this.length = clen;    
} as BezierConstructor;

Bezier.prototype = {
    map: function(u) {
        var targetLength = u * this.arcLengths[this.len];
        var low = 0, high = this.len, index = 0;
        while (low < high) {
            index = low + (((high - low) / 2) | 0);
            if (this.arcLengths[index] < targetLength) {
                low = index + 1;
            
            } else {
                high = index;
            }
        }
        if (this.arcLengths[index] > targetLength) {
            index--;
        }
        
        var lengthBefore = this.arcLengths[index];
        if (lengthBefore === targetLength) {
            return index / this.len;
        
        } else {
            return (index + (targetLength - lengthBefore) / (this.arcLengths[index + 1] - lengthBefore)) / this.len;
        }
    },
	// return two closest
    map2: function(u) {
        var targetLength = u * this.arcLengths[this.len];
        var low = 0, high = this.len, index = 0;
        while (low < high) {
            index = low + (((high - low) / 2) | 0);
            if (this.arcLengths[index] < targetLength) {
                low = index + 1;
            
            } else {
                high = index;
            }
        }
        if (this.arcLengths[index] > targetLength) {
            index--;
        }
        
        var lengthBefore = this.arcLengths[index];
        if (lengthBefore === targetLength) {
            return index / this.len;
        
        } else {
            return (index + (targetLength - lengthBefore) / (this.arcLengths[index + 1] - lengthBefore)) / this.len;
        }
    },
    mx: function (u) {
        return this.x(this.map(u));
    },
    
    my: function (u) {
        return this.y(this.map(u));
    },
    
    x: function (t) {
        return ((1 - t) * (1 - t) * (1 - t)) * this.a.x
               + 3 * ((1 - t) * (1 - t)) * t * this.b.x
               + 3 * (1 - t) * (t * t) * this.c.x
               + (t * t * t) * this.d.x;
    },
    
    y: function (t) {
        return ((1 - t) * (1 - t) * (1 - t)) * this.a.y
               + 3 * ((1 - t) * (1 - t)) * t * this.b.y
               + 3 * (1 - t) * (t * t) * this.c.y
               + (t * t * t) * this.d.y;
    },
	get: function(u) {
		const t = this.map(u);
		const step = 1/this.len
		if (t > step) return undefined;
		const point = {x: this.x(t), y: this.my(t)}
		const angle = Math.atan2(point.x - this.x(t - step), point.x - this.x(t - step))
		return {point, angle}
	}
};
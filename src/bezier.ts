export interface Bezier {
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
    get(u:number): {point: Point, angle: number}
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

// from https://gamedev.stackexchange.com/questions/5373/moving-ships-between-two-planets-along-a-bezier-missing-some-equations-for-acce/5427#5427
export const Bezier = function(points,n) {
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

// from https://gamedev.stackexchange.com/questions/5373/moving-ships-between-two-planets-along-a-bezier-missing-some-equations-for-acce/5427#5427
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
    //function that combines everything into 1 call
	get: function(u) {
		const t = this.map(u);
		const step = 1/this.len
        const tPrev = this.map(u +step);
		const point = {x: this.x(t), y: this.my(t)}
        console.log(point)
		const angle = Math.atan2(point.y - this.y(tPrev), point.x - this.x(tPrev))
		return {point, angle}
	}
};
import {BezierObject} from './curve';
import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';

export const place = (
    node: SceneNode, // to clone
	curve: BezierObject,
	options: SettingData
) =>{

	let totalLength = curve.reduce((accumulator, curValue) => {
		return accumulator + curValue.length
	}, 0);
	let curvePos = 0;
	const spacing = options.autoWidth ? totalLength / options.count : options.spacing;

	for (var count = 0; count < options.count; count++) {

		let object = node.type === 'COMPONENT' ? node.createInstance() : node.clone();
		
		// select curve based on spacing
		if (spacing*count > curve[curvePos].cumulative) curvePos +=1;
		const current = curve[curvePos]
		const t =  (spacing*count -(current.cumulative - current.length)) / current.length

		if (current.type === 'CUBIC') {
			//position in % of that boolean
			const normal = current.bezier.normal(t)
		
			const angle = Math.atan2(normal.y, normal.x);
			const point = current.bezier.get(t)


		} else if (current.type === 'LINE' ) {
			const point = pointBtwn(current.points[0],current.points[1],t,current.length);
			const angle = current.angle;
			
		}
		const center:Point = {
			x: 0 -  object.width * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
			y: 0 - object.height * options.verticalAlign
		}
		const matrix = compose(

		)
	
	
	}
}

/**
 * find point between two points a and b over time
 * *in this case time is pixels
 * @param a point a
 * @param b point b
 * @param t current time
 * @param dist total time
 */
 export const pointBtwn = (a: Point, b: Point, t: number, dist: number): Point => {

	//find the unit  vector between points a and b
	// not really unit vector in the math sense tho
	//const unitVector: Point = { x: , y: (} 
	return  {
		x: a.x + ((b.x - a.x) / dist) * t,
		y: a.y + ((b.y - a.y) / dist ) * t
	}
}
import {SVGPathData, SVGPathDataTransformer, encodeSVGPath, SVGPathDataParser} from 'svg-pathdata';
import type { SVGCommand } from 'svg-pathdata/lib/types';
import { BezierObject } from './curve';

/**
 * turn text svg code is into curved one.
 *  * note: figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
 * @param svgData svg path data (uncompressed)
 * @returns array of lines and bezier objects
 */
 export const textToPoints = (svgData: string, curve:BezierObject=undefined)  => {
	const paths = svgData.split('Z').slice(0,-1) // remove extra array at the end
	console.log(paths)
	
	const newpaths = paths.map((path)=> {
		path +="Z"; //put this guy back
		
		const {commands} = new SVGPathData(path);
		const bounds = getBounds(commands);
	})
	return;

}

const getBounds=(commands:SVGCommand[])=>{
	if (commands[0].type !== SVGPathData.MOVE_TO) throw "error parsing text path! please report to developer"
	const initValue = [{x:commands[0].x,y:commands[0].y},{x:commands[0].x,y:commands[0].y}];
	const boundingBox: Point[] = commands.reduce((prev,current)=> {
		if ( current.type ===  SVGPathData.LINE_TO || current.type ===  SVGPathData.CURVE_TO || current.type=== SVGPathData.MOVE_TO){
			return [
				{
					x: Math.min(prev[0].x, current.x),
					y: Math.min(prev[0].y, current.y)
				},{
					x: Math.max(prev[1].x, current.x),
					y: Math.max(prev[1].y, current.y)
				}]
		} else {
			return prev
		}
	}, initValue)

	return boundingBox
}
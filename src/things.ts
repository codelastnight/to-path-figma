import {BezierObject} from './curve';
import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';

export const place = (
    object: SceneNode,
	curve: BezierObject,
	options: SettingData
) =>{

	const center = {
		x: 0 -  object.width * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
		y: 0 - object.height * options.verticalAlign
	}
}
import { BezierObject } from "./curve";
import {
  scale,
  rotate,
  translate,
  compose,
  Matrix,
} from "transformation-matrix";

export const place = (
  node: SceneNode, // to clone
  curve: BezierObject,
  options: SettingData,
  position = 0
) => {
  let totalLength = curve.reduce((accumulator, curValue) => {
    return accumulator + curValue.length;
  }, 0);
  let curvePos = 0;
  const spacing = options.autoWidth
    ? totalLength / options.count
    : options.spacing;

  for (var count = position; count < options.count; count++) {
    // select curve based on spacing
    if (spacing * count > curve[curvePos].cumulative) curvePos += 1;
    const current = curve[curvePos];
    const t =
      (spacing * count - (current.cumulative - current.length)) /
      current.length;

    if (current.type === "CUBIC") {
      //position in % of that boolean
      const normal = current.bezier.normal(t);

      const angle = Math.atan2(normal.y, normal.x);
      const point = current.bezier.get(t);
    } else if (current.type === "LINE") {
      const point = pointBtwn(
        current.points[0],
        current.points[1],
        t,
        current.length
      );
      const angle = current.angle;
    }

    let object =
      node.type === "COMPONENT" ? node.createInstance() : node.clone();

    const center: Point = {
      x: 0 - object.width * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
      y: 0 - object.height * options.verticalAlign,
    };
    const baseMatrix = convertMatrix(object.relativeTransform);
  //   const matrix = compose(
	// 	baseMatrix,
	// );
  }
};

const transformObject = (object: SceneNode) => {};


/**
 * convert figma matrix into one I can consume (I ate!!!)
 * @param m figma matrix array
 * @returns matrix object
 */
const convertMatrix = (m: number[][]): Matrix => {
  return {
    a: m[0][0],
    c: m[0][1],
    e: m[0][2],
    b: m[1][0],
    d: m[1][1],
    f: m[1][2],
  };
};

/**
 * find point between two points a and b over time
 * *in this case time is pixels
 * @param a point a
 * @param b point b
 * @param t current time
 * @param dist total time
 */
export const pointBtwn = (
  a: Point,
  b: Point,
  t: number,
  dist: number
): Point => {
  //find the unit  vector between points a and b
  // not really unit vector in the math sense tho
  //const unitVector: Point = { x: , y: (}
  return {
    x: a.x + ((b.x - a.x) / dist) * t,
    y: a.y + ((b.y - a.y) / dist) * t,
  };
};

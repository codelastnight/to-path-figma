//import {Bezier} from 'bezier-js';
import { Bezier } from "./bezier";
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
  const path = svgData.replace("Z", "").split("M").slice(1); //split if more then 1 section and gets rid of the extra array value at front
  // throw error if theres too many lines becasue im lazy
  if (path.length > 1) throw "This plugin only supports one continous vector!";

  const bezierChunks = path[0].trim().split(/ L|C /); // splits string into the chunks of different lines

  // the point to splice into the next curve
  let splicein: string[] = bezierChunks[0].trim().split(" ");

  // var for cumulative;
  let cumulative = 0;
  // the output group of curves (which is a group of points)
  let bezierArray: (BezierInfo | LineInfo)[] = bezierChunks
    .splice(1)
    .map((e) => {
      const splitPoints = [...splicein, ...e.trim().split(" ")]; //split each string in the chunk into points
      splicein = [
        splitPoints[splitPoints.length - 2],
        splitPoints[splitPoints.length - 1],
      ]; //this adds the last point from the previous array into the next one.

      const numberPoints = splitPoints.map((value) => {
        return parseFloat(value);
      });
      if (numberPoints.length === 8) {
        const curve = new Bezier(numberPoints, 100);
        cumulative += curve.length;
        const data: BezierInfo = {
          type: "CUBIC",
          bezier: curve,
          length: curve.length,
          cumulative: cumulative,
        };
        return data;
      } else if (numberPoints.length === 4) {
        const linePoints = [
          { x: numberPoints[0], y: numberPoints[1] },
          { x: numberPoints[2], y: numberPoints[3] },
        ];
        const length = distBtwn(linePoints[0], linePoints[1]);
        cumulative += length;
        const data: LineInfo = {
          type: "LINE",
          points: linePoints,
          length: length,
          cumulative: cumulative,
          angle: Math.atan2(
            linePoints[1].y - linePoints[0].y,
            linePoints[1].x - linePoints[0].x
          ),
        };
        return data;
      } else {
        throw "Error Parsing SVG! Is the vector a valid SVG?";
      }
    });
  return bezierArray;
};

/**
 * distance between points a and b
 * @param a first point
 * @param b second point
 */
export const distBtwn = (a: Point, b: Point): number => {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
};

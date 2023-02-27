import { SVGPathData, encodeSVGPath } from "svg-pathdata";
import type { SVGCommand } from "svg-pathdata/lib/types";
import {
  rotate,
  translate,
  compose,
  scale,
  applyToPoint,
  applyToPoints,
} from "transformation-matrix";
import { BezierObject, getPointfromCurve } from "./curve";
import type { optionsType, Point } from "../../config";
import { FigmaMatrixToObj, ObjToFigmaMatrix } from "./things";

/**
 * turn text svg code is into curved one.
 *  * note: figma doesnt have the 3 point bezier curve in vector mode, only 4 or 2.
 * @param svgData svg path data (uncompressed)
 * @returns array of lines and bezier objects
 */
export const textToPoints = (
  textNode: TextNode,
  curveNode: VectorNode,
  options: optionsType,
  curve: BezierObject[] = undefined,
  position = 0
) => {
  const svgData = figma.flatten([textNode.clone()], curveNode.parent);
  const paths = svgData.vectorPaths;

  const totalLength = curve[curve.length - 1].cumulative;
  let clonedNodes = [];
  let curvePos = 0;

  const newpaths = paths.map((path) => {
    //path += "Z"; //put this guy back
    const pathData = new SVGPathData(path.data);
    const commands = pathData.commands;
    const bounds = getBounds(commands);

    const center: Point = {
      x: 0 - (bounds[1].x - bounds[0].x) * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
      y: 0 - (bounds[1].y - bounds[0].y) * options.verticalAlign,
    };

    const letterPos = bounds[0].x;
    //    console.log(letterPos);
    if (letterPos > totalLength) return path;
    if (letterPos > curve[curvePos].cumulative) {
      curvePos += 1;
    }
    const current = curve[curvePos];
    const t =
      (letterPos - (current.cumulative - current.length)) / current.length;
    //console.log(letterPos, t);
    //  if (t < 0) throw "math error";
    const { angle, point } = getPointfromCurve(current, t);
    const baseMatrix = FigmaMatrixToObj(curveNode.relativeTransform);
    const transformMatrix = compose(
      //  baseMatrix,
      translate(point.x, point.y)
      //rotate(angle)
      // translate(center.x, center.y),
    );
    const originMatrix = pathData.matrix(
      transformMatrix.a,
      transformMatrix.b,
      transformMatrix.c,
      transformMatrix.d,
      transformMatrix.e,
      transformMatrix.f
    );
    //const star = figma.createStar();
    ///curveNode.parent.appendChild(star);
    //star.relativeTransform = ObjToFigmaMatrix(transformMatrix);
    const newPathData = encodeSVGPath(originMatrix.commands)
      .replace(/((-?\d)([a-zA-Z]))/g, "$2 $3") // add space btn number and letter
      .replace(/(([a-zA-Z])(-?\d))/g, "$2 $3") // add sapce btn letter and number
      .toUpperCase()

      .replace(/(Z)(M)/g, "$1 $2")

      .trim();
    return { windingRule: path.windingRule, data: newPathData };
  });

  const newNode = figma.flatten([textNode.clone()], curveNode.parent);
  newNode.relativeTransform = curveNode.relativeTransform;

  // //lol regex
  // const regex = newpaths
  //   .replace(/((-?\d)([a-zA-Z]))/g, "$2 $3") // add space btn number and letter
  //   .replace(/(([a-zA-Z])(-?\d))/g, "$2 $3") // add sapce btn letter and number
  //   .replace(/(\s\s+)/g, " ") // remove double spaces
  //   .toUpperCase()
  //   .trim();
  //console.log(regex);
  newNode.vectorPaths = newpaths;
  svgData.remove();

  return newNode;
};

const getBounds = (commands: SVGCommand[]) => {
  if (commands[0].type !== SVGPathData.MOVE_TO)
    throw "error parsing text path! please report to developer";
  const initValue = [
    { x: commands[0].x, y: commands[0].y },
    { x: commands[0].x, y: commands[0].y },
  ];
  const boundingBox: Point[] = commands.reduce((prev, current) => {
    if (
      current.type === SVGPathData.LINE_TO ||
      current.type === SVGPathData.CURVE_TO ||
      current.type === SVGPathData.MOVE_TO
    ) {
      return [
        {
          x: Math.min(prev[0].x, current.x),
          y: Math.min(prev[0].y, current.y),
        },
        {
          x: Math.max(prev[1].x, current.x),
          y: Math.max(prev[1].y, current.y),
        },
      ];
    } else {
      return prev;
    }
  }, initValue);

  return boundingBox;
};

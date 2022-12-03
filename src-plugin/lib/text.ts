import { SVGPathData, encodeSVGPath } from "svg-pathdata";
import type { SVGCommand } from "svg-pathdata/lib/types";

import {
  scale,
  rotate,
  translate,
  compose,
  applyToPoint,
  applyToPoints,
} from "transformation-matrix";
import type { Matrix } from "transformation-matrix";

import { BezierObject, getPointfromCurve } from "./curve";
import type { optionsType, Point } from "../../config";

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
  const svgData = textNode.fillGeometry[0].data;
  const paths = svgData.split("Z").slice(0, -1); // remove extra array at the end

  const totalLength = curve[curve.length - 1].cumulative;
  let clonedNodes = [];
  let curvePos = 0;

  const newpaths = paths.reduce((prev, path) => {
    path += "Z"; //put this guy back

    const { commands } = new SVGPathData(path);
    const bounds = getBounds(commands);
    const center: Point = {
      x: 0 - (bounds[1].x - bounds[0].x) * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
      y: 0 - (bounds[1].y - bounds[0].y) * options.verticalAlign,
    };

    const letterPos = bounds[0].x + center.x;
    if (letterPos > totalLength) return;
    if (letterPos > curve[curvePos].cumulative) {
      curvePos += 1;
    }
    const current = curve[curvePos];
    const t =
      (letterPos - (current.cumulative - current.length)) / current.length;

    const { angle, point } = getPointfromCurve(current, t);
    const transformMatrix = compose(
      translate(point.x, point.y),
      rotate(angle),
      translate(center.x, center.y)
    );
    const tranformedCommands = commands.map((point) => {
      if (point.type === SVGPathData.CLOSE_PATH) return point;
      else if (
        point.type === SVGPathData.LINE_TO ||
        point.type === SVGPathData.MOVE_TO
      ) {
        const newPoint = applyToPoint(transformMatrix, {
          x: point.x,
          y: point.y,
        });
        point.x = newPoint.x;
        point.y = newPoint.y;
      } else if (point.type === SVGPathData.CURVE_TO) {
        const newPoints = applyToPoints(transformMatrix, [
          [point.x, point.y],
          [point.x1, point.y1],
          [point.x2, point.y2],
        ]);
        point = {
          type: point.type,
          relative: point.relative,
          x: newPoints[0][0],
          y: newPoints[0][1],
          x1: newPoints[1][0],
          y1: newPoints[1][1],
          x2: newPoints[2][0],
          y2: newPoints[2][1],
        };
      }

      return point;
    });

    return prev + " " + encodeSVGPath(tranformedCommands);
  });
  const newNode = figma.flatten([textNode.clone()]);
  const regex = newpaths.replace(
    /(([a-zA-Z])(-?\d))|((-?\d)([a-zA-Z]))/g,
    "$2 $3"
  );
  console.log(regex);
  newNode.vectorPaths = [
    {
      windingRule: "EVENODD",
      data: regex,
    },
  ];
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

import { Bezier } from "./bezier";
import type { Point } from "../../config";
import { pointBtwn } from "./helper";

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
 * get point and angle from position t for either a bezier or line.
 */
export const getPointfromCurve = (
  current: BezierObject,
  t: number
): { angle: number; point: Point } => {
  // hotfix if t is less then 0
  if (t < 0) t = 0.001;
  if (current.type === "CUBIC") {
    const { point, angle } = current.bezier.get(t);

    return { point, angle };
  } else if (current.type === "LINE") {
    const point = pointBtwn(current.points[0], current.points[1], t);
    const angle = current.angle;
    return { angle, point };
  }
  throw "failed at getPointfromCurve(). You should not see this error. Please contact developer if you do. ";
};

import type { Matrix } from "transformation-matrix";
import { Point } from "../../config";

/**
 * deep copy but exclude children
 * @param inObject any object
 */
export const clone = (inObject: any) => {
  let outObject: any, value: any, key: any;

  if (typeof inObject == "function") {
    return "";
  }

  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    if (key != "children" && key != "parent") {
      value = inObject[key];

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = clone(value);
    } else {
      value = "";
    }
  }

  return outObject;
};

/**
 * convert figma matrix into one I can consume (I ate!!!)
 * @param m figma matrix array
 * @returns matrix object
 */
export const FigmaMatrixToObj = (m: Transform): Matrix => {
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
 * convert matrix object into figma matrix (I ate!!!)
 * @param m figma matrix array
 * @returns matrix object
 */
export const ObjToFigmaMatrix = (m: Matrix): Transform => {
  return [
    [m.a, m.c, m.e],
    [m.b, m.d, m.f],
  ];
};

/**
 * distance between points a and b
 * @param a first point
 * @param b second point
 */
export const distBtwn = (a: Point, b: Point): number => {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
};

/**
 * find unit point between two points a and b over time
 * *in this case time is pixels
 * @param a point a
 * @param b point b
 * @param t current time
 */
export const pointBtwn = (a: Point, b: Point, t: number): Point => {
  // i think "unit" in this case is 1 figma pixel
  // const unitVector: Point = { x: , y: }
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
};

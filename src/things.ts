import {
  scale,
  rotate,
  translate,
  compose,
  rotateDEG
} from "transformation-matrix";
import type { Matrix }from "transformation-matrix"
import type { BezierObject } from "./curve";
import {clone} from './helper';

export const place = (
  node: SceneNode, // to clone
  curveNode:VectorNode,
  curve: BezierObject[],
  options: SettingData,
  groupNode: GroupNode = undefined,
  position = 0
) => {
  const totalLength = curve[curve.length -1].cumulative
  let curvePos = 0;
  const totalCount = options.autoWidth ? options.count : options.count
  

  const spacing = options.autoWidth
    ? totalLength / (totalCount -1)
    : options.spacing;
  let clonedNodes=[];
  for (var count = position; count < totalCount; count++) {
    // select curve based on spacing
    if (spacing * count > totalLength) break;
    if (spacing * count > curve[curvePos].cumulative) curvePos += 1;
    const current = curve[curvePos];
    // const t =
    //   (spacing * count - (current.cumulative - current.length)) /
    //   current.length;
    const t = (1 / (totalCount -1)) * count 
    
    const {angle, point} = getPointfromCurve(current,t);

    let object =
      node.type === "COMPONENT" ? node.createInstance() : node.clone();

    curveNode.parent.appendChild(object);
    const center: Point = {
      x: 0 - object.width * options.horizontalAlign, // no horozonatal align on text, kerning gets fucked up
      y: 0 - object.height * options.verticalAlign,
    };

    const baseMatrix = FigmaMatrixToObj(curveNode.relativeTransform);
    const matrix = compose(
    baseMatrix,    
    translate(point.x,point.y),
    rotate(angle),
    translate(center.x,center.y),
	  );

    object.relativeTransform = ObjToFigmaMatrix(matrix);
    clonedNodes = [...clonedNodes,object];
  }
  
  const group = figma.flatten(clonedNodes,curveNode.parent);
  group.opacity = 0.2;
  group.locked = true;
  //const fills = clone(group.fills);
  //fills[0].color = {r:0.051,g:0.6,b:1};
  //group.fills = fills;
  
  return group;
};

/**
 * get point and angle from position t for either a bezier or line.
 */
const getPointfromCurve =(current: BezierObject, t: number): {angle:number,point:Point}=> {
  if (current.type === "CUBIC") {

    const {point,angle} = current.bezier.get(t); 

    return {point,angle}

  } else if (current.type === "LINE") {
    const point = pointBtwn(
      current.points[0],
      current.points[1],
      t,
      current.length
    );
    const angle = current.angle;
    return {angle,point}

  }
  throw "failed at getPointfromCurve(). You should not see this error. Please contact developer if you do. "
}




/**
 * convert figma matrix into one I can consume (I ate!!!)
 * @param m figma matrix array
 * @returns matrix object
 */
const FigmaMatrixToObj = (m: Transform): Matrix => {
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
 * convert  matrix object into figma matrix (I ate!!!)
 * @param m figma matrix array
 * @returns matrix object
 */
 const ObjToFigmaMatrix = (m: Matrix): Transform => {
  return [[m.a,m.c,m.e],[m.b,m.d,m.f]]
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
  //const unitVector: Point = { x: , y: }
  return {
    x: a.x + ((b.x - a.x) / dist) * t,
    y: a.y + ((b.y - a.y) / dist) * t,
  };
};




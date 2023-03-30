import {
  rotate,
  translate,
  compose,
  applyToPoint,
  decomposeTSR,
} from "transformation-matrix";
import { getPointfromCurve } from "./curve";
import type { BezierObject } from "./curve";
import type { optionsType, Point } from "../../config";
import { FigmaMatrixToObj, ObjToFigmaMatrix } from "./things";

// fix to stop typescript from yelling at me for mutating (sorry)
type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export function textToVectorNetwork(
  textNode: TextNode,
  curveNode: VectorNode,
  options: optionsType,
  curve: BezierObject[] = undefined
) {
  //clone text object and get vector out of it. also reset rotation
  const textClone = figma.flatten([textNode.clone()], curveNode.parent);
  textClone.rotation = 0;

  const vectorNetwork = textClone.vectorNetwork;
  const totalLength = curve[curve.length - 1].cumulative;
  let curveIndex = 0;
  let newVertices = [];
  let newSegments = [];
  let firstPoint = { x: 0, y: 0 };

  //fix for applying curveNode transform to new generated transform
  const endmatrix = decomposeTSR(FigmaMatrixToObj(curveNode.absoluteTransform));
  // funny workaround for getting baseline, bc we dont have access to actual font baseline data
  let textBaseline = 0;
  vectorNetwork.regions.forEach((region, index) => {
    const bounds = getBoundsFromVectorRegion(region, vectorNetwork);
    if (index === 0) textBaseline = (bounds[1].y - bounds[0].y) * 1;
    const horizontalCenter = (bounds[1].x - bounds[0].x) * 0.5;
    const letterPosition = bounds[0].x + horizontalCenter; // get centered position for letter

    if (letterPosition > totalLength) throw "text longer then curve";
    if (letterPosition > curve[curveIndex].cumulative) curveIndex += 1;
    const currentCurve = curve[curveIndex];
    // calculate time t from curve
    const t =
      (letterPosition - (currentCurve.cumulative - currentCurve.length)) /
      currentCurve.length;

    // point and angle for curve
    const { angle, point } = getPointfromCurve(currentCurve, t);

    const perpendicular = Math.PI / 2;

    //calculate transformation matrix to apply on character
    const transformMatrix = compose(
      translate(endmatrix.translate.tx, endmatrix.translate.ty),
      rotate(endmatrix.rotation.angle),
      translate(point.x - letterPosition, point.y - textBaseline),
      rotate(angle - perpendicular, letterPosition, textBaseline)
    );

    // calcualte separate rotation matrix for tangents
    const rotationMatrix = compose(
      rotate(angle - perpendicular),
      rotate(endmatrix.rotation.angle)
    );
    // rotate and translate points. only rotate the tangents
    region.loops.forEach((loop) => {
      loop.forEach((segmentIndex) => {
        const vertex = JSON.parse(
          JSON.stringify(vectorNetwork.vertices[segmentIndex])
        ) as Mutable<VectorVertex>;

        const { x, y } = applyToPoint(transformMatrix, vertex);

        //store first vertex point for fixing position later. see repositionVector()
        if (index === 0) firstPoint = { x: x, y: y };

        vertex.x = x;
        vertex.y = y;
        newVertices.push(vertex);

        //funny clone. deepClone not available (yet) on figma electron.
        const segment = JSON.parse(
          JSON.stringify(vectorNetwork.segments[segmentIndex])
        ) as Mutable<VectorSegment>;

        if (segment.hasOwnProperty("tangentStart")) {
          segment.tangentStart = applyToPoint(
            rotationMatrix,
            segment.tangentStart
          );
        }
        if (segment.hasOwnProperty("tangentEnd")) {
          segment.tangentEnd = applyToPoint(rotationMatrix, segment.tangentEnd);
        }
        newSegments.push(segment);
      });
    });
  });
  //apply changes
  const newVectorNetwork = {
    vertices: newVertices,
    segments: newSegments,
    regions: JSON.parse(JSON.stringify(vectorNetwork.regions)),
  };
  textClone.vectorNetwork = newVectorNetwork;

  // fixes weird winding rule issue when setting vectornetwrok
  const textCloneFix = figma.flatten([textClone.clone()], curveNode.parent);
  /// textCloneFix.relativeTransform = curveNode.relativeTransform;
  // reposition the new genretated text to match the curve
  textCloneFix.relativeTransform = repositionVector(textCloneFix, firstPoint);

  //clean up
  textClone.remove();

  return textCloneFix;
}

/**
 * repositions vector node to a known point.
 * @param vector vector node to reposition
 * @param absoluteVertexPoint reference absolute position that the vertex should be in
 * @returns
 */
function repositionVector(vector: VectorNode, absoluteVertexPoint: Point) {
  const position = {
    x: vector.absoluteTransform[0][2],
    y: vector.absoluteTransform[1][2],
  };
  //get absolute position of vector node, add it to the vertex point,
  const initPoint = {
    x: position.x + vector.vectorNetwork.vertices[0].x,
    y: position.y + vector.vectorNetwork.vertices[0].y,
  };
  // then subtract that from absoluteVertexPoint, calculated before as the actual absolute position that the new object needs to be in
  const fixPoint = {
    x: absoluteVertexPoint.x - initPoint.x,
    y: absoluteVertexPoint.y - initPoint.y,
  };
  const applyFix = compose(
    FigmaMatrixToObj(vector.relativeTransform),
    translate(fixPoint.x, fixPoint.y)
  );
  return ObjToFigmaMatrix(applyFix);
}

/**
 * get bounds from points
 * modified from https://github.com/mikolalysenko/bound-points/blob/master/bounds.js
 * @param points
 * @returns
 */
function getBounds(points: VectorVertex[]) {
  const length = points.length;
  if (length === 0) {
    return [];
  }
  let low = { x: points[0].x, y: points[0].y };
  let high = { x: points[0].x, y: points[0].y };
  for (var i = 1; i < length; ++i) {
    const point = points[i];
    low.x = Math.min(low.x, point.x);
    high.x = Math.max(high.x, point.x);
    low.y = Math.min(low.y, point.y);
    high.y = Math.max(high.y, point.y);
  }
  return [low, high];
}
/**
 * get bounds for 1 vector network region (aka, each character)
 * @param region
 * @param network
 * @returns
 */
function getBoundsFromVectorRegion(
  region: VectorRegion,
  network: VectorNetwork
) {
  // smash all points into 1 array for getBounds
  let networkPoints = [];
  region.loops.forEach((loop) => {
    const loopPoints = loop.map((segmentIndex) => {
      return network.vertices[segmentIndex];
    });
    networkPoints = [...networkPoints, ...loopPoints];
  });
  const bounds = getBounds(networkPoints);
  return bounds;
}

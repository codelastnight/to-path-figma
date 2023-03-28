import {
  rotate,
  translate,
  compose,
  applyToPoint,
  applyToPoints,
} from "transformation-matrix";
import { getPointfromCurve } from "./curve";
import type { BezierObject } from "./curve";
import type { optionsType, Point } from "../../config";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export function transformVectorNetwork(
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
  // funny workaround for getting baseline, bc we dont have access to actual font baseline data
  let textBaseline = 0;
  vectorNetwork.regions.forEach((region, index) => {
    const bounds = getBoundsFromVectorRegion(region, vectorNetwork);
    if (index === 0) textBaseline = (bounds[1].y - bounds[0].y) * 1;
    console.log(textBaseline);
    const horizontalCenter = (bounds[1].x - bounds[0].x) * 0.5;
    const letterPosition = bounds[0].x + horizontalCenter; // get centered position for letter

    if (letterPosition > totalLength) throw "text longer then curve";
    if (letterPosition > curve[curveIndex].cumulative) {
      curveIndex += 1;
    }
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
      translate(point.x - letterPosition, point.y - textBaseline),
      rotate(angle - perpendicular, letterPosition, textBaseline)
    );

    // calcualte separate rotation matrix for tangents
    const rotationMatrix = rotate(angle - perpendicular);
    // rotate and translate points. only rotate the tangents
    region.loops.forEach((loop) => {
      loop.forEach((segmentIndex) => {
        const vertex = JSON.parse(
          JSON.stringify(vectorNetwork.vertices[segmentIndex])
        ) as Mutable<VectorVertex>;

        const { x, y } = applyToPoint(transformMatrix, vertex);

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
    //if its the first point, calculate distance btwn new point and curve point store it for later
    if (index === 0) {
      const rotatedBounds = applyToPoints(transformMatrix, bounds);
      firstPoint = {
        x: rotatedBounds[0].x + (rotatedBounds[1].x - rotatedBounds[0].x) * 0.5,
        y: rotatedBounds[0].y + (rotatedBounds[1].y - rotatedBounds[0].y) * 1,
      };
      console.log(firstPoint, point);
    }
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
  textCloneFix.relativeTransform = curveNode.relativeTransform;
  // reposition the new genretated text to match the curve
  textCloneFix.x = textCloneFix.x + firstPoint.x;
  textCloneFix.y = textCloneFix.y + firstPoint.y;

  //clean up
  textClone.remove();

  return textCloneFix;
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

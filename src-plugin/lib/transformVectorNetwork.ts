import {
  rotate,
  translate,
  compose,
  applyToPoint,
} from "transformation-matrix";
import { getPointfromCurve } from "./curve";
import type { BezierObject } from "./curve";
import type { optionsType, Point } from "../../config";
import { FigmaMatrixToObj, ObjToFigmaMatrix } from "./things";

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export function transformVectorNetwork(
  textNode: TextNode,
  curveNode: VectorNode,
  options: optionsType,
  curve: BezierObject[] = undefined
) {
  const textClone = figma.flatten([textNode.clone()], curveNode.parent);
  const vectorNetwork = textClone.vectorNetwork;
  const totalLength = curve[curve.length - 1].cumulative;
  let curveIndex = 0;
  let newVertices = [];
  let newSegments = [];
  const baseMatrix = FigmaMatrixToObj(curveNode.relativeTransform);
  vectorNetwork.regions.forEach((region) => {
    // loop thru points in region
    let networkPoints = [];
    region.loops.forEach((loop) => {
      const loopPoints = loop.map((segmentIndex) => {
        return vectorNetwork.vertices[segmentIndex];
      });
      networkPoints = [...networkPoints, ...loopPoints];
    });

    const bounds = getBounds(networkPoints);
    const letterPosition = bounds[0].x; // get leftmost position for letter
    if (letterPosition > totalLength) throw "text longer then curve";
    if (letterPosition > curve[curveIndex].cumulative) {
      curveIndex += 1;
    }
    const currentCurve = curve[curveIndex];
    const t =
      (letterPosition - (currentCurve.cumulative - currentCurve.length)) /
      currentCurve.length;

    const { angle, point } = getPointfromCurve(currentCurve, t);
    const rotationMatrix = rotate(angle - Math.PI / 2);

    const transformMatrix = compose(
      baseMatrix,
      translate(
        point.x - bounds[0].x,
        point.y - textClone.absoluteBoundingBox.y
      ),
      rotate(angle - Math.PI / 2, bounds[0].x, textClone.absoluteBoundingBox.y)
      // translate(center.x, center.y),
    );
    region.loops.forEach((loop) => {
      loop.forEach((segmentIndex) => {
        const vertex = JSON.parse(
          JSON.stringify(vectorNetwork.vertices[segmentIndex])
        ) as Mutable<VectorVertex>;

        const newVertexPoint = applyToPoint(transformMatrix, vertex);

        vertex.x = newVertexPoint.x;
        vertex.y = newVertexPoint.y;
        newVertices.push(vertex);

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
  const newVectorNetwork = {
    vertices: newVertices,
    segments: newSegments,
    regions: JSON.parse(JSON.stringify(vectorNetwork.regions)),
  };
  textClone.vectorNetwork = newVectorNetwork;

  // fixes weird winding rule issue when setting vectornetwrok
  const textCloneFix = figma.flatten([textClone.clone()], curveNode.parent);
  textClone.remove();
  textCloneFix.relativeTransform = curveNode.relativeTransform;
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

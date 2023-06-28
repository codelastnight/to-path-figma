import { rotate, translate, compose } from "transformation-matrix";
import { getPointfromCurve } from "./getPointfromCurve";
import { FigmaMatrixToObj, ObjToFigmaMatrix } from "./helper";

import type { BezierObject } from "./getPointfromCurve";
import type { optionsType, Point } from "../../config";
export const place = (
  node: SceneNode, // to clone
  curveNode: VectorNode,
  curve: BezierObject[],
  options: optionsType,
  groupNode: GroupNode = undefined,
  position = 0
) => {
  const totalLength = curve[curve.length - 1].cumulative;
  const totalCount = options.count;
  const spacing = options.autoWidth
    ? totalLength / (totalCount - 1)
    : options.spacing;

  let clonedNodes = [];
  let curvePos = 0;

  for (var count = position; count < totalCount; count++) {
    // select curve based on spacing
    const position = spacing * count;
    if (position > totalLength) break;
    if (position > curve[curvePos].cumulative) {
      curvePos += 1;
    }
    const current = curve[curvePos];

    const t =
      (position - (current.cumulative - current.length)) / current.length;
    const { angle, point } = getPointfromCurve(current, t);
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
      translate(point.x, point.y),
      rotate(angle),
      translate(center.x, center.y)
    );

    object.relativeTransform = ObjToFigmaMatrix(matrix);
    clonedNodes = [...clonedNodes, object];
  }

  const group = figma.flatten(clonedNodes, curveNode.parent);
  group.opacity = 0.4;
  group.locked = true;

  return group;
};

import { EdgeLayout, ReactflowNodeWithData } from "../../data/types";
import { kReactflow } from "../../states/reactflow";
import { getControlPoints, GetControlPointsParams } from "./algorithms";
import { getLabelPosition, getPathWithRoundCorners } from "./edge";

interface GetBasePathParams extends GetControlPointsParams {
  borderRadius: number;
}

export function getBasePath({
  id,
  offset,
  borderRadius,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: any) {
  const sourceNode: ReactflowNodeWithData =
    kReactflow.instance!.getNode(source)!;
  const targetNode: ReactflowNodeWithData =
    kReactflow.instance!.getNode(target)!;
  return getPathWithPoints({
    offset,
    borderRadius,
    source: {
      id: "source-" + id,
      x: sourceX,
      y: sourceY,
      position: sourcePosition,
    },
    target: {
      id: "target-" + id,
      x: targetX,
      y: targetY,
      position: targetPosition,
    },
    sourceRect: {
      ...(sourceNode.positionAbsolute || sourceNode.position),
      width: sourceNode.width!,
      height: sourceNode.height!,
    },
    targetRect: {
      ...(targetNode.positionAbsolute || targetNode.position),
      width: targetNode.width!,
      height: targetNode.height!,
    },
  });
}

export function getPathWithPoints({
  source,
  target,
  sourceRect,
  targetRect,
  offset = 20,
  borderRadius = 16,
}: GetBasePathParams): EdgeLayout {
  const { points, inputPoints } = getControlPoints({
    source,
    target,
    offset,
    sourceRect,
    targetRect,
  });
  const labelPosition = getLabelPosition(points);
  const path = getPathWithRoundCorners(points, borderRadius);
  return { path, points, inputPoints, labelPosition };
}

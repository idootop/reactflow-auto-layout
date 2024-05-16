import { deepClone, lastOf } from "@/utils/base";
import { Position, getBezierPath } from "reactflow";

import { getBasePath } from ".";
import {
  kBaseMarkerColor,
  kBaseMarkerColors,
  kNoMarkerColor,
  kYesMarkerColor,
} from "../../components/Edges/Marker";
import { isEqual } from "../../utils/diff";
import { EdgeLayout, ReactflowEdgeWithData } from "../../data/types";
import { kReactflow } from "../../states/reactflow";
import { getPathWithRoundCorners } from "./edge";

interface EdgeStyle {
  color: string;
  edgeType: "solid" | "dashed";
  pathType: "base" | "bezier";
}

/**
 * Get the style of the connection line
 * 
 * 1. When there are more than 3 edges connecting to both ends of the Node, use multiple colors to distinguish the edges.
 * 2. When the connection line goes backward or connects to a hub Node, use dashed lines to distinguish the edges.
 * 3. When the connection line goes from a hub to a Node, use bezier path.
 */
export const getEdgeStyles = (props: {
  id: string;
  isBackward: boolean;
}): EdgeStyle => {
  const { id, isBackward } = props;
  const idx = parseInt(lastOf(id.split("#")) ?? "0", 10);
  if (isBackward) {
    // Use dashed lines to distinguish the edges when the connection line goes backward or connects to a hub Node
    return { color: kNoMarkerColor, edgeType: "dashed", pathType: "base" };
  }
  const edge: ReactflowEdgeWithData = kReactflow.instance!.getEdge(id)!;
  if (edge.data!.targetPort.edges > 2) {
    // Use dashed bezier path when the connection line connects to a hub Node
    return {
      color: kYesMarkerColor,
      edgeType: "dashed",
      pathType: "bezier",
    };
  }
  if (edge.data!.sourcePort.edges > 2) {
    // Use multiple colors to distinguish the edges when there are more than 3 edges connecting to both ends of the Node
    return {
      color: kBaseMarkerColors[idx % kBaseMarkerColors.length],
      edgeType: "solid",
      pathType: "base",
    };
  }
  return { color: kBaseMarkerColor, edgeType: "solid", pathType: "base" };
};

interface ILayoutEdge {
  id: string;
  layout?: EdgeLayout;
  offset: number;
  borderRadius: number;
  pathType: EdgeStyle["pathType"];
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}

export function layoutEdge({
  id,
  layout,
  offset,
  borderRadius,
  pathType,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: ILayoutEdge): EdgeLayout {
  const relayoutDeps = [sourceX, sourceY, targetX, targetY];
  const needRelayout = !isEqual(relayoutDeps, layout?.deps?.relayoutDeps);
  const reBuildPathDeps = layout?.points;
  const needReBuildPath = !isEqual(
    reBuildPathDeps,
    layout?.deps?.reBuildPathDeps
  );
  let newLayout = layout;
  if (needRelayout) {
    newLayout = _layoutEdge({
      id,
      offset,
      borderRadius,
      pathType,
      source,
      target,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
  } else if (needReBuildPath) {
    newLayout = _layoutEdge({
      layout,
      id,
      offset,
      borderRadius,
      pathType,
      source,
      target,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
  }
  newLayout!.deps = deepClone({ relayoutDeps, reBuildPathDeps });
  return newLayout!;
}

function _layoutEdge({
  id,
  layout,
  offset,
  borderRadius,
  pathType,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: ILayoutEdge): EdgeLayout {
  const _pathType: EdgeStyle["pathType"] = pathType;
  if (_pathType === "bezier") {
    const [path, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
    const points = [
      {
        id: "source-" + id,
        x: sourceX,
        y: sourceY,
      },
      {
        id: "target-" + id,
        x: targetX,
        y: targetY,
      },
    ];
    return {
      path,
      points,
      inputPoints: points,
      labelPosition: {
        x: labelX,
        y: labelY,
      },
    };
  }

  if ((layout?.points?.length ?? 0) > 1) {
    layout!.path = getPathWithRoundCorners(layout!.points, borderRadius);
    return layout!;
  }

  return getBasePath({
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
  });
}

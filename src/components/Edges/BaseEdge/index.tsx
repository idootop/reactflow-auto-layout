import { ComponentType, memo } from "react";
import { EdgeProps, BaseEdge as _BaseEdge } from "reactflow";

import { ReactflowEdgeWithData } from "@/data/types";
import { isConnectionBackward } from "@/layout/edge/edge";
import { getEdgeStyles, layoutEdge } from "@/layout/edge/style";
import { kReactflow } from "@/states/reactflow";
import { EdgeControllers } from "../EdgeController";
import { useRebuildEdge } from "./useRebuildEdge";

export const BaseEdge: ComponentType<EdgeProps<ReactflowEdgeWithData>> = memo(
  ({
    id,
    selected,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    sourcePosition,
    targetPosition,
    markerStart,
    interactionWidth,
  }) => {
    useRebuildEdge(id);

    const isBackward = isConnectionBackward({
      source: {
        id,
        x: sourceX,
        y: sourceY,
        position: sourcePosition,
      },
      target: {
        id,
        x: targetX,
        y: targetY,
        position: targetPosition,
      },
    });

    const { color, edgeType, pathType } = getEdgeStyles({ id, isBackward });

    const edge: ReactflowEdgeWithData = kReactflow.instance!.getEdge(id)!;

    const offset = 20;
    const borderRadius = 12;
    const handlerWidth = 24;
    const handlerThickness = 6;

    edge.data!.layout = layoutEdge({
      layout: edge.data!.layout,
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

    const { path, points, labelPosition } = edge.data!.layout;

    return (
      <>
        <_BaseEdge
          path={path}
          labelX={labelPosition.x}
          labelY={labelPosition.y}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
          style={{
            ...style,
            stroke: color,
            opacity: selected ? 1 : 0.5,
            strokeWidth: selected ? 2 : 1.5,
            strokeDasharray: edgeType === "dashed" ? "10,10" : undefined,
          }}
          markerEnd={`url('#${color.replace("#", "")}')`}
          markerStart={markerStart}
          interactionWidth={interactionWidth}
        />
        {selected && (
          <EdgeControllers
            id={id}
            points={points}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
            offset={offset}
            handlerWidth={handlerWidth}
            handlerThickness={handlerThickness}
          />
        )}
      </>
    );
  }
);

BaseEdge.displayName = "BaseEdge";

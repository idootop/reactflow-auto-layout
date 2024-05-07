/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { XYPosition } from "reactflow";
import { XSta, useXState } from "xsta";

import { isEqualPoint } from "../../../layout/edge/point";
import { SmartEdge } from "./smart-edge";

interface UseDraggableParams {
  edge: SmartEdge;
  dragId?: string;
  onDragStart?: VoidFunction;
  onDragging?: (
    dragId: string,
    dragFrom: string,
    position: XYPosition,
    delta: XYPosition
  ) => void;
  onDragEnd?: VoidFunction;
}

let _id = 0;
export const useEdgeDraggable = (props: UseDraggableParams) => {
  const dragRef = useRef() as any;
  const propsRef = useRef(props);
  propsRef.current = props;

  const isDraggingEdge = () =>
    SmartEdge.draggingEdge &&
    isEqualPoint(SmartEdge.draggingEdge?.start, propsRef.current.edge.start) &&
    isEqualPoint(SmartEdge.draggingEdge?.end, propsRef.current.edge.end);

  const dragFrom = useRef((_id++).toString()).current;
  const dragId = isDraggingEdge() ? SmartEdge.draggingEdge!.dragId : dragFrom;
  const isDraggingKey = "isDragging" + dragId;
  const startPositionKey = "startPositionKey-" + dragId;
  const [_, setIsDragging] = useXState(isDraggingKey, false);
  const [__, setStartPosition] = useXState(startPositionKey, [0, 0]);
  const getIsDragging = () => XSta.get(isDraggingKey);
  const getStartPosition = () => XSta.get(startPositionKey);

  useEffect(() => {
    return () => {
      if (SmartEdge.draggingEdge?.dragId !== dragId) {
        // dispose states
        XSta.delete(isDraggingKey);
        XSta.delete(startPositionKey);
      }
    };
  }, []);

  const onDragStart = (event: MouseEvent) => {
    SmartEdge.draggingEdge = {
      dragId,
      dragFrom,
      start: propsRef.current.edge.start,
      end: propsRef.current.edge.end,
    };
    if (getIsDragging()) {
      return;
    }
    if (event.button !== 0) {
      // 过滤右键事件
      return;
    }
    if (event.target !== dragRef.current) {
      // 点击当前元素
      return;
    }
    setIsDragging(true);
    setStartPosition([event.clientX, event.clientY]);
    propsRef.current.onDragStart?.();
  };

  const onDragEnd = () => {
    if (!getIsDragging()) {
      return;
    }
    setIsDragging(false);
    propsRef.current.onDragEnd?.();
  };

  const onDragging = (event: MouseEvent) => {
    if (!getIsDragging()) {
      return;
    }
    if (event.buttons !== 1) {
      // 非左键拖拽，结束拖拽
      return onDragEnd();
    }
    propsRef.current.onDragging?.(
      dragId,
      dragFrom,
      {
        x: event.clientX,
        y: event.clientY,
      },
      {
        x: event.clientX - getStartPosition()[0],
        y: event.clientY - getStartPosition()[1],
      }
    );
    setStartPosition([event.clientX, event.clientY]);
  };

  useEffect(() => {
    document.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", onDragEnd);
    return () => {
      document.removeEventListener("mousedown", onDragStart);
      document.removeEventListener("mousemove", onDragging);
      document.removeEventListener("mouseup", onDragEnd);
    };
  }, []);

  return { dragRef, isDragging: getIsDragging() };
};

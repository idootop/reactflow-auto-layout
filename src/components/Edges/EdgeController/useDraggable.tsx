import { useEffect, useRef } from "react";
import { XYPosition } from "reactflow";
import { XSta, useXState } from "xsta";

interface UseDraggableParams {
  onDragStart?: VoidFunction;
  onDragging?: (id: string, position: XYPosition, delta: XYPosition) => void;
  onDragEnd?: VoidFunction;
}

let _id = 0;
export const useDraggable = (props: UseDraggableParams & { id?: string }) => {
  const dragRef = useRef() as any;
  const propsRef = useRef(props);
  propsRef.current = props;
  const id = useRef(props.id ?? (_id++).toString()).current;
  const isDraggingKey = "isDragging" + id;
  const startPositionKey = "startPositionKey-" + id;
  const [_, setIsDragging] = useXState(isDraggingKey, false);
  const [__, setStartPosition] = useXState(startPositionKey, [0, 0]);

  const getIsDragging = () => XSta.get(isDraggingKey);
  const getStartPosition = () => XSta.get(startPositionKey);

  const onDragStart = (event: MouseEvent) => {
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

  const onDragging = (event: MouseEvent) => {
    if (!getIsDragging()) {
      return;
    }
    propsRef.current.onDragging?.(
      id,
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

  const onDragEnd = () => {
    if (!getIsDragging()) {
      return;
    }
    setIsDragging(false);
    propsRef.current.onDragEnd?.();
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

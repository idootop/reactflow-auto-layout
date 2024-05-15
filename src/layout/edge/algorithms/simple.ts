import { uuid } from "@/utils/uuid";

import { LayoutDirection } from "../../node";
import { ControlPoint, isInLine, isOnLine } from "../point";

interface GetSimplePathParams {
  isDirectLink?: boolean;
  source: ControlPoint;
  target: ControlPoint;
  sourceOffset: ControlPoint;
  targetOffset: ControlPoint;
}

/**
 * 判断线段的方向
 *
 * Determine the direction of the line segment
 */
const getLineDirection = (
  start: ControlPoint,
  end: ControlPoint
): LayoutDirection => (start.x === end.x ? "vertical" : "horizontal");

/**
 * 当两个节点靠的过近时，使用简单 path
 *
 * When two nodes are too close, use a simple path
 */
export const getSimplePath = ({
  isDirectLink,
  source,
  target,
  sourceOffset,
  targetOffset,
}: GetSimplePathParams): ControlPoint[] => {
  const points: ControlPoint[] = [];
  const sourceDirection = getLineDirection(source, sourceOffset);
  const targetDirection = getLineDirection(target, targetOffset);
  const isHorizontalLayout = sourceDirection === "horizontal";
  if (isDirectLink) {
    // 直接连接，返回简单 Path
    // Direct connection, return a simple Path
    if (isHorizontalLayout) {
      if (sourceOffset.x <= targetOffset.x) {
        const centerX = (sourceOffset.x + targetOffset.x) / 2;
        return [
          { id: uuid(), x: centerX, y: sourceOffset.y },
          { id: uuid(), x: centerX, y: targetOffset.y },
        ];
      } else {
        const centerY = (sourceOffset.y + targetOffset.y) / 2;
        return [
          sourceOffset,
          { id: uuid(), x: sourceOffset.x, y: centerY },
          { id: uuid(), x: targetOffset.x, y: centerY },
          targetOffset,
        ];
      }
    } else {
      if (sourceOffset.y <= targetOffset.y) {
        const centerY = (sourceOffset.y + targetOffset.y) / 2;
        return [
          { id: uuid(), x: sourceOffset.x, y: centerY },
          { id: uuid(), x: targetOffset.x, y: centerY },
        ];
      } else {
        const centerX = (sourceOffset.x + targetOffset.x) / 2;
        return [
          sourceOffset,
          { id: uuid(), x: centerX, y: sourceOffset.y },
          { id: uuid(), x: centerX, y: targetOffset.y },
          targetOffset,
        ];
      }
    }
  }
  if (sourceDirection === targetDirection) {
    // 方向相同，添加两个点，两条平行线垂直距离一半的两个端点
    // Same direction, add two points, two endpoints of parallel lines at half the vertical distance
    if (source.y === sourceOffset.y) {
      points.push({
        id: uuid(),
        x: sourceOffset.x,
        y: (sourceOffset.y + targetOffset.y) / 2,
      });
      points.push({
        id: uuid(),
        x: targetOffset.x,
        y: (sourceOffset.y + targetOffset.y) / 2,
      });
    } else {
      points.push({
        id: uuid(),
        x: (sourceOffset.x + targetOffset.x) / 2,
        y: sourceOffset.y,
      });
      points.push({
        id: uuid(),
        x: (sourceOffset.x + targetOffset.x) / 2,
        y: targetOffset.y,
      });
    }
  } else {
    // 方向不同，添加一个点，保证不在当前线段上(会出现重合)，且不能有折线
    // Different directions, add one point, ensure it's not on the current line segment (to avoid overlap), and there are no turns
    let point = { id: uuid(), x: sourceOffset.x, y: targetOffset.y };
    const inStart = isInLine(point, source, sourceOffset);
    const inEnd = isInLine(point, target, targetOffset);
    if (inStart || inEnd) {
      point = { id: uuid(), x: targetOffset.x, y: sourceOffset.y };
    } else {
      const onStart = isOnLine(point, source, sourceOffset);
      const onEnd = isOnLine(point, target, targetOffset);
      if (onStart && onEnd) {
        point = { id: uuid(), x: targetOffset.x, y: sourceOffset.y };
      }
    }
    points.push(point);
  }
  return [sourceOffset, ...points, targetOffset];
};

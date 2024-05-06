import { areLinesSameDirection, isHorizontalFromPosition } from "../edge";
import {
  ControlPoint,
  HandlePosition,
  NodeRect,
  getCenterPoints,
  getExpandedRect,
  getOffsetPoint,
  getSidesFromPoints,
  getVerticesFromRectVertex,
  optimizeInputPoints,
  reducePoints,
} from "../point";
import { getAStarPath } from "./a-star";
import { getSimplePath } from "./simple";

export interface GetControlPointsParams {
  source: HandlePosition;
  target: HandlePosition;
  sourceRect: NodeRect;
  targetRect: NodeRect;
  // 连接线和节点的最小间距
  offset: number;
}

/**
 * 参考文章：https://juejin.cn/post/6942727734518874142
 */
export const getControlPoints = ({
  source: oldSource,
  target: oldTarget,
  sourceRect,
  targetRect,
  offset = 20,
}: GetControlPointsParams) => {
  const source: ControlPoint = oldSource;
  const target: ControlPoint = oldTarget;
  let edgePoints: ControlPoint[] = [];
  let optimized: ReturnType<typeof optimizeInputPoints>;

  // 1. 找到 offset 后的起止点
  const sourceOffset = getOffsetPoint(oldSource, offset);
  const targetOffset = getOffsetPoint(oldTarget, offset);
  const expandedSource = getExpandedRect(sourceRect, offset);
  const expandedTarget = getExpandedRect(targetRect, offset);

  // 2. 判断两个 Rect 是否离得比较近
  const minOffset = 2 * offset + 10;
  const isHorizontalLayout = isHorizontalFromPosition(oldSource.position);
  const isSameDirection = areLinesSameDirection(
    source,
    sourceOffset,
    targetOffset,
    target
  );
  const sides = getSidesFromPoints([
    source,
    target,
    sourceOffset,
    targetOffset,
  ]);
  const isTooClose = isHorizontalLayout
    ? sides.right - sides.left < minOffset
    : sides.bottom - sides.top < minOffset;
  const isDirectLink = isHorizontalLayout
    ? isSameDirection && source.x < target.x
    : isSameDirection && source.y < target.y;

  if (isTooClose || isDirectLink) {
    // 3. 如果两个 Rect 离得比较近或直接连接，则返回简单 Path
    edgePoints = getSimplePath({
      source,
      target,
      sourceOffset,
      targetOffset,
      isDirectLink,
    });
    optimized = optimizeInputPoints({
      source: oldSource,
      target: oldTarget,
      sourceOffset,
      targetOffset,
      edgePoints,
    });
    edgePoints = optimized.edgePoints;
  } else {
    // 3. 找到两个 expand 后 Rect 的顶点
    edgePoints = [
      ...getVerticesFromRectVertex(expandedSource, targetOffset),
      ...getVerticesFromRectVertex(expandedTarget, sourceOffset),
    ];
    // 4. 找到可能的中点和交点
    edgePoints = edgePoints.concat(
      getCenterPoints({
        source: expandedSource,
        target: expandedTarget,
        sourceOffset,
        targetOffset,
      })
    );
    // 5. 合并相近坐标点，去除重复的坐标点
    optimized = optimizeInputPoints({
      source: oldSource,
      target: oldTarget,
      sourceOffset,
      targetOffset,
      edgePoints,
    });
    // 6. 寻找最优路径
    edgePoints = getAStarPath({
      points: optimized.edgePoints,
      // 以下的起止点信息用于优化折线策略
      source: optimized.source,
      target: optimized.target,
      sourceRect: getExpandedRect(sourceRect, offset / 2),
      targetRect: getExpandedRect(targetRect, offset / 2),
    });
  }

  return {
    points: reducePoints([optimized.source, ...edgePoints, optimized.target]),
    inputPoints: optimized.edgePoints,
  };
};

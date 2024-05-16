import { areLinesReverseDirection, areLinesSameDirection } from "../edge";
import {
  ControlPoint,
  NodeRect,
  isEqualPoint,
  isSegmentCrossingRect,
} from "../point";

interface GetAStarPathParams {
  points: ControlPoint[];
  // 以下的起止点信息用于优化折线策略
  // The following start and end point information is used to optimize the polyline strategy
  source: ControlPoint;
  target: ControlPoint;
  sourceRect: NodeRect;
  targetRect: NodeRect;
}

/**
 * A* search algorithm: https://zh.wikipedia.org/wiki/A*%E6%90%9C%E5%B0%8B%E6%BC%94%E7%AE%97%E6%B3%95
 */
export const getAStarPath = ({
  points,
  source,
  target,
  sourceRect,
  targetRect,
}: GetAStarPathParams): ControlPoint[] => {
  if (points.length < 3) {
    return points;
  }
  const start = points[0];
  const end = points[points.length - 1];
  const openSet: ControlPoint[] = [start];
  const closedSet: Set<ControlPoint> = new Set();
  const cameFrom: Map<ControlPoint, ControlPoint> = new Map();
  const gScore: Map<ControlPoint, number> = new Map().set(start, 0);
  const fScore: Map<ControlPoint, number> = new Map().set(
    start,
    heuristicCostEstimate({
      from: start,
      to: start,
      start,
      end,
      source,
      target,
    })
  );

  while (openSet.length) {
    let current;
    let currentIdx;
    let lowestFScore = Infinity;
    openSet.forEach((p, idx) => {
      const score = fScore.get(p) ?? 0;
      if (score < lowestFScore) {
        lowestFScore = score;
        current = p;
        currentIdx = idx;
      }
    });

    if (!current) {
      break;
    }

    if (current === end) {
      return buildPath(cameFrom, current);
    }

    openSet.splice(currentIdx!, 1);
    closedSet.add(current);

    const curFScore = fScore.get(current) ?? 0;
    const previous = cameFrom.get(current);
    const neighbors = getNextNeighborPoints({
      points,
      previous,
      current,
      sourceRect,
      targetRect,
    });
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) {
        continue;
      }
      const neighborGScore = gScore.get(neighbor) ?? 0;
      const tentativeGScore = curFScore + estimateDistance(current, neighbor);
      if (openSet.includes(neighbor) && tentativeGScore >= neighborGScore) {
        continue;
      }
      openSet.push(neighbor);
      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(
        neighbor,
        neighborGScore +
          heuristicCostEstimate({
            from: current,
            to: neighbor,
            start,
            end,
            source,
            target,
          })
      );
    }
  }
  return [start, end];
};

const buildPath = (
  cameFrom: Map<ControlPoint, ControlPoint>,
  current: ControlPoint
): ControlPoint[] => {
  const path = [current];

  let previous = cameFrom.get(current);
  while (previous) {
    path.push(previous);
    previous = cameFrom.get(previous);
  }

  return path.reverse();
};

interface GetNextNeighborPointsParams {
  points: ControlPoint[];
  previous?: ControlPoint;
  current: ControlPoint;
  sourceRect: NodeRect;
  targetRect: NodeRect;
}

/**
 * 获取当前控制点可能的相邻点集合
 *
 * - 连线在水平或竖直方向上
 * - 连线不与两端 Node 相交
 * - 连线不与前面的线段反向（重叠）
 * 
 * Get the set of possible neighboring points for the current control point
 * 
 * - The line is in a horizontal or vertical direction
 * - The line does not intersect with the two end nodes
 * - The line does not overlap with the previous line segment in reverse direction
 */
export const getNextNeighborPoints = ({
  points,
  previous,
  current,
  sourceRect,
  targetRect,
}: GetNextNeighborPointsParams): ControlPoint[] => {
  return points.filter((p) => {
    if (p === current) {
      return false;
    }
    // 连线在水平或竖直方向上
    // The connection is in the horizontal or vertical direction
    const rightDirection = p.x === current.x || p.y === current.y;
    // 与前面的线段反向（重叠）
    // Reverse with the previous line segment (overlap)
    const reverseDirection = previous
      ? areLinesReverseDirection(previous, current, current, p)
      : false;
    return (
      rightDirection && // 连线在水平或竖直方向上 // The line is in a horizontal or vertical direction
      !reverseDirection && // 不与前面的线段反向（重叠） // The line does not overlap with the previous line segment in reverse direction
      !isSegmentCrossingRect(p, current, sourceRect) && // 不与 sourceNode 相交 // Does not intersect with sourceNode
      !isSegmentCrossingRect(p, current, targetRect) // 不与 targetNode 相交 // Does not intersect with targetNode
    );
  });
};

interface HeuristicCostParams {
  from: ControlPoint;
  to: ControlPoint;
  // 起止点
  // Start and end points
  start: ControlPoint;
  end: ControlPoint;
  source: ControlPoint;
  target: ControlPoint;
}

/**
 * 连接点距离损失函数
 *
 * - 距离之和越小越好
 * - 起止线段与起止方向相同越好
 * - 拐点在线段中间对称/居中越好
 *
 * Connection point distance loss function
 *
 * - The smaller the sum of distances, the better
 * - The closer the start and end line segments are in direction, the better
 * - The better the inflection point is symmetric or centered in the line segment
 */
const heuristicCostEstimate = ({
  from,
  to,
  start,
  end,
  source,
  target,
}: HeuristicCostParams): number => {
  const base = estimateDistance(to, start) + estimateDistance(to, end);
  const startCost = isEqualPoint(from, start)
    ? areLinesSameDirection(from, to, source, start)
      ? -base / 2
      : 0
    : 0;
  const endCost = isEqualPoint(to, end)
    ? areLinesSameDirection(from, to, end, target)
      ? -base / 2
      : 0
    : 0;
  return base + startCost + endCost;
};

/**
 * 计算两点之间的预估距离
 *
 * 曼哈顿距离：水平、竖直方向距离之和，计算速度更快
 *
 * Calculate the estimated distance between two points
 *
 * Manhattan distance: the sum of horizontal and vertical distances, faster calculation speed
 */
const estimateDistance = (p1: ControlPoint, p2: ControlPoint): number =>
  Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

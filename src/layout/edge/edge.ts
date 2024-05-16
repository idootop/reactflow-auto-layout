import { Position, XYPosition } from "reactflow";

import { uuid } from "@/utils/uuid";

import { ControlPoint, HandlePosition } from "./point";

export interface ILine {
  start: ControlPoint;
  end: ControlPoint;
}

export const isHorizontalFromPosition = (position: Position) => {
  return [Position.Left, Position.Right].includes(position);
};

export const isConnectionBackward = (props: {
  source: HandlePosition;
  target: HandlePosition;
}) => {
  const { source, target } = props;
  const isHorizontal = isHorizontalFromPosition(source.position);
  let isBackward = false;
  if (isHorizontal) {
    if (source.x > target.x) {
      isBackward = true;
    }
  } else {
    if (source.y > target.y) {
      isBackward = true;
    }
  }
  return isBackward;
};

/**
 * 获取两点之间的直线距离
 * 
 * Get the straight line distance between two points
 */
export const distance = (p1: ControlPoint, p2: ControlPoint) => {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
};

/**
 * 获取线段中点
 * 
 * Get the midpoint of the line segment
 */
export const getLineCenter = (
  p1: ControlPoint,
  p2: ControlPoint
): ControlPoint => {
  return {
    id: uuid(),
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

/**
 * 线段是否包含点
 * 
 * Whether the line segment contains points
 */
export const isLineContainsPoint = (
  start: ControlPoint,
  end: ControlPoint,
  p: ControlPoint
) => {
  return (
    (start.x === end.x &&
      p.x === start.x &&
      p.y <= Math.max(start.y, end.y) &&
      p.y >= Math.min(start.y, end.y)) ||
    (start.y === end.y &&
      p.y === start.y &&
      p.x <= Math.max(start.x, end.x) &&
      p.x >= Math.min(start.x, end.x))
  );
};

/**
 * 根据输入曲线的控制点，输出曲线 SVG path
 *
 * 注意：两个控制点之间是直线，除了端点之外的控制点处都为带圆角的转折点。
 *
 * According to the control point of the input curve, the output curve SVG PATH
 *
 * Note: The two control points are straight lines, and the control points except the endpoint are the turning point with a rounded corner.
 * @param points 曲线两端点 + 控制点 {x,y}，从输入端点开始，到输出端点结束。至少需要 2 个点
 *
 * curve both ends + control points {x, y}, start from the input endpoint, to the end of the output endpoint.It takes at least 2 points
 *
 * @param radius 曲线每个转折点处的拐角半径（非曲线borderRadius）。
 *
 * curve at the corner radius at each turning point (non-curve Borderradius).
 *
 */
export function getPathWithRoundCorners(
  points: ControlPoint[],
  radius: number
): string {
  if (points.length < 2) {
    throw new Error("至少需要两个点");
  }

  function getRoundCorner(
    center: ControlPoint,
    p1: ControlPoint,
    p2: ControlPoint,
    radius: number
  ) {
    const { x, y } = center;

    if (!areLinesPerpendicular(p1, center, center, p2)) {
      // 两条线段不垂直，直接返回直线
      // The two line segments are not vertical, and return directly to the straight line
      return `L ${x} ${y}`;
    }

    const d1 = distance(center, p1);
    const d2 = distance(center, p2);
    // eslint-disable-next-line no-param-reassign
    radius = Math.min(d1 / 2, d2 / 2, radius);

    const isHorizontal = p1.y === y;

    const xDir = isHorizontal ? (p1.x < p2.x ? -1 : 1) : p1.x < p2.x ? 1 : -1;
    const yDir = isHorizontal ? (p1.y < p2.y ? 1 : -1) : p1.y < p2.y ? -1 : 1;

    if (isHorizontal) {
      return `L ${x + radius * xDir},${y}Q ${x},${y} ${x},${y + radius * yDir}`;
    }

    return `L ${x},${y + radius * yDir}Q ${x},${y} ${x + radius * xDir},${y}`;
  }

  const path: string[] = [];
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      // 起点
      // starting point
      path.push(`M ${points[i].x} ${points[i].y}`);
    } else if (i === points.length - 1) {
      // 终点
      // Ending
      path.push(`L ${points[i].x} ${points[i].y}`);
    } else {
      path.push(
        getRoundCorner(points[i], points[i - 1], points[i + 1], radius)
      );
    }
  }

  return path.join(" ");
}

/**
 * 获取折线上距离最长的线段
 *
 * Get the longest line segment on the folding line
 */
export function getLongestLine(
  points: ControlPoint[]
): [ControlPoint, ControlPoint] {
  let longestLine: [ControlPoint, ControlPoint] = [points[0], points[1]];
  let longestDistance = distance(...longestLine);
  for (let i = 1; i < points.length - 1; i++) {
    const _distance = distance(points[i], points[i + 1]);
    if (_distance > longestDistance) {
      longestDistance = _distance;
      longestLine = [points[i], points[i + 1]];
    }
  }
  return longestLine;
}

/**
 * 获取折线上的 Label 位置
 *
 * 先找居中路径，非偶数时，再找最长路径
 *
 * Get the Label location on the folding line
 *
 * Find the middle path first, when the non -occasion, then find the longest path
 */
export function getLabelPosition(
  points: ControlPoint[],
  minGap = 20
): XYPosition {
  if (points.length % 2 === 0) {
    // 找到中间的线段
    // Find the middle line segment
    const middleP1 = points[points.length / 2 - 1];
    const middleP2 = points[points.length / 2];
    if (distance(middleP1, middleP2) > minGap) {
      return getLineCenter(middleP1, middleP2);
    }
  }
  const [start, end] = getLongestLine(points);
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
}

/**
 * 判断两条线段是否垂直(水平，竖直方向)
 *
 * Determine whether the two line segments are vertical (horizontal, vertical direction)
 */
export function areLinesPerpendicular(
  p1: ControlPoint,
  p2: ControlPoint,
  p3: ControlPoint,
  p4: ControlPoint
): boolean {
  return (p1.x === p2.x && p3.y === p4.y) || (p1.y === p2.y && p3.x === p4.x);
}

/**
 * 判断两条线段是否平行(水平，竖直方向)
 *
 * Determine whether the two line segments are parallel (horizontal, vertical direction)
 */
export function areLinesParallel(
  p1: ControlPoint,
  p2: ControlPoint,
  p3: ControlPoint,
  p4: ControlPoint
) {
  return (p1.x === p2.x && p3.x === p4.x) || (p1.y === p2.y && p3.y === p4.y);
}

/**
 * 判断两条直线是否同向(水平，竖直方向)
 *
 * Determine whether the two straight lines are the same direction (horizontal, vertical direction)
 */
export function areLinesSameDirection(
  p1: ControlPoint,
  p2: ControlPoint,
  p3: ControlPoint,
  p4: ControlPoint
) {
  return (
    (p1.x === p2.x && p3.x === p4.x && (p1.y - p2.y) * (p3.y - p4.y) > 0) ||
    (p1.y === p2.y && p3.y === p4.y && (p1.x - p2.x) * (p3.x - p4.x) > 0)
  );
}

/**
 * 判断两条直线是否反向(水平，竖直方向)
 *
 * Determine whether the two straight lines are reverse (horizontal, vertical direction)
 */
export function areLinesReverseDirection(
  p1: ControlPoint,
  p2: ControlPoint,
  p3: ControlPoint,
  p4: ControlPoint
) {
  return (
    (p1.x === p2.x && p3.x === p4.x && (p1.y - p2.y) * (p3.y - p4.y) < 0) ||
    (p1.y === p2.y && p3.y === p4.y && (p1.x - p2.x) * (p3.x - p4.x) < 0)
  );
}

/**
 * 两线段夹角
 *
 * Two -line angle
 */
export function getAngleBetweenLines(
  p1: ControlPoint,
  p2: ControlPoint,
  p3: ControlPoint,
  p4: ControlPoint
) {
  // Calculate the vectors of the two line segments
  const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
  const v2 = { x: p4.x - p3.x, y: p4.y - p3.y };

  // Calculate the dot product of the two vectors
  const dotProduct = v1.x * v2.x + v1.y * v2.y;

  // Calculate the magnitudes of the two vectors
  const magnitude1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const magnitude2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);

  // Calculate the cosine of the angle
  const cosine = dotProduct / (magnitude1 * magnitude2);

  // Calculate the angle in radians
  const angleInRadians = Math.acos(cosine);

  // Convert the angle to degrees
  const angleInDegrees = (angleInRadians * 180) / Math.PI;

  return angleInDegrees;
}

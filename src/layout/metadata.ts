import { MarkerType, Position } from '@xyflow/react';

import type {
  Reactflow,
  ReactflowEdgeWithData,
  ReactflowNodeWithData,
} from '../data/types';
import type { LayoutDirection, LayoutVisibility } from './node';

export const getRootNode = (nodes: Reactflow['nodes']) => {
  return nodes.find((e) => e.type === 'start') ?? nodes[0];
};

export const getNodeSize = (
  node: ReactflowNodeWithData,
  defaultSize = { width: 150, height: 36 },
) => {
  const nodeWith = node.measured?.width;
  const nodeHeight = node.measured?.height;
  const hasDimension = [nodeWith, nodeHeight].every((e) => e != null);

  return {
    hasDimension,
    width: nodeWith,
    height: nodeHeight,
    widthWithDefault: nodeWith ?? defaultSize.width,
    heightWithDefault: nodeHeight ?? defaultSize.height,
  };
};

export type IFixPosition = (pros: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  x: number;
  y: number;
};

export const getNodeLayouted = (props: {
  node: ReactflowNodeWithData;
  position: { x: number; y: number };
  direction: LayoutDirection;
  visibility: LayoutVisibility;
  fixPosition?: IFixPosition;
}): ReactflowNodeWithData => {
  const {
    node,
    position,
    direction,
    visibility,
    fixPosition = (p) => ({ x: p.x, y: p.y }),
  } = props;

  const hidden = visibility !== 'visible';
  const isHorizontal = direction === 'horizontal';
  const { width, height, widthWithDefault, heightWithDefault } =
    getNodeSize(node);

  return {
    ...node,
    type: 'base',
    width,
    height,
    position: fixPosition({
      ...position,
      width: widthWithDefault,
      height: heightWithDefault,
    }),
    data: {
      ...node.data,
      label: node.id,
    },
    style: {
      ...node.style,
      visibility: hidden ? 'hidden' : 'visible',
    },
    targetPosition: isHorizontal ? Position.Left : Position.Top,
    sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
  };
};

export const getEdgeLayouted = (props: {
  edge: ReactflowEdgeWithData;
  visibility: LayoutVisibility;
}): ReactflowEdgeWithData => {
  const { edge, visibility } = props;
  const hidden = visibility !== 'visible';
  return {
    ...edge,
    type: 'base',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      ...edge.style,
      visibility: hidden ? 'hidden' : 'visible',
    },
  };
};

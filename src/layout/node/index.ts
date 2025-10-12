import { removeEmpty } from '@del-wang/utils';

import type { Reactflow } from '../../data/types';
import {
  type D3DAGLayoutAlgorithms,
  kD3DAGAlgorithms,
} from './algorithms/d3-dag';
import { layoutD3Hierarchy } from './algorithms/d3-hierarchy';
import { layoutDagreTree } from './algorithms/dagre-tree';
import { type ELKLayoutAlgorithms, kElkAlgorithms } from './algorithms/elk';
import { layoutOrigin } from './algorithms/origin';

export type LayoutDirection = 'vertical' | 'horizontal';
export type LayoutVisibility = 'visible' | 'hidden';
export interface LayoutSpacing {
  x: number;
  y: number;
}

export type ReactflowLayoutConfig = {
  algorithm: LayoutAlgorithms;
  direction: LayoutDirection;
  spacing: LayoutSpacing;
  /**
   * Whether to hide the layout
   *
   * We may need to hide layout if node sizes are not available during the first layout.
   */
  visibility: LayoutVisibility;
  /**
   * Whether to reverse the order of source handles.
   */
  reverseSourceHandles: boolean;
};

export type LayoutAlgorithmProps = Reactflow &
  Omit<ReactflowLayoutConfig, 'algorithm'>;

export type LayoutAlgorithm = (
  props: LayoutAlgorithmProps,
) => Promise<Reactflow | undefined>;

export const kLayoutAlgorithms: Record<string, LayoutAlgorithm> = {
  origin: layoutOrigin,
  'dagre-tree': layoutDagreTree,
  'd3-hierarchy': layoutD3Hierarchy,
  ...kElkAlgorithms,
  ...kD3DAGAlgorithms,
};

export const kDefaultLayoutConfig: ReactflowLayoutConfig = {
  algorithm: 'elk-mr-tree',
  direction: 'vertical',
  visibility: 'visible',
  spacing: { x: 120, y: 120 },
  reverseSourceHandles: false,
};

export type LayoutAlgorithms =
  | 'origin'
  | 'dagre-tree'
  | 'd3-hierarchy'
  | ELKLayoutAlgorithms
  | D3DAGLayoutAlgorithms;

export type ILayoutReactflow = Reactflow & Partial<ReactflowLayoutConfig>;

export const layoutReactflow = async (
  options: ILayoutReactflow,
): Promise<Reactflow> => {
  const config = { ...kDefaultLayoutConfig, ...removeEmpty(options) };
  const { nodes = [], edges = [] } = config;
  const layout = kLayoutAlgorithms[config.algorithm];
  let result = await layout({ ...config, nodes, edges });
  if (!result) {
    // If the layout fails, fallback to the origin layout
    result = await layoutReactflow({
      ...config,
      nodes,
      edges,
      algorithm: 'origin',
    });
  }
  return result!;
};

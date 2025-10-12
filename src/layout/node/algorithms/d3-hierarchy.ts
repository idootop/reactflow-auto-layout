// Based on: https://github.com/flanksource/flanksource-ui/blob/75b35591d3bbc7d446fa326d0ca7536790f38d88/src/ui/Graphs/Layouts/algorithms/d3-hierarchy.ts

import { getIncomers, type Node } from '@xyflow/react';
import { type HierarchyPointNode, stratify, tree } from 'd3-hierarchy';

import type { ReactflowNodeWithData } from '@/data/types';

import { getEdgeLayouted, getNodeLayouted, getNodeSize } from '../../metadata';
import type { LayoutAlgorithm } from '..';

type NodeWithPosition = ReactflowNodeWithData & { x: number; y: number };

const layout = tree<NodeWithPosition>().separation(() => 1);

// Since d3-hierarchy layout algorithm does not support multiple root nodes,
// we attach the sub-workflows to the global rootNode.
const rootNode: NodeWithPosition = {
  id: '#root',
  x: 0,
  y: 0,
  position: { x: 0, y: 0 },
  data: {} as any,
};

export const layoutD3Hierarchy: LayoutAlgorithm = async (props) => {
  const { nodes, edges, direction, visibility, spacing } = props;
  const isHorizontal = direction === 'horizontal';

  const initialNodes = [] as NodeWithPosition[];
  let maxNodeWidth = 0;
  let maxNodeHeight = 0;
  for (const node of nodes) {
    const { widthWithDefault, heightWithDefault } = getNodeSize(node);
    initialNodes.push({
      ...node,
      ...node.position,
      width: widthWithDefault,
      height: heightWithDefault,
    });
    maxNodeWidth = Math.max(maxNodeWidth, widthWithDefault);
    maxNodeHeight = Math.max(maxNodeHeight, heightWithDefault);
  }

  // Since d3-hierarchy does not support horizontal layout,
  // we swap the width and height of nodes and interchange x and y mappings based on the layout direction.
  const nodeSize: [number, number] = isHorizontal
    ? [maxNodeHeight + spacing.y, maxNodeWidth + spacing.x]
    : [maxNodeWidth + spacing.x, maxNodeHeight + spacing.y];

  layout.nodeSize(nodeSize);

  const getParentId = (node: Node) => {
    if (node.id === rootNode.id) {
      return undefined;
    }
    // Node without input is the root node of sub-workflow, and we should connect it to the rootNode
    const incomers = getIncomers(node, nodes, edges);
    return incomers[0]?.id || rootNode.id;
  };

  const hierarchy = stratify<NodeWithPosition>()
    .id((d) => d.id)
    .parentId(getParentId)([rootNode, ...initialNodes]);

  const root = layout(hierarchy);
  const layoutNodes = new Map<string, HierarchyPointNode<NodeWithPosition>>();
  for (const node of root) {
    layoutNodes.set(node.id!, node);
  }

  return {
    nodes: nodes.map((node) => {
      const { x, y } = layoutNodes.get(node.id)!;
      // Interchange x and y mappings based on the layout direction.
      const position = isHorizontal ? { x: y, y: x } : { x, y };
      return getNodeLayouted({
        node,
        position,
        direction,
        visibility,
        fixPosition: ({ x, y, width, height }) => {
          // This algorithm uses the center coordinate of the node as the reference point,
          // which needs adjustment for ReactFlow's topLeft coordinate system.
          return {
            x: x - width / 2,
            y: y - height / 2,
          };
        },
      });
    }),
    edges: edges.map((edge) => getEdgeLayouted({ edge, visibility })),
  };
};

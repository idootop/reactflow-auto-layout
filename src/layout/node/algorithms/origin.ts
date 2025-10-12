import { getEdgeLayouted, getNodeLayouted } from '../../metadata';
import type { LayoutAlgorithm } from '..';

/**
 * Positions all nodes at the origin (0,0) in the layout.
 */
export const layoutOrigin: LayoutAlgorithm = async (props) => {
  const { nodes, edges, direction, visibility } = props;
  return {
    nodes: nodes.map((node) => {
      return getNodeLayouted({
        node,
        direction,
        visibility,
        position: { x: 0, y: 0 },
      });
    }),
    edges: edges.map((edge) => getEdgeLayouted({ edge, visibility })),
  };
};

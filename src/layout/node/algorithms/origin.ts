import { LayoutAlgorithm } from "..";
import { getEdgeLayouted, getNodeLayouted } from "../../metadata";

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

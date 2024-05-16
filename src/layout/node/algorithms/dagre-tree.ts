import dagre from "@dagrejs/dagre";
import { getIncomers } from "reactflow";

import { ReactflowNodeWithData } from "@/data/types";
import { LayoutAlgorithm } from "..";
import { getEdgeLayouted, getNodeLayouted, getNodeSize } from "../../metadata";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const layoutDagreTree: LayoutAlgorithm = async (props) => {
  const { nodes, edges, direction, visibility, spacing } = props;
  const isHorizontal = direction === "horizontal";

  dagreGraph.setGraph({
    nodesep: isHorizontal ? spacing.y : spacing.x,
    ranksep: isHorizontal ? spacing.x : spacing.y,
    ranker: "tight-tree",
    rankdir: isHorizontal ? "LR" : "TB",
  });

  const subWorkflowRootNodes: ReactflowNodeWithData[] = [];
  nodes.forEach((node) => {
    const incomers = getIncomers(node, nodes, edges);
    if (incomers.length < 1) {
      // Node without input is the root node of sub-workflow
      subWorkflowRootNodes.push(node);
    }
    const { widthWithDefault, heightWithDefault } = getNodeSize(node);
    dagreGraph.setNode(node.id, {
      width: widthWithDefault,
      height: heightWithDefault,
    });
  });

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  // Connect sub-workflows' root nodes to the rootNode
  dagreGraph.setNode("#root", { width: 1, height: 1 });
  for (const subWorkflowRootNode of subWorkflowRootNodes) {
    dagreGraph.setEdge("#root", subWorkflowRootNode.id);
  }

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return getNodeLayouted({
        node,
        position,
        direction,
        visibility,
        fixPosition: ({ x, y, width, height }) => ({
          // This algorithm uses the center coordinate of the node as the reference point,
          // which needs adjustment for ReactFlow's topLeft coordinate system.
          x: x - width / 2,
          y: y - height / 2,
        }),
      });
    }),
    edges: edges.map((edge) => getEdgeLayouted({ edge, visibility })),
  };
};
